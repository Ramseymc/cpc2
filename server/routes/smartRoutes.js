const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
// const { checktoken, jwtSignUser } = require("./checkToken");
const dayjs = require("dayjs");
// var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
// dayjs.extend(isSameOrBefore);
// var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
// dayjs.extend(isSameOrAfter);
var fs = require("fs");
const crypto = require("crypto");
var client = require("smartsheet");

const qs = require("querystring");
const { sheets } = require("smartsheet/lib/utils/apis");

router.post("/smartProgressWB", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works!!"})
  development = req.body.id;
  let mysql = `select * from smartToken where development = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        // unitsAffected = result;
        // res.json(result)
        // console.log(unitsAffected);
        res.json(result);

        // res.redirect(authorizationUri);
      }
    });
    connection.release();
  });
});

function authorizeURL(params) {
  const authUrl = "https://app.smartsheet.com/b/authorize";
  return `${authUrl}?${qs.stringify(params)}`;
}

// App client id: 1qoe716uw15dlzax11x
// App Secret: y1rg04dvt8zgp9a3d6j

const authorizationUri = authorizeURL({
  response_type: "code",
  client_id: "1qoe716uw15dlzax11x",
  // redirect_uri: "http://localhost:3000/callbackProgressWB",
  redirect_uri: "https://www.cape-projectsbe.co.za/callbackProgressWB",
  // scope: "READ_SHEETS",
  scope: "READ_SHEETS CREATE_SHEETS WRITE_SHEETS",
  state: "unitTasks",
});
let unitsAffected = [];
let smartUnits = ["A101", "A102"];
let development;

// Initial page redirecting to Smartsheet
router.get("/authSmartsheetsProgress/:id", (req, res) => {
  console.log(req.params.id);
  development = req.params.id;
  console.log("development", development);
  res.redirect(authorizationUri);
});

router.get("/callbackProgressWB", async (req, res) => {
  console.log("queryURL", req.url);

  const authCode = req.query.code;

  // console.log(authCode);

  let appSecret = "y1rg04dvt8zgp9a3d6j";

  let smartsheet = client.createClient({
    // a blank token provides access to Smartsheet token endpoints
    accessToken: "",
  });

  // console.log("Awesome Redirected");

  var hash = crypto
    .createHash("sha256")
    .update(`${appSecret}|${authCode}`)
    // .update('ujhvmnu9n79b68uit3n' + '|' + 'sample6p9qisx6a')
    // ('Your App Secret' + '|' + 'Received Authorization Code')
    .digest("hex");

  // console.log(hash);

  // // Set options
  var options = {
    queryParameters: {
      client_id: "1qoe716uw15dlzax11x", // Your App Client ID
      code: `${authCode}`, // Received Authorization Code
      hash: hash,
    },
    contentType: "application/x-www-form-urlencoded",
  };

  await smartsheet.tokens
    .getAccessToken(options)
    .then(function (token) {
      console.log("Token", token);
      let expires_in = dayjs(token.expires_in * 1000 + Date.now()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      console.log(Date.now());

      console.log("expires_in", expires_in);

      let mysql1 = `delete from smartToken where development = ${development}`;
      let mysql2 = `insert into smartToken (access_token,token_type,refresh_token,expires_in, development) values (
        '${token.access_token}', '${token.token_type}','${token.refresh_token}', '${expires_in}',${development}
      )`;
      let mysql = `${mysql1};${mysql2}`;
      console.log(mysql);

      pool.getConnection(function (err, connection) {
        if (err) {
          console.log("THE ERR", err);
          connection.release();
          resizeBy.send("Error with connection");
        }
        connection.query(mysql, function (error, result) {
          if (error) {
            console.log("THE ERROR", error);
          }
        });
        connection.release();
      });
    })

    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      setTimeout(() => {
        res.redirect(process.env.SMARTSHEET2_REDIRECT);
      }, 500);
    });
});

router.post("/updateFromSmartSheets", async (req, res) => {
  console.log("body", req.body.development);

  try {
    console.log(req.body);
    let mysql = `select * from smartsheetControl where development = ${req.body.development} order by id`;
    let smartSheetControl = [];

    await pool.getConnection(function (err, connection) {
      if (err) {
        console.log("THE ERR", err);
        connection.release();
        resizeBy.send("Error with connection");
      }
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
          res.json("smartSheetControl", error);
        } else {
          smartSheetControl = result;
        }
      });
      connection.release();
    });

    smartsheet = client.createClient({
      accessToken: `${req.body.access_token}`,
      logLevel: "info",
    });
    var options = {
      queryParameters: {
        include: "attachments",
        includeAll: true,
      },
    };

    //  res.json("smartSheetControl",smartSheetControl)

    await smartsheet.sheets
      .listSheets(options)
      .then(async function (result) {
        await smartSheetControl.forEach((element, index, arr) => {
          // let sheetId = sheetInfoFromDB[0].id;
          let sheetId = parseFloat(element.smartsheetId);
          let rowsToAddToDatabase = [];
          // Load one sheet
          smartsheet.sheets
            .getSheet({ id: sheetId })
            .then(function (sheetInfo) {
              console.time("getReleventRows Time Test:");
              sheetInfo.rows.sort((a, b) =>
                a.rowNumber < b.rowNumber
                  ? 1
                  : b.rowNumber > a.rowNumber
                  ? -1
                  : 0
              );
              // console.log("rows",sheetInfo.rows)
              sheetInfo.rows.forEach((el) => {
                let filteredRows = el.cells.filter((el2) => {
                  if (
                    (el2.columnId === parseFloat(element.isUnit) &&
                      el2.value === true) ||
                    (el2.columnId === parseFloat(element.isTaskType) &&
                      el2.value === true) ||
                    (el2.columnId === parseFloat(element.isTask) &&
                      el2.value === true)
                  ) {
                    return el2;
                  }
                });
                // console.log(filteredRows)
                if (filteredRows.length) {
                  // console.log(el.cells[0])
                  el.cells.forEach((el3) => {
                    el3.rowId = el.id;
                    el3.sheetId = sheetId;
                    el3.rowNumber = el.rowNumber;
                  });

                  rowsToAddToDatabase.push(el.cells);
                }
              });
              // console.log(rowsTßoAddToDatabase)
              rowsToAddToDatabase.sort((a, b) =>
                a.rowNumber > b.rowNumber
                  ? 1
                  : b.rowNumber > a.rowNumber
                  ? -1
                  : 0
              );

              let unitName = "";
              let taskType = "";
              let taskName = "";
              let units = [];
              let infoToInsertToDatabase = [];
              let insertToDBArray = {};
              rowsToAddToDatabase.forEach((el, index) => {
                // console.log("el", el)
                let filteredUnit = el.filter((el2) => {
                  return (
                    el2.columnId === parseFloat(element.isUnit) &&
                    el2.value === true
                  );
                });
                // console.log("filteredUnit",filteredUnit)
                if (filteredUnit.length) {
                  let refilteredUnit = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.TaskName);
                  });
                  // console.log("refilteredUnit",refilteredUnit)

                  unitName = refilteredUnit[0].value;
                  insertToDBArray.unitName = unitName;
                  units.push(unitName);
                } else {
                  unitName = unitName;
                  insertToDBArray.unitName = unitName;
                }

                let filteredTaskType = el.filter((el2) => {
                  return (
                    el2.columnId === parseFloat(element.isTaskType) &&
                    el2.value === true
                  );
                });
                if (filteredTaskType.length) {
                  let refilteredTaskType = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.TaskName);
                  });
                  taskType = refilteredTaskType[0].value;
                  unitName = unitName;
                } else {
                  taskType = taskType;
                }
                let filteredTaskName = el.filter((el2) => {
                  return (
                    el2.columnId === parseFloat(element.isTask) &&
                    el2.value === true
                  );
                });

                if (filteredTaskName.length) {
                  let refilteredTaskName = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.TaskName);
                  });
                  unitName = unitName;
                  taskType = taskType;
                  taskName = refilteredTaskName[0].value;
                } else {
                  taskName = "";
                }

                let filteredDuration = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.Duration);
                });
                if (filteredDuration.length) {
                  let refilteredDuration = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.Duration);
                  });
                  insertToDBArray.duration = refilteredDuration[0].value;
                  // insertToDBArray.unitName = unitName;
                  insertToDBArray.taskName = taskName;
                  insertToDBArray.taskType = taskType;
                }

                let filteredStartDate = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.StartDate);
                });
                if (filteredStartDate.length) {
                  let refilteredStartDate = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.StartDate);
                  });
                  if (refilteredStartDate[0].value === undefined) {
                    insertToDBArray.startDate = "";
                  } else {
                    insertToDBArray.startDate = dayjs(
                      refilteredStartDate[0].value
                    ).format("YYYY-MM-DD HH:mm:ss");
                  }
                //   if (parseFloat(sheetId) === 6713637168539524) {
                //     if (refilteredStartDate[0].value === undefined) {
                //       console.log(chalk.yellowBright("Undefined"));
                //     } else {
                //       console.log(chalk.blue(refilteredStartDate[0].value));
                //     }
                //   }
                //   insertToDBArray.startDate = dayjs(
                //     refilteredStartDate[0].value
                //   ).format("YYYY-MM-DD HH:mm:ss");
                // } else {
                //   insertToDBArray.startDate = "";
                }
                // if (parseFloat(sheetId) === 6713637168539524) {
                //   console.log(chalk.red(insertToDBArray.startDate), unitName);
                // }
                let filteredEndDate = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.EndDate);
                });
                if (filteredEndDate.length) {
                  let refilteredEndDate = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.EndDate);
                  });
                  insertToDBArray.endDate = dayjs(
                    refilteredEndDate[0].value
                  ).format("YYYY-MM-DD HH:mm:ss");
                } else {
                  insertToDBArray.endDate = null;
                }

                let filteredAssignedTo = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.AssignedTo);
                });
                if (filteredAssignedTo.length) {
                  let refilteredAssignedTo = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.AssignedTo);
                  });
                  if (refilteredAssignedTo[0].value !== undefined) {
                    insertToDBArray.assignedTo = refilteredAssignedTo[0].value;
                  } else {
                    insertToDBArray.assignedTo = null;
                  }
                }

                let filteredComments = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.Comments);
                });
                if (filteredComments.length) {
                  let refilteredComments = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.Comments);
                  });
                  if (refilteredComments[0].value !== undefined) {
                    insertToDBArray.comments = refilteredComments[0].value;
                  } else {
                    insertToDBArray.comments = null;
                  }
                }

                let filteredSubcontractor1 = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.Subcontractor1);
                });
                if (filteredSubcontractor1.length) {
                  let refilteredSubcontractor1 = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.Subcontractor1);
                  });
                  if (refilteredSubcontractor1[0].value !== undefined) {
                    insertToDBArray.subcontractor1 =
                      refilteredSubcontractor1[0].value;
                  } else {
                    insertToDBArray.subcontractor1 = 0;
                  }
                }

                let filteredSubcontractor2 = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.Subcontractor2);
                });
                if (filteredSubcontractor2.length) {
                  let refilteredSubcontractor2 = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.Subcontractor2);
                  });
                  if (refilteredSubcontractor2[0].value !== undefined) {
                    insertToDBArray.subcontractor2 =
                      refilteredSubcontractor2[0].value;
                  } else {
                    insertToDBArray.subcontractor2 = 0;
                  }
                }

                let filteredLabourCost = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.LabourCost);
                });
                if (filteredLabourCost.length) {
                  let refilteredLabourCost = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.LabourCost);
                  });
                  if (refilteredLabourCost[0].value !== undefined) {
                    insertToDBArray.labourCost = refilteredLabourCost[0].value;
                  } else {
                    insertToDBArray.labourCost = 0;
                  }
                }
                let filteredMaterialCost = el.filter((el3) => {
                  return el3.columnId === parseFloat(element.MaterialCost);
                });
                if (filteredMaterialCost.length) {
                  let refilteredMaterialCost = el.filter((el3) => {
                    return el3.columnId === parseFloat(element.MaterialCost);
                  });
                  if (refilteredMaterialCost[0].value !== undefined) {
                    insertToDBArray.materialCost =
                      refilteredMaterialCost[0].value;
                  } else {
                    insertToDBArray.materialCost = 0;
                  }
                }
                insertToDBArray.totalCost =
                  insertToDBArray.subcontractor1 +
                  insertToDBArray.subcontractor2 +
                  insertToDBArray.labourCost +
                  insertToDBArray.materialCost;
                insertToDBArray.percentComplete = 0;
                insertToDBArray.rowId = `${el[0].rowId}`;
                insertToDBArray.rowNumber = el[0].rowNumber;
                insertToDBArray.sheetId = `${sheetId}`;
                insertToDBArray.development = req.body.development;
                insertToDBArray.block = element.block;
                infoToInsertToDatabase.push(insertToDBArray);
                // console.log("insertToDBArray",insertToDBArray)
                insertToDBArray = {};
              });

              infoToInsertToDatabase = infoToInsertToDatabase.filter(
                (el) => el.taskType !== ""
              );
              infoToInsertToDatabase = infoToInsertToDatabase.filter(
                (el) => el.startDate !== undefined
              );
              infoToInsertToDatabase = infoToInsertToDatabase.filter(
                (el) => el.startDate !== ""
              );
              infoToInsertToDatabase = infoToInsertToDatabase.filter(
                (el) => el.startDate !== null
              );
              infoToInsertToDatabase = infoToInsertToDatabase.filter(
                (el) => el.taskName !== ""
              );

              // ************************

              let taskTypeSQL = `select * from smartTaskTypes order by taskTypeName`;
              let getUnitsSQl = `select * from smartUnits where development = ${req.body.development} order by unitName`;
              let gettasksSQl = `select * from smartTasks where development = ${req.body.development} and sheetId = '${sheetId}' order by unitName`;
              let latestSQL = `${taskTypeSQL};${getUnitsSQl};${gettasksSQl}`;
              let smartTaskTypes = [];
              let smartUnits = [];
              let smartTasks = [];
              pool.getConnection(function (err, connection) {
                if (err) {
                  console.log("THE ERR", err);
                  connection.release();
                  resizeBy.send("Error with connection");
                }
                connection.query(latestSQL, function (error, result) {
                  if (error) {
                    console.log("THE ERROR", error);
                    res.json("latestSQL", error);
                  } else {
                    smartTaskTypes = result[0];
                    smartUnits = result[1];
                    smartTasks = result[2];

                    let taskTypes = [];
                    let newIndex = false;
                    let unitsInSmartsheet = [];
                    infoToInsertToDatabase.forEach((el, index, arr) => {
                      let insert = {
                        subsection: el.block,
                        development: el.development,
                        unitName: el.unitName,
                      };
                      unitsInSmartsheet.push(insert);
                      taskTypes.push(el.taskType);
                      if (index === arr.length - 1) {
                        newIndex = true;
                      } else {
                        newIndex = false;
                      }
                    });

                    taskTypes = Array.from(new Set(taskTypes));
                    taskTypes.sort();
                    unitsInSmartsheet = unitsInSmartsheet.filter(
                      (unit, index, self) =>
                        index ===
                        self.findIndex(
                          (t) =>
                            t.subsection === unit.subsection &&
                            t.development === unit.development &&
                            t.unitName === unit.unitName
                        )
                    );

                    // console.log(taskTypes);
                    const filterByReference = (arr1, arr2) => {
                      let res = [];
                      res = arr1.filter((el) => {
                        return !arr2.find((element) => {
                          return (
                            element.unitName === el.unitName &&
                            element.subsection === el.subsection &&
                            element.development === el.development
                          );
                        });
                      });
                      return res;
                    };
                    const filterByTasksByReference = (arr1, arr2) => {
                      let res = [];
                      res = arr1.filter((el) => {
                        return !arr2.find((element) => {
                          return (
                            element.rowId.toString() === el.rowId &&
                            element.sheetId.toString() === el.sheetId
                          );
                        });
                      });
                      return res;
                    };
                    const filterByTasksToUpdate = (arr1, arr2) => {
                      let res = [];
                      res = arr1.filter((el) => {
                        return arr2.find((element) => {
                          return (
                            element.rowId.toString() === el.rowId &&
                            element.sheetId.toString() === el.sheetId
                          );
                        });
                      });
                      return res;
                    };
                    const selectTasksToUpdate = (arr1, arr2) => {
                      let res = [];
                      res = arr1.filter((el) => {
                        return !arr2.find((element) => {
                          return (
                            element.rowId == el.rowId &&
                            element.sheetId == el.sheetId &&
                            element.subcontractor1 === el.subcontractor1 &&
                            element.subcontractor2 === el.subcontractor2 &&
                            element.labourCost === el.labourCost &&
                            element.materialCost === el.materialCost &&
                            dayjs(element.startDate).format("YYYY-MM-DD") ===
                              dayjs(el.startDate).format("YYYY-MM-DD") &&
                            dayjs(element.endDate).format("YYYY-MM-DD") ===
                              dayjs(el.endDate).format("YYYY-MM-DD") &&
                            element.comments === el.comments
                          );
                        });
                      });
                      return res;
                    };
                    infoToInsertToDatabase.sort((a, b) =>
                      a.rowNumber > b.rowNumber
                        ? 1
                        : b.rowNumber > a.rowNumber
                        ? -1
                        : 0
                    );
                    // infoToInsertToDatabase.forEach((el) => {
                    //   console.log(el.rowNumber);
                    // });
                    let indexToSplice = [];
                    infoToInsertToDatabase.forEach((el, index, arr) => {
                      if (
                        index > 0 &&
                        el.taskName === arr[index - 1].taskName &&
                        el.taskType !== arr[index - 1].taskType &&
                        el.unitName === arr[index - 1].unitName
                      ) {
                        indexToSplice.push(el.rowNumber);
                        console.log(
                          el.unitName,
                          " ",
                          arr[index - 1].unitName,
                          "--",
                          el.taskType,
                          " ",
                          arr[index - 1].taskType,
                          " -- ",
                          el.taskName,
                          "  ",
                          arr[index - 1].taskName,
                          "-- ",
                          index,
                          " ",
                          index - 1,
                          " rowNumber:",
                          el.rowNumber,
                          " ",
                          arr[index - 1].rowNumber
                        );
                      }
                    });
                    console.log("indexToSplice", indexToSplice);

                    indexToSplice.forEach((el) => {
                      infoToInsertToDatabase = infoToInsertToDatabase.filter(
                        (el2) => {
                          return el2.rowNumber !== el;
                        }
                      );
                    });

                    //   indexToSplice.forEach((el) => {
                    //     infoToInsertToDatabase.splice(el, 1);
                    //   });
                    //   setTimeout(() => {
                    //   infoToInsertToDatabase.forEach((el, index, arr) => {
                    //     if (
                    //       index > 0 &&
                    //       el.taskName === arr[index - 1].taskName &&
                    //       el.taskType !== arr[index - 1].taskType &&
                    //       el.unitName === arr[index - 1].unitName
                    //     ) {
                    //       // indexToSplice.push(index);
                    //       console.log(el.unitName, ' ' ,arr[index - 1].unitName ,'--' , el.taskType ,' ', arr[index - 1].taskType,' -- ',el.taskName,'  ', arr[index - 1].taskName,'-- ', index, ' ', index - 1, ' rowNumber:',el.rowNumber,' ', arr[index-1].rowNumber)
                    //     } else {
                    //       console.log("All Good")
                    //     }
                    //   });
                    // }, 800)

                    let tasksToInsert = filterByTasksByReference(
                      infoToInsertToDatabase,
                      smartTasks
                    );
                    let tasksToUpdate = filterByTasksToUpdate(
                      infoToInsertToDatabase,
                      smartTasks
                    );
                    let tasksToUpdateCheck = filterByTasksToUpdate(
                      infoToInsertToDatabase,
                      tasksToInsert
                    );
                    let finalisedTasksToUpdate = selectTasksToUpdate(
                      tasksToUpdate,
                      smartTasks
                    );
                    // console.log("tasksToInsert", tasksToInsert.length);
                    //  console.log("tasksToUpdate", tasksToUpdate.length)
                    //  console.log("tasksToUpdateCheck", tasksToUpdateCheck.length)
                    //  console.log("finalisedTasksToUpdate", finalisedTasksToUpdate[0])
                    //  console.log("finalisedTasksToUpdate", finalisedTasksToUpdate.length)

                    let updateSmartTaskTypes = [];
                    smartTaskTypes.forEach((el) => {
                      updateSmartTaskTypes.push(el.taskTypeName);
                    });
                    // console.log(infoToInsertToDatabase.length, "records");
                    // console.log(infoToInsertToDatabase, "record");

                    // console.log(infoToInsertToDatabase.length, "records");
                    let newTaskTypes = taskTypes.filter(
                      (taskType) => !updateSmartTaskTypes.includes(taskType)
                    );
                    let unitsToAddToDatabase = filterByReference(
                      unitsInSmartsheet,
                      smartUnits
                    );
                    let mysqlTasktypes = "";
                    let mysqlunits = "";
                    let mysqlTasks = "";
                    let mysqlUpdateTasks = "";
                    if (
                      finalisedTasksToUpdate.length &&
                      !tasksToInsert.length
                    ) {
                      finalisedTasksToUpdate.forEach((el) => {
                        let updateTasksSql = "";
                        if (el.assignedTo === null) {
                          el.assignedTo = null;
                        } else {
                          el.assignedTo = `"${el.assignedTo}"`;
                        }
                        if (el.comments === null) {
                          el.comments = null;
                        } else {
                          el.comments = `"${el.comments}"`;
                        }
                        updateTasksSql = `${updateTasksSql} update smartTasks set unitName = '${
                          el.unitName
                        }', taskName = "${el.taskName}", taskType = "${
                          el.taskType
                        }", 
                        startDate = '${dayjs(el.startDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}', endDate = '${dayjs(el.endDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}', comments = ${el.comments}, 
                        subcontractor1 = ${
                          el.subcontractor1
                        }, subcontractor2 = ${el.subcontractor2},labourCost = ${
                          el.labourCost
                        },materialCost = ${el.materialCost}, totalCost = ${
                          el.totalCost
                        } where rowId = '${el.rowId}' and sheetId = '${
                          el.sheetId
                        }';`;
                        mysqlUpdateTasks = `${updateTasksSql}`;
                      });
                    }

                    if (tasksToInsert.length) {
                      let startSQL = `Insert into smartTasks (sheetId, rowId, subsection, development, unitName,taskName, taskType, startDate,
                                      endDate, assignedTo, comments , subcontractor1, subcontractor2,labourCost, materialCost, totalCost,  percentComplete ) values `;
                      let insertsql = "";
                      tasksToInsert.forEach((el, index, arr) => {
                        if (el.assignedTo === null) {
                          el.assignedTo = null;
                        } else {
                          el.assignedTo = `"${el.assignedTo}"`;
                        }
                        if (el.comments === null) {
                          el.comments = null;
                        } else {
                          el.comments = `"${el.comments}"`;
                        }
                        if (index < arr.length - 1) {
                          insertsql = `${insertsql} ("${el.sheetId}", "${el.rowId}", ${el.block}, ${el.development}, "${el.unitName}","${el.taskName}", "${el.taskType}", "${el.startDate}",
                            "${el.endDate}", ${el.assignedTo}, ${el.comments} , ${el.subcontractor1}, ${el.subcontractor2},${el.labourCost}, ${el.materialCost}, ${el.totalCost}, ${el.percentComplete}),`;
                        } else {
                          insertsql = `${insertsql} ("${el.sheetId}", "${el.rowId}", ${el.block}, ${el.development}, "${el.unitName}","${el.taskName}", "${el.taskType}", "${el.startDate}",
                          "${el.endDate}", ${el.assignedTo}, ${el.comments} , ${el.subcontractor1}, ${el.subcontractor2},${el.labourCost}, ${el.materialCost}, ${el.totalCost},${el.percentComplete});`;
                        }
                      });
                      mysqlTasks = `${startSQL}${insertsql}`;
                    }

                    if (newTaskTypes.length) {
                      let startSQL = `Insert into smartTaskTypes (taskTypeName) values `;
                      let insertsql = "";
                      newTaskTypes.forEach((el, index, arr) => {
                        if (index < arr.length - 1) {
                          insertsql = `${insertsql} ("${el}"),`;
                        } else {
                          insertsql = `${insertsql} ("${el}");`;
                        }
                      });
                      mysqlTasktypes = `${startSQL}${insertsql}`;
                    }
                    // console.log(chalk.red(mysqlUpdateTasks));

                    if (unitsToAddToDatabase.length) {
                      let startSQL = `Insert into smartUnits (subsection, development, unitName) values `;
                      let insertsql = "";
                      unitsToAddToDatabase.forEach((el, index, arr) => {
                        if (index < arr.length - 1) {
                          insertsql = `${insertsql} (${el.subsection}, ${el.development}, '${el.unitName}'),`;
                        } else {
                          insertsql = `${insertsql} (${el.subsection}, ${el.development}, '${el.unitName}');`;
                        }
                      });
                      mysqlunits = `${startSQL}${insertsql}`;
                    }

                    let updatesql = `${mysqlTasktypes}${mysqlunits}${mysqlTasks}${mysqlUpdateTasks}`;
                    // console.log("updatesql",updatesql)
                    // console.log("updatesql", updatesql.length);
                    // let str = "['abc','xyz']";

                    // str = str.replace(/[\[\]']+/g, "");
                    // console.log("str", str);

                    // var myString = "This is my string [remove] this";
                    // console.log("myString",myString)

                    // myString = myString.replace(/ *\([^\])*]/, "");
                    // console.log("myString",myString)

                    if (updatesql.length) {
                      connection.query(updatesql, function (error, result) {
                        if (error) {
                          console.log("THE ERROR", error);
                          crypto.createSecretKey.json("updatesql", error);
                        } else {
                        }
                      });
                    }
                    if (index === arr.length - 1 && newIndex) {
                      setTimeout(() => {
                        console.log(chalk.red("AWESOME"));
                        res.json({ now: "Only return to sheet" });
                      }, 1250);
                    }
                  }
                });
                connection.release();
              });

              console.timeEnd("getReleventRows Time Test:");
            })
            .catch(function (error) {
              console.log("wayne", error);
            });
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {});
  } catch (error) {
    console.log(error);
  } finally {
  }
});

router.post("/getSubsectionForProgress", (req, res) => {
  let mysql = `select * from subsection where development = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getsmartUnitsForProgress", (req, res) => {
  let mysql = `select * from smartUnits where development = ${req.body.id} and subsection = ${req.body.subsection}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getsmartTasksForProgress", (req, res) => {
  let mysql1 = `select * from smartTasks where development = ${req.body.id} and subsection = ${req.body.subsection} and unitName = '${req.body.unitName}'`;
  let mysql2 = `select * from smartsheetControl where development = ${req.body.id} and block = ${req.body.subsection}`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getTasksToAllocateSubcontractors", (req, res) => {
  // let mysql1 = `select * from smartTasks where development = ${req.body.id} and subsection = ${req.body.subsection} and unitName = '${req.body.unitName}'`;
  // let mysql2 = `select * from smartsheetControl where development = ${req.body.id} and block = ${req.body.subsection}`;
  let mysql1 = `select distinct taskName from smartTasks where development = ${req.body.id} order by taskName`;
  let mysql2 = `select * from suppliers where isSubcontractor = 1 order by supplierName`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getTasksForAllocationOfSubcontractor", (req, res) => {
  // let mysql1 = `select * from smartTasks where development = ${req.body.id} and subsection = ${req.body.subsection} and unitName = '${req.body.unitName}'`;
  // let mysql2 = `select * from smartsheetControl where development = ${req.body.id} and block = ${req.body.subsection}`;
  let mysql = `select distinct t.id,  t.subsection,s.subsectionName, u.unitName,t.taskType,t.taskName, t.sheetId, t.rowId,c.assignedTo as columnId, t.assignedTo 
  from smartUnits u, smartTasks t, smartsheetControl c, subsection s
  where u.unitName = t.unitName and 
  c.smartsheetId = t.sheetId and 
  t.development = ${req.body.id} and 
  c.development = ${req.body.id} and 
  u.development = ${req.body.id} 
  and c.block = t.subsection
  and t.subsection = s.id
  and t.taskName = '${req.body.taskChosen}' order by s.subsectionName`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/postSmartProgressItems", (req, res) => {
  let mysql = "";
  req.body.finalTasks.forEach((el) => {
    mysql = `${mysql} update smartTasks set percentComplete = ${el.percentComplete} where id = ${el.id};`;
  });

  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        // res.json(result);
        let row = [];

        req.body.finalTasks.forEach((el) => {
          let insert = {
            id: el.rowId,
            cells: [
              {
                columnId: parseFloat(el.PercentCompleteId),
                value: el.percentComplete / 100,
              },
            ],
          };
          row.push(insert);
        });
        let smartsheet = client.createClient({
          accessToken: `${req.body.token[0].access_token}`,
          logLevel: "info",
        });
        // Set options
        var options = {
          sheetId: parseFloat(req.body.finalTasks[0].sheetId),
          body: row,
        };

        smartsheet.sheets
          .updateRow(options)
          .then(function (updatedRows) {
            console.log("updatedRows", updatedRows);
            res.json({ success: true });
          })
          .catch(function (error) {
            console.log("error", error);
            res.json({ success: false });
          });
      }
    });
    connection.release();
  });
});

router.post("/postSmartSubcontractors", (req, res) => {
  let mysql = "";
  req.body.finalTasks.forEach((el) => {
    mysql = `${mysql} update smartTasks set assignedTo = '${el.assignedTo}' where id = ${el.id};`;
  });
  console.log(mysql);
  let errorCount = 0;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        // res.json(result);
        // let row = [];

        req.body.finalTasks.forEach((el) => {
          let row = [];
          let insert = {
            id: el.rowId,
            cells: [
              {
                columnId: parseFloat(el.assignedToId),
                objectValue: el.assignedTo,
              },
            ],
          };
          row.push(insert);
          let sheetId = el.sheetId;

          let smartsheet = client.createClient({
            accessToken: `${req.body.token[0].access_token}`,
            logLevel: "info",
          });
          // Set options
          var options = {
            sheetId: parseFloat(sheetId),
            body: row,
          };

          smartsheet.sheets
            .updateRow(options)
            .then(function (updatedRows) {
              console.log("updatedRows", updatedRows);
            })
            .catch(function (error) {
              console.log("error", error);
              errorCount += 1;
            });
        });
      }
    });
    connection.release();
  });
  if (errorCount === 0) {
    res.json({ success: true });
  } else {
    res.json({ success: true });
  }
});

let sheetInfoFromDB = [
  {
    smartsheetId: 3232342836832132,
    development: 1,
    block: 6,
    TaskName: 2074720710485892,
    isUnit: 2357198494951300,
    isTaskType: 6860798122321796,
    isTask: 1231298588108676,
    Duration: 6578320337856388,
    StartDate: 4326520524171140,
    EndDate: 8830120151541636,
    Predecessors: 245133361866628,
    PercentComplete: 4748732989237124,
    Status: 2496933175551876,
    AssignedTo: 7000532802922372,
    Comments: 1371033268709252,
    Subcontractor1: 8795410843101060,
    Subcontractor2: 210424053426052,
    LabourCost: 4607939464980356,
    MaterialCost: 104339837609860,
    TotalCost: 8900432859817860,
  },
];

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
const dayjs = require("dayjs");
const businessDays = require("dayjs-business-days");
const multer = require("multer");
const fs = require("fs");
const nodemailer = require("nodemailer");

const options1 = {
  holidays: [
    "2021-04-02",
    "2021-04-05",
    "2021-04-27",
    "2021-06-16",
    "2021-08-09",
    "2021-09-24",
    "2021-12-16",
    "2021-12-27",
  ],
  holidayFormat: "YYYY-MM-DD",
};
// dayjs.extend(businessDays, options1);

router.post("/importTasks", checktoken, (req, res) => {
  let post = [];
  let postData = [];
  postData.push(req.body);
  post = postData;
  let mysql = `insert into tasks (development, taskType, unitNumber, taskDescription, cost, quantity, fix, duration, startDate, endDate, supplier) values ?`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, post, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.get("/getUnits/:id", checktoken, (req, res) => {
  let post = [];
  let postData = [];
  postData.push(req.body);
  post = postData;
  let mysql1 = `select id from units where development = ${req.params.id}`;
  let mysql2 = `select id from taskTypes`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, post, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getDataforTemplate", (req, res) => {
  let mysql1 = `select id, developmentName from developments where id = ${req.body.developmentId}`;
  let mysql2 = `select id, development, subsectionName from subsection where development = ${req.body.developmentId} order by subsectionName`;
  let mysql3 = `select id, development, subsection, unitName from units where development = ${req.body.developmentId} order by unitName`;
  let mysql4 = `select id, development,taskName from taskTypes where development = ${req.body.developmentId} order by taskName`;
  let mysql5 = `select id, supplierName, vatVendor from suppliers order by supplierName`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getDataforCFDownload", (req, res) => {
  let mysql1 = `select id, developmentName from developments where id = ${req.body.developmentId}`;
  let mysql2 = `select id, development, subsectionName from subsection where development = ${req.body.developmentId} order by subsectionName`;
  let mysql3 = `select id, development, subsection, unitName from units where development = ${req.body.developmentId} order by unitName`;
  let mysql4 = `select id, development,taskName from taskTypes where development = ${req.body.developmentId} order by taskName`;
  let mysql5 = `select id, supplierName from suppliers order by supplierName`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/deleteTestData", checktoken, (req, res) => {
  let mysql1 = `delete from progress where task > 162`;
  let mysql2 = `delete from tasks where id > 162`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.get("/taskTypes", checktoken, (req, res) => {
  let post = [];
  let postData = [];
  postData.push(req.body);
  post = postData;
  let mysql = `select id, taskName from  taskTypes`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/addTaskTypes", checktoken, (req, res) => {
  let mysql = `insert into taskTypes (development, taskName) values(${req.body.development},'${req.body.taskName}')`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getAllTasksforGant", (req, res) => {
  // console.log(req.body.id)
  let mysql2 = `select * from fixes order by startDate`;
  let mysql1 = `select t.id, t.taskType, tt.taskName, t.supplier,t.sortIndex, s.retention, ss.subsectionName, t.unitNumber,u.unitName ,t.taskDescription,coalesce(p.lastCertificateIssuedAt,0) as lastCertificateIssuedAt, t.price, t.fix, t.startDate, t.endDate,t.baselineStartDate, t.baselineEndDate,t.duration,  p.id as progressID, p.task,t.dependantOn,t.parentId, 
  coalesce(p.progress,0) as progress, p.progressDate, round((t.price * coalesce(p.progress,0) / 100),0) as done, 
  (t.price - round((t.price * coalesce(p.progress,0) / 100),0)) as remaining
   from suppliers s, taskTypes tt, subsection ss,units u,tasks t
  left join progress p
  on t.id = p.task
  where t.development = ${req.body.id} and u.id = t.unitNumber and s.id = t.supplier and ss.id = u.subsection and tt.id = t.taskType
  order by t.taskType, t.unitNumber, t.fix, t.sortIndex, t.id
 `;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.time("Start");

        let ganttData = result[1];
        ganttData.forEach((el) => {
          let diffEndDate = dayjs(el.endDate).diff(
            dayjs(el.baselineEndDate),
            "d"
          );
          let diffStartDate = dayjs(el.startDate).diff(
            dayjs(el.baselineStartDate),
            "d"
          );
          if (el.id === "1-11-54-1st") {
            console.log(
              "YEBO",
              dayjs(el.endDate).diff(dayjs(el.startDate), "d")
            );
          }
          let color;
          if (diffEndDate > diffStartDate && diffStartDate == 0) {
            color = "#F44336";
          } else if (diffEndDate === diffStartDate && diffEndDate > 0) {
            color = "#F57C00";
          } else if (diffEndDate < diffStartDate && diffStartDate > 0) {
            color = "#40C4FF";
          } else {
            color = "lime";
            // color = "#4CAF50";
          }
          filteredData = result[0].filter((el2) => {
            return el2.parentId === el.id;
          });

          // console.log("@@@@@@@@@", filteredData)
          let baseline = { fill: `${color} 0.8`, stroke: `0.9 ${color}` };
          let duration = dayjs(el.endDate).diff(dayjs(el.startDate));
          let totalCost = filteredData.reduce((prev, el) => {
            return el.price + prev;
          }, 0);
          let totalDone = filteredData.reduce((prev, el) => {
            return (el.price * el.progress) / 100 + prev;
          }, 0);
          let finalPercentage = `${(totalDone / totalCost) * 100}%`;

          let finalProgress =
            filteredData.reduce((prev, el) => {
              return prev + el;
            }, 0) / filteredData.length;

          // let id = el.id
          el.name = `${el.taskName}: Unit ${el.unitName} - ${el.fix} Fix`;
          el.actualStart = el.startDate;
          el.actualEnd = el.endDate;
          el.baselineStart = el.baselineStartDate;
          (el.baselineEnd = el.baselineEndDate),
            (el.baselineProgressValue = "67%");
          el.baseline = baseline;
          el.duration = duration;
          // el.fix = el.fix,
          el.block = el.subsectionName;
          (el.unit = el.unitName), (el.taskName = el.taskName);
          el.percent = finalProgress;
          el.user = el.supplier;
          el.progressValue = finalPercentage; //DO THIS
          el.connectTo = el.dependantOn;
          el.connectorType = "finish-start";
          el.children = [];

          // let filtered = response.data[0].filter((el2) => {
          //   return (
          //     el.block === el2.subsectionName &&
          //     el.unit === el2.unitName &&
          //     el.taskName === el2.taskName &&
          //     el.fix === el2.fix
          //   );
          // });
          filteredData.forEach((el3) => {
            let diffEndDate = dayjs(el3.endDate).diff(
              dayjs(el3.baselineEndDate),
              "d"
            );
            let diffStartDate = dayjs(el3.startDate).diff(
              dayjs(el3.baselineStartDate),
              "d"
            );
            let color2;
            if (diffEndDate > diffStartDate && diffStartDate == 0) {
              color2 = "#F44336";
            } else if (diffEndDate === diffStartDate && diffEndDate > 0) {
              color2 = "#F57C00";
            } else if (diffEndDate < diffStartDate && diffStartDate > 0) {
              color2 = "#40C4FF";
            } else {
              color2 = "lime";
            }
            let baseline = { fill: `${color2} 0.8`, stroke: `0.9 ${color2}` };
            let insert = {
              id: el3.id,
              name: el3.taskDescription,
              actualStart: el3.startDate,
              actualEnd: el3.endDate,
              baselineStart: el3.baselineStartDate,
              baselineEnd: el3.baselineEndDate,
              baselineProgressValue: "67%",
              baseline: baseline,
              progressValue: `${el3.progress}%`,
              connectorType: "finish-start",
              connectTo: el3.dependantOn,
            };
            el.children.push(insert);
          });
          // console.log(el.children)
        });
        // finalFixArray.forEach((el) => {
        //   el.children.forEach((el2, index, arr) => {
        //     if (index < arr.length - 1) {
        //       el2.connectTo = arr[index + 1].id;
        //       el2.connectorType = "finish-start";
        //     }
        //   });

        // });

        // })
        res.json(ganttData);
        // res.json(result);
        // console.log(ganttData)
        console.log(ganttData.length);
        console.timeEnd("Start");

        // res.json(result);
      }
    });
    connection.release();
  });
});
// router.post("/getAllTasksforGant", (req, res) => {
// // console.log(req.body.id)
//   // let mysql = `select * from tasks order by taskType, unitNumber, fix, id `;
//   let mysql = `select t.id, t.taskType, tt.taskName, t.supplier,s.retention, ss.subsectionName, t.unitNumber,u.unitName ,t.taskDescription,coalesce(p.lastCertificateIssuedAt,0) as lastCertificateIssuedAt, t.price, t.fix, t.startDate, t.endDate,t.baselineStartDate, t.baselineEndDate,t.duration,  p.id as progressID, p.task,t.dependantOn,t.parentId,
//   coalesce(p.progress,0) as progress, p.progressDate, round((t.price * coalesce(p.progress,0) / 100),0) as done,
//   (t.price - round((t.price * coalesce(p.progress,0) / 100),0)) as remaining
//    from suppliers s, taskTypes tt, subsection ss,units u,tasks t
//   left join progress p
//   on t.id = p.task
//   where t.development = ${req.body.id} and u.id = t.unitNumber and s.id = t.supplier and ss.id = u.subsection and tt.id = t.taskType
//   order by t.taskType, t.unitNumber, t.fix, t.id
//  `;
//   pool.getConnection(function (err, connection) {
//     if (err) {
//       connection.release();
//       resizeBy.send("Error with connection");
//     }
//     connection.query(mysql, function (error, result) {
//       if (error) {
//         console.log(error);
//       } else {
//         res.json(result);
//         // res.json(result);
//       }
//     });
//     connection.release();
//   });
// });

router.get("/getAllTasks", (req, res) => {
  let mysql = `select * from tasks order by taskType, unitNumber, fix, id `;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/postTaskUpdates", (req, res) => {
  // let data = []
  // data.push(req.body.info)
  // console.log(req.body.info)
  let mysql = "";
  req.body.info.forEach((el) => {
    // req.body.info.forEach(el => {
    mysql = `${mysql} update tasks set startDate = '${el.startDate}', endDate = '${el.endDate}', duration = ${el.duration}, parentId = '${el.parentId}', dependantOn = '${el.dependantOn}' where id = ${el.id};`;
  });
  console.log(mysql);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/resetData", (req, res) => {
  let mysql = `delete from depositsMade;
  delete from paymentCertificatesDetails;
  delete from paymentCertificates;
  delete from progress;
  delete from progressRetention;
  delete from deliveries;
  delete from purchaseOrders;
  delete from qcquestionnaireDone;
  update tasks set baselineStartDate = startDate;
  update tasks set baselineEndDate = endDate;
  update tasks set comments = null;
  delete from stockPurchased;
  delete from notifications;`;
  // console.log(mysql)
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/upDateTasksFromProgress", (req, res) => {
  let mysql = "";
  req.body.forEach((el) => {
    mysql = `${mysql} update tasks set startDate = '${el.startDate}', endDate = '${el.endDate}', duration = ${el.duration}, comments = '${el.comments}' where id = ${el.id};`;
  });
  console.log(mysql);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getFixes", (req, res) => {
  let mysql1 = `select  t.taskType, tt.taskName as taskName, t.unitNumber, u.unitName as unitName, s.subsectionName, t.fix, t.supplier,su.vatVendor,
  sum(round(t.price,2)) as totalBudget, round(sum(t.price * coalesce(p.progress,0)/100),2) as totalUsed,  round(sum(t.price) - sum((t.price * coalesce(p.progress,0) / 100)),2) as Remaining
from units u, taskTypes tt,subsection s,suppliers su,  tasks t
  left join progress p
  on p.task = t.id
  where u.id = t.unitNumber and tt.id = t.taskType and t.development = ${req.body.id} and s.id = u.subsection and t.supplier = su.id
  group by  s.subsectionName, t.taskType, tt.taskName, t.unitNumber, u.unitName,  t.fix  ,t.supplier, su.vatVendor
  order by s.subsectionName, u.unitName, tt.taskName, t.fix`;
  let mysql2 = `select * from fixes`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        // console.log(result)
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/postFixes", (req, res) => {
  console.log(req.body);
  let mysql = "";
  req.body.forEach((el) => {
    mysql = `${mysql} insert into fixes (id,development, taskType, taskName, unitNumber, unitName, subsectionName, fix, supplier, vatVendor) values 
    ('${el.id}', ${el.development}, ${el.taskType}, '${el.taskName}', ${el.unitNumber}, '${el.unitName}', '${el.subsectionName}', '${el.fix}', ${el.supplier}, ${el.vatVendor});`;
  });

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        let mysqla = `select * from fixes`;
        let mysqlb = `select * from tasks`;
        let mysql2 = `${mysqla};${mysqlb}`;
        connection.query(mysql2, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            // console.log("the result",result)
            let mysql3 = "";
            result[0].forEach((el) => {
              let filteredData = result[1].filter((el2) => {
                return (
                  el.fix === el2.fix &&
                  el.development === el2.development &&
                  el.taskType === el2.taskType &&
                  el.unitNumber === el2.unitNumber
                );
              });
              let startDate = dayjs(filteredData[0].startDate).format(
                "YYYY-MM-DD HH:mm"
              );
              let endDate = dayjs(
                filteredData[filteredData.length - 1].endDate
              ).format("YYYY-MM-DD HH:mm");
              let baselineStartDate = dayjs(
                filteredData[0].baselineStartDate
              ).format("YYYY-MM-DD HH:mm");
              let baselineEndDate = dayjs(
                filteredData[filteredData.length - 1].baselineEndDate
              ).format("YYYY-MM-DD HH:mm");
              mysql3 = `${mysql3} update fixes set startDate = '${startDate}', endDate = '${endDate}', baselineStartDate = '${baselineStartDate}', baselineEndDate = '${baselineEndDate}' where id = '${el.id}';`;
            });
            connection.query(mysql3, function (error, result) {
              if (error) {
                console.log(error);
              } else {
                console.log("the result", result);

                // console.log(result)
                res.json(result);
              }
            });

            // console.log(result)
            // res.json(result);
          }
        });

        // console.log(result)
        // res.json(result);
      }
    });
    connection.release();
  });
});

// id: '1-11-54-1st',
// development: 1,
// taskType: 1,
// taskName: 'Electrical',
// unitNumber: 54,
// unitName: 'F101',
// subsectionName: 'Block F',
// fix: '1st',
// supplier: 11,
// vatVendor: 1,
// totalBudget: null,
// totalUsed: null,
// Remaining: null,
// startDate: '2021-04-16T09:49:51.000Z',
// endDate: '2021-04-16T09:49:51.000Z',
// baselineStartDate: '2021-04-16T09:49:51.000Z',
// baselineEndDate: '2021-04-16T09:49:51.000Z',
// dependantOn: null,
// parentId: null,
// title: 'Block F: F101 - Electrical - 1st',
// subtitle: 'Block F',
// avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg'

router.post("/getRelatedTasks", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works"})
  let mysql = `select * from tasks where development = ${req.body.development} and taskType = ${req.body.taskType} and unitNumber = ${req.body.unitNumber} and fix = '${req.body.fix}' order by sortIndex`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/saveProjectChanges", (req, res) => {
  console.clear();
  console.log(req.body);
  // res.json({awesome: "It Works"})
  let mysql1 = "";
  let mysql2 = "";
  console.log(chalk.red("FIXES"), req.body.fixes);
  console.log(chalk.yellow("TASKS"), req.body.tasks);
  if (req.body.fixes.length) {
    req.body.fixes.forEach((el) => {
      if (el.dependantOn !== null) {
        el.dependantOn = `'${el.dependantOn}'`;
      }
      if (el.parentId !== null) {
        el.parentId = `'${el.parentId}'`;
      }
      mysql1 = `${mysql1} update fixes set startDate = '${dayjs(
        el.startDate
      ).format("YYYY-MM-DD HH:mm")}', endDate = '${dayjs(el.endDate).format(
        "YYYY-MM-DD HH:mm"
      )}', baselineStartDate = '${dayjs(el.startDate).format(
        "YYYY-MM-DD HH:mm"
      )}',baselineEndDate = '${dayjs(el.endDate).format("YYYY-MM-DD HH:mm")}', 
       dependantOn = ${el.dependantOn}, parentId = ${el.parentId} where id = '${
        el.id
      }';`;
    });
  }
  if (req.body.tasks.length) {
    req.body.tasks.forEach((el) => {
      if (el.dependantOn !== null) {
        el.dependantOn = `'${el.dependantOn}'`;
      }
      if (el.parentId !== null) {
        el.parentId = `'${el.parentId}'`;
      }
      mysql2 = `${mysql2} update tasks set startDate = '${dayjs(
        el.startDate
      ).format("YYYY-MM-DD HH:mm")}', endDate = '${dayjs(el.endDate).format(
        "YYYY-MM-DD HH:mm"
      )}', baselineStartDate = '${dayjs(el.startDate).format(
        "YYYY-MM-DD HH:mm"
      )}',baselineEndDate = '${dayjs(el.endDate).format("YYYY-MM-DD HH:mm")}', 
       dependantOn = ${el.dependantOn}, parentId = ${el.parentId}, duration = ${
        el.duration
      },sortIndex = ${el.sortIndex} where id = ${el.id};`;
    });
  }
  // console.log(chalk.yellow(mysql1))
  // console.log(chalk.red(mysql2))
  let mysql = `${mysql1}${mysql2}`;
  console.log(mysql);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        // console.log(result)
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getTaskListWb", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works"})
  let mysql = `select * from taskList where development = ${req.body.id} order by sortIndex`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(error)
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/createTaskListItemWb", (req, res) => {
  console.log(req.body);

  // res.json({awesome: "It Works"})
  let mysql = `insert into taskList (development, taskText, taskTitle, userName, icon, typeTask, sortIndex, estimate ) values(
    ${req.body.development}, '${req.body.taskText}', '${req.body.taskTitle}', '${req.body.userName}', '${req.body.icon}', '${req.body.typeTask}', ${req.body.sortIndex}, '${req.body.estimate}'
  )`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/deleteTaskListItemWb", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works"})
  let mysql = `delete from taskList where id = ${req.body.id}`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/updateTaskListWb", (req, res) => {
  console.log(req.body.info);
  // res.json({awesome: "It Works"})

  let mysql = "";
  req.body.info.forEach((el) => {
    mysql = `${mysql} update taskList set development = ${el.development}, taskText = '${el.taskText}',taskTitle = '${el.taskTitle}',userName = '${el.userName}',icon = '${el.icon}', sortIndex = ${el.sortIndex},typeTask = '${el.typeTask}', estimate = '${el.estimate}' where id = ${el.id};`;
  });

  // let mysql = `delete from taskList where id = ${req.body.id}`

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

// stockTrx stuff
router.post("/getStockList", (req, res) => {
  console.log(req.body)
  // res.json({awesome: "It Works"})
  //let mysql = `select distinct mainCategory(reference) from stockonhand
  let mysql = `
  select p.itemCode, p.itemDescription, p.unitDescription, sum(d.quantityDelivered) as qtyOnHand
from deliveries d, purchaseOrders p
where  d.PONumber = p.PONumber and d.development = ${req.body.id} and p.development = ${req.body.id}
group by p.itemCode, p.itemDescription, p.unitDescription
union all
select s.stockid as itemCode, 'stockTransfered' as itemDescription, 'zz' as unitDescription, -sum(s.qtyTransfered) as qtyOnHand
from stocktranfers s
where development = ${req.body.id}
group by s.stockid, itemDescription, unitDescription`
//   let mysql = `
//   select p.itemCode, p.itemDescription, sum(d.quantityDelivered) as qtyOnHand
// from deliveries d, purchaseOrders p
// where  d.PONumber = p.PONumber and d.development = ${req.body.id} and p.development = ${req.body.id}
// group by p.itemCode, p.itemDescription 
// union all
// select s.stockid as itemCode, 'stockTransfered' as itemDescription, -sum(s.qtyTransfered) as qtyOnHand
// from stocktranfers s
// where development = ${req.body.id}
// group by s.stockid, itemDescription;`
  // let mysql = `
  // select p.reference as mainCategory,p.itemCode, p.itemDescription, sum(d.quantityDelivered) - coalesce(sum(s.qtyTransfered),0) as qtyOnHand from  deliveries d, purchaseOrders p
  // left join 
  // stocktranfers s on s.stockid = p.itemCode
  // where p.id = d.purchaseNumber and p.unitDescription != 'm³' and d.development = ${req.body.id} and p.development = ${req.body.id}
  // group by p.reference, p.itemCode, p.itemDescription order by p.itemDescription;`
  // let mysql = `
  // select 
  //       po.reference as mainCategory, 
  //       po.itemCode, 
  //       po.itemDescription, 
  //       SUM(d.quantityDelivered - IFNULL(si.requisitioned,0)) as qtyOnHand, 
  //       IFNULL(si.requisitioned,0) as requisitioned 
  //     from deliveries d 
  //     join purchaseOrders po on po.PONumber = d.PONumber 
  //     join stockItems si on si.id = po.stockId    
  //     where d.development = ${req.body.id}
  //     group by  po.reference, po.itemCode, po.itemDescription, si.requisitioned;`
  //let mysql2 = `select * from deliveries d join purchaseorders po on po.PONumber = d.PONumber join stockitems si on si.id = po.stockId`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
       console.log("getStockList success 2")
       result.sort((a, b) =>  (a.itemCode > b.itemCode) ? 1 : ((b.itemCode > a.itemCode) ? -1 : 0)
       )
       console.log("1",result.length)
       let result2 = []
       result = result.filter((el) => {
         return el.unitDescription !== 'm³'
       } )
       console.log("2",result.length)

       result.forEach((el) => {
         let filtered = result.filter((el2) => {
           return el2.itemCode === el.itemCode
         })
         if (filtered.length > 1) {
           let insert = {}
           for (let i = 0; i < filtered.length; i++) {
             if (filtered[i].itemDescription !== 'stockTransfered') {
               insert.itemDescription = filtered[i].itemDescription
               insert.itemCode = filtered[i].itemCode
               break;
             }
           }
           let qtyOnHand = filtered.reduce((prev, curr) => {
             return prev + curr.qtyOnHand
           },0)
           insert.qtyOnHand = qtyOnHand
           result2.push(insert)

         } 
         else {
         
           result2.push(el)
         }
       })
       result2 = result2.filter((el, index, arr) => arr.findIndex(t => (t.itemCode === el.itemCode && t.itemDescription === el.itemDescription && t.qtyOnHand === el.qtyOnHand)) === index)
      //  result2 = result2.filter((el, index, arr) => {
      //   index === arr.findIndex((t) => {t.itemCode === el.itemCode})
      //  })

       console.log(result)
       console.log(result2)
       console.log(result.length)
       console.log(result2.length)
 
        res.json(result2);
      }
    });
    connection.release();
  });
}),


  router.post("/getSubContractors", (req, res) => {
    console.log(req.body);
    // res.json({awesome: "It Works"})
    let mysql = `select * from suppliers s where s.isSubcontractor = 1`;
    // and s.development = ${req.body.id}

    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        resizeBy.send("Error with connection");
      }
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          // console.log("getSubContractors success 2")
          res.json(result);
        }
      });
      connection.release();
    });
  });

const fileFilter = function (req, file, cb) {
  const allowedTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type");
    error.code = "LIMIT_FILE_TYPES";
    console.log(req.path, error);
    return cb(error, false);
  }
  cb(null, true);
};

let MAX_SIZE = 20000000;
const upload = multer({
  dest: "./public/uploads/",
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
    fieldSize: 100 * 1024 * 1024,
  },
});

router.post("/uploadImage", upload.single("stockImage"), (req, res) => {
  console.log("imageUploaded and renamed to: ", req.body.newImageName);
  // rename the image
  console.log("req.file", req.file);
  fs.rename(
    `public/uploads/${req.file.filename}`,
    `public/uploads/${req.body.newImageName}`,
    (err) => {
      if (err) console.log("Error renaming", err);
      //throw err
    }
  );
}),
  router.post("/completeTransfers", (req, res) => {
    console.log("completeTransfers req", req.body);
    let supplierName = "";
    let contactID = "";
    req.body.subContractor.forEach((subContract) => {
      supplierName = subContract.supplierName;
      contactID = subContract.contactID;
    });
    console.log(req.body.stockList)
    console.log("XXXS", supplierName);
    console.log("XXXC", contactID);
    let mysqlPrefix = ` insert into stocktranfers (supplierName, contactID, block, unit, stockId, qtyTransfered, user, userId, stockImageUrl, transferDate) values`;
    let mysql1 = "";
    let mysql2 = ""
    let mysql2Prefix = ` update stockitems s join purchaseorders po on po.stockId = s.id set requisitioned = IFNULL(requisitioned,0)  + `;
    req.body.stockList.forEach((stockItem, index, arr) => {
      // console.log(ArrayBuffer)
      if (index < arr.length - 1) {
      mysql1 =    
        `${mysql1} ('${supplierName}', '${req.body.contactID}', '${req.body.block}', '${req.body.unit}',  '${stockItem.itemCode}', '${stockItem.qtyToTransfer}' , '${req.body.currentUser}','${req.body.currentUserId}', '${req.body.imageName}', '${req.body.transferDate}'), `
      } else {
        mysql1 =    
        `${mysql1} ('${supplierName}', '${req.body.contactID}', '${req.body.block}', '${req.body.unit}',  '${stockItem.itemCode}', '${stockItem.qtyToTransfer}' , '${req.body.currentUser}','${req.body.currentUserId}', '${req.body.imageName}', '${req.body.transferDate}')`
      }
        mysql2 = 
        `${mysql2} ${mysql2Prefix} ${parseInt(stockItem.qtyToTransfer)} WHERE s.itemCode = '${
          stockItem.itemCode
        }' AND po.reference = '${stockItem.mainCategory}';`;
    });
    let insertSql = `${mysqlPrefix}${mysql1}`
    let updateSql = `${mysql2}`
    let mysql = `${insertSql};${updateSql}`
    console.log(chalk.cyanBright("completeTransfers sql", mysql));

    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        resizeBy.send("Error with connection");
      }
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log("completeTransfers success");
          res.json(result);
        }
      });
      connection.release();
    });
  });

router.post("/submitStockTake", (req, res) => {
  console.log("submitStockTake in server");
  console.log(req.body.StockList);
  req.body.StockList.forEach((el) => {
    if (el.CountCorrect === true) {
      el.CountCorrect = 1;
    } else {
      el.CountCorrect = 0;
    }
  });

  let mysqlPrefix = ` insert into stocktake ( itemCode, reference, qtyOnHand, qtyCounted, countCorrect, stockTakeDate, user, userId) `;
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  let mysql = "";
  //let mysql2Prefix = ` update stockitems set requisitioned = IFNULL(requisitioned,0)  + `
  req.body.StockList.forEach((stockItem) => {
    if (!stockItem.CountCorrect) {
    mysql =
      mysql +
      mysqlPrefix +
      ` VALUES ('${stockItem.itemCode}','${stockItem.itemDescription}',  '${stockItem.qtyOnHand}', '${stockItem.qtyCounted}' , '${stockItem.CountCorrect}', '${dateTime}', '${req.body.currentUser}',  '${req.body.currentUserId}' ); `;
    }
    //+ mysql2Prefix + ` ${parseInt(stockItem.qtyToTransfer)} WHERE id = '${stockItem.stockId}';`
  });
  console.log(chalk.greenBright("completeTransfers sql", mysql));

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(error)
      } else {
        console.log("completeTransfers success");
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/sendStockTakeEmail", (req, res) => {
  console.log("XXXX", req.body);
  let subject = `Stock Take Completed`;
  let recipient = "morne@cpconstruction.co.za; wayne@opportunity.co.za";
  // let recipient = " wayne@opportunity.co.za";
  // ${req.body.info[0].firstname} ${req.body.info[0].firstname}

  let invalidItemsHtml = "";
  req.body.forEach((invalidItem) => {
    invalidItemsHtml =
      invalidItemsHtml +
      " <br/>  <br/> Stock Item: " +
      invalidItem.itemCode +
      "<br/> Qty On Hand: " +
      invalidItem.qtyOnHand +
      "<br/> Qty Counted: " +
      invalidItem.qtyCounted;
  });
  console.log("invalidItemsHtml=", invalidItemsHtml);
  // The following documents have been received
  let output = `Dear Morne,
            A stock take has been completed and the following items have been reported as not fully accounted for;
            <br><br><br>
            
            <strong> 
               ${invalidItemsHtml}              
            </strong>
            
            <br><br>          
            Kind regards
            <br><br>
    
            <strong>Stock Take Sytem</strong><br>
            Oppurtunity Private Capital<br>
            CPC<br><br>
            `;

  sendMail(subject, recipient, output).then(() => {
    console.log("mail sent");
  });
});

router.post("/getAllUnitsforStockPage", (req, res) => {
  console.log("getAllUnitsforStockPage", req.body); // this is the only changed method the rest are new
  let mysql = `select u.id, u.unitName from units u where u.subsection IN (${req.body.blocksId}) and u.development = ${req.body.id}`;
  // IN ('1','2')
  console.log("Hello", mysql);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("UNITS=", result);
        console.log("UNITSLength=", result.length);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getblocks", (req, res) => {
  // console.log("Awesome")
  // res.json({awesome: "It Works"})
  // console.log("TESTING")
  let mysql = `select * from subsection where subsectionName not like 'Common Area' and  development = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        //console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getblocksA", (req, res) => {
  // console.log("Awesome")
  // res.json({awesome: "It Works"})
  // console.log("TESTING")
  let mysql = `select * from subsection where subsectionName not like 'Common Area' and  development = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        //console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

async function sendMail(subject, recipient, output) {
  let mailOptions = {
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: ["waynebruton@icloud.com"],
    subject: `${subject}`,
    text: "Stock Take Info",
    html: output,
    // attachments: [
    //   {
    //     filename: `${filename}.pdf`,
    //     path: `public/purchaseorders/${filename}.pdf`, // stream this file
    //   },
    // ],
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    console.log("Sending mail in the transporter");
    if (error) {
      console.log("Error with connection", error);
    }
  });
}

let transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: 465, //587
  secure: true,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// end
module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
const dayjs = require("dayjs")
const businessDays = require("dayjs-business-days");

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
  // let mysql = `select * from tasks order by taskType, unitNumber, fix, id `;
  let mysql = `select t.id, t.taskType, tt.taskName, t.supplier,s.retention, ss.subsectionName, t.unitNumber,u.unitName ,t.taskDescription,coalesce(p.lastCertificateIssuedAt,0) as lastCertificateIssuedAt, t.price, t.fix, t.startDate, t.endDate,t.baselineStartDate, t.baselineEndDate,t.duration,  p.id as progressID, p.task,t.dependantOn,t.parentId, 
  coalesce(p.progress,0) as progress, p.progressDate, round((t.price * coalesce(p.progress,0) / 100),0) as done, 
  (t.price - round((t.price * coalesce(p.progress,0) / 100),0)) as remaining
   from suppliers s, taskTypes tt, subsection ss,units u,tasks t
  left join progress p
  on t.id = p.task
  where t.development = ${req.body.id} and u.id = t.unitNumber and s.id = t.supplier and ss.id = u.subsection and tt.id = t.taskType
  order by t.taskType, t.unitNumber, t.fix, t.id
 `;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        // console.time("TimeThis")
        // let finalFixArray = [];
        //   let fixArray = [];
        //   result.forEach((el) => {
        //     fixArray.push(el.parentId);
        //     let dependsOn = [];
        //     if (el.dependantOn !== "null") {
        //       dependsOn.push(parseInt(el.dependantOn));
        //       el.dependentOn = dependsOn;
        //     } else {
        //       el.dependentOn = null;
        //     }
        //   });
        //   fixArray = Array.from(new Set(fixArray));
        //   fixArray.forEach((el, index) => {
        //     let dataStartArray = result.filter((el2) => {
        //       return el2.parentId === el;
        //     });
        //     let startDate = [];
        //     let endDate = [];
        //     let userArr = [];
        //     let progress = [];

        //     dataStartArray.forEach((el3) => {
        //       startDate.push(el3.startDate);
        //       endDate.push(el3.endDate);
        //       userArr.push(el3.supplier);
        //       progress.push(el3.progress);
        //     });
        //     let finalProgress =
        //       progress.reduce((prev, el) => {
        //         return prev + el;
        //       }, 0) / progress.length;
        //     startDate = Array.from(new Set(startDate));
        //     startDate.sort();
        //     endDate = Array.from(new Set(endDate));
        //     endDate.sort();
        //     let start = dayjs(startDate[0]).format("YYYY-MM-DD HH:mm:ss");
        //     let duration = dayjs(endDate[endDate.length - 1]).diff(
        //       dayjs(startDate[0])
        //     );
        //     let end = dayjs(endDate[endDate.length - 1]).format(
        //       "YYYY-MM-DD HH:mm:ss"
        //     );
        //     userArr = Array.from(new Set(userArr));
        //     let baselineStart;
        //     let baselineEnd;
        //     let baseline;
        //     if (index === 0) {
        //       baselineStart = start,
        //       baselineEnd = end;
        //       baseline = { fill: "lime 0.8", stroke: "0.9 lime" }
        //     } else if (index === 1) {
        //        baselineStart = start,
        //        baselineEnd = dayjs(end)
        //         .subtract(2, "d")
        //         .format("YYYY-MM-DD HH:mm:ss");
        //         baseline = { fill: "red 0.8", stroke: "0.9 red" }
        //     } else {
        //        baselineStart = dayjs(start)
        //         .subtract(2, "d")
        //         .format("YYYY-MM-DD HH:mm:ss");
        //        baselineEnd = dayjs(end)
        //         .subtract(2, "d")
        //         .format("YYYY-MM-DD HH:mm:ss");
        //         baseline = { fill: "orange 0.8", stroke: "0.9 orange" }
        //     }
        //     let insert = {
        //       id: el,
        //       name: `${dataStartArray[0].taskName}: Unit ${dataStartArray[0].unitName} - ${dataStartArray[0].fix} Fix`,
        //       actualStart: start,
        //       actualEnd: end,
        //       baselineStart: baselineStart,
        //       baselineEnd: baselineEnd,
        //       // baselineProgressValue: "100%",
        //       baseline: baseline,
        //       duration: duration,
        //       fix: dataStartArray[0].fix,
        //       block: dataStartArray[0].subsectionName,
        //       unit: dataStartArray[0].unitName,
        //       taskName: dataStartArray[0].taskName,
        //       percent: finalProgress,
        //       user: userArr[0],
        //       progressValue: "76%",
        //       children: [],
        //     };
        //     finalFixArray.push(insert);
        //   });

        //   finalFixArray.forEach((el, index, arr) => {
        //     if (index !== 0) {
        //       if (el.user == arr[index - 1].user) {
        //         let depArr = [];
        //         depArr.push(arr[index - 1].id);
        //         el.dependentOn = depArr;
        //       } else {
        //       }
        //     }
        //   });

        //   finalFixArray.forEach((el, index, arr) => {
        //     if (index < arr.length - 1) {
        //       if (el.user == arr[index + 1].user) {
        //         el.connectTo = arr[index + 1].id;
        //         el.connectorType = "finish-start";
        //       } else {
        //       }
        //     }
        //   });
        //   finalFixArray.forEach((el) => {
        //     let filtered = result.filter((el2) => {
        //       return (
        //         el.block === el2.subsectionName &&
        //         el.unit === el2.unitName &&
        //         el.taskName === el2.taskName &&
        //         el.fix === el2.fix
        //       );
        //     });
        //     filtered.forEach((el3) => {
        //       let insert = {
        //         id: el3.id,
        //         name: el3.taskDescription,
        //         actualStart: el3.startDate,
        //         actualEnd: el3.endDate,
        //         progressValue: `${el3.progress}%`,
        //       };
        //       el.children.push(insert);
        //     });
        //   });
        //   finalFixArray.forEach((el) => {
        //     el.children.forEach((el2, index, arr) => {
        //       if (index < arr.length - 1) {
        //         el2.connectTo = arr[index + 1].id;
        //         el2.connectorType = "finish-start";
        //       } else {
        //         console.log("Err", index, arr.length);
        //       }
        //     });
        //   });
        //   // console.log(finalFixArray)
        // console.timeEnd("TimeThis")
        
        res.json(result);
        // res.json(result);
      }
    });
    connection.release();
  });
});

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
  req.body.info.forEach(el => {
  // req.body.info.forEach(el => {
    mysql = `${mysql} update tasks set startDate = '${el.startDate}', endDate = '${el.endDate}', duration = ${el.duration}, parentId = '${el.parentId}', dependantOn = '${el.dependantOn}' where id = ${el.id};`
  });
  console.log(mysql)
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
        console.log(result)
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
  update tasks set comments = null;`
  // console.log(mysql)
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
        console.log(result)
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/upDateTasksFromProgress", (req, res) => {
  let mysql = "";
  req.body.forEach(el => {
    mysql = `${mysql} update tasks set startDate = '${el.startDate}', endDate = '${el.endDate}', duration = ${el.duration}, comments = '${el.comments}' where id = ${el.id};`
  });
  console.log(mysql)
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result)
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;

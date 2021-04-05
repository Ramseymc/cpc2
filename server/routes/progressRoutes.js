// const express = require("express");
// const router = express.Router();
// const  pool = require("./connection");
// const  chalk = require("chalk");
// import { checktoken } from "./checkToken.js";
const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
const moment = require("moment");
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc') // dependent on utc plugin
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

router.get("/start", checktoken, (req, res) => {
  res.json({ Awesome: "It Works!!!!" });
});

router.get("/development2", checktoken, (req, res) => {
  let mysql = `select * from developments`;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
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

router.get("/subsection/:parameter", (req, res) => {
  let mysql = `select * from subsection where development = ${req.params.parameter} order by subsectionName`;
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

router.get("/getUnits/:development/:subsection", (req, res) => {
  let mysql = `select * from units where development = ${req.params.development} and subsection = ${req.params.subsection} order by unitName`;
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

router.post("/getUnitsForOptions", (req, res) => {
  let mysql = `select * from units where development = ${req.body.id} and subsection = ${req.body.subsection}`;
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

router.post("/getblocksForOptions", (req, res) => {
  let mysql = `select * from subsection where development = ${req.body.id}`;
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

router.post("/taskTypesR", (req, res) => {
  // let mysql = `select distinct t.taskName, t.id,  ta.taskType from taskTypes t, units u, tasks ta where t.development = ${req.body.id} and u.id = ${req.body.unit} and t.id = ta.taskType`;
  let mysql = `select distinct t.taskName, t.id,  ta.taskType from taskTypes t, units u, tasks ta where t.development = ${req.body.id} and u.id = ${req.body.unit} and u.id = ta.unitNumber and t.id = ta.taskType order by t.taskName `;
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

router.get("/taskTypes/:id", (req, res) => {
  let mysql = `select * from taskTypes where development = ${req.params.id} order by taskName`;
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

router.post("/progressPost", (req, res) => {
  let mysql;

  if (req.body.progressId === null) {
    mysql = `insert into progress (task, unitNumber, progress, progressDate) values
      (${req.body.task}, ${req.body.unitNumber}, ${req.body.progress}, '${req.body.progressDate}')`;
  } else {
    mysql = `update progress set task = ${req.body.task}, unitNumber = ${req.body.unitNumber}, progress = ${req.body.progress}, progressDate = '${req.body.progressDate}' where id = ${req.body.progressId}`;
  }
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

router.post("/progressPostAll", (req, res) => {
  console.log(req.body.allTasks)
  let sqlType;
  let allTasks = req.body.allTasks;
  let post = [];
  let sqlStmt = ``;
  if (allTasks[0][5] === null) {
    sqlType = "New";
    allTasks.forEach((el) => {
      el.splice(2, 1);
      el.pop();
      el.push("[]");
    });
    post.push(allTasks);
  } else {
    sqlType = "Update";
    allTasks.forEach((el) => {
      el.splice(2, 1);
    });
    allTasks.forEach((el) => {
      let str = `update progress set task = ${el[0]}, unitNumber = ${el[1]}, progress = ${el[3]}, progressDate = '${el[2]}' where id = ${el[4]};`;
      sqlStmt = sqlStmt + str;
    });
  }
  let mysql;

  if (sqlType === "New") {
    mysql = `insert into progress (task, unitNumber, progressDate,  progress, paymentDetails) values ?`;
  } else {
    mysql = sqlStmt;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    if (sqlType === "New") {
      connection.query(mysql, post, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          res.json(result);
        }
      });
    } else {
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          res.json(result);
        }
      });
    }
    connection.release();
  });
});

router.post("/progressPostRetained", (req, res) => {
  let sqlType;
  let allTasks = req.body.allTasks;
  let post = [];
  let sqlStmt = ``;
  if (allTasks[0][8] === null) {
    sqlType = "New";
    allTasks.forEach((el) => {
      el.pop();
    });
    post.push(allTasks);
  } else {
    sqlType = "Update";

    allTasks.forEach((el) => {
      let str = `update progressRetention set progress = ${el[4]}, progressDate = '${el[7]}' where id = ${el[8]};`;
      sqlStmt = sqlStmt + str;
    });
  }
  let mysql;

  if (sqlType === "New") {
    mysql = `insert into progressRetention (development, supplier, taskType, unitNumber, progress, totalRetention, retentionToDate, progressDate) values ?`;
  } else {
    mysql = sqlStmt;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    if (sqlType === "New") {
      connection.query(mysql, post, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          res.json(result);
        }
      });
    } else {
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          res.json(result);
        }
      });
    }
    connection.release();
  });
});

router.get("/tasks/:unit/:taskType", (req, res) => {
  let mysql1 = `select t.id, t.taskType,t.supplier,s.retention,  t.unitNumber, t.taskDescription,coalesce(p.lastCertificateIssuedAt,0) as lastCertificateIssuedAt, t.price, t.fix, t.startDate, t.endDate,t.duration,  p.id as progressID, p.task, 
    coalesce(p.progress,0) as progress, p.progressDate, round((t.price * coalesce(p.progress,0) / 100),0) as done, 
    (t.price - round((t.price * coalesce(p.progress,0) / 100),0)) as remaining
     from suppliers s, tasks t
    left join progress p
    on t.id = p.task
    where t.unitNumber = ${req.params.unit} and t.taskType = ${req.params.taskType} and s.id = t.supplier order by t.fix, t.id, t.startDate, t.taskDescription`;
  let mysql2 = `select id as progressID, supplier, taskType, unitNumber, progress,totalRetention, retentionToDate, progressDate, certificateIssued, lastCertificateIssuedAt, lastCertificateNumber, paymentDetails, updatedBy, lastUpdate 
    from progressRetention where unitNumber = ${req.params.unit} and taskType = ${req.params.taskType}`;
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
        let remaining = [];

        remaining = result[0].filter((el) => {
          return el.progress <= 100;
        });
        remaining.forEach((el) => {
          console.log(new Date(el.startDate).getTimezoneOffset())
          el.startDate = dayjs(el.startDate).add(new Date(el.startDate).getTimezoneOffset(),'minutes').format("YYYY-MM-DD HH:mm:ss")
          el.endDate = dayjs(el.endDate).add(new Date(el.endDate).getTimezoneOffset(),'minutes').format("YYYY-MM-DD HH:mm:ss")
        })
        let finalResult = {
          remaining,
          retention: result[1],
        };
        console.log(finalResult.remaining)
        res.json(finalResult);
      }
    });
    connection.release();
  });
});

router.post("/cashflow", (req, res) => {
  let mysql = `select s.supplierName, tt.taskName, u.unitName, t.fix,  t.endDate, round((sum(t.price) - sum(t.price) * s.retention / 100 - coalesce(sum(pc.amountPaid),0)),2) as price
  from  suppliers s, taskTypes tt, units u,tasks t 
left join progress p
  on p.task = t.id
  left join paymentCertificatesDetails pc
  on p.id = pc.progressId
  where s.id = t.supplier and t.taskType = tt.id and u.id = t.unitNumber and t.development = ${req.body.id}
  group by s.supplierName, t.taskType, u.unitName,t.fix, t.startDate, t.endDate, p.lastCertificateIssuedAt, pc.unitName`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        result.forEach((el) => {
          el.price = Math.round(el.price);
          el.endDate = moment(el.endDate).format("YYYY-MM-DD");
        }, 100);
        res.json(result);
      }
    });
    connection.release();
  });
});

//

module.exports = router;

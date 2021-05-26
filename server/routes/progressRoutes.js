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

router.get("/development2", (req, res) => {
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


router.post("/postTimeChange", (req, res) => {

  console.log(req.body)
  // res.json({awesome: "It works!!!"})

  let mysql = ""
  if (req.body.progressID === null) {
    console.log("NULL VALUE")
    mysql = `insert into progress (task, unitNumber, currentTime) values
    (${req.body.task}, ${req.body.unitNumber}, ${req.body.currentTime})`
    console.log(chalk.red(mysql))
  } else {
    mysql = `update progress set task = ${req.body.task}, unitNumber = ${req.body.unitNumber}, currentTime = ${req.body.currentTime} where id = ${req.body.progressID}`
    console.log(chalk.yellow(mysql))
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
})

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
  // let post = [];
  // let sqlStmt = ``;
  // if (allTasks[0][5] === null) {
  //   sqlType = "New";
  //   allTasks.forEach((el) => {
  //     el.splice(2, 1);
  //     el.pop();
  //     el.push("[]");
  //   });
  //   post.push("New",allTasks);
  //   console.log(allTasks)
  // } else {
  //   sqlType = "Update";
  //   allTasks.forEach((el) => {
  //     el.splice(2, 1);
  //   });
  //   console.log("Update",allTasks)
  //   allTasks.forEach((el) => {
  //     let str = `update progress set task = ${el[0]}, unitNumber = ${el[1]}, progress = ${el[3]}, progressDate = '${el[2]}' where id = ${el[4]};`;
  //     sqlStmt = sqlStmt + str;
      
  //   });
  //   console.log(sqlStmt)
  // }
  let mysql = "";

  allTasks.forEach((el) => {
    if (el.progressID === null) {
      mysql = `${mysql} insert into progress (task, unitNumber, progressDate,  progress) values (
        ${el.id},${el.unitNumber},'${el.changed}',${el.progress});`;
    } else {
      mysql = `${mysql} update progress set progress = ${el.progress}, progressDate = '${el.changed}' where id = ${el.progressID} and task = ${el.id} and unitNumber = ${el.unitNumber};`
    }
  })

  // if (sqlType === "New") {
  //   mysql = `insert into progress (task, unitNumber, progressDate,  progress, paymentDetails) values ?`;
  // } else {
  //   mysql = sqlStmt;
  // }

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    // if (sqlType === "New") {
    //   connection.query(mysql, post, function (error, result) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log(result)
    //       res.json("1",result);
    //     }
    //   });
    // } else {
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log("2",result)
          res.json(result);
        }
      });
    // }
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
  let mysql1 = `select t.id, t.taskType,t.supplier,s.supplierName, s.retention,s.vatVendor,  t.unitNumber, t.taskDescription,coalesce(p.lastCertificateIssuedAt,0) as lastCertificateIssuedAt, t.price, t.fix, t.startDate, t.endDate,t.baselineStartDate, t.baselineEndDate, t.duration,  p.id as progressID,p.currentTime, p.task, t.comments,
    coalesce(p.progress,0) as progress, p.progressDate, round((t.price * coalesce(p.progress,0) / 100),0) as done, 
    (t.price - round((t.price * coalesce(p.progress,0) / 100),0)) as remaining
     from suppliers s, tasks t
    left join progress p
    on t.id = p.task
    where t.unitNumber = ${req.params.unit} and t.taskType = ${req.params.taskType} and s.id = t.supplier order by t.fix, t.id, t.startDate, t.taskDescription`;
  let mysql2 = `select id as progressID, supplier, taskType, unitNumber, progress,totalRetention, retentionToDate, progressDate, certificateIssued, lastCertificateIssuedAt, lastCertificateNumber, paymentDetails, updatedBy, lastUpdate 
    from progressRetention where unitNumber = ${req.params.unit} and taskType = ${req.params.taskType}`;
    let mysql3 = `select * from fixes where unitNumber = ${req.params.unit} and taskType = ${req.params.taskType} order by fix`
  let mysql = `${mysql1};${mysql2};${mysql3}`;
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
          el.baselineStartDate = dayjs(el.baselineStartDate).add(new Date(el.baselineStartDate).getTimezoneOffset(),'minutes').format("YYYY-MM-DD HH:mm:ss")
          el.baselineEndDate = dayjs(el.baselineEndDate).add(new Date(el.baselineEndDate).getTimezoneOffset(),'minutes').format("YYYY-MM-DD HH:mm:ss")
        })
        let finalResult = {
          remaining,
          retention: result[1],
          fixes: result[2]
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

router.post("/processValuationNotification", (req, res) => {
  console.log(req.body)
  let mysql = `select id, userName from users`

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        
        let items = ["default","warning","error","success","info"]
        var item = items[Math.floor(Math.random() * items.length)];
        let mysql2 = ""
        result.forEach((el) => {
          mysql2 = `${mysql2} insert into notifications (title, msg, user, type) values (
            'Valuation Done', 'A valuation has been done on ${new Date().toISOString().substr(0,10)} by ${req.body.name}' , ${el.id}, '${item}'
          );`
        })
        
        connection.query(mysql2, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            
            
            res.json({result: "done!!"});
          }
        });
      }
    });
    connection.release();
  });
});

//

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
var fs = require("fs");
const { response } = require("express");
const runReport = require("./itcPDFs");

router.post("/getP&G", (req, res) => {
    console.log(req.body);
    let mysql = `select * from pandgNew where development = ${req.body.id};
   `;
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
          // result.forEach((el) => {
          //   console.log(el)
          // })
          let dataAvailable = result.reduce((prev, curr) => {
            return curr.length + prev
          },0)
          // console.log(dataAvailable)
          if (dataAvailable === 1) {
            result = {
              noInfo: true
            }
          }
          res.json(result);

        }
      });
      connection.release();
    });
  });

router.post("/updateP&G", (req, res) => {
    // console.log(req.body);
    console.log(req.body.length);
    let mysql = ""
    req.body.forEach((el) => {
      mysql = `${mysql} update pandg set actualAmount = ${parseFloat(el.actualAmount)}, budgetAmount = ${parseFloat(el.budgetAmount)}, posted = ${el.posted} where id = ${el.id};`
    })
    // let mysql = `update `;
    // console.log(mysql)
    // res.json({Awesome: "It Works!!!"})

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

router.post("/getSubcontractors", (req, res) => {
    console.log(req.body);
    let mysql = `select * from suppliers where isSubcontractor = true order by supplierName`;
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

router.post("/getTaskTotals", (req, res) => {
    console.log(req.body);
    let mysql = `select t.supplier, s.supplierName, t.taskType,tt.taskName, ss.id, ss.subsectionName, t.unitNumber, u.unitName,t.fix, sum(t.price) as total 
    from tasks t, taskTypes tt, units u, suppliers s, subsection ss
    where t.supplier = ${req.body.supplier} and u.id = t.unitNumber and tt.id = t.taskType and t.development = ${req.body.development} and s.id = t.supplier and u.subsection = ss.id  and t.itcDone = 0
    group by t.supplier, t.taskType, ss.id, t.unitNumber, t.fix`;
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log("THE ERR", err);
        res.json(err)
        connection.release();
        
      }
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
        } else {
          console.log(result)
          res.json(result);
        }
      });
      connection.release();
    });
  });

router.post("/saveITC", (req, res) => {
    console.log(req.body);
    // res.json({awesome: "It Works!!!"})

    runReport(req.body.pdfData)

  
    let mysql1 = `insert into instructionToCommence (itcRefNumber, development, subsection, unit, floorLevel, supplier, netVal, startDate, taskType, issuer, notes ) values (
      '${req.body.itcRefNumber}', ${req.body.development}, ${req.body.subsection}, ${req.body.unit}, '${req.body.floorLevel}', ${req.body.supplier}, ${req.body.netVal.split("R").join("").split(" ").join("")}, '${req.body.startDate}', ${req.body.taskType}, '${req.body.issuer}', '${req.body.notes}'
    )`;
    let mysql2 = ""
    req.body.mostData.forEach((el) => {
      mysql2 = `${mysql2} Update tasks set itcDone = true where supplier = ${req.body.supplier} and unitNumber = ${req.body.unit} and taskType = ${req.body.taskType} and fix = '${el.fix}';`
    })
    
    let mysql = `${mysql1};${mysql2}`
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

router.post("/deleteITC", (req, res) => {
    console.log(req.body);


    let mysql1 = `delete from  instructionToCommence where id = ${req.body.id}`;
    let mysql2 = `Update tasks set itcDone = false where supplier = ${req.body.supplier} and unitNumber = ${req.body.unitNumber} and taskType = ${req.body.taskType}`
    let mysql = `${mysql1};${mysql2}`
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

router.post("/getAllItc", (req, res) => {
    console.log(req.body);
    let mysql = `select i.id, i.itcRefNumber, i.development, i.subsection,ss.subsectionName, i.unit,u.unitName, i.supplier, s.supplierName, s.emailAddress, i.netVal, i.startDate, i.taskType, t.taskName, i.issuer, i.notes, i.sentToSupplier 
    from instructionToCommence i, subsection ss, units u, suppliers s, taskTypes t
    where ss.id = i.subsection and u.id = i.unit and s.id = i.supplier and i.development =  ${req.body.id} and t.id = i.taskType order by id desc`;
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


module.exports = router;
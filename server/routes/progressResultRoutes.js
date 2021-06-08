const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const moment = require("moment");
const tz = require("moment-timezone");
const { checktoken, jwtSignUser } = require("./checkToken");

// FOR PAYMENTS DUE
// select s.supplierName,p.createdAt as certificateDate, p.certificateNumber,p.invoiceNumber as invoiceNumber, round(sum(p.afterRetention),2) as due,  round(sum(p.amountPaid),2) as paid from paymentcertificatesDetails p, suppliers s
// where p.development = 1
// and  s.id = 10
// and p.amountPaid = 0
// and p.invoiceNumber is not null
// group by s.supplierName,p.createdAt, p.certificateNumber,p.invoiceNumber

router.get("/progressResults/:id", checktoken, (req, res) => {
  let mysql1 = `select f.id, f.taskType, f.taskName, f.unitNumber, f.unitName, f.subsectionName, f.fix, f.supplier, f.vatVendor, f.startDate, f.endDate,
  sum(round(t.price,2)) as totalBudget, round(sum(t.price * coalesce(p.progress,0)/100),2) as totalUsed,  round(sum(t.price) - sum((t.price * coalesce(p.progress,0) / 100)),2) as Remaining
 from tasks t, fixes f
  left join progress p
   on p.task = f.taskType
 where t.parentId = f.id and f.development = ${req.params.id}
 group by f.id, f.taskType, f.taskName, f.unitNumber, f.unitName, f.subsectionName, f.fix, f.supplier, f.vatVendor, f.startDate, f.endDate
  order by f.subsectionName, f.unitName, f.taskName, f.fix`;
  let mysql2 = `select p.task, tt.taskName, p.unitNumber,  u.unitName,t.fix,  pc.certificateNumber,
  round(coalesce(sum(pc.toDate),0),2) as PCToDate, round(coalesce(sum(pc.afterRetention),0),2) as PCIssued, round(coalesce(sum(pc.amountPaid),0),2) as PCPaid, round(coalesce(sum(pc.retained),0),2) as Retained
  from tasks t,taskTypes tt, units u, progress p
  left join paymentCertificatesDetails pc
  on p.id = pc.progressId
  where t.id = p.task and tt.id = t.taskType and p.unitNumber = u.id and pc.development = ${req.params.id} and pc.isRetention = 0
  group by  p.task, tt.taskName, p.unitNumber,  u.unitName,t.fix,  pc.certificateNumber
  `;
  let mysql3 = `select unitName, sum(amountPaid) as retentionPaid from paymentCertificatesDetails where isRetention = true and development = ${req.params.id}
  group by unitName`
  let mysql4 = `select distinct p.development, p.supplier,s.supplierName, p.unitName,  p.depositRecoveredThisStatement as recovered from  suppliers s,paymentCertificates p
  where p.depositRecoveredThisStatement > 0 and p.supplier = s.id and p.development = ${req.params.id}
`
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4}`;
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
        console.log("RRRRR",result[0])
        result[0].forEach((el2) => {
          let fix = el2.fix;
          let unitNumber = el2.unitNumber;
          let taskType = el2.taskType;
          let totalBudget = el2.totalBudget;
          let totalUsed = el2.totalUsed;
          result[1].forEach((el) => {
            if (
              el.fix == fix &&
              el.unitNumber == unitNumber &&
              el.taskType == taskType
            ) {
              el.totalBudget = totalBudget;
              el.totalUsed = totalUsed;
            }
          });
        });
// ********************
    let now = new Date();
          result[0].forEach(el => {
            if (!el.vatVendor) {
              el.PCIssued = el.PCIssued / 1.15;
              el.PCPaid = el.PCPaid / 1.15;
              el.Remaining = parseFloat(el.Remaining) / 1.15;
              el.Retained = el.Retained / 1.15;
              el.budgetLessPaid = parseFloat(el.budgetLessPaid) / 1.15;
              el.due = parseFloat(el.due) / 1.15;
              el.totalBudget = el.totalBudget / 1.15;
              el.totalUsed = el.totalUsed / 1.15;
            }
            if (
              moment(now) > moment(el.endDate) &&
              el.totalBudget - (el.totalBudget * (el.progress, 0)) / 100 > 0
            ) {
              el.schedule = "Behind";
            } else {
              el.schedule = "";
            }
            el.PCIssuedArray = result[1].filter(el2 => {
              return (
                el2.fix === el.fix &&
                el2.unitName === el.unitName &&
                el2.taskName === el.taskName
              );
            });

            el.PCIssued = el.PCIssuedArray.reduce((acc, pv) => {
              return acc + pv.PCIssued;
            }, 0);
            el.Retained = el.PCIssuedArray.reduce((acc, pv) => {
              return acc + pv.Retained;
            }, 0);
            el.PCPaid = el.PCIssuedArray.reduce((acc, pv) => {
              return acc + pv.PCPaid;
            }, 0);
            let startDate = new Date(el.startDate).toISOString();
            el.startDate = moment(startDate).format("YY-MM-DD");
            let endDate = new Date(el.endDate).toISOString();
            el.endDate = moment(endDate).format("YY-MM-DD");
            el.totalBudget = parseFloat(el.totalBudget.toFixed(2));
            el.totalUsed = parseFloat(el.totalUsed.toFixed(2));
            el.Remaining = el.Remaining.toFixed(2);
            el.percentRemaining =
              ((el.totalUsed / el.totalBudget) * 100).toFixed(0) + "%";
            el.due = (el.totalUsed - el.PCIssued - el.Retained).toFixed(2);
            el.budgetLessPaid = (el.totalBudget - el.PCPaid).toFixed(2);

            el.RetainedStr = convertToString(el.Retained);
            el.budgetLessPaidStr = convertToString(el.budgetLessPaid);
            el.dueStr = convertToString(el.due);
            el.PCIssuedStr = convertToString(el.PCIssued);
            el.PCPaidStr = convertToString(el.PCPaid);
            el.totalUsedStr = convertToString(el.totalUsed);
            el.totalBudgetStr = convertToString(el.totalBudget);
          });
// ********************
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
if (result[3].length) {
  for (let i = 0; i < result[3].length; i++) {
    if (result[3].length === 1) {
      result[3][i].fixNumber = 1;
    } else {
      result[3][0].fixNumber = 1;
      if (i > 0) {
        if (
          result[3][i - 1].unitName ===
            result[3][i].unitName &&
          result[3][i - 1].supplier ===
            result[3][i].supplier
        ) {
          result[3][i].fixNumber =
            result[3][i - 1].fixNumber + 1;
        } else {
          result[3][i].fixNumber = 1;
        }
      }
    }
    result[3][i].fix = result[3][
      i
    ].fixNumber.toString();
    result[3][i].fix = convertNumber(
      result[3][i].fix
    );
  }
}
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
result[3].forEach((el) => {
  result[0].forEach((el2) => {
    if (
      el.unitName === el2.unitName &&
      el.supplier === el2.supplier &&
      el.fix === el2.fix
    ) {
      // console.log("This works")
      el2.PCPaid = el2.PCPaid + el.recovered;
      el2.PCPaidStr = convertToString(el2.PCPaid);
      el2.budgetLessPaid = el2.budgetLessPaid - el2.PCPaid;
      el2.budgetLessPaidStr = convertToString(
        el2.budgetLessPaid
      );
      el2.PCIssued = el2.PCIssued - el2.PCPaid;
      el2.PCIssuedStr = convertToString(el2.PCIssued);
    }
  });
});
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
result[0].forEach((el) => {
  if (el.unitName.substring(1, 2) === ".") {
    result[0].push(result[0].shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
  }
});
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
if (result[2].length) {
  result[2].forEach((el) => {
    let unitName = el.unitName;
    let filtered = result[0].filter((el2) => {
      return el2.unitName === unitName;
    });
    let sumTotalBudget = filtered.reduce((acc, pv) => {
      return acc + pv.totalBudget;
    }, 0);
    result[0].forEach((el2) => {
      if (el2.unitName === unitName) {
        el2.paidRetention =
          (el.retentionPaid / sumTotalBudget) * el2.totalBudget;
        el2.PCPaid = el2.PCPaid + el2.paidRetention;
        el2.PCPaidStr = convertToString(el2.PCPaid);
        el2.budgetLessPaid = el2.budgetLessPaid - el2.paidRetention;
        el2.budgetLessPaidStr = convertToString(
          el2.budgetLessPaid
        );
        el2.PCIssued = el2.PCIssued + el2.paidRetention;
        el2.PCIssuedStr = convertToString(el2.PCIssued);
        el2.Retained = el2.Retained - el2.paidRetention;
        el2.RetainedStr = convertToString(el2.Retained);
      }
    });
  });
}
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



        result.forEach((el) => {
          el.startDate = moment(el.startDate)
            .tz("Etc/UTC")
            .format("YYYY-MM-DD HH:mm:ss")
            .toString();
          el.endDate = moment(el.endDate)
            .tz("Etc/UTC")
            .format("YYYY-MM-DD HH:mm:ss")
            .toString();
        });
        res.json(result[0]);
      }
    });
    connection.release();
  });
});

const convertNumber = function (number) {
  let numStr = number;
  switch (numStr.substring(numStr.length - 1, 1)) {
    // switch (numStr) {
    case "1":
      numStr = `${numStr}st`;
      break;
    case "2":
      numStr = `${numStr}nd`;
      break;
    case "3":
      numStr = `${numStr}rd`;
      break;
    case "":
      numStr = "error";
      break;
    default:
      numStr = `${numStr}th`;
  }
  return numStr;
};

const convertToString = function (factor) {
  //CONVERTS NUMBERS TO STRING WTH "R"
  if (typeof factor === "string" || factor instanceof String) {
    factor = parseFloat(factor);
  }
  let str = factor.toFixed(2).toString().split("").reverse();
  if (str.length > 9) {
    str.splice(9, 0, " ");
  }
  if (str.length > 6) {
    str.splice(6, 0, " ");
  }
  str.reverse().unshift("R");
  str = str.join("");
  return str;
};

router.get("/progressGantt/:id", checktoken, (req, res) => {
  let mysql = `select   t.taskType as taskType, tt.taskName, u.id as unitId, u.unitName, s.subsectionName,  t.dependencies as dependencies, t.fix, t.startDate, t.endDate, 
  sum(t.price) as totalBudget, sum((t.price * coalesce(p.progress,0) / 100)) as totalUsed, 
  sum(t.price) - sum((t.price * coalesce(p.progress,0) / 100)) as Remaining, now() as today, 
  if(now() > t.endDate and sum(t.price) - sum((t.price * coalesce(p.progress,0) / 100)) > 0, "Behind", "") as schedule, 
  round(sum((t.price * coalesce(p.progress,0) / 100)) / sum(t.price) * 100,0) as progressMade
   from  units u, taskTypes tt, subsection s,  tasks t
  left join progress p
  on p.task = t.id 
  where u.id = t.unitNumber and tt.id = t.taskType and t.development = ${req.params.id} and s.id = u.subsection
  group by  s.id, s.subsectionName, t.taskType, tt.taskName, u.id, u.unitName, t.fix,t.startDate, t.endDate,t.dependencies 
  order by tt.taskName, s.subsectionName, u.unitName, t.fix`;
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
        result.forEach((el) => {
          el.startDate = moment(el.startDate)
            // .tz("Africa/Johannesburg")
            .tz("Etc/UTC")
            .format("YYYY-MM-DD HH:mm:ss")
            .toString();
          el.endDate = moment(el.endDate)
            // .tz("Africa/Johannesburg")
            .tz("Etc/UTC")
            .format("YYYY-MM-DD HH:mm:ss")
            .toString();
          el.today = moment(el.today)
            // .tz("Africa/Johannesburg")
            .tz("Etc/UTC")
            .format("YYYY-MM-DD HH:mm:ss")
            .toString();
        });

        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/progressDependency", (req, res) => {
  let data = req.body;
  let mysql;
  if (data.dependencies.length) {
    mysql = `update tasks set dependencies = '["${data.dependencies}"]' where taskType = ${data.taskType} and unitNumber = ${data.unitNumber} and fix = '${data.fix}'`;
  } else {
    mysql = `update tasks set dependencies = '[]' where taskType = ${data.taskType} and unitNumber = ${data.unitNumber} and fix = '${data.fix}'`;
  }
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

router.post("/changeProgress", (req, res) => {
  let mysql = `update progress set progress = ${req.body.progress} where task = ${req.body.id}`;
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

router.post("/processDateChanges", (req, res) => {
  let mysql;
  mysql = `update tasks set startDate = '${req.body[0].start}', endDate = '${req.body[0].end}' where taskType = ${req.body[0].taskType} and unitNumber = ${req.body[0].unitNumber} and fix = '${req.body[0].fix}'`;
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

router.post("/updateTasksFromGantt", (req, res) => {
  // console.log(req.body)
  // res.json({awesome: "It works!!"})
  let mysql = "";
  req.body.data.forEach((el) => {
    if (el.dependencies !== null) {
    mysql = `${mysql}update tasks set startDate = '${el.start_date}', endDate = '${el.endDate}', dependencies = '["${el.dependencies}"]'  where taskType = ${el.taskType} and unitNumber = ${el.unitNumber} and fix = '${el.fix}';`
    } else {
    mysql = `${mysql}update tasks set startDate = '${el.start_date}', endDate = '${el.endDate}', dependencies = null where taskType = ${el.taskType} and unitNumber = ${el.unitNumber} and fix = '${el.fix}';`

    }
  })
  console.log(chalk.red(mysql))
  // let mysql;
  // mysql = `update tasks set startDate = '${req.body[0].start}', endDate = '${req.body[0].end}' where taskType = ${req.body[0].taskType} and unitNumber = ${req.body[0].unitNumber} and fix = '${req.body[0].fix}'`;
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
        console.log(result)
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/progressResultTasks", (req, res) => {
  let mysql;
  mysql = `select t.id, t.development, t.taskType, tt.taskName, u.unitName,  t.unitNumber, t.fix, t.taskDescription, round(t.price, 2) as price
  ,coalesce(p.progress,0) as progress, round(t.price * coalesce(p.progress,0)/100,2) as remaining
  from  units u, taskTypes tt, tasks t
  left join progress p
  on  t.id = p.task 
  where u.id = t.unitNumber and tt.id = t.taskType and t.development = ${req.body.development} and t.fix = '${req.body.fix}' and u.unitName = '${req.body.unitName}' and tt.taskName = '${req.body.taskName}'
   `;
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
        result.forEach((el) => {
          el.price = el.price.toFixed(2);
          el.remaining = el.remaining.toFixed(2);
        });
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/paymentCertificateHistory", (req, res) => {
  let mysql;
  mysql = `select development, supplier, taskName, unitName, certificateNumber,coalesce(invoiceNumber,"Invoice Not Received") as invoiceNumber , round(sum(toDate),2) as netBeforeRetention, round(sum(retained),2) as retention, round(sum(afterRetention),2) as netAfterRetention, round(sum(amountPaid),2) as amountPaid
  from paymentCertificatesDetails
  where development = ${req.body.development} and fix = '${req.body.fix}' and unitName = '${req.body.unitName}' and taskName = '${req.body.taskName}'
  group by development, supplier, taskName, unitName, certificateNumber,invoiceNumber
   `;
  mysql2 = `select t.id, t.development, t.taskType, tt.taskName, u.unitName,  t.unitNumber, t.fix, t.taskDescription, round(t.price, 2) as price
  ,coalesce(p.progress,0) as progress, round(t.price * coalesce(p.progress,0)/100,2) as remaining
  from  units u, taskTypes tt, tasks t
  left join progress p
  on  t.id = p.task 
  where u.id = t.unitNumber and tt.id = t.taskType and t.development = ${req.body.development} and t.fix = '${req.body.fix}' and u.unitName = '${req.body.unitName}' and tt.taskName = '${req.body.taskName}'
   `;
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
        result.forEach((el) => {
          if (el.amountPaid === null) {
            el.amountPaid = 0;
          }
          el.amountPaid = el.amountPaid.toFixed(2);
        });
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/paymentsdue", (req, res) => {
  let mysql1 = `select p.id, p.supplier,s.supplierName,s.contactID,p.certificateNumber, p.unitName, p.contractValue, p.previousValues, p.currentValue, p.grossValue, p.recoveries, p.penalties, p.damages, p.retained, p.netCurrentCertificateValue, p.invoiceNumber, p.certificateDate, p.payStatus, p.invNumber, p.netCurrentCertificateValue - coalesce(p.amtPaid, 0) as owing, coalesce(p.amtPaid,0) as paid, p.approvedFinance, p.approvedManagement, p.declinedManagement, p.sentToSupplier 
  from paymentCertificates p, suppliers s where development = ${req.body.id} and (p.netCurrentCertificateValue -  coalesce(p.amtPaid,0) > 0) and s.id = p.supplier
  `;
  let mysql2 = `select  p.PONumber,   p.supplier,s.supplierName, s.contactID, p.invoiceNumber, p.xeroStatus, sum(p.totalCost) as totalCost, sum(p.vat) as vat, sum(p.nettCost) as nettCost 
  from purchaseOrders p, suppliers s
  where p.development = ${req.body.id} and p.xeroStatus = 'CAPTURED' and s.id = p.supplier
  group by p.PONumber, p.supplier,s.supplierName, s.contactID, p.invoiceNumber, p.xeroStatus`
  let mysql = `${mysql1};${mysql2}`
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
        result.forEach((el) => {
          el.certificateDate = moment(el.certificateDate).format("YYYY-MM-DD");
        });

        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/paymentsdueNew", (req, res) => {
  let mysql = `select p.PONumber as docNo, 'PO' as docType, p.supplier,s.supplierName,s.terms, s.contactID, p.deliveryDate as docDate, p.invoiceNumber as invoiceNumber,p.invoiceDate as invoiceDate, p.xeroStatus,p.approvedFinance,p.approvedManagement, sum(p.nettCost) as due from purchaseOrders p, suppliers s
  where p.xerostatus = 'CAPTURED' and p.development = ${req.body.id} and s.id = p.supplier
  group by p.PONumber, p.supplier, p.deliveryDate, p.invoiceNumber,p.invoiceDate, p.xeroStatus,p.approvedFinance,p.approvedManagement
  union
  select p.certificateNumber as docNo,'PC' as docType, p.supplier, s.supplierName,s.terms, s.contactID, p.certificateDate as docDate, p.invNumber as invoiceNumber, p.invDate as invoiceDate, p.payStatus as xeroStatus,p.approvedFinance,p.approvedManagement, p.netCurrentCertificateValue as due from paymentCertificates p, suppliers s
  where s.id = p.supplier and p.development = ${req.body.id} and p.payStatus = 'CAPTURED'
  `;
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
        // result.forEach((el) => {
        //   el.certificateDate = moment(el.certificateDate).format("YYYY-MM-DD");
        // });
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/PmtApprovals", (req, res) => {
  let mysql = `select * from paymentCertificates where certificateNumber = '${req.body.number}'
  `;
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
        result.forEach((el) => {
          el.certificateDate = moment(el.certificateDate).format("YYYY-MM-DD");
        });
        res.json(result);
      }
    });
    connection.release();
  });
});


router.post("/ApprovePaymentsAll", (req, res) => {
console.log(req.body)
  let mysql = ``;
  req.body.forEach((el) => {
    if (el.docType === 'PC') {
    mysql =
        mysql +
        `update paymentCertificates set approvedFinance = ${el.approvedFinance}, approvedManagement = ${el.approvedManagement} where invoiceNumber = '${el.invoiceNumber}';`;
    } else {
      mysql =
        mysql +
        `update purchaseOrders set approvedFinance = ${el.approvedFinance}, approvedManagement = ${el.approvedManagement} where invoiceNumber = '${el.invoiceNumber}';`;
    }
  });

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

module.exports = router;

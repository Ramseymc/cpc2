const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
const moment = require("moment");
var fs = require("fs");
const { response } = require("express");
const runReport = require("./reportsPDF");

router.get("/suppliers", (req, res) => {
  let mysql = `select * from suppliers order by supplierName`;
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

router.post("/supplierHistory", (req, res) => {
  let mysql = `select taskName, unitName, certificateNumber,createdAt, progress, coalesce(invoiceNumber, 'null') as invoiceNumber, isRetention,  sum(price) as price, sum(toDate) as valuation, sum(retained) as retention, sum(afterRetention) as nett, coalesce(sum(amountPaid),0) as paid   
  from paymentCertificatesDetails
  where supplier = ${req.body.supplier} and development = ${req.body.development}
  group by taskName, unitName, certificateNumber,createdAt, progress, invoiceNumber, isRetention`;
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

router.post("/depositHistory", (req, res) => {
  console.log(req.body);
  let mysql = `select * from depositsMade
  where supplier = ${req.body.supplier} and development = ${req.body.development}`;
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

router.post("/addDeposit", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "it Works!!!!"})
  let mysql = `Insert into depositsMade (supplier, development, depositPaid, depositRemaining) values (${
    req.body.supplier
  }, ${req.body.development}, ${req.body.deposit.toFixed(
    2
  )}, ${req.body.deposit.toFixed(2)})`;
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
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/certificates", (req, res) => {
  let mysql1 = `select * from paymentCertificates where supplier = ${req.body.id}`;
  let mysql2 = `select distinct t.id, p.id as progressId, t.supplier,s.vatVendor,t.taskDescription, t.fix, tt.taskName, u.unitName, round(t.price, 2) as price,s.retention, p.progress, 
  round(((t.price * p.progress / 100) - (t.price * p.lastCertificateIssuedAt / 100)),2) as toDate, p.lastCertificateIssuedAt, p.certificateIssued, p.lastCertificateNumber 
  from tasks t, progress p, units u, taskTypes tt, suppliers s
    where t.id = p.task and t.supplier = ${req.body.id} and t.development = ${req.body.development} and t.unitNumber = u.id and t.taskType = tt.id and s.id = t.supplier 
    order by p.progress desc, t.id`;
  let mysql3 = `select round(sum(price),2) as contractPrice from tasks where supplier = ${req.body.id}`;
  let mysql4 = `select p.id as progressID, p.development, p.supplier, p.taskType,'Retention' as fix, t.taskName, u.unitName, p.unitNumber, p.progress, round(p.totalRetention,2) as price, round(p.totalRetention * (p.progress / 100) - (p.totalRetention * ((p.lastCertificateIssuedAt)/100)),2) as toDate, p.progressDate, p.certificateIssued, p.lastCertificateIssuedAt, p.lastCertificateNumber, 
  p.paymentDetails, p.updatedBy, p.lastUpdate from progressRetention p, taskTypes t, units u where p.supplier = ${req.body.id} and p.development = ${req.body.development} and t.id = p.taskType and p.unitNumber = u.id`;

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
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/updatePaymentCertificateWithInvoiceNumber", (req, res) => {
  let mysql1 = `update paymentCertificates set invoiceNumber = '${req.body.invoiceNumber}', payStatus = 'AWAITING INVOICE', invDate = '${req.body.invoiceDate}' where id  = '${req.body.id}'`;
  let mysql2 = `Update paymentCertificatesDetails set invoiceNumber = '${req.body.invoiceNumber}', invoiceDate = '${req.body.invoiceDate}' where certificateNumber = '${req.body.certificateNumber}'`;
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

router.post("/updateStatusPaid", (req, res) => {
  let amountPaid = req.body.amountPaid;
  let payStatus = req.body.payStatus;
  let invoiceNumber = req.body.invoiceNumber;

  let mysql = `select * from paymentCertificates where invNumber = '${invoiceNumber}'`;

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
        let totalAmount = result.reduce((acc, pv) => {
          return acc + pv.netCurrentCertificateValue;
        }, 0);
        let mysqla = `update paymentCertificates set payStatus = '${payStatus}', amtPaid = ${
          totalAmount / amountPaid
        } * netCurrentCertificateValue where invNumber = '${invoiceNumber}' `;
        let mysqlb = `update paymentCertificatesDetails set amountPaid = ${
          totalAmount / amountPaid
        } * afterRetention where invoiceNumber = '${invoiceNumber}' `;
        let finalSQL = `${mysqla};${mysqlb}`;
        connection.query(finalSQL, function (error, result) {
          if (error) {
            console.log("THE ERROR", error);
          } else {
            res.json(result);
          }
        });
      }
    });
    connection.release();
  });
});

router.post("/updateStatusNotYetPaid", (req, res) => {
  let mysql = `update paymentCertificates set payStatus = '${req.body.payStatus}', invNumber = '${req.body.invoiceNumber}' where invoiceNumber  = '${req.body.invoiceNumber}'`;

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

router.post("/processCertificate", (req, res) => {
  let certificateDetailsToPost = req.body.certificateDetailsToPost;

  let totalValue = certificateDetailsToPost.reduce((acc, pv) => {
    return acc + parseFloat(pv.toDate);
  }, 0);

  let sumofAfterRetention = certificateDetailsToPost.reduce((acc, pv) => {
    return acc + parseFloat(pv.afterRetention);
  }, 0);
  let unitName = certificateDetailsToPost[0].unitName;

  let certificateNumber = req.body.certificateNumber;

  let recoveries = 0;
  let penalties = 0;
  let damages = 0;

  let depositPaid = 0;
  let depositId = 0;
  if (req.body.depositDetails.length) {
    depositPaid = req.body.depositDetails[0].depositPaid;
    depositId = req.body.depositDetails[0].id;
  }

  let depositRecovered = 0;
  let depositRemaining = 0;
  let depositRecoveredThisStatement = 0;

  let mysql4;
  if (req.body.depositDetails.length) {
    if (!req.body.previousCertificates.length) {
      if (
        totalValue -
          recoveries -
          penalties -
          damages -
          (totalValue - sumofAfterRetention) >=
        depositPaid
      ) {
        depositRecovered = depositPaid;
        depositRecoveredThisStatement = depositRecovered;
      } else {
        depositRecovered =
          totalValue -
          recoveries -
          penalties -
          damages -
          (totalValue - sumofAfterRetention);
        depositRecoveredThisStatement = depositRecovered;
      }
      depositRemaining = depositPaid - depositRecovered;
      mysql4 = `update depositsMade set certificateNumber = '${certificateNumber}', depositRecovered = ${depositRecovered}, depositRemaining = ${depositRemaining} where id = ${depositId}`;
    } else {
      if (req.body.depositDetails[0].depositRemaining > 0) {
        if (
          totalValue -
            recoveries -
            penalties -
            damages -
            (totalValue - sumofAfterRetention) >=
          req.body.depositDetails[0].depositRemaining
        ) {
          depositRecovered =
            req.body.depositDetails[0].depositRemaining +
            req.body.depositDetails[0].depositRecovered;
          depositRecoveredThisStatement =
            req.body.depositDetails[0].depositRemaining;
        } else {
          depositRecovered =
            totalValue -
            recoveries -
            penalties -
            damages -
            (totalValue - sumofAfterRetention) +
            req.body.depositDetails[0].depositRecovered;
          depositRecoveredThisStatement =
            totalValue -
            recoveries -
            penalties -
            damages -
            (totalValue - sumofAfterRetention);
        }
        depositRemaining = depositPaid - depositRecovered;
        mysql4 = `update depositsMade set certificateNumber = '${certificateNumber}', depositRecovered = ${depositRecovered}, depositRemaining = ${depositRemaining} where id = ${depositId}`;
      } else {
        mysql4 = `update depositsMade set certificateNumber = '${
          req.body.previousCertificates[
            req.body.previousCertificates.length - 1
          ].certificateNumber
        }' where id = ${depositId}`;
      }
    }
  }

  let sqlStr = ``;

  if (req.body.fix !== "Retention") {
    certificateDetailsToPost.forEach((el) => {
      sqlStr =
        sqlStr +
        `insert into paymentCertificatesDetails (development, progressId, supplier, taskDescription, taskName, unitName, price, progress,toDate, retained, afterRetention, certificateNumber,fix, totalValue  ) values ( 
      ${req.body.developmentId}, ${el.progressId}, ${el.supplier}, '${
          el.taskDescription
        }', '${el.taskName}', '${el.unitName}',
       ${el.price}, ${el.progress},${el.toDate},${
          el.toDate - parseFloat(el.afterRetention)
        }, ${el.afterRetention} , '${certificateNumber}', '${
          el.fix
        }', ${totalValue} );`;
    });
  } else {
    certificateDetailsToPost.forEach((el) => {
      sqlStr =
        sqlStr +
        `insert into paymentCertificatesDetails (development, progressId, supplier, isRetention, taskName, unitName, price, progress,toDate, retained, afterRetention, certificateNumber,fix, totalValue  ) values ( 
      ${req.body.developmentId}, ${el.progressID}, ${el.supplier}, true, '${el.taskName}', '${el.unitName}',
       ${el.price}, ${el.progress},${el.toDate},0, ${el.toDate} , '${certificateNumber}', '${el.fix}', ${totalValue} );`;
    });
  }

  let mysql3 = sqlStr;
  let mysql2 = ``;
  let previousValues = req.body.previousCertificates.reduce((prev, el) => {
    return prev + el.netCurrentCertificateValue;
  }, 0);
  certificateDetailsToPost.forEach((el) => {
    let paymentDetail = {
      certificateNumber: certificateNumber,
      amountPaid: 0,
    };
    paymentDetail = JSON.stringify(paymentDetail);
    let sql;
    if (req.body.fix !== "Retention") {
      sql = `Update progress set progress= ${el.progress}, certificateIssued = true, lastCertificateIssuedAt = progress, lastCertificateNumber = '${certificateNumber}' where id = ${el.progressId};`;
    } else {
      sql = `Update progressRetention set progress= ${el.progress}, certificateIssued = true, lastCertificateIssuedAt = progress, lastCertificateNumber = '${certificateNumber}' where id = ${el.progressID};`;
    }
    mysql2 = mysql2 + sql;
  });

  let now = new Date().toISOString().substring(0, 10);
  let mysql1;
  if (req.body.fix !== "Retention") {
    mysql1 = `insert into paymentCertificates (development, supplier, certificateNumber, ContractValue, 
    previousValues, currentValue, grossValue, recoveries, penalties, damages, retained, netCurrentCertificateValue, certificateDate, unitName, payStatus, depositPaid, depositRecovered, depositRemaining, depositRecoveredThisStatement) values (
    ${req.body.developmentId},${req.body.supplier}, '${certificateNumber}', ${
      req.body.contractPrice
    }, ${previousValues}, ${
      previousValues + totalValue
    }, ${totalValue}, ${recoveries}, ${penalties}, ${damages},${
      totalValue - sumofAfterRetention
    } , ${
      totalValue -
      recoveries -
      penalties -
      damages -
      (totalValue - sumofAfterRetention)
    }, '${now}', '${unitName}','AWAITING INVOICE', ${depositPaid}, ${depositRecovered}, ${depositRemaining}, ${depositRecoveredThisStatement})
    `;
  } else {
    mysql1 = `insert into paymentCertificates (development, supplier, certificateNumber, ContractValue, 
    previousValues, currentValue, grossValue, recoveries, penalties, damages, retained, netCurrentCertificateValue, certificateDate, unitName, payStatus, isRetention, depositPaid, depositRecovered, depositRemaining,depositRecoveredThisStatement ) values (
    ${req.body.developmentId},${req.body.supplier}, '${certificateNumber}', ${
      req.body.contractPrice
    }, ${previousValues}, ${
      previousValues + totalValue
    }, ${totalValue}, ${recoveries}, ${penalties}, ${damages}, 0 , ${totalValue}, '${now}', '${unitName}','AWAITING INVOICE', true,  ${depositPaid}, ${depositRecovered}, ${depositRemaining}, ${depositRecoveredThisStatement})
    `;
  }
  // console.log(mysql1)

  // let mysql4 = `update depositsMade set certificateNumber = '${certificateNumber}', depositRecovered = ${depositRecovered}, depositRemaining = ${depositRemaining} where id = ${depositId}`;
  let mysql;
  if (req.body.depositDetails.length) {
    mysql = `${mysql1};${mysql2}${mysql3}${mysql4}`;
  } else {
    mysql = `${mysql1};${mysql2}${mysql3}`;
  }
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
        let mysqlCert = `select p.development, p.supplier,p.unitName, p.certificateNumber, p.ContractValue, p.previousValues, p.currentValue, p.grossValue, p.recoveries, p.penalties, 
        p.damages, p.retained,  p.netCurrentCertificateValue, p.certificateDate, s.vat_number, s.supplierName, s.first_name, s.last_name, s.emailAddress, s.default_number, s.mobile_number, s.street_address, s.postal_address,s.vatVendor,
        p.depositPaid, p.depositRecovered, p.depositRemaining, p.depositRecoveredThisStatement
         from paymentCertificates p 
        left join
        suppliers s
        on s.id = p.supplier
        where p.supplier = ${req.body.supplier} and p.certificateNumber = '${certificateNumber}'
        `;
        connection.query(mysqlCert, function (error, result) {
          if (error) {
            console.log("THE ERROR", error);
          } else {
            let thisData = result;
            certificateDetailsToPost.sort((a, b) =>
              a.lastCertificateNumber > b.lastCertificateNumber ? 1 : -1
            );
            certificateDetailsToPost.sort((a, b) => (a.fix > b.fix ? 1 : -1));
            certificateDetailsToPost.forEach((el) => {
              el.price = el.price.toFixed(2);
              el.toDate = el.toDate.toFixed(2);
            });
            console.log(thisData)
            thisData.forEach((el) => {
              el.certificateDate = el.certificateDate
                .toISOString()
                .substring(0, 10);
                let vatRate = 1
                if (!el.vatVendor) {
                  vatRate = 1
                } else {
                  vatRate = 1.15
                }
              
              el.currentValue = (el.currentValue / vatRate).toFixed(2);
              el.previousValues = (el.previousValues / vatRate).toFixed(2);
              el.grossValue = (el.grossValue / vatRate).toFixed(2);
              el.netBeforVat = (el.netCurrentCertificateValue / vatRate).toFixed(
                2
              );

              if (el.vatVendor) {
                el.vat = (el.grossValue * (vatRate - 1)).toFixed(2);
              } else {
                el.vat = 0;
                el.netCurrentCertificateValue = el.netBeforVat
                
              }
              
              el.afterDepositDeducted =
                el.netCurrentCertificateValue -
                el.depositRecoveredThisStatement;
              el.afterDepositDeducted = convertToString(
                el.afterDepositDeducted
              );
              el.depositRecoveredThisStatement = convertToString(
                el.depositRecoveredThisStatement
              );
              el.depositPaid = convertToString(el.depositPaid);
              el.depositRecovered = convertToString(el.depositRecovered);
              el.depositRemaining = convertToString(el.depositRemaining);
              el.retained = (el.retained / vatRate).toFixed(2);
              el.ContractValue = (el.ContractValue / vatRate).toFixed(2);
              el.recoveries = el.recoveries.toFixed(2);
              el.penalties = el.penalties.toFixed(2);
              el.damages = el.damages.toFixed(2);
              el.grossValue = el.currentValue - el.retained - el.previousValues
              el.currentValue = convertToString(el.currentValue);
              el.previousValues = convertToString(el.previousValues);
              el.grossValue = convertToString(el.grossValue);
              el.vat = convertToString(el.vat);
              el.netBeforVat = convertToString(el.netBeforVat);
              el.retained = convertToString(el.retained);
              el.ContractValue = convertToString(el.ContractValue);
              el.recoveries = convertToString(el.recoveries);
              el.penalties = convertToString(el.penalties);
              el.damages = convertToString(el.damages);
              el.netCurrentCertificateValue = convertToString(
                el.netCurrentCertificateValue
              );
              el.street_address = el.street_address.replace(/\n/g, "");
              el.street_address = el.street_address.replace(
                "addressType : POBOXaddressLine1 :",
                ""
              );
              el.street_address = el.street_address.replace(
                "addressLine2 : ",
                " "
              );
              el.street_address = el.street_address.replace(
                "addressLine3 : ",
                " "
              );
              el.street_address = el.street_address.replace(
                "addressLine4 : ",
                " "
              );
              el.street_address = el.street_address.replace("city : ", " ");
              el.street_address = el.street_address.replace("region : ", " ");
              el.street_address = el.street_address.replace(
                "postalCode : ",
                " "
              );
              el.street_address = el.street_address.replace("country : ", " ");
              el.street_address = el.street_address.replace(
                "attentionTo : ",
                " attentionTo :  "
              );
            });

            certificateDetailsToPost.forEach((el) => {
              el.price = convertToString(el.price);
              el.toDate = convertToString(el.toDate);
              el.afterRetention = convertToString(el.afterRetention);
            });

            runReport(thisData, certificateDetailsToPost);
          }
        });
      }
    });
    connection.release();
  });
});

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

module.exports = router;

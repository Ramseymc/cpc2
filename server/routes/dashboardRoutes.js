const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
// const { checktoken, jwtSignUser } = require("./checkToken");
const dayjs = require("dayjs");
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
var Excel = require("exceljs");
var { cols } = require("./columnsXLS");
// import { cols } from "./cols"
const xlsx = require("xlsx");
var fs = require("fs");
const { Console } = require("console");
const { RSA_NO_PADDING } = require("constants");
const multer = require("multer");
const crypto = require("crypto");
var client = require("smartsheet");

router.post("/updateTasksWithPayDateWB", (req, res) => {
  console.log(req.body);
  console.log(req.body.id);
  let mysql = `update tasks as t1,
  (
  select t.id,t.taskType,tt.taskName, t.unitNumber,u.unitName, if(s.vatVendor = 1, round(sum(t.cost),2),round(sum(t.cost/1.15),2))  as cost, 
  if(s.vatVendor = 1, round(sum(t.price),2),round(sum(t.price /1.15),2))  as price, t.supplier, s.supplierName,t.startDate, t.endDate,
  if(s.terms = 1, LAST_DAY(DATE_ADD(t.endDate, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(t.endDate, INTERVAL 14 DAY), 
  if(s.terms = 3, date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),
  if(s.terms = 4, DATE_ADD(date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),INTERVAL 7 DAY), t.endDate)))) as estimatedPayDate
  from tasks t, taskTypes tt, units u, suppliers s, progress p 
  where if(s.terms = 1, LAST_DAY(DATE_ADD(t.endDate, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(t.endDate, INTERVAL 14 DAY), 
  if(s.terms = 3, date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),
  if(s.terms = 4, DATE_ADD(date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),INTERVAL 7 DAY), t.endDate)))) < '2029-09-29' and if(s.terms = 1, LAST_DAY(DATE_ADD(t.endDate, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(t.endDate, INTERVAL 14 DAY), 
  if(s.terms = 3, date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),
  if(s.terms = 4, DATE_ADD(date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),INTERVAL 7 DAY), t.endDate)))) > '2010-08-01' and t.development = ${req.body.id}
  and u.id = t.unitNumber and u.development = ${req.body.id} and tt.id = t.taskType and tt.development = ${req.body.id} and t.supplier = s.id
  group by t.id, t.taskType,tt.taskName, t.unitNumber,u.unitName, t.supplier, s.supplierName,t.startDate, t.endDate, estimatedPayDate) as t2
  set t1.payDate = t2.estimatedPayDate
  where t1.id = t2.id and t1.payDate is null; update purchaseOrders as t1,
  (
  select p.id, p.unitNumber,u.unitName, if(s.vatVendor = 1, round(sum(p.nettCost),2),round(sum(p.nettCost/1.15),2))  as nettCost, 
   p.supplier, s.supplierName,
  if(s.terms = 1, LAST_DAY(DATE_ADD(p.createdAt, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(p.createdAt, INTERVAL 14 DAY), 
  if(s.terms = 3, date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),
  if(s.terms = 4, DATE_ADD(date(p.createdAt + INTERVAL 5 - weekday(p.createdAt) DAY),INTERVAL 7 DAY), p.createdAt)))) as estimatedPayDate
  from purchaseOrders p, units u, suppliers s
  where if(s.terms = 1, LAST_DAY(DATE_ADD(p.createdAt, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(p.createdAt, INTERVAL 14 DAY), 
  if(s.terms = 3, date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),
  if(s.terms = 4, DATE_ADD(date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),INTERVAL 7 DAY), p.createdAt)))) < '2029-09-29' and if(s.terms = 1, LAST_DAY(DATE_ADD(p.createdAt, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(p.createdAt, INTERVAL 14 DAY), 
  if(s.terms = 3, date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),
  if(s.terms = 4, DATE_ADD(date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),INTERVAL 7 DAY), p.createdAt)))) > '2010-08-01' and p.development = ${req.body.id}
  and u.id = p.unitNumber and u.development = 1 and p.supplier = s.id
  group by p.id,  p.unitNumber,u.unitName, p.supplier, s.supplierName, estimatedPayDate) as t2
  set t1.payDate = t2.estimatedPayDate
  where t1.id = t2.id and t1.payDate is null;update paymentCertificatesDetails as t1,
  (
  select p.id,p.unitName, p.totalValue, 
   p.supplier, s.supplierName,
  if(s.terms = 1, LAST_DAY(DATE_ADD(p.createdAt, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(p.createdAt, INTERVAL 14 DAY), 
  if(s.terms = 3, date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),
  if(s.terms = 4, DATE_ADD(date(p.createdAt + INTERVAL 5 - weekday(p.createdAt) DAY),INTERVAL 7 DAY), p.createdAt)))) as estimatedPayDate
  from paymentCertificatesDetails p, suppliers s
  where if(s.terms = 1, LAST_DAY(DATE_ADD(p.createdAt, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(p.createdAt, INTERVAL 14 DAY), 
  if(s.terms = 3, date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),
  if(s.terms = 4, DATE_ADD(date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),INTERVAL 7 DAY), p.createdAt)))) < '2029-09-29' and if(s.terms = 1, LAST_DAY(DATE_ADD(p.createdAt, INTERVAL 1 MONTH)),
  if(s.terms = 2, DATE_ADD(p.createdAt, INTERVAL 14 DAY), 
  if(s.terms = 3, date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),
  if(s.terms = 4, DATE_ADD(date(p.createdAt+ INTERVAL 5 - weekday(p.createdAt) DAY),INTERVAL 7 DAY), p.createdAt)))) > '2010-08-01' and p.development = ${req.body.id}
   and p.supplier = s.id
  group by p.id,  p.unitName, p.supplier, s.supplierName, estimatedPayDate) as t2
  set t1.payDate = t2.estimatedPayDate
  where t1.id = t2.id and t1.payDate is null;`;
  // console.log(mysql);
  // // res.json({awesome: "So Far!!!!"})

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

router.post("/getSubcontractorPayments", (req, res) => {
  console.log(req.body);

  let mysql = `select t.taskType,tt.taskName, t.unitNumber,u.unitName, if(s.vatVendor = 1, round(sum(t.cost),2),round(sum(t.cost/1.15),2))  as cost, 
  if(s.vatVendor = 1, round(sum(t.price),2),round(sum(t.price /1.15),2))  as price, t.supplier, s.supplierName,t.startDate, t.endDate, t.payDate
  from tasks t, taskTypes tt, units u, suppliers s, progress p 
  where t.payDate < '${req.body.dateTo}' and t.payDate > '${req.body.dateFrom}' and t.development = ${req.body.id}
  and u.id = t.unitNumber and u.development = ${req.body.id} and tt.id = t.taskType and tt.development = ${req.body.id} and t.supplier = s.id
  group by t.taskType,tt.taskName, t.unitNumber,u.unitName, t.supplier, s.supplierName,t.startDate, t.endDate, t.payDate `;
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
        console.log(result);
      }
    });
    connection.release();
  });
  // res.json({ posted: "Awsome!!!" });
});

router.post("/editSubcontractorPaymentEndDates", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works"})
  let payDate = null;
  if (req.body.payDate === null) {
    payDate = null;
  } else {
    payDate = `'${req.body.payDate}'`;
  }
  let mysql = `update tasks set payDate = ${payDate}, endDate = '${req.body.endDate}' where taskType = ${req.body.taskType} and supplier = ${req.body.supplier} and unitNumber = ${req.body.unitNumber}`;
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
        console.log(result);
      }
    });
    connection.release();
  });
});

// ##################################################

const qs = require("querystring");
const { sheets } = require("smartsheet/lib/utils/apis");

function authorizeURL(params) {
  const authUrl = "https://app.smartsheet.com/b/authorize";
  return `${authUrl}?${qs.stringify(params)}`;
}

const authorizationUri = authorizeURL({
  response_type: "code",
  client_id: "slpg1r1qxwsn1fgm554",
  // redirect_uri: "http://localhost:3000/callbackWB",
  redirect_uri: "https://www.cape-projectsbe.co.za/callbackWB",
  scope: "READ_SHEETS",
  // scope: 'CREATE_SHEETS WRITE_SHEETS',
  state: "WaynesTest",
});
let unitsAffected = [];

// Initial page redirecting to Smartsheet
router.get("/authSmartsheets/:id", (req, res) => {
  console.log(req.params);
  development = req.params.id;
  console.log(development);
  let mysql = `select s.id, s.unit, u.unitName, s.smartRow, s.smartColumn, s.development, s.beds,s.bath,s.unit_type,s.size,s.base_price,s.contract_price,s.sold,s.isEnclosed,s.bathAdd,s.study,s.parking,
  s.bay_no,s.mood_board,s.extras,s.notes,s.deductions,s.sale_date,s.bond_app_date,s.lodge_date,s.transfer_date , s.actualsale_date
  from salesData s, units u
  where u.id = s.unit and s.development = ${req.params.id}
  order by u.unitName
    `;
  // let mysql = `select distinct u.id, d.id as development, u.unitName, s.subsectionName, d.developmentName
  // from units u, subsection s, developments d
  // where d.id = ${req.params.id} and s.development = ${req.params.id} and u.subsection = s.id and length(u.unitName) < 5 and u.subsection in (
  //     select id from subsection where development = ${req.params.id} and subsectionName != 'Common Area'
  //   )
  //   `;

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
        unitsAffected = result;
        // console.log(unitsAffected);

        res.redirect(authorizationUri);
      }
    });
    connection.release();
  });

  // console.log("Testing", authorizationUri);
  // console.log("response:",res)
});

router.get("/callbackWB", (req, res) => {
  console.log("queryURL", req.url);

  const authCode = req.query.code;

  // console.log(authCode);

  let appSecret = "ujhvmnu9n79b68uit3n";

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
      client_id: "slpg1r1qxwsn1fgm554", // Your App Client ID
      code: `${authCode}`, // Received Authorization Code
      hash: hash,
    },
    contentType: "application/x-www-form-urlencoded",
  };

  smartsheet.tokens
    .getAccessToken(options)
    .then(function (token) {
      console.log(token);
      smartsheet = client.createClient({
        accessToken: token.access_token,
        logLevel: "info",
      });
      var options = {
        queryParameters: {
          include: "attachments",
          includeAll: true,
        },
      };

      smartsheet.sheets
        .listSheets(options)
        .then(function (result) {
          // res.json({soFar: "So Good!!!", auth: req.query.code, result: result})
          // console.log("TESTING",result);
          let resultFilter = result.data.filter((el) => {
            return el.name === "Master Project Programme";
          });
          // console.log("resultFilter",resultFilter)
          // var sheetId = result.data[2].id; // Choose the first sheet
          var sheetId = resultFilter[0].id; // Choose the first sheet

          // Load one sheet
          smartsheet.sheets
            .getSheet({ id: sheetId })
            .then(function (sheetInfo) {
              // let dataToUse = [];
              // sheetInfo.rows.forEach((el) => {
              //   el.cells.forEach((el1) => {
              //   // console.log(el1.displayValue.includes('Registration / Transfer'))
                // console.log(sheetInfo.columns)
                // let rowInfo = []
                // sheetInfo.rows.forEach((el) => {

                //   el.cells.forEach((el2) => {
                //     if  (el2.displayValue !== undefined && el2.displayValue.includes(' - Transfer')
                //     ) {
                //       let insert = {
                //         rowID: el.id,
                //         unitName: el2.displayValue.substr(0,4).trim()
                //       }
                //     rowInfo.push(insert)
                //     }
                //   })

                // })
                // rowInfo.forEach((el) => {
                //   let filtered = unitsAffected.filter((el2) => {
                //     return el2.unitName === el.unitName
                //   })
                //   el.unit = filtered[0].unit
                // })
                // console.log(rowInfo)
                // let mysql222 = ""
                // rowInfo.forEach((el) => {
                //   mysql222 = `${mysql222} Update salesData set smartRow = '${el.rowID}' where unit = ${el.unit};`
                // })
                // console.log(mysql222)

                


              //     if (el1.displayValue !== undefined && el1.displayValue.includes('Registration / Transfer')) {
              //       console.log(el1.displayValue)
              //       let insert = {
              //         rowID: el.id,
              //         rowNumber: el.rowNumber,
              //         rowText: el1.displayValue.substring(0,4).trim(),
              //         columnID: 3634515536045956,
              //       }
              //       dataToUse.push(insert)
              //     }
              //   })
              // })
              // dataToUse.forEach((el) => {
              //   let filteredUnits = unitsAffected.filter((el1) => {
              //     return el1.unitName === el.rowText
              //   })
              //   el.unitID = filteredUnits[0].id
              // })
              // console.log(dataToUse)
              let rowIDS = [];
              unitsAffected.forEach((el) => {
                rowIDS.push(parseInt(el.smartRow));
              });

              // console.log(rowIDS)

              let filteredSheetInfo = sheetInfo.rows.filter((item) => {
                return rowIDS.indexOf(item.id) !== -1;
              });
              let finalSQLArray = [];

              // console.log(filteredSheetInfo)
              // console.log(filteredSheetInfo.length)
              filteredSheetInfo.forEach((el) => {
                let filtered = el.cells.filter((el1) => {
                  return (
                    el1.columnId === parseInt(unitsAffected[0].smartColumn)
                  );
                });
                // console.log(filtered[0])
                let insert = {
                  smartRow: el.id,
                  smartColumn: filtered[0].columnId,
                  transfer_date: dayjs(filtered[0].value).format("YYYY-MM-DD"),
                };
                finalSQLArray.push(insert);
              });
              finalSQLArray.forEach((el) => {
                let filtered = unitsAffected.filter((el1) => {
                  return el.smartRow === parseInt(el1.smartRow);
                });
                el.unit = filtered[0].unit;
                el.unitName = filtered[0].unitName;
              });
              let mysql = "";
              finalSQLArray.forEach((el) => {
                mysql = `${mysql} update salesData set transfer_date = '${
                  el.transfer_date
                }', lodge_date = '${dayjs(el.transfer_date)
                  .subtract(21, "day")
                  .format("YYYY-MM-DD")}', 
                bond_app_date = '${dayjs(el.transfer_date)
                  .subtract(42, "day")
                  .format("YYYY-MM-DD")}', sale_date = '${dayjs(
                  el.transfer_date
                )
                  .subtract(63, "day")
                  .format("YYYY-MM-DD")}' where unit = ${
                  el.unit
                } and development = ${unitsAffected[0].development};
                 update investorDetails set repayment_date = '${
                   el.transfer_date
                 }' where unit = ${el.unit} and development = ${
                  unitsAffected[0].development
                };
                 update investorDetailsPlanning set repayment_date = '${
                   el.transfer_date
                 }' where unit = ${el.unit} and development = ${
                  unitsAffected[0].development
                };
                 `;
              });


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
                    res.json(error);
                  } else {
                    // res.json(result);
                    console.clear();
                    console.log(chalk.blue("Succesful update"));

                    // res.json(result)
                  }
                });
                connection.release();
              });
            })
            .catch(function (error) {
              console.log("wayne", error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    })

    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      // res.json({soFar: "So Good!!!"})
      setTimeout(() => {
        // res.redirect('https://www.cape-projects.co.za/salesData')
        res.redirect(process.env.SMARTSHEET_REDIRECT);
      }, 500);
      // res.redirect('www.google.com')
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

router.post("/insertFinanceConstructionWB", (req, res) => {
  console.log(req.body);
  let invoiceNumber;
  if (req.body.insertData.invoiceNumber === null) {
    invoiceNumber = null;
  } else {
    invoiceNumber = `'${req.body.insertData.invoiceNumber}'`;
  }
  let invoiceDate;
  if (req.body.insertData.invoiceDate === null) {
    invoiceDate = null;
  } else {
    invoiceDate = `'${req.body.insertData.invoiceDate}'`;
  }
  let paymentDate;
  if (req.body.insertData.paymentDate === null) {
    paymentDate = null;
  } else {
    paymentDate = `'${req.body.insertData.paymentDate}'`;
  }

  let mysql = `Insert into financeConstructionInput (actualAmount,
  budgetAmount,
  budgetted,
  development,
  finalised,
  invoiceDate,
  invoiceNumber,
  paid,
  paymentDate,
  supplier,
  task,
  taskType,
  unitNumber,
  vatVendor)
   values (
    ${req.body.insertData.actualAmount},
    ${req.body.insertData.budgetAmount},
    false,
    ${req.body.insertData.development},
    ${req.body.insertData.finalised},
    ${invoiceDate},
    ${invoiceNumber},
    ${req.body.insertData.paid},
    ${paymentDate},
    ${req.body.insertData.supplier},
    0,
    0,
    ${req.body.insertData.unitNumber},
    ${req.body.insertData.vatVendor}

   )`;
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
        console.log(result);
      }
    });
    connection.release();
  });
});

router.post("/updateFinanceConstructionWB", (req, res) => {
  console.log(req.body);
  // res.json({ awesome: "So Far So good!!!" });
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    req.body.updateData.forEach((el) => {
      let invoiceNumber;
      if (el.invoiceNumber === null) {
        invoiceNumber = null;
      } else {
        invoiceNumber = `'${el.invoiceNumber}'`;
      }
      let invoiceDate;
      if (el.invoiceDate === null) {
        invoiceDate = null;
      } else {
        invoiceDate = `'${el.invoiceDate}'`;
      }
      let paymentDate;
      if (el.paymentDate === null) {
        paymentDate = null;
      } else {
        paymentDate = `'${el.paymentDate}'`;
      }
      let mysql = `update financeConstructionInput set development = ${el.development},
  task = ${el.task},
  taskType = ${el.taskType},
  unitNumber = ${el.unitNumber},
  supplier = ${el.supplier},
 
  vatVendor = ${el.vatVendor},
  paymentDate =  ${paymentDate},
  budgetAmount  = ${el.budgetAmount},
  
  actualAmount =  ${el.actualAmount},
  invoiceNumber = ${invoiceNumber},
  invoiceDate =  ${invoiceDate},
 
  finalised = ${el.finalised},
  paid = ${el.paid} where id = ${el.id}
`;
      console.log(chalk.red(mysql));
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
        } else {
          // res.json(result);
          console.log(result);
        }
      });
    });
    res.json({ posted: "Awsome!!!" });

    connection.release();
  });
});

router.post("/getUnitInfo", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "So far so good!!!"})
  let mysql1 = `SELECT investorDetails.id,
  investorDetails.unit,
  investorDetails.investor_code,
  investorDetails.investor,
  investorDetails.la_email_date,
  investorDetails.la_sign_date,
  investorDetails.pledged,
  investorDetails.attorney_inv_amount,
  investorDetails.fica_inv_date,
  investorDetails.amount,
  investorDetails.quinteDate,
  investorDetails.draw,
  investorDetails.interest_rate,
  investorDetails.repayment_date,
  investorDetails.trust_account_interest,
  investorDetails.supplementary_interest,
  investorDetails.opc_comm,
  investorDetails.development,
  investorDetails.drawAdjustment,
  investorDetails.drawn,
  investorDetails.available_date,
  investorDetails.available,
  investorDetails.pledgeUsed,
  investorDetails.pledge_date
FROM investorDetails where unit = ${req.body.unitId} and development = ${req.body.development}
`;
  let mysql2 = `SELECT salesData.id,
  salesData.unit,
  salesData.beds,
  salesData.bath,
  salesData.unit_type,
  salesData.size,
  salesData.base_price,
  salesData.contract_price,
  salesData.sold,
  salesData.isEnclosed,
  salesData.bathAdd,
  salesData.study,
  salesData.parking,
  salesData.bay_no,
  salesData.mood_board,
  salesData.extras,
  salesData.notes,
  salesData.deductions,
  salesData.sale_date,
  salesData.bond_app_date,
  salesData.lodge_date,
  salesData.transfer_date,
  salesData.development,
  salesData.actualsale_date
FROM salesData where unit = ${req.body.unitId} and development = ${req.body.development}`;
  let mysql3 = `SELECT s.id, s.firstname, s.lastname, s.iDNumber, s.email, s.bankName, s.accountNumber, s.accountType, s.block, s.unit,u.unitName, s.mood, s.flooring, s.fileOTP, 
  s.fileId, s.fileBank, s.filePaySlip, s.fileFica, s.salesEmailSent, s.dateCreated, s.signedOff, s.mobile, s.landline, s.floorplan, s.postalAddress, 
  s.residentialAddress, s.salesAgent, s.salesAgentPhone, s.saleType, s.personTwoFirstName, s.personTwoLastName, s.personTwoIDNumber, s.personTwoEmail, personTwoBankName, personTwoAccountNumber, personTwoAccountType, personTwoFileID, personTwoFileBank, personTwoFilePaySlip, personTwoFileFica, personTwoMobile, personTwoLandline, personTwoPostalAddress, personTwoResidentialAddress, marital, salePerson, saleBuyers, cashDeal, balanceRem, deposit, depositDate, gasStove, personTwoMarital, spareRoom, additionalExtras, additionalExtrasCost, bayNo, notes, enclosedBalcony, fileDepositPop, gasStoveCost, s.planType 
  FROM salesinfo s, units u
  where u.unitName = s.unit and u.development = ${req.body.development} and u.id = ${req.body.unitId}`;
  let mysql4 = `select * from units where development = ${req.body.development}`;
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

router.post("/processPONotAllocatedWMB", (req, res) => {
  res.json({ Awesome: "So far!!! I guess" });

  console.log("Check This Out", req.body);
  // req.body.pos = JSON.parse(req.body.pos)

  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    req.body.pos.forEach((el) => {
      console.log(el.PONumber);
      let mysql = `insert into financeConstructionInput (development,
    task,
    taskType,
    unitNumber,
    supplier,
    vatVendor,
    paymentDate,
    budgetAmount,
    vatDate,
    actualAmount,
    purchaseOrder,
    purchaseOrderNumber,
    purchaseOrderAmount,
    purchaseOrderDate) values (
      ${req.body.id}, 0, 0, ${el.unitNumber}, ${el.supplier}, ${el.vatVendor}, '${el.paymentDate}',0, '${el.vatDate}', 0,
      ${el.id}, '${el.PONumber}', ${el.nettCost}, '${el.createdAt}'
    )`;

      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
        } else {
          // res.json(result);
        }
      });
    });
    connection.release();
  });
  // res.json({ allDone: "You Beauty!!!" });
});

router.post("/processPOAllocatedWB", (req, res) => {
  console.log(req.body);

  // res.json({awesome: "so far!!!!"})
  // let mysql = `select purchaseOrder from financeConstructionInput where development = ${req.body.id} and purchaseOrder is not null`
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    req.body.pos.forEach((el) => {
      let mysql1 = ``;
      let mysql2 = ``;
      mysql1 = `${mysql1} select * from financeConstructionInput where task = ${el.task} and purchaseOrder is Null;`;
      mysql2 = `${mysql2}select * from financeConstructionInput where task = ${el.task} and purchaseOrder is NOT Null;`;
      let mysql = `${mysql1}${mysql2}`;
      // console.log(mysql);
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
        } else {
          //  res.json(result)
          console.log(result);
          if (result[0].length > 0) {
            mysql2 = `Update financeConstructionInput set purchaseOrder = ${
              el.id
            },
            purchaseOrderNumber = '${el.PONumber}',
            purchaseOrderAmount = ${el.nettCost},
            purchaseOrderDate = '${el.createdAt.substr(0, 10)}' where id = ${
              result[0][0].id
            }`;
          } else {
            mysql2 = `insert into financeConstructionInput (development,
                  task,
                  taskType,
                  unitNumber,
                  supplier,
                  vatVendor,
                  paymentDate,
                  budgetAmount,
                  vatDate,
                  actualAmount,
                  purchaseOrder,
                  purchaseOrderNumber,
                  purchaseOrderAmount,
                  purchaseOrderDate) values (
                    ${result[1][0].development},${result[1][0].task}, ${result[1][0].taskType}, ${result[1][0].unitNumber}, ${result[1][0].supplier},${result[1][0].vatVendor},
                    '${result[1][0].paymentDate}',${result[1][0].budgetAmount}, '${result[1][0].vatDate}',  0, ${el.id}, '${el.PONumber}',
                    ${el.nettCost}, '${el.createdAt}'
                  )`;
          }
          console.log(mysql2);
          connection.query(mysql2, function (error, result) {
            if (error) {
              console.log("THE ERROR", error);
            } else {
              console.log("result", result);
              // res.json(result)
            }
          });
        }
      });
    });
    res.json({ comleted: "Yes!!!" });
    connection.release();
  });
});

router.post("/tasksListforFinanceWB", (req, res) => {
  let mysql1 = `SELECT f.id,
  f.development,
  f.task,
  f.taskType,
  f.unitNumber,
  u.unitName,
  f.supplier,
  s.supplierName,
  f.vatVendor,
  f.paymentDate,
  f.budgetAmount,
  f.vatDate,
  f.actualAmount,
  f.invoiceNumber,
  f.invoiceDate,
  f.budgetted,
  f.purchaseOrder,
  f.purchaseOrderNumber,
  f.purchaseOrderAmount,
  f.paymentCertificate,
  f.paymentCertificateNumber,
  f.paymentCertificateAmount,
  f.finalised,
  f.paid
FROM financeConstructionInput f, suppliers s, units u where s.id = f.supplier and u.id = f.unitNumber and f.development = ${req.body.id} order by f.paymentDate, f.task`;
  let mysql2 = `SELECT 
f.supplier,
s.supplierName,
f.vatVendor,
f.paymentDate,
f.invoiceNumber,
  f.invoiceDate,
sum(f.budgetAmount) as budgetAmount,
sum(f.actualAmount) as actualAmount,
f.finalised,
f.paid
FROM financeConstructionInput f, suppliers s where s.id = f.supplier and f.development = ${req.body.id} 
Group by  f.supplier,
s.supplierName,
f.vatVendor,
f.invoiceNumber,
  f.invoiceDate,
f.paymentDate,f.finalised,
f.paid order by f.paymentDate, s.supplierName
`;
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

router.post("/getPOtoInsertIntoFinanceConstructionWB", (req, res) => {
  let mysql = `select purchaseOrder from financeConstructionInput where development = ${req.body.id} and purchaseOrder is not null`;
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
        let poIdIn = [];
        console.log("result POsß", result);
        if (result.length > 0) {
          result.forEach((el) => {
            poIdIn.push(el.purchaseOrder);
          });
        }
        if (poIdIn.length > 0) {
          poIdIn.sort();
          poIdIn = Array.from(new Set(poIdIn));
          poIdIn = poIdIn.join(",");
        }

        let mysql2 = `select * from purchaseOrders where development = ${req.body.id} `;
        let mysqlAdd3 = ` and id not in (${poIdIn})`;
        if (poIdIn.length > 0) {
          mysql2 = `${mysql2}${mysqlAdd3}`;
        } else {
          mysql2 = `${mysql2}`;
        }
        connection.query(mysql2, function (error, result) {
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

router.post("/insertFinanceConstructionInputWB", (req, res) => {
  let mysql = `select p.PONumber as documentNumber, 'PO' as documentType, p.supplier, s.supplierName,  sum(p.nettCost) as documentValue, p.invoiceNumber,p.invoiceDate, coalesce(sum(p.paidAmount),0) as paidAmount, p.payDate, coalesce(p.paid, 0) as paid from purchaseOrders p, suppliers s
  where s.id = p.supplier and p.development = ${req.body.id} and p.task != 0
  group by p.PONumber, p.supplier, s.supplierName,p.invoiceNumber,p.invoiceDate, p.payDate, p.paid
  union all
  select p.certificateNumber as documentNumber,'PC' as documentType, p.supplier, s.supplierName, sum(p.totalValue) as documentValue, p.invoiceNumber,p.invoiceDate, coalesce(sum(p.paidAmount),0) as paidAmount, p.payDate, coalesce(p.paid, 0) as paid from paymentCertificatesDetails p, suppliers s
  where s.id = p.supplier and p.development = ${req.body.id}
  group by p.certificateNumber, p.supplier, s.supplierName,p.invoiceNumber,p.invoiceDate, p.payDate, p.paid
  order by payDate;`;

  // let mysql = `${mysql1};${mysql2}`;
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
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/editFinanceConstructionInputWB", (req, res) => {
  console.log(req.body);
  let paidAmount;

  let mysql = ``;
  if (req.body.documentType === "PO") {
    if (req.body.paidAmount === 0) {
      paidAmount = 0;
    } else {
      paidAmount = `nettCost / ${req.body.documentValue} * ${req.body.paidAmount}`;
    }
    mysql = `Update purchaseorders set paid = ${req.body.paid}, paidAmount = ${paidAmount}, invoiceDate = '${req.body.invoiceDate}', invoiceNumber = '${req.body.invoiceNumber}', payDate = '${req.body.payDate}' where PONumber = '${req.body.documentNumber}'`;
  } else {
    if (req.body.paidAmount === 0) {
      paidAmount = 0;
    } else {
      paidAmount = `totalValue / ${req.body.documentValue} * ${req.body.paidAmount}`;
    }
    mysql = `Update paymentCertificatesDetails set paid = ${req.body.paid}, paidAmount = ${req.body.paidAmount}, invoiceDate = '${req.body.invoiceDate}', invoiceNumber = '${req.body.invoiceNumber}', payDate = '${req.body.payDate}' where certificateNumber = '${req.body.documentNumber}';
    Update paymentCertificates set paid = ${req.body.paid}, paidAmount = ${req.body.paidAmount}, invDate = '${req.body.invoiceDate}', invNumber = '${req.body.invoiceNumber}', payDate = '${req.body.payDate}' where certificateNumber = '${req.body.documentNumber}'`;
  }

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
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/insertPCtoFinanceConstructionInputWB", (req, res) => {
  console.log("req.body", req.body);
  // res.json({awesome:"So Far!!!"})

  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    req.body.pcs.forEach((el) => {
      let mysql1 = ``;
      let mysql2 = ``;
      mysql1 = `${mysql1} select * from financeConstructionInput where task = ${el.task} and paymentCertificate is Null;`;
      mysql2 = `${mysql2}select * from financeConstructionInput where task = ${el.task} and paymentCertificate is NOT Null;`;
      let mysql = `${mysql1}${mysql2}`;
      // console.log(mysql);
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
        } else {
          // res.json(result)
          //  res.json(result)
          console.log(result);
          if (result[0].length > 0) {
            mysql2 = `Update financeConstructionInput set paymentCertificate = ${
              el.id
            },
                paymentCertificateNumber = '${el.certificateNumber}',
                paymentCertificateAmount = ${el.price},
                paymentCertificateDate = '${el.createdAt.substr(
                  0,
                  10
                )}' where id = ${result[0][0].id}`;
          } else {
            mysql2 = `insert into financeConstructionInput (development,
                  task,
                  taskType,
                  unitNumber,
                  supplier,
                  vatVendor,
                  paymentDate,
                  budgetAmount,
                  vatDate,
                  actualAmount,
                  paymentCertificate,
                  paymentCertificateNumber,
                  paymentCertificateAmount,
                  paymentCertificateDate) values (
                    ${result[1][0].development},${result[1][0].task}, ${result[1][0].taskType}, ${result[1][0].unitNumber}, ${result[1][0].supplier},${result[1][0].vatVendor},
                    '${result[1][0].paymentDate}',${result[1][0].budgetAmount}, '${result[1][0].vatDate}',  0, ${el.id}, '${el.certificateNumber}',
                    ${el.price}, '${result[1][0].paymentCertificateDate}'
                  )`;
          }
          console.log(mysql2);
          connection.query(mysql2, function (error, result) {
            if (error) {
              console.log("THE ERROR", error);
            } else {
              console.log("result", result);
            }
          });
        }
      });
    });
    connection.release();
  });
});

router.post("/PONotAllocatedWB", (req, res) => {
  let mysql1 = `select p.id, p.task, p.PONumber, p.unitNumber,u.unitName, p.reference, p.itemDescription, p.task, p.supplier, s.supplierName, p.nettCost, p.unitCost, p.quantity, p.development, p.createdAt 
  from suppliers s,purchaseOrders p, units u where task = 0 and p.development = ${req.body.id} and u.id = p.unitNumber
  and s.id = p.supplier`;
  let mysql2 = `select t.id, t.supplier,s.supplierName,t.cost, t.price, t.quantity, t.taskDescription, t.taskType, tt.taskName, t.unitNumber from tasks t, taskTypes tt, suppliers s where t.pc = 0 and t.development = ${req.body.id} and tt.id = t.taskType and t.supplier = s.id`;
  let mysql3 = `select t.id, t.taskName from taskTypes t where t.development = ${req.body.id}`;

  let mysql = `${mysql1};${mysql2};${mysql3}`;
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

router.post("/insertNewTaskFromPO", (req, res) => {
  let mysql = `insert into tasks (development, taskType, unitNumber, fix, cost, quantity, duration, startDate, endDate, PC, actualAmount,supplier, taskDescription) values (
    ${req.body.development}, ${req.body.taskTypeId}, ${req.body.unitNumber}, '1st', 0, 0, 1, '${req.body.createdAt}', '${req.body.createdAt}', 0, ${req.body.nettCost}, ${req.body.supplier}, '${req.body.taskDescription}'
  )`;
  console.log(req.body);
  console.log(mysql);
  // res.json({Awesome: "It works!!!"})
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
        console.log(result);
        let mysql2 = `update purchaseOrders set task = ${result.insertId} where id = ${req.body.id}`;
        // console.log(mysql2)
        connection.query(mysql2, function (error, result) {
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

router.post("/changeTaskSupplierWB", (req, res) => {
  let mysql = `update purchaseOrders set task = ${req.body.newSupplier.id} where id = ${req.body.id};
  update tasks set supplier = ${req.body.supplier}, taskType = ${req.body.newSupplier.taskType} where id = ${req.body.newSupplier.id}`;
  console.log(req.body);
  console.log(mysql);
  // res.json({Awesome: "It works!!!"})
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
        // console.log(result);
      }
    });
    connection.release();
  });
});

router.post("/updateVATInfo", (req, res) => {
  console.log(req.body);
  console.log(req.body.id);
  let mysql = `Update VATPlanning set amount = ${req.body.amount}, vatDate = '${req.body.vatDate}', vatPeriod = ${req.body.vatPeriod}, processed = ${req.body.processed} where id = ${req.body.id} `;
  console.log(mysql);
  // res.json({awesome: "So Far!!!!"})

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

router.post("/deleteDuplicate", (req, res) => {
  console.log(req.body);
  console.log(req.body.id);
  let mysql = `delete from VATPlanning where id = ${req.body.id} `;
  console.log(mysql);
  // res.json({awesome: "So Far!!!!"})

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

router.post("/getVATInfo", (req, res) => {
  let mysql1 = `delete from VATPlanning where processed = 0 and development = ${req.body.id};
  insert into VATPlanning (discipline, development, amount, vatDate, vatPeriod)
  select "VAT Expenses" as discipline,f.development, if(sum(f.actualAmount) = 0, sum(f.budgetAmount /1.15 * .15), sum(f.actualAmount /1.15 * .15)) as amount, f.vatDate as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(LAST_DAY(vatDate), INTERVAL 1 MONTH)) as VatPeriod from financeInput f where f.vatable = 1 and f.development = ${req.body.id} group by discipline, dashboardDate, vatPeriod
    union all
    select "TRANSFER FEES" as discipline, f.development, if(sum(f.actualAmount) = 0, sum(f.budgetAmount), sum(f.actualAmount)) as amount, vatDate as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(LAST_DAY(vatDate), INTERVAL 1 MONTH)) as VatPeriod from financeInput f where category = 2 and f.development = ${req.body.id} group by discipline, dashboardDate, vatPeriod
    union all
    select "VAT Construction" as discipline, t.development,  sum(t.price / 1.15 * .15) as amount, 
     if(MOD(month(t.endDate), 2) = 0, DATE_ADD(LAST_DAY(t.endDate), INTERVAL 1 MONTH), DATE_ADD(LAST_DAY(t.endDate), INTERVAL 2 MONTH)) as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(LAST_DAY(endDate), INTERVAL 1 MONTH)) as VatPeriod  from suppliers s,tasks t, subsection ss, units u
      where s.id = t.supplier and u.id = t.unitNumber and ss.id = u.subsection and t.development = ${req.body.id} and s.vatVendor = 1 and t.price != 0 and u.development = ${req.body.id} and ss.development = ${req.body.id} group by discipline, dashboardDate, vatPeriod
      union all
      select "VAT ON Sales" as discipline, development,  sum(contract_price / 1.15 * .15) as amount,  if(MOD(month(transfer_date), 2) = 0, DATE_ADD(LAST_DAY(transfer_date), INTERVAL 1 MONTH), DATE_ADD(LAST_DAY(transfer_date), INTERVAL 2 MONTH)) as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(LAST_DAY(transfer_date), INTERVAL 1 MONTH)) as VatPeriod  from  salesData
  where development = ${req.body.id} group by discipline, dashboardDate, vatPeriod
  union all
  select 'VAT Expenses' as discipline,development,  sum(amount) * .15 as amount, if(mod(month(paymentDate),2) = 0, date_add(last_day(paymentDate), INTERVAL 1 MONTH),date_add(last_day(paymentDate), INTERVAL 2 MONTH))  as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(if(mod(month(paymentDate),2) = 0, date_add(last_day(paymentDate), INTERVAL 1 MONTH),date_add(last_day(paymentDate), INTERVAL 2 MONTH)), INTERVAL 1 MONTH)) as VatPeriod from escalations where development = ${req.body.id} group by discipline,development,  dashboardDate, vatPeriod
union all
select 'VAT Expenses' as discipline,development,  sum(amount) * .15 as amount, if(mod(month(paymentDate),2) = 0, date_add(last_day(paymentDate), INTERVAL 1 MONTH),date_add(last_day(paymentDate), INTERVAL 2 MONTH))  as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(if(mod(month(paymentDate),2) = 0, date_add(last_day(paymentDate), INTERVAL 1 MONTH),date_add(last_day(paymentDate), INTERVAL 2 MONTH)), INTERVAL 1 MONTH)) as VatPeriod from contingencies where development = ${req.body.id} group by discipline,development,  dashboardDate, vatPeriod
union all
SELECT 'VAT Expenses' as discipline,
development,
   sum(
     OFFICE_BASED_MANAGEMENT +
     SITE_BASED_MANAGEMENT +
     INSURANCE +
     MAINTENANCE_ALLOWANCE +
     SITE_STAFF +
     SITE_ESTABLISHMENT +
     TRAINING +
     SITE_SECURITY +
     TEMPORARY_FENCING__GATES_ETC +
     PHONES_FAX_INTERNET_RADIOS +
     TEMPORARY_ELECTRICAL_SERVICES +
     TEMPORARY_WATER_SUPPLY +
     SETTING_OUT__GENERAL_Assistance +
     SITE_SAFETY_AND_SAFETY_EQUIPMENT +
     MEDICALS +
     COMPUTER_EXPENSES +
     PRINTING__STATIONARY_EXPENSES +
     MINOR_PLANT_AND_LOOSE_TOOLS +
     HOUSEKEEPING_SITE_TIDINESS +
     HAND_OVER_CLEANING_ +
     PROTECTION_OF_WORKS +
     HIRED_PLANT_INTERNAL_incl_weekends +
     GENERAL_TRANSPORT +
     RUBBLE_MANAGEMENT +
     SCAFFOLDING +
     MATERIALS_HANDLING +
     PETTY_CASH) * .15 as amount,
if(mod(month(effectiveDate),2) = 0, date_add(last_day(effectiveDate), INTERVAL 1 MONTH),date_add(last_day(effectiveDate), INTERVAL 2 MONTH))  as dashboardDate, EXTRACT(YEAR_MONTH from DATE_SUB(if(mod(month(effectiveDate),2) = 0, date_add(last_day(effectiveDate), INTERVAL 1 MONTH),date_add(last_day(effectiveDate), INTERVAL 2 MONTH)), INTERVAL 1 MONTH)) as VatPeriod
     
 FROM pandgNew
 where development = ${req.body.id}
 group by  discipline,development,  dashboardDate, vatPeriod
 

  `;
  let mysql2 = `select * from VATPlanning where development = ${req.body.id} order by vatPeriod, discipline;`;
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

router.post("/getFinanceInput", (req, res) => {
  let mysql1 = `select f.id, f.category, f.development,  c.discipline, f.budgetAmount, f.actualAmount, f.paymentDate, f.invoiceDate, f.invoiceNumber, f.supplier, f.supplierTerms as supplierTermsId, s.supplierTerms, f.vatable, f.drawNumber as drawId,d.drawNumber,  f.vatDate, f.paid, f.pop
    from  financeInput f
    left join dashboardCategories c on 
    c.id = f.category
    left join draws d
    on f.drawNumber = d.id
    left join supplierTerms s
    on f.supplierTerms = s.id
    where f.development = ${req.body.id}
    order by f.paymentDate`;
  let mysql2 = `select * from dashboardCategories`;
  let mysql3 = `select * from draws`;
  let mysql4 = `select * from supplierTerms`;
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

router.post("/editFinanceInput", upload.single("POP"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  let pop = "";
  if (req.file !== undefined) {
    fs.rename(
      `public/uploads/${req.file.filename}`,
      `public/uploads/${req.file.originalname}`,
      (err) => {
        if (err) {
          console.log("Error renaming");
        } //throw err
      }
    );
    pop = `'${req.file.originalname}'`;
  } else {
    pop = null;
  }
  // console.log(req.pop)
  let invoiceNumber;
  let invoiceDate;
  if (req.body.invoiceNumber === null) {
    invoiceNumber = null;
  } else {
    invoiceNumber = `'${req.body.invoiceNumber}'`;
  }
  if (req.body.invoiceDate == null || req.body.invoiceDate === "null") {
    console.log("IsNull");
    // invoiceNumber = null;
    invoiceDate = null;
  } else {
    console.log("IsNotNull");

    // invoiceNumber = `'${req.body.invoiceNumber}'`;
    invoiceDate = `'${req.body.invoiceDate}'`;
  }
  // console.log(req.body);
  let mysql = `UPDATE financeInput set category = ${
    req.body.category
  }, budgetAmount = ${parseFloat(
    req.body.budgetAmount
  )}, actualAmount = ${parseFloat(req.body.actualAmount)},
    paymentDate = '${
      req.body.paymentDate
    }', invoiceDate = ${invoiceDate}, supplierTerms  = ${
    req.body.supplierTermsId
  }, invoiceNumber = ${invoiceNumber}, supplier = '${req.body.supplier}',
     vatable = ${req.body.vatable}, drawNumber = ${
    req.body.drawId
  }, vatDate = '${req.body.vatDate}', paid = ${
    req.body.paid
  }, pop = ${pop} where id = ${req.body.id}`;
  console.log(chalk.red(mysql));

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

router.post("/insertFinanceInput", (req, res) => {
  console.log(req.body);
  let invoiceNumber;
  let invoiceDate;
  if (req.body.invoiceNumber === null || req.body.invoiceNumber === "") {
    invoiceNumber = null;
    // invoiceDate = null;
  } else {
    invoiceNumber = `'${req.body.invoiceNumber}'`;
    // invoiceDate = `'${req.body.invoiceDate}'`;
  }
  if (req.body.invoiceDate == null) {
    console.log("IsNull");
    // invoiceNumber = null;
    invoiceDate = null;
  } else {
    console.log("IsNotNull");

    // invoiceNumber = `'${req.body.invoiceNumber}'`;
    invoiceDate = `'${req.body.invoiceDate}'`;
  }

  let mysql = `insert into financeInput (development,category ,budgetAmount,actualAmount,paymentDate, invoiceDate,invoiceNumber, supplier, supplierTerms, vatable, drawNumber ,vatDate, paid) values (
      ${req.body.development},${req.body.category},${parseFloat(
    req.body.budgetAmount
  )}, ${parseFloat(req.body.actualAmount)}, '${req.body.paymentDate}',
    ${invoiceDate},${invoiceNumber}, '${req.body.supplier}', ${
    req.body.supplierTermsId
  },
     ${req.body.vatable}, ${req.body.drawId}, '${req.body.vatDate}', ${
    req.body.paid
  }
     )`;
  console.log(chalk.red(mysql));
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

router.post("/deleteFinanceInput", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql = `delete from financeInput where id = ${req.body.id}`;
  console.log(chalk.red(mysql));
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

// SALES DATA
router.post("/getSalesDataWb", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql = `select s.id, s.unit, u.unitName, s.development, s.beds,s.bath,s.unit_type,s.size,s.base_price,s.contract_price,s.sold,s.isEnclosed,s.bathAdd,s.study,s.parking,
    s.bay_no,s.mood_board,s.extras,s.notes,s.deductions,s.sale_date,s.bond_app_date,s.lodge_date,s.transfer_date , s.actualsale_date
    from salesData s, units u
    where u.id = s.unit and s.development = ${req.body.id}
    order by u.unitName
    `;
  console.log(chalk.red(mysql));
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

router.post("/editsalesDataWb", (req, res) => {
  // res.json({ awesome: "This Far!!" });

  console.log(req.body);
  let unit_type = req.body.unit_type.join(",");
  console.log(unit_type);
  let sale_date;
  let bond_app_date;
  let lodge_date;
  let transfer_date;
  let actualsale_date;

  if (req.body.sale_date === "" || req.body.sale_date === null) {
    sale_date = null;
  } else {
    sale_date = `'${req.body.sale_date}'`;
  }
  console.log(sale_date);
  if (req.body.bond_app_date === "" || req.body.bond_app_date === null) {
    bond_app_date = null;
  } else {
    bond_app_date = `'${req.body.bond_app_date}'`;
  }
  if (req.body.lodge_date === "" || req.body.lodge_date === null) {
    lodge_date = null;
  } else {
    lodge_date = `'${req.body.lodge_date}'`;
  }
  if (req.body.transfer_date === "" || req.body.transfer_date === null) {
    transfer_date = null;
  } else {
    transfer_date = `'${req.body.transfer_date}'`;
  }
  if (req.body.actualsale_date === "" || req.body.actualsale_date === null) {
    actualsale_date = null;
  } else {
    actualsale_date = `'${req.body.actualsale_date}'`;
  }

  let sold;
  if (req.body.sold === "No") {
    sold = false;
  } else {
    sold = true;
  }

  let mysql0 = `Update salesData set base_price = ${parseFloat(
    req.body.base_price
  )}, contract_price = ${parseFloat(req.body.contract_price)},
                  parking = ${parseFloat(req.body.parking)}, bay_no = '${
    req.body.bay_no
  }', mood_board = '${req.body.mood_board}', extras = ${parseFloat(
    req.body.extras
  )}, unit_type = '${unit_type}',
                  notes = '${req.body.notes}', deductions =  ${parseFloat(
    req.body.deductions
  )}, sale_date = ${sale_date},
                  bond_app_date = ${bond_app_date}, lodge_date = ${lodge_date}, transfer_date = ${transfer_date}, actualsale_date = ${actualsale_date},
                  sold = ${sold} where id = ${req.body.id}   
    `;
    let mysql1 = `update salesinfo set actualSalesdate = ${actualsale_date} where unit = '${req.body.unitName}' and development = ${req.body.development}`
    let mysql = `${mysql0};${mysql1}`
  console.log(chalk.red(mysql));
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

// Investment DATA
router.post("/getInvestmentDataForFile", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql1 = `select i.id, i.development, i.unit,u.unitName,s.sold,i.investor_code,i.investor, i.available, i.available_date, i.la_email_date,i.la_sign_date,i.pledged,i.attorney_inv_amount,i.fica_inv_date,i.amount,
  i.quinteDate,i.draw, d.drawNumber,i.drawn,  i.drawAdjustment, i.interest_rate,i.repayment_date, 
  i.trust_account_interest,i.supplementary_interest,i.opc_comm from salesData s, units u,investorDetails i
  left join  draws d
  on i.draw = d.id
  where i.unit = u.id and i.development = ${req.body.id} and s.unit = i.unit
  order by unitName, id
    `;
  // let mysql1 = `select i.id, i.development, i.unit,u.unitName,i.investor_code,i.investor, i.available, i.available_date, i.la_email_date,i.la_sign_date,i.pledged,i.attorney_inv_amount,i.fica_inv_date,i.amount,
  //   i.quinteDate,i.draw, d.drawNumber,i.drawn,  i.drawAdjustment, i.interest_rate,i.repayment_date, 
  //   i.trust_account_interest,i.supplementary_interest,i.opc_comm from units u,investorDetails i
  //   left join  draws d
  //   on i.draw = d.id
  //   where i.unit = u.id and i.development = ${req.body.id}
  //   order by unit, id
  //   `;
  let mysql2 = `select * from draws`;
  let mysql3 = `select * from units where development = ${req.body.id}`;
  let mysql = `${mysql1};${mysql2};${mysql3}`;
  console.log(chalk.red(mysql));
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
        // console.log("AWESOME RESULT HERE")
        console.log("The Result", result[0].length);
        console.log("The Result", result[1].length);
        console.log("The Result", result[2].length);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getInvestmentDataPlanningForFile", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql1 = `select i.id, i.development, i.unit,u.unitName,i.investor_code,i.investor, i.available, i.available_date, i.la_email_date,i.la_sign_date,i.pledged,i.attorney_inv_amount,i.fica_inv_date,i.amount,
    i.quinteDate,i.draw, d.drawNumber,i.drawn,  i.drawAdjustment, i.interest_rate,i.repayment_date, 
    i.trust_account_interest,i.supplementary_interest,i.opc_comm from units u,investorDetailsPlanning i
    left join  draws d
    on i.draw = d.id
    where i.unit = u.id and i.development = ${req.body.id}
    order by unit, id
    `;
  let mysql2 = `select * from draws`;
  let mysql3 = `select * from units where development = ${req.body.id}`;
  let mysql4 = `select unit, sum(amount) as amount from (
    select i.unit, if(i.attorney_inv_amount = 0, i.pledged, if(i.attorney_inv_amount > i.amount, i.amount, i.attorney_inv_amount)) as amount from investorDetails i
    ) as sumInvestorDetails
    group by unit`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4}`;
  console.log(chalk.red(mysql));
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
        // console.log("AWESOME RESULT HERE")
        console.log("The Result", result[0].length);
        console.log("The Result", result[1].length);
        console.log("The Result", result[2].length);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/updateAvailableData", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works!!"})
  let mysql = "";
  req.body.forEach((el) => {
    mysql = `${mysql} update investorDetailsPlanning set available = ${
      el.available
    }, available_date = '${dayjs(new Date()).format(
      "YYYY-MM-DD"
    )}' where unit = ${el.unit};`;
  });

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

router.post("/updateAvailableDataPlanning", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works!!"})
  let mysql = "";
  req.body.forEach((el) => {
    mysql = `${mysql} update investorDetailsPlanning set available = ${
      el.available
    }, available_date = '${dayjs(new Date()).format(
      "YYYY-MM-DD"
    )}' where unit = ${el.unit};`;
  });

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

router.post("/editInvestmentData", (req, res) => {
  console.log("REQ>BODY EDIT", req.body);
  // res.json({awesome: "It Works!!!!"})

  let la_email_date;
  if (req.body.la_email_date === null || req.body.la_email_date === "") {
    la_email_date = null;
  } else {
    la_email_date = `'${req.body.la_email_date}'`;
  }
  let la_sign_date;
  if (req.body.la_sign_date === null || req.body.la_sign_date === "") {
    la_sign_date = null;
  } else {
    la_sign_date = `'${req.body.la_sign_date}'`;
  }
  let fica_inv_date;
  if (req.body.fica_inv_date === null || req.body.fica_inv_date === "") {
    fica_inv_date = null;
  } else {
    fica_inv_date = `'${req.body.fica_inv_date}'`;
  }
  let quinteDate;
  if (req.body.quinteDate === null || req.body.quinteDate === "") {
    quinteDate = null;
  } else {
    quinteDate = `'${req.body.quinteDate}'`;
  }
  let repayment_date;
  if (req.body.repayment_date === null || req.body.repayment_date === "") {
    repayment_date = null;
  } else {
    repayment_date = `'${req.body.repayment_date}'`;
  }
  let available_date;
  if (req.body.available_date === null || req.body.available_date === "") {
    available_date = null;
  } else {
    available_date = `'${req.body.available_date}'`;
  }
  let pledge_date;
  if (req.body.pledge_date === null || req.body.pledge_date === "") {
    pledge_date = null;
  } else {
    pledge_date = `'${req.body.pledge_date}'`;
  }
  let interest_rate = parseFloat(req.body.interest_rate) / 100;
  let trust_account_interest =
    parseFloat(req.body.trust_account_interest) / 100;
  let supplementary_interest =
    parseFloat(req.body.supplementary_interest) / 100;
  let opc_comm = parseFloat(req.body.opc_comm) / 100;

  // id: 4,

  let mysql = `UPDATE investorDetails set unit = ${
    req.body.unit
  }, investor_code = '${req.body.investor_code}', investor = '${
    req.body.investor
  }',
  la_email_date = ${la_email_date}, la_sign_date = ${la_sign_date}, pledged = ${parseFloat(
    req.body.pledged
  )}, attorney_inv_amount = ${parseFloat(req.body.attorney_inv_amount)},
  fica_inv_date = ${fica_inv_date}, amount = ${parseFloat(
    req.body.amount
  )}, quinteDate = ${quinteDate}, draw = ${req.body.draw},
  drawAdjustment = ${parseFloat(
    req.body.drawAdjustment
  )}, interest_rate = ${interest_rate}, repayment_date = ${repayment_date}, trust_account_interest = ${trust_account_interest},
  supplementary_interest = ${supplementary_interest}, opc_comm = ${opc_comm}, drawn = ${
    req.body.drawn
  }, available_date = ${available_date}, available = ${
    req.body.available
  }, pledge_date = ${pledge_date}, pledgeUsed = ${
    req.body.pledgeUsed
  } where id = ${req.body.id}`;

  console.log(chalk.red(mysql));

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

router.post("/editInvestmentDataPlanning", (req, res) => {
  console.log("REQ>BODY EDIT", req.body);
  // res.json({awesome: "It Works!!!!"})

  let la_email_date;
  if (req.body.la_email_date === null || req.body.la_email_date === "") {
    la_email_date = null;
  } else {
    la_email_date = `'${req.body.la_email_date}'`;
  }
  let la_sign_date;
  if (req.body.la_sign_date === null || req.body.la_sign_date === "") {
    la_sign_date = null;
  } else {
    la_sign_date = `'${req.body.la_sign_date}'`;
  }
  let fica_inv_date;
  if (req.body.fica_inv_date === null || req.body.fica_inv_date === "") {
    fica_inv_date = null;
  } else {
    fica_inv_date = `'${req.body.fica_inv_date}'`;
  }
  let quinteDate;
  if (req.body.quinteDate === null || req.body.quinteDate === "") {
    quinteDate = null;
  } else {
    quinteDate = `'${req.body.quinteDate}'`;
  }
  let repayment_date;
  if (req.body.repayment_date === null || req.body.repayment_date === "") {
    repayment_date = null;
  } else {
    repayment_date = `'${req.body.repayment_date}'`;
  }
  let available_date;
  if (req.body.available_date === null || req.body.available_date === "") {
    available_date = null;
  } else {
    available_date = `'${req.body.available_date}'`;
  }
  let pledge_date;
  if (req.body.pledge_date === null || req.body.pledge_date === "") {
    pledge_date = null;
  } else {
    pledge_date = `'${req.body.pledge_date}'`;
  }
  let interest_rate = parseFloat(req.body.interest_rate) / 100;
  let trust_account_interest =
    parseFloat(req.body.trust_account_interest) / 100;
  let supplementary_interest =
    parseFloat(req.body.supplementary_interest) / 100;
  let opc_comm = parseFloat(req.body.opc_comm) / 100;

  // id: 4,

  let mysql = `UPDATE investorDetailsPlanning set unit = ${
    req.body.unit
  }, investor_code = '${req.body.investor_code}', investor = '${
    req.body.investor
  }',
  la_email_date = ${la_email_date}, la_sign_date = ${la_sign_date}, pledged = ${parseFloat(
    req.body.pledged
  )}, attorney_inv_amount = ${parseFloat(req.body.attorney_inv_amount)},
  fica_inv_date = ${fica_inv_date}, amount = ${parseFloat(
    req.body.amount
  )}, quinteDate = ${quinteDate}, draw = ${req.body.draw},
  drawAdjustment = ${parseFloat(
    req.body.drawAdjustment
  )}, interest_rate = ${interest_rate}, repayment_date = ${repayment_date}, trust_account_interest = ${trust_account_interest},
  supplementary_interest = ${supplementary_interest}, opc_comm = ${opc_comm}, drawn = ${
    req.body.drawn
  }, available_date = ${available_date}, available = ${
    req.body.available
  }, pledge_date = ${pledge_date}, pledgeUsed = ${
    req.body.pledgeUsed
  } where id = ${req.body.id}`;

  console.log(chalk.red(mysql));

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

router.post("/insertinvestorDetails", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works!!!"})

  let la_email_date;
  if (req.body.la_email_date === null || req.body.la_email_date === "") {
    la_email_date = null;
  } else {
    la_email_date = `'${req.body.la_email_date}'`;
  }
  let la_sign_date;
  if (req.body.la_sign_date === null || req.body.la_sign_date === "") {
    la_sign_date = null;
  } else {
    la_sign_date = `'${req.body.la_sign_date}'`;
  }
  let fica_inv_date;
  if (req.body.fica_inv_date === null || req.body.fica_inv_date === "") {
    fica_inv_date = null;
  } else {
    fica_inv_date = `'${req.body.fica_inv_date}'`;
  }
  let quinteDate;
  if (req.body.quinteDate === null || req.body.quinteDate === "") {
    quinteDate = null;
  } else {
    quinteDate = `'${req.body.quinteDate}'`;
  }
  let repayment_date;
  if (req.body.repayment_date === null || req.body.repayment_date === "") {
    repayment_date = null;
  } else {
    repayment_date = `'${req.body.repayment_date}'`;
  }
  let available_date;
  if (req.body.available_date === null || req.body.available_date === "") {
    available_date = null;
  } else {
    available_date = `'${req.body.available_date}'`;
  }
  let pledge_date;
  if (req.body.pledge_date === null || req.body.pledge_date === "") {
    pledge_date = null;
  } else {
    pledge_date = `'${req.body.pledge_date}'`;
  }
  let interest_rate = parseFloat(req.body.interest_rate) / 100;
  let trust_account_interest =
    parseFloat(req.body.trust_account_interest) / 100;
  let supplementary_interest =
    parseFloat(req.body.supplementary_interest) / 100;
  let opc_comm = parseFloat(req.body.opc_comm) / 100;

  let mysql = `insert into investorDetails (unit,investor_code,investor,la_email_date,la_sign_date,pledged,attorney_inv_amount,
            fica_inv_date,amount,quinteDate,draw,interest_rate,trust_account_interest,supplementary_interest,opc_comm, development, 
            drawAdjustment, drawn, repayment_date, available_date, available, pledge_date, pledgeUsed) values (
            ${req.body.unit}, '${req.body.investor_code}', '${
    req.body.investor
  }' , ${la_email_date}, ${la_sign_date}, ${parseFloat(
    req.body.pledged
  )},${parseFloat(req.body.attorney_inv_amount)},
            ${fica_inv_date},${parseFloat(req.body.amount)}, ${quinteDate}, ${
    req.body.draw
  }, ${interest_rate}, ${trust_account_interest}, ${supplementary_interest}, ${opc_comm}, ${
    req.body.development
  },
            ${parseFloat(req.body.drawAdjustment)}, ${
    req.body.drawn
  }, ${repayment_date}, ${available_date}, ${
    req.body.available
  }, ${pledge_date}, ${req.body.pledgeUsed})`;
  // console.log(chalk.red(mysql));

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

router.post("/insertinvestorDetailsPlanning", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works!!!"})

  let la_email_date;
  if (req.body.la_email_date === null || req.body.la_email_date === "") {
    la_email_date = null;
  } else {
    la_email_date = `'${req.body.la_email_date}'`;
  }
  let la_sign_date;
  if (req.body.la_sign_date === null || req.body.la_sign_date === "") {
    la_sign_date = null;
  } else {
    la_sign_date = `'${req.body.la_sign_date}'`;
  }
  let fica_inv_date;
  if (req.body.fica_inv_date === null || req.body.fica_inv_date === "") {
    fica_inv_date = null;
  } else {
    fica_inv_date = `'${req.body.fica_inv_date}'`;
  }
  let quinteDate;
  if (req.body.quinteDate === null || req.body.quinteDate === "") {
    quinteDate = null;
  } else {
    quinteDate = `'${req.body.quinteDate}'`;
  }
  let repayment_date;
  if (req.body.repayment_date === null || req.body.repayment_date === "") {
    repayment_date = null;
  } else {
    repayment_date = `'${req.body.repayment_date}'`;
  }
  let available_date;
  if (req.body.available_date === null || req.body.available_date === "") {
    available_date = null;
  } else {
    available_date = `'${req.body.available_date}'`;
  }
  let pledge_date;
  if (req.body.pledge_date === null || req.body.pledge_date === "") {
    pledge_date = null;
  } else {
    pledge_date = `'${req.body.pledge_date}'`;
  }
  let interest_rate = parseFloat(req.body.interest_rate) / 100;
  let trust_account_interest =
    parseFloat(req.body.trust_account_interest) / 100;
  let supplementary_interest =
    parseFloat(req.body.supplementary_interest) / 100;
  let opc_comm = parseFloat(req.body.opc_comm) / 100;

  let mysql = `insert into investorDetails (unit,investor_code,investor,la_email_date,la_sign_date,pledged,attorney_inv_amount,
            fica_inv_date,amount,quinteDate,draw,interest_rate,trust_account_interest,supplementary_interest,opc_comm, development, 
            drawAdjustment, drawn, repayment_date, available_date, available, pledge_date, pledgeUsed) values (
            ${req.body.unit}, '${req.body.investor_code}', '${
    req.body.investor
  }' , ${la_email_date}, ${la_sign_date}, ${parseFloat(
    req.body.pledged
  )},${parseFloat(req.body.attorney_inv_amount)},
            ${fica_inv_date},${parseFloat(req.body.amount)}, ${quinteDate}, ${
    req.body.draw
  }, ${interest_rate}, ${trust_account_interest}, ${supplementary_interest}, ${opc_comm}, ${
    req.body.development
  },
            ${parseFloat(req.body.drawAdjustment)}, ${
    req.body.drawn
  }, ${repayment_date}, ${available_date}, ${
    req.body.available
  }, ${pledge_date}, ${req.body.pledgeUsed})`;
  // console.log(chalk.red(mysql));

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

router.post("/deleteInvestmentData", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql = `delete from investorDetails where id = ${req.body.id}`;
  console.log(chalk.red(mysql));
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

router.post("/deleteInvestmentDataPlanning", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql = `delete from investorDetails where id = ${req.body.id}`;
  console.log(chalk.red(mysql));
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

router.post("/getPercentages", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "This Far!!"})
  let mysql = `select * from percentagesToInvestors where development = ${req.body.id}`;
  console.log(chalk.red(mysql));
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
        console.log("result", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/editPercentages", (req, res) => {
  console.log("BODY!!!", req.body);
  // res.json({awesome: "This Far!!"})
  let dashboardDate;
  if (req.body.dashboardDate === null || req.body.dashboardDate === "") {
    dashboardDate = null;
  } else {
    dashboardDate = `'${req.body.dashboardDate}'`;
  }
  let mysql = `update percentagesToInvestors set development = ${req.body.development}, dashboardDate = ${dashboardDate}, percentageTransferred = ${req.body.percentageTransferred}, vatOrSales = '${req.body.vatOrSales}'  where id = ${req.body.id}`;
  console.log(chalk.red(mysql));
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
        console.log("result", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/insertPercentages", (req, res) => {
  console.log("BODY!!!", req.body);
  // res.json({awesome: "This Far!!"})
  let dashboardDate;
  if (req.body.dashboardDate === null || req.body.dashboardDate === "") {
    dashboardDate = null;
  } else {
    dashboardDate = `'${req.body.dashboardDate}'`;
  }
  let mysql = `insert into percentagesToInvestors (development, dashboardDate, percentageTransferred, vatOrSales) values (
    ${req.body.development},${dashboardDate}, ${req.body.percentageTransferred}, '${req.body.vatOrSales}'
  )`;

  console.log(chalk.red(mysql));
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
        console.log("result", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/deletePercentages", (req, res) => {
  console.log("BODY!!!", req.body);
  // res.json({awesome: "This Far!!"})
  let mysql = `delete from  percentagesToInvestors where id = ${req.body.id}
  `;

  console.log(chalk.red(mysql));
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
        console.log("result", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

//UNIT SALES

router.post("/getunitSalesProjection", (req, res) => {
  console.time("Start");
  let mysql1 = `select s.id, s.unit, u.unitName, s.development, s.beds,s.bath,s.unit_type,s.size,s.base_price,s.contract_price,s.sold,s.isEnclosed,s.bathAdd,s.study,s.parking,
  s.bay_no,s.mood_board,s.extras,s.notes,s.deductions,s.sale_date,s.bond_app_date,s.lodge_date,s.transfer_date , s.actualsale_date
  from salesData s, units u
  where u.id = s.unit and s.development = ${req.body.id} and u.development = ${req.body.id}
  order by u.unitName`;
  let mysql2 = `select i.id, i.development, i.unit,u.unitName,i.investor_code,i.investor,i.la_email_date,i.la_sign_date,i.pledged,i.attorney_inv_amount,i.fica_inv_date,i.amount,
  i.quinteDate,i.draw, d.drawNumber, i.drawAdjustment, i.interest_rate,i.repayment_date, 
  i.trust_account_interest,i.supplementary_interest,i.opc_comm from units u,investorDetails i
  left join  draws d
  on i.draw = d.id
  where i.unit = u.id and i.development = ${req.body.id} and u.development = ${req.body.id}`;
  let mysql3 = `select f.paymentDate as theDate from financeInput f where f.development = ${req.body.id} union select s.transfer_date as theDate from salesData s where s.development = ${req.body.id}
  order by theDate`;
  let mysql4 = `select f.id,c.discipline, c.section, c.lineNumber, f.category, f.budgetAmount, f.actualAmount, f.paymentDate, f.invoiceDate, f.vatDate 
  from financeInput f, dashboardCategories c
  where c.id = f.category and f.development = ${req.body.id} `;
  let mysql5 = `select distinct discipline from dashboardCategories`;
  let mysql6 = `select if(s.subsectionName = 'Common Area', u.unitName, s.subsectionName) as discipline, 
  t.price as budgetAmount, t.price - coalesce(pc.totalValue,0) - if(po.task = 0, 0, coalesce(po.nettCost,0)) as actualAmount,  t.payDate as paymentDate  
   from units u, subsection s, tasks t
  left join progress p
  on p.task = t.id
  left join paymentCertificatesDetails pc
  on pc.progressId = p.id
  left join purchaseOrders po
  on po.task = t.id
  where u.id = t.unitNumber and s.id = u.subsection and t.development = ${req.body.id}
  union all
select if(s.subsectionName = 'Common Area', u.unitName,s.subsectionName) as discipline, pc.totalValue as budgetAmount, pc.totalValue as actualAmount, pc.payDate as paymentDate  
from paymentCertificatesDetails pc, progress p, units u, subsection s where p.id = pc.progressId and u.id = p.unitNumber and u.subsection = s.id and pc.development = ${req.body.id}
union all
select if(s.subsectionName = 'Common Area', u.unitName,s.subsectionName) as discipline, po.nettCost as budgetAmount, po.nettCost as actualAmount, po.payDate as paymentDate  
from purchaseOrders po, units u, subsection s where u.id = po.unitNumber and s.id = po.subsection and po.development = ${req.body.id}`;
  // let mysql6 = `select if(s.subsectionName = 'Common Area', u.unitName, s.subsectionName) as discipline, if(ss.vatVendor = 1, sum(t.price),sum(t.price /1.15))  as budgetAmount, 0 as actualAmount, if(ss.terms = 1, LAST_DAY(DATE_ADD(t.endDate, INTERVAL 1 MONTH)),
  // if(ss.terms = 2, DATE_ADD(t.endDate, INTERVAL 14 DAY),
  // if(ss.terms = 3, date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),
  // if(ss.terms = 4, DATE_ADD(date(t.endDate+ INTERVAL 5 - weekday(t.endDate) DAY),INTERVAL 7 DAY), t.endDate)))) as paymentDate from tasks t, units u, subsection s, suppliers ss
  //   where u.id = t.unitNumber and s.id = u.subsection and u.development = ${req.body.id} and t.development = ${req.body.id} and s.development = ${req.body.id} and t.supplier = ss.id
  //   group by discipline,ss.vatVendor,ss.terms, endDate`;
  let mysql7 = `SELECT
  sum(
    OFFICE_BASED_MANAGEMENT +
    SITE_BASED_MANAGEMENT +
    INSURANCE +
    MAINTENANCE_ALLOWANCE +
    SITE_STAFF +
    SITE_ESTABLISHMENT +
    TRAINING +
    SITE_SECURITY +
    TEMPORARY_FENCING__GATES_ETC +
    PHONES_FAX_INTERNET_RADIOS +
    TEMPORARY_ELECTRICAL_SERVICES +
    TEMPORARY_WATER_SUPPLY +
    SETTING_OUT__GENERAL_Assistance +
    SITE_SAFETY_AND_SAFETY_EQUIPMENT +
    MEDICALS +
    COMPUTER_EXPENSES +
    PRINTING__STATIONARY_EXPENSES +
    MINOR_PLANT_AND_LOOSE_TOOLS +
    HOUSEKEEPING_SITE_TIDINESS +
    HAND_OVER_CLEANING_ +
    PROTECTION_OF_WORKS +
    HIRED_PLANT_INTERNAL_incl_weekends +
    GENERAL_TRANSPORT +
    RUBBLE_MANAGEMENT +
    SCAFFOLDING +
    MATERIALS_HANDLING +
    PETTY_CASH) * 1.15 as budgetAmount,
  sum(
    OFFICE_BASED_MANAGEMENT +
    SITE_BASED_MANAGEMENT +
    INSURANCE +
    MAINTENANCE_ALLOWANCE +
    SITE_STAFF +
    SITE_ESTABLISHMENT +
    TRAINING +
    SITE_SECURITY +
    TEMPORARY_FENCING__GATES_ETC +
    PHONES_FAX_INTERNET_RADIOS +
    TEMPORARY_ELECTRICAL_SERVICES +
    TEMPORARY_WATER_SUPPLY +
    SETTING_OUT__GENERAL_Assistance +
    SITE_SAFETY_AND_SAFETY_EQUIPMENT +
    MEDICALS +
    COMPUTER_EXPENSES +
    PRINTING__STATIONARY_EXPENSES +
    MINOR_PLANT_AND_LOOSE_TOOLS +
    HOUSEKEEPING_SITE_TIDINESS +
    HAND_OVER_CLEANING_ +
    PROTECTION_OF_WORKS +
    HIRED_PLANT_INTERNAL_incl_weekends +
    GENERAL_TRANSPORT +
    RUBBLE_MANAGEMENT +
    SCAFFOLDING +
    MATERIALS_HANDLING +
    PETTY_CASH) * 1.15 as actualAmount,

    effectiveDate as paymentDate
FROM pandgNew
where development = ${req.body.id}
group by  effectiveDate `;

  let mysql8 = `select "Loan Agreement Emailed" as discipline,la_email_date as dashboardDate, sum(pledged) as amount from investorDetails where attorney_inv_amount = 0 and development = ${req.body.id} and la_sign_date is null
  group by discipline,la_email_date
  union all
  select "Loan Agreement Expected" as discipline,la_sign_date  as dashboardDate, sum(pledged) as amount from investorDetails where attorney_inv_amount = 0 and la_sign_date is not null and development = ${req.body.id}
   group by discipline,la_sign_date
  union all
  select "Received In Attorney Trust Acc" as discipline,fica_inv_date  as dashboardDate, sum(attorney_inv_amount) as amount from investorDetails where attorney_inv_amount != 0 and fica_inv_date is not null and development = ${req.body.id}
  group by discipline,fica_inv_date
  union all
  select "Actual Draws Done" as discipline,quinteDate  as dashboardDate, sum(amount + drawAdjustment) as amount from investorDetails where amount != 0 and QuinteDate is not null and development = ${req.body.id} and drawn = 1
  group by discipline,quinteDate
  union all
  select "Draw (prepopulated - Debbie)" as discipline,quinteDate  as dashboardDate, sum(amount) as amount from investorDetails where amount != 0 and QuinteDate is not null and development = ${req.body.id} and drawn = 0
  group by discipline,quinteDate
  union all
  select "Available Income (Units not funded - Debbie)" as discipline,if(available_date is null, '2019-11-01',available_date) as dashboardDate, sum(available) as amount from investorDetailsPlanning where development = ${req.body.id}
  group by discipline, available_date
  union all
  select "Pledges Utilized" as discipline, pledge_date as dashboardDate, sum(pledged) as amount from investorDetails where development = 1 and pledgeUsed = ${req.body.id}
  group by discipline, pledge_date
  union all
  select if(vatOrSales = 'Sales',"% Company Income to Loan", "% to Bond") as discipline, dashboardDate as dashboardDate, sum(percentageTransferred)/100 as amount from percentagesToInvestors where development = ${req.body.id}
  group by discipline, dashboardDate`;
  let mysql9 = ` select "Contract Interest" as discipline, i.quinteDate as startingDate ,i.repayment_date as endingDate,
  (i.amount * (i.interest_rate))/365 as dailyInterest 
 from investorDetails i
   where i.development = ${req.body.id} and amount != 0  and i.quinteDate is not null
 union all
 select "Contract Interest" as discipline, i.available_date as startingDate ,i.repayment_date as endingDate,
  coalesce((i.available * (i.interest_rate))/365,0) as dailyInterest 
 from investorDetailsPlanning i
   where i.development = ${req.body.id} and available != 0  and i.available_date is not null
   union all
 select  "Trust Interest" as discipline, fica_inv_date as startingDate, if(i.quinteDate is not null,i.quinteDate, s.transfer_date) as endingDate ,
  (i.attorney_inv_amount * (i.supplementary_interest + i.trust_account_interest))/365 as dailyInterest
 from investorDetails i
 left join salesData s
 on s.unit = i.unit
  where (i.development = ${req.body.id} and attorney_inv_amount != 0) and s.development = ${req.body.id}`;
  let mysql10 = `select "Transfer Income" as discipline, s.contract_price - (s.contract_price/1.15*.04025) - 16591.33 - 16851.69 - 1789 - (s.contract_price * .005) as amount, s.transfer_date as dashboardDate from salesData s where s.development = ${req.body.id}`;

  let mysql11 = `select "Transfer to Loan - Repay Investor" as discipline, coalesce(amount + (amount * (trust_account_interest + supplementary_interest) * datediff(quinteDate,fica_inv_date)/365) + (amount * interest_rate * datediff(repayment_date, quinteDate)/365),0) as amount, repayment_date as dashboardDate  from investorDetails where amount != 0  and development = ${req.body.id}
  union all 
  select "Transfer to Loan - Repay Investor" as discipline, coalesce(available + (available * interest_rate * datediff(repayment_date, available_date)/365),0) as amount, repayment_date as dashboardDate  
from investorDetailsPlanning where available != 0  and development = ${req.body.id}`;

  let mysql12 = `select "Unit/s Transferred" as discipline, count(transfer_date) as amount, transfer_date as dashboardDate from salesData where development = ${req.body.id}
  group by transfer_date`;

  let mysql13 = `select "Actual draws" as discipline,  sum(amount + drawAdjustment) as amount, quinteDate as dashboardDate from investorDetails where amount != 0 and development = ${req.body.id} and draw is not null
  group by draw, quinteDate
  `;
  let mysql14 = `select discipline, amount, vatDate as dashboardDate from VATPlanning where development = ${req.body.id} order by vatPeriod, discipline`;
  let mysql15 = `select  "Expenses still due" as discipline, sum(f.budgetAmount - f.actualAmount) as amount, f.paymentDate as dashboardDate
  from financeInput f
  where  f.development = ${req.body.id} and (f.budgetAmount - f.actualAmount != 0)
  group by f.paymentDate`;
  let mysql16 = `select "Construction Expenses still due" as discipline, sum(totalValue - paidAmount) as amount, payDate as dashboardDate from paymentCertificatesDetails
  where development = ${req.body.id} and paid != 1
  group by payDate
  union all
   select "Construction Expenses still due" as discipline, sum(nettCost - coalesce(paidAmount,0)) as amount, payDate as dashboardDate from purchaseOrders
  where development = ${req.body.id}
  group by payDate
  union all
  select "Construction Expenses still due" as discipline, amount as amount, paymentDate as dashboardDate from contingencies where development = ${req.body.id} and processed != 1
  union all
  select "Construction Expenses still due" as discipline, amount as amount, paymentDate as dashboardDate from escalations where development = ${req.body.id} and processed != 1
  union all
  SELECT "Construction Expenses still due" as discipline,
   sum(
     OFFICE_BASED_MANAGEMENT +
     SITE_BASED_MANAGEMENT +
     INSURANCE +
     MAINTENANCE_ALLOWANCE +
     SITE_STAFF +
     SITE_ESTABLISHMENT +
     TRAINING +
     SITE_SECURITY +
     TEMPORARY_FENCING__GATES_ETC +
     PHONES_FAX_INTERNET_RADIOS +
     TEMPORARY_ELECTRICAL_SERVICES +
     TEMPORARY_WATER_SUPPLY +
     SETTING_OUT__GENERAL_Assistance +
     SITE_SAFETY_AND_SAFETY_EQUIPMENT +
     MEDICALS +
     COMPUTER_EXPENSES +
     PRINTING__STATIONARY_EXPENSES +
     MINOR_PLANT_AND_LOOSE_TOOLS +
     HOUSEKEEPING_SITE_TIDINESS +
     HAND_OVER_CLEANING_ +
     PROTECTION_OF_WORKS +
     HIRED_PLANT_INTERNAL_incl_weekends +
     GENERAL_TRANSPORT +
     RUBBLE_MANAGEMENT +
     SCAFFOLDING +
     MATERIALS_HANDLING +
     PETTY_CASH) * 1.15 as amount,
     effectiveDate as dashboardDate
 FROM pandgNew
 where development = ${req.body.id} and processed = 0
 group by  effectiveDate `;
  let mysql17 = `select if(discipline = 'VAT ON Sales', 'VAT ON Sales to Process', 'VAT on Expenses to Process') as discipline, amount, vatDate as dashboardDate from VATPlanning where development = ${req.body.id} and processed = 0 order by vatPeriod, discipline`;
  let mysql18 = `select 'Contingencies' as discipline, amount * 1.15 as budgetAmount, if(processed = 1, amount * 1.15,0) as actualAmount, DATE_FORMAT(paymentDate,'%Y-%m-%d') as paymentDate from contingencies where development = ${req.body.id}
  union all
  select 'Escalations' as discipline, amount * 1.15 as budgetAmount, if(processed = 1, amount * 1.15,0) as actualAmount, DATE_FORMAT(paymentDate,'%Y-%m-%d') as paymentDate from escalations where development = ${req.body.id}`;
  let mysql19 = `select 'Overs / Unders' as discipline,
  0 as budgetAmount,
    if(sum(f.actualAmount) = 0, 0, sum(f.budgetAmount) - sum(f.actualAmount)) as actualAmount,
    f.paymentDate 
    from financeConstructionInput f 
    where  f.development =  ${req.body.id} and f.budgetAmount != 0
    group by discipline, f.paymentDate
    order by f.paymentDate;
  select * from dashboardCategories`;
  let mysql20 = `select 
  if(d.section = 1, 'Total Land Costs Paid', 
  if(d.section = 2, 'Total Professional Fees & Payments Paid', 
  if (d.section = 3, 'Total Infrastructure Construction Paid', 
  if(d.section = 4, 'Total Construction & Building Paid',0)))) as discipline,
  sum(f.actualAmount) as amount, f.paymentDate as dashboardDate from financeInput f, dashboardCategories d 
  where f.development = ${req.body.id} and f.category = d.id and f.paid = 1
  group by d.section, dashboardDate`;
  let mysql21 = `select 'Total Construction & Building Paid - Janine' as discipline, sum(actualAmount) as amount, paymentDate as dashboardDate 
  from financeConstructionInput
  where development = ${req.body.id} and paid != 0
  group by paymentDate`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5};${mysql6};${mysql7};${mysql8};${mysql9};${mysql10};${mysql11};${mysql12};${mysql13};${mysql14};${mysql15};${mysql16};${mysql17};${mysql18};${mysql19};${mysql20};${mysql21}`;
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
        result[2].sort(function (a, b) {
          return new Date(a.theDate) - new Date(b.theDate);
        });
        result[2] = Array.from(new Set(result[2]));
        result[1].forEach((el) => {
          el.transfer_date = result[0].filter((el1) => {
            return el1.unit === el1.unit;
          })[0].transfer_date;
          if (el.fica_inv_date !== null && el.quinteDate === null) {
            el.trustInterestDays = dayjs(el.transfer_date).diff(
              dayjs(el.fica_inv_date),
              "d"
            );
          } else if (el.quinteDate !== null && el.fica_inv_date !== null) {
            el.trustInterestDays = dayjs(el.quinteDate).diff(
              dayjs(el.fica_inv_date),
              "d"
            );
          } else {
            el.trustInterestDays = 0;
          }
          if (el.quinteDate !== null) {
            el.contractInterestDays = dayjs(el.transfer_date).diff(
              dayjs(el.quinteDate),
              "d"
            );
          } else {
            el.contractInterestDays = 0;
          }

          el.trustInterest =
            ((el.attorney_inv_amount * el.trust_account_interest) / 365) *
            el.trustInterestDays;
          el.supplementaryInterest =
            ((el.attorney_inv_amount * el.supplementary_interest) / 365) *
            el.trustInterestDays;
          el.contractInterest =
            ((el.amount * el.interest_rate) / 365) * el.contractInterestDays;
        });
        result[0].forEach((el) => {
          let calculationArray = result[1].filter((el2) => {
            return el.unit === el2.unit;
          });

          if (calculationArray.length > 0) {
            el.trustInterest = calculationArray.reduce((prev, curr) => {
              return curr.trustInterest + prev;
            }, 0);
            el.supplementaryInterest = calculationArray.reduce((prev, curr) => {
              return curr.supplementaryInterest + prev;
            }, 0);
            el.contractInterest = calculationArray.reduce((prev, curr) => {
              return curr.contractInterest + prev;
            }, 0);
            el.totalInterest =
              el.trustInterest + el.supplementaryInterest + el.contractInterest;
            el.investmentAmount = calculationArray.reduce((prev, curr) => {
              return curr.attorney_inv_amount + prev;
            }, 0);
            el.raisingCommission = el.investmentAmount * 0.04;
            el.structuringFee = el.investmentAmount * 0.04;
            el.transfer_date = dayjs(calculationArray[0].transfer_date).format(
              "YYYY-MM-DD"
            );

            // el.attorney_inv_amount
          } else {
            el.trustInterest = 0;
            el.supplementaryInterest = 0;
            el.contractInterest = 0;
            el.totalInterest = 0;
            el.investmentAmount = 0;
            el.raisingCommission = 0;
            el.structuringFee = 0;
          }
        });
        let dates = [];
        dates.push(result[2][0].theDate);
        dates.push(result[2][result[2].length - 1].theDate);
        dates[1] = dayjs(dates[1]).add(12, "months").format("YYYY-MM-DD");

        dates[0] = dayjs(dates[0]).subtract(1, "week").add(2, "day");

        result[5].forEach((el) => {
          if (el.discipline === "Security") {
            el.discipline = "Site Security";
          }
          if (el.discipline === "Landscaping") {
            el.discipline = "Landscaping Site";
          }
        });
        let result5 = result[5];

        let disciplineArray = [];
        result[6].forEach((el) => {
          el.discipline = "CPC P&G";
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });
        // console.log(result[10]);

        const fakeBudget = [
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-02",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-02",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-02",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-09",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-09",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-09",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-16",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-16",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-16",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-23",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-23",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-23",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-30",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-30",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-07-30",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-06",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-06",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-06",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-13",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-13",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-13",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-20",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-20",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-20",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-27",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-27",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-08-27",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-03",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-03",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-03",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-10",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-10",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-10",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-17",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-17",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-17",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-24",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-24",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-09-24",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-01",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-01",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-01",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-08",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-08",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-08",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-15",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-15",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-15",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-22",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-22",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-22",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-29",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-29",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-10-29",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-05",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-05",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-05",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-12",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-12",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-12",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-19",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-19",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-11-19",
          },
          {
            discipline: "Block A",
            budgetAmount: 175417.28,
            actualAmount: 0,
            paymentDate: "2021-11-26",
          },
          {
            discipline: "Block B",
            budgetAmount: 73499.55,
            actualAmount: 0,
            paymentDate: "2021-11-26",
          },
          {
            discipline: "Block C",
            budgetAmount: 74460.4,
            actualAmount: 0,
            paymentDate: "2021-11-26",
          },
          {
            discipline: "Block A",
            budgetAmount: 207311.34,
            actualAmount: 0,
            paymentDate: "2021-12-03",
          },
          {
            discipline: "Block B",
            budgetAmount: 92345.6,
            actualAmount: 0,
            paymentDate: "2021-12-03",
          },
          {
            discipline: "Block C",
            budgetAmount: 92621.46,
            actualAmount: 0,
            paymentDate: "2021-12-03",
          },
          {
            discipline: "Block A",
            budgetAmount: 239205.38,
            actualAmount: 0,
            paymentDate: "2021-12-10",
          },
          {
            discipline: "Block B",
            budgetAmount: 111191.63,
            actualAmount: 0,
            paymentDate: "2021-12-10",
          },
          {
            discipline: "Block C",
            budgetAmount: 110782.54,
            actualAmount: 0,
            paymentDate: "2021-12-10",
          },
          {
            discipline: "Block A",
            budgetAmount: 271099.44,
            actualAmount: 0,
            paymentDate: "2021-12-17",
          },
          {
            discipline: "Block B",
            budgetAmount: 130037.68,
            actualAmount: 0,
            paymentDate: "2021-12-17",
          },
          {
            discipline: "Block C",
            budgetAmount: 128943.62,
            actualAmount: 0,
            paymentDate: "2021-12-17",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-12-24",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-12-24",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-12-24",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-12-31",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-12-31",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2021-12-31",
          },
          {
            discipline: "Block A",
            budgetAmount: 302993.49,
            actualAmount: 0,
            paymentDate: "2022-01-07",
          },
          {
            discipline: "Block B",
            budgetAmount: 148883.71,
            actualAmount: 0,
            paymentDate: "2022-01-07",
          },
          {
            discipline: "Block C",
            budgetAmount: 147104.68,
            actualAmount: 0,
            paymentDate: "2022-01-07",
          },
          {
            discipline: "Block A",
            budgetAmount: 334887.54,
            actualAmount: 0,
            paymentDate: "2022-01-14",
          },
          {
            discipline: "Block B",
            budgetAmount: 167729.75,
            actualAmount: 0,
            paymentDate: "2022-01-14",
          },
          {
            discipline: "Block C",
            budgetAmount: 165265.76,
            actualAmount: 0,
            paymentDate: "2022-01-14",
          },
          {
            discipline: "Block A",
            budgetAmount: 366781.59,
            actualAmount: 0,
            paymentDate: "2022-01-21",
          },
          {
            discipline: "Block B",
            budgetAmount: 186575.8,
            actualAmount: 0,
            paymentDate: "2022-01-21",
          },
          {
            discipline: "Block C",
            budgetAmount: 183426.82,
            actualAmount: 0,
            paymentDate: "2022-01-21",
          },
          {
            discipline: "Block A",
            budgetAmount: 398675.64,
            actualAmount: 0,
            paymentDate: "2022-01-28",
          },
          {
            discipline: "Block B",
            budgetAmount: 205421.83,
            actualAmount: 0,
            paymentDate: "2022-01-28",
          },
          {
            discipline: "Block C",
            budgetAmount: 201587.9,
            actualAmount: 0,
            paymentDate: "2022-01-28",
          },
          {
            discipline: "Block A",
            budgetAmount: 430569.69,
            actualAmount: 0,
            paymentDate: "2022-02-04",
          },
          {
            discipline: "Block B",
            budgetAmount: 224267.87,
            actualAmount: 0,
            paymentDate: "2022-02-04",
          },
          {
            discipline: "Block C",
            budgetAmount: 219748.98,
            actualAmount: 0,
            paymentDate: "2022-02-04",
          },
          {
            discipline: "Block A",
            budgetAmount: 462463.75,
            actualAmount: 0,
            paymentDate: "2022-02-11",
          },
          {
            discipline: "Block B",
            budgetAmount: 243113.91,
            actualAmount: 0,
            paymentDate: "2022-02-11",
          },
          {
            discipline: "Block C",
            budgetAmount: 237910.04,
            actualAmount: 0,
            paymentDate: "2022-02-11",
          },
          {
            discipline: "Block A",
            budgetAmount: 494357.79,
            actualAmount: 0,
            paymentDate: "2022-02-18",
          },
          {
            discipline: "Block B",
            budgetAmount: 246883.12,
            actualAmount: 0,
            paymentDate: "2022-02-18",
          },
          {
            discipline: "Block C",
            budgetAmount: 255163.06,
            actualAmount: 0,
            paymentDate: "2022-02-18",
          },
          {
            discipline: "Block A",
            budgetAmount: 526251.85,
            actualAmount: 0,
            paymentDate: "2022-02-25",
          },
          {
            discipline: "Block B",
            budgetAmount: 219556.36,
            actualAmount: 0,
            paymentDate: "2022-02-25",
          },
          {
            discipline: "Block C",
            budgetAmount: 242450.32,
            actualAmount: 0,
            paymentDate: "2022-02-25",
          },
          {
            discipline: "Block A",
            budgetAmount: 558145.899999999,
            actualAmount: 0,
            paymentDate: "2022-03-04",
          },
          {
            discipline: "Block B",
            budgetAmount: 191287.3,
            actualAmount: 0,
            paymentDate: "2022-03-04",
          },
          {
            discipline: "Block C",
            budgetAmount: 215208.7,
            actualAmount: 0,
            paymentDate: "2022-03-04",
          },
          {
            discipline: "Block A",
            budgetAmount: 590039.95,
            actualAmount: 0,
            paymentDate: "2022-03-11",
          },
          {
            discipline: "Block B",
            budgetAmount: 163018.25,
            actualAmount: 0,
            paymentDate: "2022-03-11",
          },
          {
            discipline: "Block C",
            budgetAmount: 187967.1,
            actualAmount: 0,
            paymentDate: "2022-03-11",
          },
          {
            discipline: "Block A",
            budgetAmount: 621934,
            actualAmount: 0,
            paymentDate: "2022-03-18",
          },
          {
            discipline: "Block B",
            budgetAmount: 134749.18,
            actualAmount: 0,
            paymentDate: "2022-03-18",
          },
          {
            discipline: "Block C",
            budgetAmount: 160725.48,
            actualAmount: 0,
            paymentDate: "2022-03-18",
          },
          {
            discipline: "Block A",
            budgetAmount: 613960.49,
            actualAmount: 0,
            paymentDate: "2022-03-25",
          },
          {
            discipline: "Block B",
            budgetAmount: 106480.13,
            actualAmount: 0,
            paymentDate: "2022-03-25",
          },
          {
            discipline: "Block C",
            budgetAmount: 133483.88,
            actualAmount: 0,
            paymentDate: "2022-03-25",
          },
          {
            discipline: "Block A",
            budgetAmount: 566119.41,
            actualAmount: 0,
            paymentDate: "2022-04-01",
          },
          {
            discipline: "Block B",
            budgetAmount: 78211.0600000001,
            actualAmount: 0,
            paymentDate: "2022-04-01",
          },
          {
            discipline: "Block C",
            budgetAmount: 106242.28,
            actualAmount: 0,
            paymentDate: "2022-04-01",
          },
          {
            discipline: "Block A",
            budgetAmount: 518278.33,
            actualAmount: 0,
            paymentDate: "2022-04-08",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-08",
          },
          {
            discipline: "Block C",
            budgetAmount: 79000.66,
            actualAmount: 0,
            paymentDate: "2022-04-08",
          },
          {
            discipline: "Block A",
            budgetAmount: 470437.26,
            actualAmount: 0,
            paymentDate: "2022-04-15",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-15",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-15",
          },
          {
            discipline: "Block A",
            budgetAmount: 422596.180000001,
            actualAmount: 0,
            paymentDate: "2022-04-22",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-22",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-22",
          },
          {
            discipline: "Block A",
            budgetAmount: 374755.109999999,
            actualAmount: 0,
            paymentDate: "2022-04-29",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-29",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-04-29",
          },
          {
            discipline: "Block A",
            budgetAmount: 326914.02,
            actualAmount: 0,
            paymentDate: "2022-05-06",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-06",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-06",
          },
          {
            discipline: "Block A",
            budgetAmount: 279072.950000001,
            actualAmount: 0,
            paymentDate: "2022-05-13",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-13",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-13",
          },
          {
            discipline: "Block A",
            budgetAmount: 231231.869999999,
            actualAmount: 0,
            paymentDate: "2022-05-20",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-20",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-20",
          },
          {
            discipline: "Block A",
            budgetAmount: 183390.800000001,
            actualAmount: 0,
            paymentDate: "2022-05-27",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-27",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-05-27",
          },
          {
            discipline: "Block A",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-06-03",
          },
          {
            discipline: "Block B",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-06-03",
          },
          {
            discipline: "Block C",
            budgetAmount: 0,
            actualAmount: 0,
            paymentDate: "2022-06-03",
          },
        ];

        const fakeBudget2 = [
          {
            discipline: "Block C",
            budgetAmount: 136276.15,
            actualAmount: 0,
            paymentDate: "2021-10-25",
          },
          {
            discipline: "Block C",
            budgetAmount: 183267.91,
            actualAmount: 0,
            paymentDate: "2021-11-08",
          },
          {
            discipline: "Block C",
            budgetAmount: 230259.693,
            actualAmount: 0,
            paymentDate: "2021-11-22",
          },
          {
            discipline: "Block C",
            budgetAmount: 277251.476,
            actualAmount: 0,
            paymentDate: "2021-12-06",
          },
          {
            discipline: "Block C",
            budgetAmount: 324243.236,
            actualAmount: 0,
            paymentDate: "2021-12-20",
          },
          {
            discipline: "Block C",
            budgetAmount: 371235.019,
            actualAmount: 0,
            paymentDate: "2022-01-03",
          },
          {
            discipline: "Block C",
            budgetAmount: 418226.779,
            actualAmount: 0,
            paymentDate: "2022-01-17",
          },
          {
            discipline: "Block C",
            budgetAmount: 427625.154,
            actualAmount: 0,
            paymentDate: "2022-01-31",
          },
          {
            discipline: "Block C",
            budgetAmount: 542754.9775,
            actualAmount: 0,
            paymentDate: "2022-02-14",
          },
          {
            discipline: "Block C",
            budgetAmount: 105731.4945,
            actualAmount: 0,
            paymentDate: "2022-02-28",
          },
          {
            discipline: "Block C",
            budgetAmount: 218511.753000001,
            actualAmount: 0,
            paymentDate: "2022-03-14",
          },
          {
            discipline: "Block C",
            budgetAmount: 148024.09,
            actualAmount: 0,
            paymentDate: "2022-03-28",
          },
          {
            discipline: "Block B",
            budgetAmount: 139547.578,
            actualAmount: 0,
            paymentDate: "2021-10-25",
          },
          {
            discipline: "Block B",
            budgetAmount: 191231.8555,
            actualAmount: 0,
            paymentDate: "2021-11-08",
          },
          {
            discipline: "Block B",
            budgetAmount: 242916.1445,
            actualAmount: 0,
            paymentDate: "2021-11-22",
          },
          {
            discipline: "Block B",
            budgetAmount: 294600.4335,
            actualAmount: 0,
            paymentDate: "2021-12-06",
          },
          {
            discipline: "Block B",
            budgetAmount: 346284.711,
            actualAmount: 0,
            paymentDate: "2021-12-20",
          },
          {
            discipline: "Block B",
            budgetAmount: 397969,
            actualAmount: 0,
            paymentDate: "2022-01-03",
          },
          {
            discipline: "Block B",
            budgetAmount: 439316.4335,
            actualAmount: 0,
            paymentDate: "2022-01-17",
          },
          {
            discipline: "Block B",
            budgetAmount: 385047.9335,
            actualAmount: 0,
            paymentDate: "2022-01-31",
          },
          {
            discipline: "Block B",
            budgetAmount: 498753.3555,
            actualAmount: 0,
            paymentDate: "2022-02-14",
          },
          {
            discipline: "Block B",
            budgetAmount: 38763.2225000003,
            actualAmount: 0,
            paymentDate: "2022-02-28",
          },
          {
            discipline: "Block B",
            budgetAmount: 152468.6445,
            actualAmount: 0,
            paymentDate: "2022-03-14",
          },
          {
            discipline: "Block A",
            budgetAmount: 385962.77,
            actualAmount: 0,
            paymentDate: "2021-10-25",
          },
          {
            discipline: "Block A",
            budgetAmount: 502921.1855,
            actualAmount: 0,
            paymentDate: "2021-11-08",
          },
          {
            discipline: "Block A",
            budgetAmount: 619879.601,
            actualAmount: 0,
            paymentDate: "2021-11-22",
          },
          {
            discipline: "Block A",
            budgetAmount: 736838.0165,
            actualAmount: 0,
            paymentDate: "2021-12-06",
          },
          {
            discipline: "Block A",
            budgetAmount: 853796.432,
            actualAmount: 0,
            paymentDate: "2021-12-20",
          },
          {
            discipline: "Block A",
            budgetAmount: 970754.8475,
            actualAmount: 0,
            paymentDate: "2022-01-03",
          },
          {
            discipline: "Block A",
            budgetAmount: 1087713.263,
            actualAmount: 0,
            paymentDate: "2022-01-17",
          },
          {
            discipline: "Block A",
            budgetAmount: 1204671.6785,
            actualAmount: 0,
            paymentDate: "2022-01-31",
          },
          {
            discipline: "Block A",
            budgetAmount: 1771920,
            actualAmount: 0,
            paymentDate: "2022-02-14",
          },
          {
            discipline: "Block A",
            budgetAmount: 614031.678499999,
            actualAmount: 0,
            paymentDate: "2022-02-28",
          },
          {
            discipline: "Block A",
            budgetAmount: 941515.246500002,
            actualAmount: 0,
            paymentDate: "2022-03-14",
          },
          {
            discipline: "Block A",
            budgetAmount: 766077.617499999,
            actualAmount: 0,
            paymentDate: "2022-03-28",
          },
          {
            discipline: "Block A",
            budgetAmount: 590639.999999999,
            actualAmount: 0,
            paymentDate: "2022-04-11",
          },
          {
            discipline: "Block A",
            budgetAmount: 415202.371,
            actualAmount: 0,
            paymentDate: "2022-04-22",
          },
        ];
        result5.forEach((el) => {
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });
        fakeBudget.forEach((el) => {
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });

        result[17].forEach((el) => {
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });
        result[18].forEach((el) => {
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });

        // console.log("sql19",result[18])
        // console.log("sql20",result[20])

        disciplineArray.sort();
        disciplineArray = Array.from(new Set(disciplineArray));

        disciplineArray.forEach((el) => {
          let insert = {
            discipline: el,
          };
          result[4].push(insert);
        });

        let dashboardData = [];

        let startDate = dayjs(dates[0]).subtract(7, "day").format("YYYY-MM-DD");

        do {
          let insert = {};
          result[4].forEach((el) => {
            Object.assign(insert, { [el.discipline]: 0 });
          });
          insert.dashboardDate = startDate;
          dashboardData.push(insert);
          startDate = dayjs(startDate).add(7, "day").format("YYYY-MM-DD");
        } while (dayjs(startDate) < dayjs(dates[1]));

        dashboardData.forEach((el) => {
          let afterDate = dayjs(el.dashboardDate)
            .subtract(7, "day")
            .format("YYYY-MM-DD");
          let beforeDate = dayjs(el.dashboardDate).format("YYYY-MM-DD");

          let dataToAffect = result[3].filter((el2) => {
            return (
              new Date(el2.paymentDate) <= new Date(beforeDate) &&
              new Date(el2.paymentDate) > new Date(afterDate)
            );
          });
          if (dataToAffect.length > 0) {
            dataToAffect.forEach((el3) => {
              if (el3.actualAmount !== 0) {
                el[el3.discipline] =
                  el[el3.discipline] + parseFloat(el3.actualAmount);
              } else {
                el[el3.discipline] =
                  el[el3.discipline] + parseFloat(el3.budgetAmount);
              }
            });
          }
        });

        let summaryDisciplines = [
          { discipline: "Loan Agreement Emailed" },
          { discipline: "Loan Agreement Expected" },
          { discipline: "Funds Due" },
          { discipline: "Received In Attorney Trust Acc" },
          { discipline: "Actual Draws Done" },
          { discipline: "Draw (prepopulated - Debbie)" },
          { discipline: "Available Income (Units not funded - Debbie)" },
          { discipline: "Available to Draw" },
          { discipline: "Planned Draws" },
          { discipline: "Pledges Utilized" },
          { discipline: "Nett Available to Draw" },
          { discipline: "Trust / supplementary Interest - Project" },
          {
            discipline: "Trust / supplementary Interest - Project (Cumulative)",
          },
          { discipline: "Transactional Interest" },
          { discipline: "Cumulative Interest Project" },
          { discipline: "Transfer Income" },
          { discipline: "Company Income" },
          { discipline: "Transfer to Loan - Repay Investor" },
          { discipline: "% Company Income to Loan" },
          { discipline: "Unit/s Transferred" },
          { discipline: "Remaining" },
          { discipline: "Actual draws" },
          { discipline: "Expenses still due" },
          { discipline: "Construction Expenses still due" },

          { discipline: "Costs" },
          { discipline: "Income From Sales" },
          { discipline: "VAT Income" },
          { discipline: "VAT Expense" },
          { discipline: "Group Loan Incurred (USED)" },
          { discipline: "Group Loan repay" },
          { discipline: "Anticipated Draws" },
          { discipline: "Company Cashflow Balance" },
          { discipline: "Owing on Group Loan" },
          { discipline: "VAT Expenses" },
          { discipline: "VAT Construction" },
          { discipline: "TRANSFER FEES" },
          { discipline: "Total Claimable VAT" },
          { discipline: "% to Bond" },
          { discipline: "VAT ON Sales" },
          { discipline: "NETT VATT" },
          { discipline: "Repayments" },
          { discipline: "Draws to date" },
          { discipline: "Int Cumulative to date" },
          { discipline: "Bond" },
          { discipline: "Repayment" },
          { discipline: "Current BOND" },
          { discipline: "Trust Interest" },
          { discipline: "Contract Interest" },
          { discipline: "calcbecomeslessthanzero" },
          { discipline: "VAT ON Sales to Process" },
          { discipline: "VAT on Expenses to Process" },
          { discipline: "Total Land Costs Paid" },
          { discipline: "Total Professional Fees & Payments Paid" },
          { discipline: "Total Infrastructure Construction Paid" },
          { discipline: "Total Construction & Building Paid" },
          { discipline: "Total Construction & Building Paid - Janine" },
        ];

        let interestArray = result[8];

        let interestCalcArray = [];

        // let finalDatesArray = []
        // let firstSarttDate = dayjs(dates[0]).subtract(7, 'day')
        // do {

        // }

        console.time("Interest");
        interestArray.forEach((el) => {
          let startingDate = dayjs(el.startingDate).format("YYYY-MM-DD");
          let endingDate = dayjs(el.endingDate).format("YYYY-MM-DD");
          let insert = {};
          do {
            insert.discipline = el.discipline;
            insert.dashboardDate = startingDate;
            insert.amount = el.dailyInterest;
            interestCalcArray.push(insert);
            insert = {};
            startingDate = dayjs(startingDate)
              .add(1, "day")
              .format("YYYY-MM-DD");
          } while (dayjs(startingDate) <= dayjs(endingDate));
        });
        console.log(interestCalcArray.length);
        console.timeEnd("Interest");

        let fakeVAT = JSON.parse(JSON.stringify(fakeBudget));
        let fakeVATINSERT = [];
        fakeVAT.forEach((el) => {
          let month = parseInt(dayjs(el.paymentDate).format("MM"));
          let dashboardDate;
          // console.log(month)
          if (month % 2 === 0) {
            dashboardDate = dayjs(el.paymentDate)
              .endOf("month")
              .add(1, "month")
              .format("YYYY-MM-DD");
          } else {
            dashboardDate = dayjs(el.paymentDate)
              .endOf("month")
              .add(2, "month")
              .format("YYYY-MM-DD");
          }
          // let dashboardDate = dayjs(el.paymentDate).format
          let insert = {
            discipline: "VAT Construction",
            dashboardDate: dashboardDate,
            amount: (el.budgetAmount / 1.15) * 0.15,
          };
          fakeVATINSERT.push(insert);
        });

        fakeVATINSERT.forEach((el) => {
          result[13].push(el);
        });

        // console.log(result[20])
        // console.log(result[21])
        if (result[21].length === 0) {
          let insert = {
            discipline: 'Total Construction & Building Paid - Janine',
            Amount: 0,
            dashboardDate: '2021-09-03'
          }
          result[21].push(insert)
        }


        console.time("Merge 7 & 10");
        result[7] = [
          ...result[7],
          ...result[9],
          ...result[10],
          ...result[11],
          ...result[12],
          ...result[13],
          ...result[14],
          ...result[15],
          ...result[16],
          ...result[20],
          ...result[21],

        ];

        console.timeEnd("Merge 7 & 10");

        console.time("interest Array Calc");

        let resultForSummaryPage = [...interestCalcArray, ...result[7]];

        console.timeEnd("interest Array Calc");

        let summaryPageData = [];
        let startDate2 = dayjs(dates[0])
          .subtract(7, "day")
          .format("YYYY-MM-DD");

        do {
          let insert2 = {};
          summaryDisciplines.forEach((el) => {
            Object.assign(insert2, { [el.discipline]: 0 });
          });
          insert2.dashboardDate = startDate2;
          summaryPageData.push(insert2);
          startDate2 = dayjs(startDate2).add(7, "day").format("YYYY-MM-DD");
        } while (dayjs(startDate2) < dayjs(dates[1]));

        console.time("Populate Data3");

        summaryPageData.forEach((el) => {
          let afterDate = dayjs(el.dashboardDate)
            .subtract(7, "day")
            .format("YYYY-MM-DD");
          let beforeDate = dayjs(el.dashboardDate).format("YYYY-MM-DD");

          // let dataToAffect = result[7].filter((el2) => {
          let dataToAffect = resultForSummaryPage.filter((el2) => {
            return (
              new Date(el2.dashboardDate) <= new Date(beforeDate) &&
              new Date(el2.dashboardDate) > new Date(afterDate)
            );
          });
          if (dataToAffect.length > 0) {
            dataToAffect.forEach((el3) => {
              if (el3.amount !== 0) {
                el[el3.discipline] =
                  el[el3.discipline] + parseFloat(el3.amount);
              }
            });
          }
        });
        console.timeEnd("Populate Data3");

        let finalResult;

        createDashboardXLSX(result[0], dashboardData, summaryPageData);
        console.timeEnd("Start");
        res.json({ fileWritten: true});
      }
    });

    connection.release();
  });
});

let dataToSend;
router.get("/getExcelData", async (req, res) => {
  await createDatafromXlsx().then(() => {
    res.json(dataToSend);
  });
});

const createDatafromXlsx = async () => {
  const wb = xlsx.readFile("public/dashboard.xlsx");
  const ws = wb.Sheets["Summary"];
  const data = xlsx.utils.sheet_to_json(ws, {
    raw: true,
    defval: null,
    cellFormula: true,
  });
  dataToSend = data;
};

const createDashboardXLSX = async (data, data2, data3) => {
  var workbook = new Excel.Workbook();

  var sheet = workbook.addWorksheet("Interest Summary", {
    properties: { tabColor: { argb: "00C1D4" } },
  });
  let columns = [
    { header: "Details", key: "detail", width: 30 },
    { header: "Total", key: "total", width: 30 },
  ];
  data.forEach((el) => {
    let factor = el.unitName;
    let insert = {
      header: factor,
      key: factor,
      width: 20,
    };
    columns.push(insert);
  });

  sheet.columns = columns;

  let unitNames = [];
  data.forEach((el) => [unitNames.push(el.unitName)]);
  let obj = {};
  let obj1 = {};
  let obj2 = {};
  let obj3 = {};
  let obj4 = {};
  let obj5 = {};
  let obj6 = {};
  let obj7 = {};
  let obj8 = {};
  let obj9 = {};
  let obj10 = {};
  let obj11 = {};
  let obj12 = {};
  let obj13 = {};
  let obj14 = {};
  let obj15 = {};
  let obj16 = {};
  let obj17 = {};
  let obj18 = {};
  let obj19 = {};
  let obj20 = {};
  let obj21 = {};
  let obj22 = {};
  let obj23 = {};

  let salesObjects = ["obj", "obj1", "obj8", "obj7", "obj9"];
  // let summary = []

  data.forEach((el, index, arr) => {
    let unitName = el.unitName;

    //   for (const key in user) {

    //     console.log(`${key}: ${user[key]}`);
    // }
    obj[`${unitName}`] = el.contract_price;
    obj1[`${unitName}`] = el.contract_price * 0.7;
    obj8[`${unitName}`] = el.transfer_date;
    obj7[`${unitName}`] = el.investmentAmount;
    obj9[`${unitName}`] = el.investmentAmount * 0.04;

    if (index === arr.length - 1) {
      obj.detail = "Contract Price";
      obj1.detail = "Minimum Investment (70%)";
      obj8.detail = "Transfer Date";
      obj7.detail = "Investment Amount";
      obj9.detail = "Raising Commission (4%)";

      salesObjects.forEach((el2, index) => {
        if (index === 0 || index === 2) {
          sheet.addRow({});
        }
        let summary = [];
        for (const key in eval(el2)) {
          summary.push(`${parseFloat(eval(el2)[key])}`);
        }
        summary = summary.slice(0, summary.length - 1);
        eval(el2).total = summary.reduce((prev, curr) => {
          return parseFloat(curr) + prev;
        }, 0);
        sheet.addRow(eval(el2));
        if (index === 2 || index === 3) {
          sheet.addRow({});
        }
        if (index === 3) {
          sheet.addRow({ detail: "FEES" });
        }
      });
    }

    obj10[`${unitName}`] = el.investmentAmount * 0.03;
    if (index === arr.length - 1) {
      obj10.detail = "Structuring Fee (3%)";
      let summary = [];
      for (const key in obj10) {
        summary.push(`${parseFloat(obj10[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj10.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj10);
    }
    obj11[`${unitName}`] =
      el.investmentAmount * 0.04 + el.investmentAmount * 0.03;
    if (index === arr.length - 1) {
      obj11.detail = "Total Fees";
      let summary = [];
      for (const key in obj11) {
        summary.push(`${parseFloat(obj11[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj11.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj11);
      // sheet.addRow({});
    }
    obj12[`${unitName}`] =
      el.investmentAmount -
      (el.investmentAmount * 0.04 + el.investmentAmount * 0.03);
    if (index === arr.length - 1) {
      obj12.detail = "Available for construction";
      let summary = [];
      for (const key in obj12) {
        summary.push(`${parseFloat(obj12[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj12.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj12);
      sheet.addRow({});
    }

    obj2[`${unitName}`] = el.trustInterest;
    if (index === arr.length - 1) {
      obj2.detail = "Trust Interest";
      let summary = [];
      for (const key in obj2) {
        summary.push(`${parseFloat(obj2[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj2.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj2);
    }

    obj3[`${unitName}`] = el.supplementaryInterest;
    if (index === arr.length - 1) {
      obj3.detail = "Supplementary Interest";
      let summary = [];
      for (const key in obj3) {
        summary.push(`${parseFloat(obj3[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj3.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj3);
    }
    obj4[`${unitName}`] = el.contractInterest;
    if (index === arr.length - 1) {
      obj4.detail = "Contract Interest";
      let summary = [];
      for (const key in obj4) {
        summary.push(`${parseFloat(obj4[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj4.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj4);
      // sheet.addRow({});
    }
    obj5[`${unitName}`] = el.totalInterest;
    if (index === arr.length - 1) {
      obj5.detail = "Total Interest";
      let summary = [];
      for (const key in obj5) {
        summary.push(`${parseFloat(obj5[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj5.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj5);

      sheet.addRow({});
    }

    if (index === arr.length - 1) {
      sheet.addRow({ detail: "SALE DETAILS" });
    }

    obj13[`${unitName}`] = el.contract_price;
    if (index === arr.length - 1) {
      obj13.detail = "Sale Price";
      let summary = [];
      for (const key in obj13) {
        summary.push(`${parseFloat(obj13[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj13.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      // sheet.addRow({});
      sheet.addRow(obj13);
    }
    obj14[`${unitName}`] = (el.contract_price / 1.15) * 0.15;
    if (index === arr.length - 1) {
      obj14.detail = "VAT";
      let summary = [];
      for (const key in obj14) {
        summary.push(`${parseFloat(obj14[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj14.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj14);
      // sheet.addRow({});
    }
    obj15[`${unitName}`] =
      el.contract_price - (el.contract_price / 1.15) * 0.15;
    if (index === arr.length - 1) {
      obj15.detail = "Gross";
      let summary = [];
      for (const key in obj15) {
        summary.push(`${parseFloat(obj15[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj15.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj15);
      // sheet.addRow({});
    }
    obj16[`${unitName}`] =
      (el.contract_price - (el.contract_price / 1.15) * 0.15) * 0.04025;
    if (index === arr.length - 1) {
      obj16.detail = "Commission (4.025%)";
      let summary = [];
      for (const key in obj16) {
        summary.push(`${parseFloat(obj16[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj16.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj16);
      // sheet.addRow({});
    }
    obj17[`${unitName}`] = 16591.33;
    if (index === arr.length - 1) {
      obj17.detail = "Transfer Fees";
      let summary = [];
      for (const key in obj17) {
        summary.push(`${parseFloat(obj17[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj17.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj17);
      // sheet.addRow({});
    }
    obj18[`${unitName}`] = 16851.69;
    if (index === arr.length - 1) {
      obj18.detail = "Bond Registration";
      let summary = [];
      for (const key in obj18) {
        summary.push(`${parseFloat(obj18[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj18.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj18);
      // sheet.addRow({});
    }
    obj19[`${unitName}`] = 1789;
    if (index === arr.length - 1) {
      obj19.detail = "Bond Registration";
      let summary = [];
      for (const key in obj19) {
        summary.push(`${parseFloat(obj19[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj19.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj19);
      // sheet.addRow({});
    }
    obj20[`${unitName}`] = el.contract_price * 0.005;
    if (index === arr.length - 1) {
      obj20.detail = "Unforseen(0.05%)";
      let summary = [];
      for (const key in obj20) {
        summary.push(`${parseFloat(obj20[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj20.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj20);
      // sheet.addRow({});
    }
    obj21[`${unitName}`] =
      el.contract_price -
      (el.contract_price - (el.contract_price / 1.15) * 0.15) * 0.04025 -
      16591.33 -
      16851.69 -
      1789 -
      el.contract_price * 0.005;
    if (index === arr.length - 1) {
      obj21.detail = "Transfer Income";
      let summary = [];
      for (const key in obj21) {
        summary.push(`${parseFloat(obj21[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj21.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj21);
    }
    obj22[`${unitName}`] = el.investmentAmount + el.totalInterest;
    if (index === arr.length - 1) {
      obj22.detail = "Due to Investors";
      let summary = [];
      for (const key in obj22) {
        summary.push(`${parseFloat(obj22[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj22.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj22);
    }
    obj23[`${unitName}`] =
      el.contract_price -
      (el.contract_price - (el.contract_price / 1.15) * 0.15) * 0.04025 -
      16591.33 -
      16851.69 -
      1789 -
      el.contract_price * 0.005 -
      (el.investmentAmount + el.totalInterest);
    if (index === arr.length - 1) {
      obj23.detail = "Surplus / Deficit";
      let summary = [];
      for (const key in obj23) {
        summary.push(`${parseFloat(obj23[key])}`);
      }
      summary = summary.slice(0, summary.length - 1);
      obj23.total = summary.reduce((prev, curr) => {
        return parseFloat(curr) + prev;
      }, 0);
      sheet.addRow(obj23);
    }
  });
  // sheet.getRow(1).font = { size: 13, bold: true };
  let rows = [
    // "2",
    "3",
    "4",
    "8",
    "11",
    "12",
    "13",
    "14",
    "16",
    "17",
    "18",
    "19",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
  ];

  for (i = 0; i < sheet.columns.length; i++) {
    sheet.getCell(`${cols[i]}1`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0" },
    };

    if (parseFloat(sheet.getCell(`${cols[i]}8`).value) < 1000000) {
      sheet.getCell(`${cols[i]}8`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4848" },
      };
    } else if (parseFloat(sheet.getCell(`${cols[i]}8`).value) >= 1000000) {
      sheet.getCell(`${cols[i]}8`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "7FC8A9" },
      };
    }
    if (parseFloat(sheet.getCell(`${cols[i]}32`).value) < 0) {
      sheet.getCell(`${cols[i]}32`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4848" },
      };
    } else if (parseFloat(sheet.getCell(`${cols[i]}8`).value) >= 0) {
      sheet.getCell(`${cols[i]}32`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "7FC8A9" },
      };
    }

    sheet.getCell(`${cols[i]}1`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };
    sheet.getCell(`${cols[i]}1`).font = {
      color: { argb: "FFFFFF" },
      size: 13,
      bold: true,
    };
    sheet.getCell(`${cols[i]}1`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  }
  for (i = 0; i < sheet.columns.length; i++) {
    sheet.getCell(`${cols[i]}6`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`${cols[i]}6`).font = {
      size: 13,
      bold: true,
    };
    sheet.getCell(`${cols[i]}6`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };
  }
  for (i = 0; i < rows.length; i++) {
    for (x = 0; x < sheet.columns.length; x++) {
      sheet.getCell(`${cols[x]}${rows[i]}`).numFmt =
        '"R"#,##0.00;[Black]-"R"#,##0.00';
      sheet.getCell(`${cols[x]}${rows[i]}`).font = {
        size: 13,
        bold: false,
      };
      sheet.getCell(`${cols[x]}${rows[i]}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      if (
        rows[i] === "13" ||
        rows[i] === "19" ||
        rows[i] === "22" ||
        rows[i] === "23" ||
        rows[i] === "24" ||
        rows[i] === "25" ||
        rows[i] === "26" ||
        rows[i] === "27" ||
        rows[i] === "28" ||
        rows[i] === "29" ||
        rows[i] === "30" ||
        rows[i] === "31"
      ) {
        // if (rows[i] === '13') {
        sheet.getCell(`${cols[x]}${rows[i]}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "5089C6" },
        };
        sheet.getCell(`${cols[x]}${rows[i]}`).font = {
          color: { argb: "FFFFFF" },
          size: 13,
          bold: false,
        };
      }
      if (parseFloat(sheet.getCell(`${cols[i]}32`).value) < 0) {
        sheet.getCell(`${cols[i]}32`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4848" },
        };
        sheet.getCell(`${cols[i]}32`).font = {
          color: { argb: "261C2C" },
          size: 13,
        };
      } else if (parseFloat(sheet.getCell(`${cols[i]}32`).value) >= 0) {
        sheet.getCell(`${cols[i]}32`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "7FC8A9" },
        };
      }

      if (rows[i] === "13" || rows[i] === "19") {
        sheet.getCell(`${cols[x]}${rows[i]}`).font = {
          color: { argb: "FFFFFF" },
          size: 13,
          bold: true,
        };
      }
    }
  }
  sheet.getCell("A10").font = {
    size: 13,
    bold: true,
  };
  sheet.getCell("A21").font = {
    size: 13,
    bold: true,
  };

  sheet.views = [
    {
      state: "frozen",
      xSplit: 2,
      ySplit: 1,
      topLeftCell: "G10",
      activeCell: "A1",
    },
  ];
  // const sheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}})
  var sheet2 = workbook.addWorksheet("Trust", {
    properties: { tabColor: { argb: "50CB93" } },
  });
  let dbdates = [];
  data2.forEach((el) => {
    dbdates.push(el.dashboardDate);
  });

  dbdates.sort();
  dbdates = Array.from(new Set(dbdates));
  let columns2 = [
    { header: "Description", key: "description", width: 25 },
    {
      header: "Budget",
      key: "budget",
      width: 25,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' },
    },
    {
      header: "Totals",
      key: "total",
      width: 25,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' },
    },
  ];

  dbdates.forEach((el) => {
    let insert = {
      header: el,
      key: el,
      width: 18,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' },
    };
    columns2.push(insert);
  });

  sheet2.columns = columns2;

  let dashDates = [];
  data2.forEach((el) => [dashDates.push(el.dashboardDate)]);

  let object1 = {};
  let object2 = {};
  let object3 = {};
  let object4 = {};
  let object5 = {};
  let object6 = {};
  let object7 = {};
  let object8 = {};
  let object9 = {};
  let object10 = {};
  let object11 = {};
  let object12 = {};
  let object13 = {};
  let object14 = {};
  let object15 = {};
  let object16 = {};
  let object17 = {};
  let object18 = {};
  let object19 = {};
  let object20 = {};
  let object21 = {};
  let object22 = {};
  let object23 = {};
  let object24 = {};
  let object25 = {};
  let object26 = {};
  let object27 = {};
  let object28 = {};
  let object29 = {};
  let object30 = {};
  let object31 = {};
  let object32 = {};
  let object33 = {};
  let object34 = {};
  let object35 = {};
  let object36 = {};
  let object37 = {};
  let object38 = {};
  let object39 = {};
  let object40 = {};
  let object41 = {};
  let object42 = {};
  let object43 = {};
  let object44 = {};
  let object45 = {};
  let object46 = {};
  let object47 = {};
  let object48 = {};
  let object49 = {};
  let object50 = {};
  let object51 = {};
  let object52 = {};
  let object56 = {};
  let object57 = {};
  let object58 = {};
  let object59 = {};
  let object60 = {};
  let object61 = {};
  let object62 = {};
  let object75 = {};

  let objects = [
    "object1",
    "object2",
    "object3",
    "object4",
    "object45",
    "object5",
    "object6",
    "object7",
    "object8",
    "object9",
    "object10",
    "object11",
    "object12",
    "object13",
    "object14",
    "object15",
    "object16",
    "object17",
    "object18",
    "object19",
    "object20",
    "object21",
    "object22",
    "object23",
    "object24",
    "object25",
    "object46",
    "object26",
    "object27",
    "object28",
    "object29",
    "object30",
    "object31",
    "object32",
    "object33",
    "object34",
    "object35",
    "object36",
    "object37",
    "object47",
    "object52",
    "object50",
    "object49",
    "object38",
    "object39",
    "object40",
    "object44",
    "object41",
    "object42",
    "object43",
    "object51",
    "object56",
    "object57",
    "object58",
    "object59",
    "object75",
    "object60",
    "object61",
    "object62",
    "object48",
  ];

  let constructionTotals = [];

  data2.forEach((el, index, arr) => {
    let dashboardDate = el.dashboardDate;

    object1[`${dashboardDate}`] = el["Land Cost"];
    object2[`${dashboardDate}`] = el["Transfer Duties"];
    object3[`${dashboardDate}`] = el["Security Bond Registration"];
    object4[`${dashboardDate}`] = el["Rates & Taxes Admin Prov"];
    object45[`${dashboardDate}`] =
      el["Rates & Taxes Admin Prov"] +
      el["Security Bond Registration"] +
      el["Transfer Duties"] +
      el["Land Cost"];
    object5[`${dashboardDate}`] = el["Architect"];
    object6[`${dashboardDate}`] = el["Town Planner"];
    object7[`${dashboardDate}`] = el["TIA"];
    object8[`${dashboardDate}`] = el["Development Manager"];
    object9[`${dashboardDate}`] = el["Civil Engineer"];
    object10[`${dashboardDate}`] = el["Electrical Engineer"];
    object11[`${dashboardDate}`] = el["Land Surveyor"];
    object12[`${dashboardDate}`] = el["Raising Fee"];
    object13[`${dashboardDate}`] = el["Structuring Fee"];
    object14[`${dashboardDate}`] = el["Health & Safety"];
    object15[`${dashboardDate}`] = el["ECO"];
    object16[`${dashboardDate}`] = el["Plan Approval Fees"];
    object17[`${dashboardDate}`] = el["SDP Approval Fees"];
    object18[`${dashboardDate}`] = el["NHBRC"];
    object19[`${dashboardDate}`] = el["Structural Engineer"];
    object20[`${dashboardDate}`] = el["Mechanical Engineer"];
    object21[`${dashboardDate}`] = el["Geotechnical"];
    object22[`${dashboardDate}`] = el["Qs"];
    object23[`${dashboardDate}`] = el["Fire Engineer"];
    object24[`${dashboardDate}`] = el["Marketing"];
    object25[`${dashboardDate}`] = el["Other "];
    object46[`${dashboardDate}`] =
      el["Other "] +
      el["Marketing"] +
      el["Fire Engineer"] +
      el["Qs"] +
      el["Geotechnical"] +
      el["Mechanical Engineer"] +
      el["Structural Engineer"] +
      el["NHBRC"] +
      el["SDP Approval Fees"] +
      el["Plan Approval Fees"] +
      el["ECO"] +
      el["Health & Safety"] +
      el["Structuring Fee"] +
      el["Raising Fee"] +
      el["Land Surveyor"] +
      el["Electrical Engineer"] +
      el["Civil Engineer"] +
      el["Development Manager"] +
      el["TIA"] +
      el["Town Planner"] +
      el["Architect"];
    object26[`${dashboardDate}`] = el["Bulk Levies"];
    object27[`${dashboardDate}`] = el["Civils"];
    object28[`${dashboardDate}`] = el["Electrical"];
    object29[`${dashboardDate}`] = el["Demolision"];
    object30[`${dashboardDate}`] = el["Water Connection"];
    object31[`${dashboardDate}`] = el["CPC_Site Establishment"];
    object32[`${dashboardDate}`] = el["Security"];
    object33[`${dashboardDate}`] = el["Sewerage Connection_GLC"];
    object34[`${dashboardDate}`] = el["COCT (Shared Network Charge)"];
    object35[`${dashboardDate}`] = el["COCT (Connection fee/Meter)"];
    object36[`${dashboardDate}`] = el["COCT (Security Deposit)"];
    object37[`${dashboardDate}`] = el["Landscaping"];
    object47[`${dashboardDate}`] =
      el["Landscaping"] +
      el["COCT (Security Deposit)"] +
      el["COCT (Connection fee/Meter)"] +
      el["COCT (Shared Network Charge)"] +
      el["Sewerage Connection_GLC"] +
      el["Security"] +
      el["CPC_Site Establishment"] +
      el["Water Connection"] +
      el["Demolision"] +
      el["Electrical"] +
      el["Civils"] +
      el["Bulk Levies"];
    object52[`${dashboardDate}`] = el["Block A"];
    object50[`${dashboardDate}`] = el["Block B"];
    object49[`${dashboardDate}`] = el["Block C"];
    object38[`${dashboardDate}`] = el["Block D"];
    object39[`${dashboardDate}`] = el["Block E"];
    // object40[`${dashboardDate}`] = 0;
    object40[`${dashboardDate}`] = el["Block F"];
    // console.log("ZZXXZZ",el["Block F"])
    object44[`${dashboardDate}`] = el["CPC P&G"];
    object41[`${dashboardDate}`] = el["Refuse Room"];
    object42[`${dashboardDate}`] = el["Guard House"];
    object43[`${dashboardDate}`] = el["Boundary Walls_DP2"];
    object51[`${dashboardDate}`] = el["Substation Slab"];
    object56[`${dashboardDate}`] = el["External Works"];
    object57[`${dashboardDate}`] = el["Site Security"];
    object58[`${dashboardDate}`] = el["Boundary Wall"];
    object59[`${dashboardDate}`] = el["Play Equipment"];
    object75[`${dashboardDate}`] = el["Landscaping Site"];
    // object75[`${dashboardDate}`] = el["Waterheating Area"];
    object60[`${dashboardDate}`] = el["Escalations"];
    object61[`${dashboardDate}`] = el["Contingencies"];
    object62[`${dashboardDate}`] = el["Overs / Unders"];
    object48[`${dashboardDate}`] =
      el["Boundary Walls_DP2"] +
      el["Guard House"] +
      el["Refuse Room"] +
      el["CPC P&G"] +
      el["Block F"] +
      el["Block E"] +
      el["Block D"] +
      el["Substation Slab"] +
      el["External Works"] +
      el["Site Security"] +
      el["Boundary Wall"] +
      el["Play Equipment"] +
      el["Block A"] +
      el["Block B"] +
      el["Block C"] +
      el["Escalations"] +
      el["Contingencies"] +
      el["Overs / Unders"] +
      el["Landscaping Site"];
    // el["Block C"] + el["Escalations"] + el["Contingencies"] + el["Overs / Unders"] + el["Waterheating Area"];

    if (index === arr.length - 1) {
      object1.description = "Land Cost";
      object2.description = "Transfer Duties";
      object3.description = "Security Bond Registration";
      object4.description = "Rates & Taxes Admin Prov";
      object45.description = "Total Land Costs";
      object5.description = "Architect";
      object6.description = "Town Planner";
      object7.description = "TIA";
      object8.description = "Development Manager";
      object9.description = "Civil Engineer";
      object10.description = "Electrical Engineer";
      object11.description = "Land Surveyor";
      object12.description = "Raising Fee";
      object13.description = "Structuring Fee";
      object14.description = "Health & Safety";
      object15.description = "ECO";
      object16.description = "Plan Approval Fees";
      object17.description = "SDP Approval Fees";
      object18.description = "NHBRC";
      object19.description = "Structural Engineer";
      object20.description = "Mechanical Engineer";
      object21.description = "Geotechnical";
      object22.description = "Qs";
      object23.description = "Fire Engineer";
      object24.description = "Marketing";
      object25.description = "Other ";
      object46.description = "Total Professional Fees & Payments";
      object26.description = "Bulk Levies";
      object27.description = "Civils";
      object28.description = "Electrical";
      object29.description = "Demolition";
      object30.description = "Water Connection";
      object31.description = "CPC_Site Establishment";
      object32.description = "Security";
      object33.description = "Sewerage Connection_GLC";
      object34.description = "COCT (Shared Network Charge)";
      object35.description = "COCT (Connection fee/Meter)";
      object36.description = "COCT (Security Deposit)";
      object37.description = "Landscaping";
      object47.description = "Total Infrastructure Construction";
      object52.description = "Block A";
      object50.description = "Block B";
      object49.description = "Block C";
      object38.description = "Block D";
      object39.description = "Block E";
      object40.description = "Block F";
      object44.description = "CPC P&G";
      object41.description = "Refuse Room";
      object42.description = "Guard House";
      object43.description = "Boundary Walls_DP2";
      object51.description = "Substation Slab";
      object56.description = "External Works";
      object57.description = "Security";
      object58.description = "Boundary Wall";
      object59.description = "Play Equipment";
      object75.description = "Landscaping";
      object60.description = "Escalations";
      object61.description = "Contingencies";
      object62.description = "Overs / Unders";
      object48.description = "Total Construction & Building";
      // console.log("object40",object40)

      sheet2.addRow({});
      objects.forEach((el, index) => {
        if (index === 5 || index === 27 || index === 40) {
          sheet2.addRow({});
          sheet2.addRow({});
          sheet2.addRow({});
        }
        let summary = [];
        for (const key in eval(el)) {
          summary.push(`${parseFloat(eval(el)[key])}`);
        }
        summary = summary.slice(0, summary.length - 1);
        eval(el).total = summary.reduce((prev, curr) => {
          return parseFloat(curr) + prev;
        }, 0);
        sheet2.addRow(eval(el));
      });
    }
  });

  constructionTotals.push(object45);
  constructionTotals.push(object46);
  constructionTotals.push(object47);
  constructionTotals.push(object48);
  // console.log(constructionTotals);
  // console.log(constructionTotals.length);

  sheet2.views = [
    {
      state: "frozen",
      xSplit: 3,
      ySplit: 1,
      topLeftCell: "G10",
      activeCell: "A1",
    },
  ];

  for (x = 0; x < sheet2.columns.length; x++) {
    // console.log(`${sheet3.columns[x]}30`)
    // console.log(cols[x])
    // sheet2.getCell(`${cols[x]}30`).numFmt = "0.00%";
    // sheet2.getCell(`${cols[x]}31`).numFmt = "0";
    // sheet2.getCell(`${cols[x]}32`).numFmt = "0";
    // sheet2.getCell(`${cols[x]}54`).numFmt = "0.00%";
    sheet2.getCell(`${cols[x]}1`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "7FC8A9" },
    };
    // if (x >= 3 && x <= 80) {
    //   sheet2.getColumn(`${cols[x]}`).hidden = true;
    // }
  }

  var sheet3 = workbook.addWorksheet("Summary", {
    properties: { tabColor: { argb: "F43B86" } },
  });
  // let dbdates = [];
  // data2.forEach((el) => {
  //   dbdates.push(el.dashboardDate);
  // });

  // dbdates.sort();
  // dbdates = Array.from(new Set(dbdates));
  let columns3 = [
    {
      header: "Description",
      key: "description",
      width: 45,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00', font: { size: 12 } },
    },
    {
      header: "Budget",
      key: "budget",
      width: 25,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00', font: { size: 12 } },
    },
    {
      header: "Totals",
      key: "total",
      width: 25,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00', font: { size: 12 } },
    },
  ];

  dbdates.forEach((el) => {
    let insert = {
      header: el,
      key: el,
      width: 18,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00', font: { size: 12 } },
    };
    columns3.push(insert);
  });

  sheet3.columns = columns3;

  const mergeTotals = (data) => {
    const result = {}; //(1)

    data.forEach((basket) => {
      //(2)
      for (let [key, value] of Object.entries(basket)) {
        //(3)
        if (result[key]) {
          //(4)
          result[key] += value; //(5)
        } else {
          //(6)
          result[key] = value;
        }
      }
    });
    return result; //(7)
  };

  const totalTotals = mergeTotals(constructionTotals);

  console.log("totalTotals", totalTotals);

  totalTotals.description = "Total Costs - Trust";

  sheet3.addRow({});
  constructionTotals.forEach((el, index, arr) => {
    sheet3.addRow(el);
    if (index === arr.length - 1) {
      sheet3.addRow(totalTotals);
    }
  });

  let summaryObject1 = {};
  let summaryObject2 = {};
  let summaryObject3 = {};
  let summaryObject4 = {};
  let summaryObject5 = {};
  let summaryObject6 = {};
  let summaryObject7 = {};
  let summaryObject8 = {};
  let summaryObject9 = {};
  let summaryObject10 = {};
  let summaryObject11 = {};
  let summaryObject12 = {};
  let summaryObject13 = {};
  let summaryObject14 = {};
  let summaryObject15 = {};
  let summaryObject16 = {};
  let summaryObject17 = {};
  let summaryObject18 = {};
  let summaryObject19 = {};
  let summaryObject20 = {};
  let summaryObject21 = {};
  let summaryObject22 = {};
  let summaryObject23 = {};
  let summaryObject24 = {};
  let summaryObject25 = {};
  let summaryObject26 = {};
  let summaryObject27 = {};
  let summaryObject28 = {};
  let summaryObject29 = {};
  let summaryObject30 = {};
  let summaryObject31 = {};
  let summaryObject32 = {};
  let summaryObject33 = {};
  let summaryObject34 = {};
  let summaryObject35 = {};
  let summaryObject36 = {};
  let summaryObject37 = {};
  let summaryObject38 = {};
  let summaryObject39 = {};
  let summaryObject40 = {};
  let summaryObject50 = {};
  let summaryObject51 = {};
  let summaryObject52 = {};
  let summaryObject100 = {};
  let summaryObject101 = {};
  let summaryObject102 = {};
  let summaryObject103 = {};
  let summaryObject110 = {};
  let summaryObject111 = {};
  let summaryObject112 = {};
  let summaryObject113 = {};
  let summaryObject114 = object52;
  let summaryObject115 = object50;
  let summaryObject116 = object49;
  let summaryObject117 = {};
  let summaryObject118 = {};
  let summaryObject119 = {};
  let summaryObject120 = {};
  let summaryObject121 = {};

  // console.log("summaryObject114",summaryObject114)

  // object52.description = "Block A";
  //     object50.description = "Block B";
  //     object49.description = "Block C";

  let summaryObjects = [
    "summaryObject1",
    "summaryObject2",
    "summaryObject3",
    "summaryObject4",
    "summaryObject100",
    "summaryObject52",
    "summaryObject101",

    "summaryObject5",
    "summaryObject50",
    "summaryObject102",
    "summaryObject103",

    // "summaryObject51",
    "summaryObject6",
    "summaryObject7",
    "summaryObject8",
    "summaryObject9",
    "summaryObject10",
    "summaryObject11",
    "summaryObject12",
    "summaryObject13",
    "summaryObject14",
    "summaryObject15",
    "summaryObject16",
    // "summaryObject17",
    "summaryObject18",
    "summaryObject19",
    "summaryObject20",
    "summaryObject21",
    "summaryObject22",
    "summaryObject23",
    "summaryObject24",
    // "summaryObject25",
    // "summaryObject26",
    "summaryObject27",
    "summaryObject28",
    "summaryObject29",
    "summaryObject30",
    "summaryObject31",
    "summaryObject32",
    "summaryObject33",
    "summaryObject34",
    "summaryObject35",
    "summaryObject36",
    "summaryObject37",
    "summaryObject38",
    "summaryObject39",
    "summaryObject110",
    "summaryObject111",
    "summaryObject112",
    "summaryObject113",
    "summaryObject114",
    "summaryObject115",
    "summaryObject116",
    "summaryObject117",
    "summaryObject118",
    "summaryObject119",
    "summaryObject120",
    "summaryObject121",
  ];

  // console.log("totalTotals",totalTotals)
  // calcbecomeslessthanzero
  data3.forEach((el, index, arr) => {
    let dashboardDate = el.dashboardDate;
    if (index > 0) {
      let newestDate = arr[index - 1].dashboardDate;
      if (
        totalTotals[`${newestDate}`] -
          arr[index - 1]["Transfer Income"] +
          arr[index - 1]["Transfer to Loan - Repay Investor"] -
          arr[index - 1]["VAT Expenses"] -
          arr[index - 1]["VAT Construction"] -
          arr[index - 1]["TRANSFER FEES"] +
          arr[index - 1]["VAT ON Sales"] <
        0
      ) {
        el["calcbecomeslessthanzero"] =
          totalTotals[`${newestDate}`] -
          arr[index - 1]["Transfer Income"] +
          arr[index - 1]["Transfer to Loan - Repay Investor"] -
          arr[index - 1]["VAT Expenses"] -
          arr[index - 1]["VAT Construction"] -
          arr[index - 1]["TRANSFER FEES"] +
          arr[index - 1]["VAT ON Sales"] +
          arr[index - 1][["calcbecomeslessthanzero"]];
      }
    }
  });

  data3.forEach((el, index, arr) => {
    let dashboardDate = el.dashboardDate;

    summaryObject1[`${dashboardDate}`] = el["Loan Agreement Emailed"];
    summaryObject2[`${dashboardDate}`] = el["Loan Agreement Expected"];
    summaryObject3[`${dashboardDate}`] =
      el["Loan Agreement Emailed"] + el["Loan Agreement Expected"];
    summaryObject4[`${dashboardDate}`] = el["Received In Attorney Trust Acc"];
    summaryObject100[`${dashboardDate}`] = el["Pledges Utilized"];
    summaryObject52[`${dashboardDate}`] =
      el["Available Income (Units not funded - Debbie)"];
    summaryObject5[`${dashboardDate}`] = el["Actual Draws Done"];

    summaryObject50[`${dashboardDate}`] = el["Draw (prepopulated - Debbie)"];

    summaryObject101[`${dashboardDate}`] = 0;

    summaryObject102[`${dashboardDate}`] = 0;
    summaryObject103[`${dashboardDate}`] = 0;
    // summaryObject51[`${dashboardDate}`] = 0;
    summaryObject6[`${dashboardDate}`] = 0;
    summaryObject7[`${dashboardDate}`] = 0;
    summaryObject8[`${dashboardDate}`] = 0;
    summaryObject9[`${dashboardDate}`] = el["Trust Interest"];
    summaryObject10[`${dashboardDate}`] = el["Contract Interest"];
    summaryObject11[`${dashboardDate}`] = el["Transfer Income"];
    summaryObject12[`${dashboardDate}`] =
      el["Transfer to Loan - Repay Investor"];
    summaryObject13[`${dashboardDate}`] = 0;
    summaryObject14[`${dashboardDate}`] = el["% Company Income to Loan"];
    summaryObject15[`${dashboardDate}`] = el["Unit/s Transferred"];
    summaryObject16[`${dashboardDate}`] = 0;
    // summaryObject17[`${dashboardDate}`] = el["Actual draws"];
    summaryObject18[`${dashboardDate}`] = 0;
    summaryObject19[`${dashboardDate}`] = 0;
    summaryObject20[`${dashboardDate}`] = 0;
    summaryObject21[`${dashboardDate}`] = 0;
    summaryObject22[`${dashboardDate}`] = 0;
    summaryObject23[`${dashboardDate}`] = 0;
    // summaryObject24[`${dashboardDate}`] = 0;
    // summaryObject25[`${dashboardDate}`] = 0;
    // summaryObject26[`${dashboardDate}`] = 0;
    summaryObject27[`${dashboardDate}`] = el["VAT Expenses"];
    summaryObject28[`${dashboardDate}`] = el["VAT Construction"];
    summaryObject29[`${dashboardDate}`] = el["TRANSFER FEES"];
    summaryObject30[`${dashboardDate}`] = 0;
    summaryObject31[`${dashboardDate}`] = el["% to Bond"];
    summaryObject32[`${dashboardDate}`] = el["VAT ON Sales"];
    summaryObject33[`${dashboardDate}`] = 0;
    summaryObject34[`${dashboardDate}`] = 0;
    summaryObject35[`${dashboardDate}`] = 0;
    summaryObject36[`${dashboardDate}`] = 0;
    summaryObject37[`${dashboardDate}`] = 0;
    summaryObject38[`${dashboardDate}`] = 0;
    summaryObject39[`${dashboardDate}`] = 0;
    summaryObject110[`${dashboardDate}`] = el["Expenses still due"];
    summaryObject111[`${dashboardDate}`] =
      el["Construction Expenses still due"];
    summaryObject112[`${dashboardDate}`] = el["VAT ON Sales to Process"];
    summaryObject113[`${dashboardDate}`] = el["VAT on Expenses to Process"];
    summaryObject117[`${dashboardDate}`] = el["Total Land Costs Paid"];
    summaryObject118[`${dashboardDate}`] = el["Total Professional Fees & Payments Paid"];
    summaryObject119[`${dashboardDate}`] = el["Total Infrastructure Construction Paid"];
    summaryObject120[`${dashboardDate}`] = el["Total Construction & Building Paid"];
    summaryObject121[`${dashboardDate}`] = el["Total Construction & Building Paid - Janine"];

 


    if (index === arr.length - 1) {
      summaryObject1.description = "Loan Agreement Emailed Not signed";
      summaryObject2.description = "Loan Agreement Signed - Not deposited";
      summaryObject3.description = "Funds Due";
      summaryObject4.description = "Received In Attorney Trust Acc";
      summaryObject100.description = "Pledges Due being utilised for Cash Flow";

      summaryObject52.description =
        "Available Income (Units not funded - Debbie Input)";
      summaryObject101.description =
        "Available Income (Units not funded - Model Input)";

      summaryObject5.description = "Actual Draws Done";
      summaryObject50.description = "Draw (prepopulated - Debbie)";
      summaryObject102.description = "Draw to be done after funding";
      summaryObject103.description =
        "Draw to be done after funding - Model Input";

      // summaryObject51.description = "Raising Capital Required";
      summaryObject6.description =
        "Received In Attorney Trust Acc - Cumulative";
      summaryObject7.description =
        "Released From Attornet T/Acc (Draws) - Cumulative";
      summaryObject8.description = "Available To Draw";
      summaryObject9.description = "Trust Interest";
      summaryObject10.description = "Contract Interest";
      summaryObject11.description = "Transfer Income";
      summaryObject12.description = "Transfer to Loan - Repay Investor";
      summaryObject13.description = "Company Income";
      summaryObject14.description = "% Company Income allcated elsewhere";
      summaryObject15.description = "Unit/s Transferred";
      summaryObject16.description = "Remaining";
      summaryObject18.description = "Expenses";
      summaryObject19.description = "Company Income utilized  from Sales";
      summaryObject20.description = "VAT Income";
      summaryObject21.description = "VAT Expense";
      summaryObject22.description = "Group Loan Incurred (USED)";
      summaryObject23.description = "Group Loan repay";
      // summaryObject24.description = "" + summaryObjects.indexOf("summaryObject24");
      // summaryObject25.description = "Company Cashflow Balance";
      // summaryObject26.description = "Owing on Group Loan";
      summaryObject27.description = "VAT Expenses";
      summaryObject28.description = "VAT Construction";
      summaryObject29.description = "TRANSFER FEES";
      summaryObject30.description = "Total Claimable VAT";
      summaryObject31.description = "% to VAT not allocated to costs";
      summaryObject32.description = "VAT ON Sales";
      summaryObject33.description = "NETT VATT";
      summaryObject34.description = "Repayments";
      summaryObject35.description = "Draws to date (Incl. Int & Repayments)";
      summaryObject36.description = "Int Cumulative";
      summaryObject37.description = "Bond";
      summaryObject38.description = "Repayment";
      summaryObject39.description = "Current Bond";
      summaryObject110.description = "Expenses still due";
      summaryObject111.description = "Construction Expenses still due";
      summaryObject112.description = "VAT ON Sales to Process";
      summaryObject113.description = "VAT on Expenses to Process";
      // summaryObject114.description = "Block A";
      // summaryObject115.description = "Block B";
      // summaryObject116.description = "Block C";
      summaryObject117.description = "Total Land Costs Paid";
      summaryObject118.description = "Total Professional Fees & Payments Paid";
      summaryObject119.description = "Total Infrastructure Construction Paid";
      summaryObject120.description = "Total Construction & Building Paid";
      summaryObject121.description = "Total Construction & Building Paid (PO & PC)";


         // { discipline: "Total Land Costs Paid" },
    //       { discipline: "Total Professional Fees & Payments Paid" },
    //       { discipline: "Total Infrastructure Construction Paid" },
    //       { discipline: "Total Construction & Building Paid" },

      sheet3.addRow({});
      sheet3.addRow({ description: "LOAN DETAILS" });
      sheet3.addRow({ description: "Pledges" });
      // sheet3.addRow({description: "Loan"});

      summaryObjects.forEach((el, index) => {
        console.log("summaryObject", index, el)
        if (
          index === 0 ||
          index === 7 ||
          index === 11 ||
          // index === 7 ||
          index === 14 ||
          index === 16 ||
          index === 19 ||
          index === 20 ||
          index === 22 ||
          index === 36
          // ||
          // index === 41
          // ||
          // index === 19 ||
          // index === 31 ||
          // index === 33 ||
          // index === 34 ||
          // index === 35 ||
          // index === 36
        ) {
          sheet3.addRow({});
          // sheet3.addRow({});
          // sheet3.addRow({});
        }
        if (index === 42) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
        }
        // if (index === 42) {
        //   sheet3.addRow({});
        //   sheet3.addRow({});
        //   sheet3.addRow({});

        let summary = [];
        for (const key in eval(el)) {
          summary.push(`${parseFloat(eval(el)[key])}`);
        }
        summary = summary.slice(0, summary.length - 1);
        eval(el).total = summary.reduce((prev, curr) => {
          return parseFloat(curr) + prev;
        }, 0);
        sheet3.addRow(eval(el));
        if (index === 2) {
          sheet3.addRow({});
          sheet3.addRow({ description: "Loan" });
        }
        if (index === 21) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "PROJECT CASHFLOW" });
        }
        if (index === 27) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "VAT CALC" });
        }
        if (index === 36) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "BOND" });
        }
        if (index === 48) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "Paid to Date - Amina" });
        }
      });
    }
  });

  sheet3.views = [
    {
      state: "frozen",
      xSplit: 3,
      ySplit: 1,
      topLeftCell: "G10",
      activeCell: "A1",
    },
  ];

  // console.log("C3", sheet3.getCell("C3").value);
  console.log("Columns", sheet3.columns.length);
  console.log("Last Column", cols[sheet3.columns.length - 1]);

  sheet3.getCell("C3").value = {
    formula: "+C99",
    result: 0,
  };
  sheet3.getCell("C4").value = {
    formula: "+C100",
    result: 0,
  };
  sheet3.getCell("C5").value = {
    formula: "+C101",
    result: 0,
  };
  sheet3.getCell("C6").value = {
    formula: "+C102+C103",
    result: 0,
  };
  sheet3.getCell("C7").value = {
    formula: "+C3+C4+C5+C6",
    result: 0,
  };

  sheet3.getCell("D14").value = {
    formula: "+D13+D12-D18",
    result: 0,
  };
  sheet3.fillFormula(
    `E14:${cols[sheet3.columns.length - 1]}14`,
    "+E13+E12-E18+D14"
  );

  sheet3.fillFormula(`D23:CR23`, "0");

  // console.log(sheet3.columns.name)

  sheet3.fillFormula(`C27:D27`, "+C17+C18+C19+C20");
  sheet3.fillFormula(
    `E27:${cols[sheet3.columns.length - 1]}27`,
    "+E17+E18+E19+E20+D27"
  );
  sheet3.fillFormula(`C28:D28`, "+C22+C23+C24+C25");
  sheet3.fillFormula(
    `E28:${cols[sheet3.columns.length - 1]}28`,
    "+E22+E23+E24+E25+D28"
  );
  sheet3.fillFormula(`C29:${cols[sheet3.columns.length - 1]}29`, "+C27-C28");
  sheet3.fillFormula(`C36:${cols[sheet3.columns.length - 1]}36`, "+C34-C35");

  sheet3.getCell("D41").value = {
    formula: "$C$40",
    result: sheet3.getCell("C40").value,
  };
  sheet3.fillFormula(`E41:${cols[sheet3.columns.length - 1]}41`, "+D41-E40");
  sheet3.getCell("C42").value = {
    formula: `=sum(D42:${cols[sheet3.columns.length - 1]}42)`,
    result: 0,
  };

  sheet3.fillFormula(
    `D42:${cols[sheet3.columns.length - 1]}42`,
    "=+D36*D38*D39"
  );
  sheet3.getCell("C43").value = {
    formula: `=sum(D43:${cols[sheet3.columns.length - 1]}43)`,
    result: 0,
  };

  sheet3.fillFormula(
    `D43:${cols[sheet3.columns.length - 1]}43`,
    "=+D36*D38*D39+(D59*D60)"
  );
  // sheet3.fillFormula(
  //   `D43:${cols[sheet3.columns.length - 1]}43`,
  //   "=(D36-D47-D42)+D59-D48"
  // );

  // sheet3.fillFormula(
  //   `CS46:D46`,
  //   "=IF(+D76+D6-D22-D23-D24-D25<0,+D23+D24+D25,+D76+D6-D22-D23-D24-D25)"
  // );


  // sheet3.fillFormula(`D46:CR46`, "0");

  // sheet3.fillFormula(
  //   `CS46:${cols[sheet3.columns.length - 1]}46`,
  //   "=CS76+CS77+CS80+CS81+CS82+CR53"
  // );


  sheet3.fillFormula(
    `D46:${cols[sheet3.columns.length - 1]}46`,
    // "=IF(+CS76+CS76-CS22-CS23-CS24-CS25<0,+CS23+CS24+CS25,+CS76+CS6-CS22-CS23-CS24-CS25)+CR53"
    "=CS76+CS77+CS80+CS81+CS82+CR53"
    // "=CS76+CS77+CR53"
  );
  sheet3.fillFormula(`D47:CR47`, "0");

  sheet3.fillFormula(
    `CS47:${cols[sheet3.columns.length - 1]}47`,
    "=+CS36*(1-CS38)"
  );
  sheet3.fillFormula(`D48:CR48`, "0");

  sheet3.fillFormula(
    `CS48:${cols[sheet3.columns.length - 1]}48`,
    "=+CS59*(1-CS60)"
  );
  // sheet3.fillFormula(`D49:CR49`, "0");

  // sheet3.fillFormula(`CS49:${cols[sheet3.columns.length - 1]}49`, "=+CS78");
  sheet3.fillFormula(`D49:${cols[sheet3.columns.length - 1]}49`, "=+D78");

  sheet3.fillFormula(
    `D52:${cols[sheet3.columns.length - 1]}52`,
    "=IF(+D46-D47-D48+D49+D50+D51-D22-D23-D24-D25<0,0,+D46-D47-D48+D49+D50+D51-D22-D23-D24-D25)"
  );
  sheet3.fillFormula(
    `D53:${cols[sheet3.columns.length - 1]}53`,
    "=IF(D46-D47-D48+D49-D50+D51<0,D46-D47-D48+D49-D50+D51,0)"
  );

  sheet3.fillFormula(
    `C59:${cols[sheet3.columns.length - 1]}59`,
    "=IF(C79<>0,C56+C57+C58,+C79)"
    // "=C56+C57+C58"
  );
  // =IF(C79=C56+C57+C58,C56+C57+C58,+C79)
  sheet3.fillFormula(`C62:${cols[sheet3.columns.length - 1]}62`, "=+C59-C61");
  sheet3.fillFormula(`D64:CR64`, "0");

  sheet3.fillFormula(
    `CS64:${cols[sheet3.columns.length - 1]}64`,
    "=+CS35+(+CS42+CS59-CS48)"
  );
  // sheet3.fillFormula(
  //   `D64:${cols[sheet3.columns.length - 1]}64`,
  //   "=+D35+(+D42+D59-D48)"
  // );

  sheet3.fillFormula(`D68:D68`, "=+D22+D23+D24+D25");
  sheet3.fillFormula(
    `E68:${cols[sheet3.columns.length - 1]}68`,
    "=+E22+E23+E24+E25+D72"
  );
  // sheet3.fillFormula(`D69:D69`, "+D31+D32");
  sheet3.fillFormula(`D69:${cols[sheet3.columns.length - 1]}69`, "=+D31+D32");
  sheet3.fillFormula(`D70:${cols[sheet3.columns.length - 1]}70`, "+D68+D69");
  sheet3.fillFormula(`D71:${cols[sheet3.columns.length - 1]}71`, "=+D64");
  // sheet3.fillFormula(`E71:${cols[sheet3.columns.length - 1]}71`, "=+E64+D71");
  sheet3.fillFormula(`D72:${cols[sheet3.columns.length - 1]}72`, "=+D70-D71");
  // sheet3.fillFormula(`D80:${cols[sheet3.columns.length - 1]}80`, "=+Trust!D52+Trust!D53+Trust!D54");
  // console.log(sheet2);

  sheet3.getCell("B3").value = {
    formula: `=sum(D3:${cols[sheet3.columns.length - 1]}3)`,
    result: 0,
  };
  sheet3.getCell("B4").value = {
    formula: `=sum(D4:${cols[sheet3.columns.length - 1]}4)`,
    result: 0,
  };
  sheet3.getCell("B5").value = {
    formula: `=sum(D5:${cols[sheet3.columns.length - 1]}5)`,
    result: 0,
  };
  sheet3.getCell("B6").value = {
    formula: `=sum(D6:${cols[sheet3.columns.length - 1]}6)`,
    result: 0,
  };
  sheet3.getCell("B7").value = {
    formula: `=sum(D7:${cols[sheet3.columns.length - 1]}7)`,
    result: 0,
  };

  sheet3.getCell("C2").value = "Paid To Date"
  // sheet3.getCell("D8").value = {
  //   formula: `+D7)`,
  //   result: 0,
  // };
  sheet3.fillFormula(`D8:D8`, "=+D7");
  sheet3.fillFormula(`E8:${cols[sheet3.columns.length - 1]}8`, "=+E7+D8");

  sheet3.getCell("C12").value = {
    formula: `=sum(D12:${cols[sheet3.columns.length - 1]}12)`,
    result: 0,
  };
  sheet3.getCell("C13").value = {
    formula: `=sum(D13:${cols[sheet3.columns.length - 1]}13)`,
    result: 0,
  };
  sheet3.getCell("C14").value = {
    formula: `+C12+C13`,
    result: 0,
  };
  sheet3.getCell("C17").value = {
    formula: `=sum(D17:${cols[sheet3.columns.length - 1]}17)`,
    result: 0,
  };
  sheet3.getCell("C18").value = {
    formula: `=sum(D18:${cols[sheet3.columns.length - 1]}18)`,
    result: 0,
  };
  sheet3.getCell("C19").value = {
    formula: `=sum(D19:${cols[sheet3.columns.length - 1]}19)`,
    result: 0,
  };
  sheet3.getCell("C20").value = {
    formula: `=sum(D20:${cols[sheet3.columns.length - 1]}20)`,
    result: 0,
  };
  sheet3.fillFormula(`C21:C21`, "=SUM(C17:C20)");
  sheet3.getCell("C22").value = {
    formula: `=sum(D22:${cols[sheet3.columns.length - 1]}22)`,
    result: 0,
  };
  sheet3.getCell("C23").value = {
    formula: `=sum(D23:${cols[sheet3.columns.length - 1]}23)`,
    result: 0,
  };
  sheet3.getCell("C24").value = {
    formula: `=sum(D24:${cols[sheet3.columns.length - 1]}24)`,
    result: 0,
  };
  sheet3.getCell("C25").value = {
    formula: `=sum(D25:${cols[sheet3.columns.length - 1]}25)`,
    result: 0,
  };
  sheet3.fillFormula(`C26:C26`, "=SUM(C22:C25)");
  sheet3.getCell("C31").value = {
    formula: `=sum(D31:${cols[sheet3.columns.length - 1]}31)`,
    result: 0,
  };
  sheet3.getCell("C32").value = {
    formula: `=sum(D32:${cols[sheet3.columns.length - 1]}32)`,
    result: 0,
  };
  sheet3.getCell("C33").value = {
    formula: `=C31+C32`,
    result: 0,
  };
  sheet3.getCell("D33").value = {
    formula: `+D32+D31`,
    result: 0,
  };
  sheet3.fillFormula(
    `E33:${cols[sheet3.columns.length - 1]}33`,
    "=+E32+E31+D33"
  );

  // sheet3.getCell("E33").value = {
  //   formula: `+E32+E31`,
  //   result: 0,
  // };
  sheet3.getCell("C34").value = {
    formula: `=sum(D34:${cols[sheet3.columns.length - 1]}34)`,
    result: 0,
  };
  sheet3.getCell("C35").value = {
    formula: `=sum(D35:${cols[sheet3.columns.length - 1]}35)`,
    result: 0,
  };
  // sheet3.getCell("C46").value = {
  //   formula: `=sum(D46:${cols[sheet3.columns.length - 1]}46)`,
  //   result: 0,
  // };
  sheet3.getCell("C47").value = {
    formula: `=sum(D47:${cols[sheet3.columns.length - 1]}47)`,
    result: 0,
  };
  sheet3.getCell("C48").value = {
    formula: `=sum(D48:${cols[sheet3.columns.length - 1]}48)`,
    result: 0,
  };
  sheet3.getCell("C49").value = {
    formula: `=sum(D49:${cols[sheet3.columns.length - 1]}49)`,
    result: 0,
  };
  sheet3.getCell("C50").value = {
    formula: `=sum(D50:${cols[sheet3.columns.length - 1]}50)`,
    result: 0,
  };
  sheet3.getCell("C51").value = {
    formula: `=sum(D51:${cols[sheet3.columns.length - 1]}51)`,
    result: 0,
  };
  sheet3.getCell("C56").value = {
    formula: `=sum(D56:${cols[sheet3.columns.length - 1]}56)`,
    result: 0,
  };
  sheet3.getCell("C57").value = {
    formula: `=sum(D57:${cols[sheet3.columns.length - 1]}57)`,
    result: 0,
  };
  sheet3.getCell("C58").value = {
    formula: `=sum(D58:${cols[sheet3.columns.length - 1]}58)`,
    result: 0,
  };
  sheet3.getCell("C61").value = {
    formula: `=sum(D61:${cols[sheet3.columns.length - 1]}61)`,
    result: 0,
  };
  sheet3.getCell("C64").value = {
    formula: `=sum(D64:${cols[sheet3.columns.length - 1]}64)`,
    result: 0,
  };
  sheet3.getCell("C68").value = {
    formula: `+C22+C23+C24+C25`,
    result: 0,
  };

  // console.log("MMMMM", `+${cols[sheet3.columns.length - 1]}68)`)
  sheet3.getCell("C69").value = {
    formula: `=sum(D69:${cols[sheet3.columns.length - 1]}69)`,
    result: 0,
  };
  sheet3.getCell("C70").value = {
    formula: `+C69+C68`,
    result: 0,
  };
  sheet3.getCell("C71").value = {
    formula: `=sum(D71:${cols[sheet3.columns.length - 1]}71)`,
    result: 0,
  };
  sheet3.getCell("C72").value = {
    formula: `+C70-C71`,
    result: 0,
  };
  sheet3.getCell("C80").value = {
    formula: `=sum(D80:${cols[sheet3.columns.length - 1]}80)`,
    result: 0,
  };
  sheet3.getCell("C81").value = {
    formula: `=sum(D81:${cols[sheet3.columns.length - 1]}81)`,
    result: 0,
  };
  sheet3.getCell("C82").value = {
    formula: `=sum(D82:${cols[sheet3.columns.length - 1]}82)`,
    result: 0,
  };
  sheet3.getCell("A86").value = "Check Box"
  sheet3.getCell("A87").value = "Budget expenditure less Actual Paid"
  sheet3.getCell("A88").value = "Actual Expenditure less Actually Drawn"
  sheet3.getCell("A89").value = "Raised plus Security less (R1 000 000 * No of units)"
  sheet3.getCell("A90").value = "Company Income and VAT Check not utilized for expenses"
  sheet3.getCell("A91").value = "Cumulative Interest"
  // sheet3.getCell("A92").value = "Transfer Income"
  // sheet3.getCell("A93").value = "Investor Repayment"

  sheet3.getCell("B87").value = {
    formula: `=+B7-C7`,
    result: 0,
  };
  sheet3.getCell("B88").value = {
    formula: `=+C7-C22`,
    result: 0,
  };
  sheet3.getCell("B89").value = {
    formula: `=+C14+C17+C19-(1000000*C40)`,
    result: 0,
  };
  sheet3.getCell("B90").value = {
    formula: `+C105`,
    result: 0,
  };
  sheet3.getCell("B91").value = {
    formula: `=+C33`,
    result: 0,
  };


  sheet3.getCell("A105").value = "Company Income and VAT Check not utilized for expenses"

  sheet3.fillFormula(`D105:${cols[sheet3.columns.length - 1]}105`, "=+D36-D42-D43-D47+((D59*D60))");
  sheet3.getCell("C105").value = {
    formula: `=sum(D105:${cols[sheet3.columns.length - 1]}105)`,
    result: 0,
  };



  sheet3.getCell('A86').border = {
    top: { style: "medium" }, 
  };
  sheet3.getCell('A87').border = {
    left: { style: "medium" }, 
  };
  sheet3.getCell('A88').border =  {
   left: { style: "medium" }, 
  };
  sheet3.getCell('A89').border =  {
   left: { style: "medium" }, 
  };
  sheet3.getCell('A90').border =  {
   left: { style: "medium" }, 
  };
  sheet3.getCell('A61').border =  {
   left: { style: "medium" }, 
  };
  sheet3.getCell('A92').border =  {
   left: { style: "medium" }, 
  };
  sheet3.getCell('A93').border =  {
   left: { style: "medium" }, 
   bottom: { style: "medium" }, 
  };
  sheet3.getCell('B87').border = {
    right: { style: "medium" }, 
  };
  sheet3.getCell('B88').border =  {
   right: { style: "medium" }, 
  };
  sheet3.getCell('B89').border =  {
   right: { style: "medium" }, 
  };
  sheet3.getCell('B90').border =  {
   right: { style: "medium" }, 
  };
  sheet3.getCell('B91').border =  {
   right: { style: "medium" }, 
  };
  sheet3.getCell('B92').border =  {
   right: { style: "medium" }, 


  };
  sheet3.getCell('B93').border =  {
   right: { style: "medium" }, 
   bottom: { style: "medium" }, 
  };
 
  sheet3.getCell('B86').border = {
    top: { style: "medium" }, 
    right: { style: "medium" }, 
  };
sheet3.getCell(`A86`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A87`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A88`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A89`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A90`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A91`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A91`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A92`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`A93`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B86`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B87`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B88`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B89`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B90`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B91`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B91`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B92`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };
sheet3.getCell(`B93`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE440" },
    };

  // console.log("actualRowCoun", sheet3.columns.length);

  for (x = 0; x < sheet3.columns.length; x++) {
    sheet3.getCell(`${cols[x]}1`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "7FC8A9" },
    };

    sheet3.getCell(`${cols[x]}38`).numFmt = "0.00%";
    sheet3.getCell(`C38`).value = "";
    sheet3.getCell(`${cols[x]}39`).numFmt = "0.00%";
    sheet3.getCell(`C39`).value = "";
    sheet3.getCell(`${cols[x]}40`).numFmt = "0";
    sheet3.getCell(`${cols[x]}41`).numFmt = "0";
    sheet3.getCell(`${cols[x]}60`).numFmt = "0.00%";
    sheet3.getCell(`C60`).value = "";

    if (x >= 3 && x <= 94) {
      sheet3.getColumn(`${cols[x]}`).hidden = true;
    }
    
    sheet3.getCell(`${cols[1]}3`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "5089C6" },
    };
    sheet3.getCell(`${cols[1]}4`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "5089C6" },
    };
    sheet3.getCell(`${cols[1]}5`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "5089C6" },
    };
    sheet3.getCell(`${cols[1]}6`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "5089C6" },
    };
    sheet3.getCell(`${cols[1]}7`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "5089C6" },
    };
    sheet3.getCell(`${cols[1]}3`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    sheet3.getCell(`${cols[1]}4`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    sheet3.getCell(`${cols[1]}5`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    sheet3.getCell(`${cols[1]}6`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    sheet3.getCell(`${cols[1]}7`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };

    sheet3.getCell(`${cols[1]}3`).font = {
      color: { argb: "FFFFFF" },
      size: 13,
      bold: false,
    };
    sheet3.getCell(`${cols[1]}4`).font = {
      color: { argb: "FFFFFF" },
      size: 13,
      bold: false,
    };
    sheet3.getCell(`${cols[1]}5`).font = {
      color: { argb: "FFFFFF" },
      size: 13,
      bold: false,
    };
    sheet3.getCell(`${cols[1]}6`).font = {
      color: { argb: "FFFFFF" },
      size: 13,
      bold: false,
    };
    sheet3.getCell(`${cols[1]}7`).font = {
      color: { argb: "FFFFFF" },
      size: 13,
      bold: true,
    };

    if (x >= 2 && x <= sheet3.columns.length) {
      // balDue.eachCell((cell, rowNumber) => {
      // If the balance due is 400 or more, highlight it with gradient color
      let formatRows = [
        3, 4, 5, 6, 7, 8, 12, 13, 14, 17, 18, 19, 20, 22, 23, 24, 25, 27, 28,
        29, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 49,
        50, 51, 52, 56, 57, 58, 59, 60, 61, 62, 64, 68, 69, 70, 71, 72,
      ];
      formatRows.forEach((el) => {
        sheet3.getCell(`${cols[x]}${el}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "5089C6" },
        };
        if (el !== 33 && el !== 38 && el !== 39 && el !== 60) {
          sheet3.getCell(`${cols[x]}${el}`).font = {
            color: { argb: "FFFFFF" },
            size: 13,
            bold: false,
          };

          sheet3.getCell(`${cols[x]}${el}`).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }

        if (el == 7 || el === 8 || el === 14 || el === 29 || el === 52) {
          sheet3.getCell(`${cols[x]}${el}`).font = {
            color: { argb: "FFFFFF" },
            size: 13,
            bold: true,
          };

          sheet3.getCell(`${cols[x]}${el}`).border = {
            top: { style: "medium" },
            left: { style: "medium" },
            bottom: { style: "medium" },
            right: { style: "medium" },
          };
        }
      });

      //CONDITIONAL FORMATTING

      // console.log("C27 Value::", sheet3.getCell(`C27`).value)
      if (sheet3.getCell(`C27`).value > 60000) {
        sheet3.getCell(`C27`).fill = {
          type: "gradient",
          gradient: "angle",
          degree: 0,
          stops: [
            { position: 0, color: { argb: "ffffff" } },
            { position: 0.5, color: { argb: "FF2626" } },
            { position: 1, color: { argb: "BD1616" } },
          ],
        };
      }
      if (sheet3.getCell(`C26`).value > 60000000) {
        sheet3.getCell(`C26`).fill = {
          type: "gradient",
          gradient: "angle",
          degree: 0,
          stops: [
            { position: 0, color: { argb: "ffffff" } },
            { position: 0.5, color: { argb: "FF2626" } },
            { position: 1, color: { argb: "BD1616" } },
          ],
        };
      }
      if (
        sheet3.getCell(`${cols[x]}77`).value === 0 &&
        sheet3.getCell(`${cols[x]}6`).value !== 0
      ) {
        sheet3.getCell(`${cols[x]}6`).fill = {
          type: "gradient",
          gradient: "angle",
          degree: 0,
          stops: [
            { position: 0, color: { argb: "ffffff" } },
            { position: 0.5, color: { argb: "81B214" } },
            { position: 1, color: { argb: "206A5D" } },
          ],
        };
      }
      if (
        sheet3.getCell(`${cols[x]}76`).value === 0 &&
        sheet3.getCell(`${cols[x]}3`).value !== 0
      ) {
        sheet3.getCell(`${cols[x]}3`).fill = {
          type: "gradient",
          gradient: "angle",
          degree: 0,
          stops: [
            { position: 0, color: { argb: "ffffff" } },
            { position: 0.5, color: { argb: "81B214" } },
            { position: 1, color: { argb: "206A5D" } },
          ],
        };
      }
      if (
        sheet3.getCell(`${cols[x]}76`).value === 0 &&
        sheet3.getCell(`${cols[x]}4`).value !== 0
      ) {
        sheet3.getCell(`${cols[x]}4`).fill = {
          type: "gradient",
          gradient: "angle",
          degree: 0,
          stops: [
            { position: 0, color: { argb: "ffffff" } },
            { position: 0.5, color: { argb: "81B214" } },
            { position: 1, color: { argb: "206A5D" } },
          ],
        };
      }
      if (
        sheet3.getCell(`${cols[x]}76`).value === 0 &&
        sheet3.getCell(`${cols[x]}5`).value !== 0
      ) {
        sheet3.getCell(`${cols[x]}5`).fill = {
          type: "gradient",
          gradient: "angle",
          degree: 0,
          stops: [
            { position: 0, color: { argb: "ffffff" } },
            { position: 0.5, color: { argb: "81B214" } },
            { position: 1, color: { argb: "206A5D" } },
          ],
        };
      }
      // });
      sheet3.getCell(`A8`).value = "Cumulative";
      sheet3.getCell(`A8`).font = {
        color: { argb: "212121" },
        size: 13,
        bold: true,
      };
      sheet3.getCell(`C21`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEF78" },
      };
      sheet3.getCell(`C26`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEF78" },
      };
      // sheet3.getCell(`${cols[x]}7`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "3DB2FF" },
      // };
      // sheet3.getCell(`${cols[x]}8`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "3DB2FF" },
      // };
      sheet3.getCell(`${cols[x]}14`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}27`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}28`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}29`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}52`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}59`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}62`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}64`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}70`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}72`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      sheet3.getCell(`${cols[x]}18`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FD6F96" },
      };
      sheet3.getCell(`${cols[x]}20`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FD6F96" },
      };
      sheet3.getCell(`${cols[x]}25`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FD6F96" },
      };
      sheet3.getCell(`${cols[x]}43`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "00A19D" },
      };
      sheet3.getCell(`${cols[x]}33`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FCFFA6" },
      };
      // sheet3.getCell(`${cols[x]}27`).font = {
      //   color: { argb: "DF2E2E" },
      //   size: 13,
      //   bold: true,
      // };
      //   sheet3.getCell(`${cols[x]}18`).font = {
      //     color: { argb: "7FC8A9" },
      //     size: 13,
      //     bold: true,
      //   };
      //   sheet3.getCell(`${cols[x]}26`).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "3DB2FF" },
      //   };
      //   sheet3.getCell(`${cols[x]}27`).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "3DB2FF" },
      //   };
      sheet3.getCell(`${cols[x]}38`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7AE" },
      };
      sheet3.getCell(`${cols[x]}39`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7AE" },
      };
      sheet3.getCell(`${cols[x]}39`).value = 0;
      sheet3.getCell(`A39`).value = "% Alloacated to Investor";
      sheet3.getCell(`A42`).value = "Amount allocated To Investor";
      //   sheet3.getCell(`${cols[x]}40`).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "3DB2FF" },
      //   };
      //   sheet3.getCell(`${cols[x]}54`).fill = {
      //     type: "pattern",
      //     pattern: "solid",Company Income not Utilised for expenses (Incl VAT)
      //     fgColor: { argb: "3DB2FF" },
      //   };

      //   sheet3.getCell(`${cols[x]}60`).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "3DB2FF" },
      //   };

      //   sheet3.getCell(`${cols[x]}68`).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "3DB2FF" },
      //   };

      //   sheet3.getCell(`${cols[x]}70`).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "3DB2FF" },
      //   };
      //   // sheet3.getCell(`${cols[x]}40`).fill = {
      //   //   type: "pattern",
      //   //   pattern: "solid",
      //   //   fgColor: { argb: "F037A5" },
      //   // };
      //   // sheet3.getCell(`${cols[x]}68`).font = {
      //   //   color: { argb: "FFFFFF" },
      //   //   size: 13,
      //   //   bold: true,
      //   // };

      sheet3.getCell(`${cols[x]}60`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7AE" },
      };
      sheet3.getCell(`${cols[x]}76`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" },
      };
      sheet3.getCell(`${cols[x]}76`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" },
      };
      sheet3.getCell(`${cols[x]}77`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" },
      };
      sheet3.getCell(`${cols[x]}78`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" },
      };
      sheet3.getCell(`${cols[x]}79`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" },
      };
    }
    if (x <= 1) {
      sheet3.getCell("A3").note =
        "Green indicates this amount has been paid, any amount not in green prior to today needs to be reallocated by Amina";
      sheet3.getCell("A4").note =
        "Green indicates this amount has been paid, any amount not in green prior to today needs to be reallocated by Amina";
      sheet3.getCell("A5").note =
        "Green indicates this amount has been paid, any amount not in green prior to today needs to be reallocated by Amina";
      sheet3.getCell("A6").note =
        "Green indicates this amount has been paid, any amount not in green prior to today needs to be reallocated by Amina";
      sheet3.getCell("A14").note = "These are pledges made";
      sheet3.getCell("A17").note =
        "These are atcual funds received which flow from pledges above Line 14";
      sheet3.getCell(
        "A18"
      ).note = `These are pledges utilised, We have not actually received this money in the attorneys trust. Then we are using this for future cashflow planning. Debbie will use planned value andfigures will populate from the database Debbie to informed of input so she can enter it on DB.`;
      sheet3.getCell(
        "A19"
      ).note = `These are funds we need but not yet received nor pledged
        We allocate these for future use to determine cash flow, interest expense etc.
        `;
      sheet3.getCell(
        "A22"
      ).note = `Actual Draws Done from Debbies investors Sheet
        `;
      // sheet3.getCell("A22").note =
      //   "Debbie Pupulates this line via databaise from values reflecting in line 25 (pink) once that is done the values in pink are deleted";
      sheet3.getCell(
        "A23"
      ).note = `Debbie Pre-populates this line via databaise from values reflecting in line 25 (pink) once that is done the values in pink are deleted
        `;
      sheet3.getCell(
        "A25"
      ).note = `This is populated by user to model finances. These values fall away once they are replaced by Debbie in line 23
        `;
      sheet3.getCell(
        "A27"
      ).note = `Sum of draws paid out to recon with released from attorneys in this row.
        `;
      sheet3.getCell(
        "A29"
      ).note = `This will be the actual cash and cash flow reflection (Including pledges utilized and avail funds)
        `;
      sheet3.getCell(
        "A46"
      ).note = `This line comese from "Trust" sheet. Finance / Construction need to ensure that amounts not being paid get pushed forward to appropriate paydates to avoid incorrect cashflow planning.
        If Line 52 is zero, assume expenses been paid.
        `;
      sheet3.getCell("A47").note =
        "Surplus income from transfer allocated for company cashflow and not repayment of loans";
      sheet3.getCell("A76").note = "These are Unpaid Expenses";
      sheet3.getCell("A77").note = "These are Unpaid Construction Expenses";
      sheet3.getCell("A78").note = "These are VAT on Sales not yet paid";
      sheet3.getCell("A79").note = "These are VAT on Expenses not yet claimed";
      sheet3.getCell("A90").note = "This checks that transfer fees as well as VAT not used in expenses reconciles. Thus rows 36, 42, 43 & 47 reconcile to Zero but that the %age of VAT not used (row 60 is where this is allocated) is also in the equation as row 43 includes the VAT not utilized for expenses.";

      sheet3.getCell(`A7`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A52`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A52`).value =
        "Draws Check - This value copied to Row number 25";
      sheet3.getCell(`A33`).value = "Cumulative";
      sheet3.getCell(`A33`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A43`).value =
        "Company Income not allocated to project (Inc VAT)";
      sheet3.getCell(`A9`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A10`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A14`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A16`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A26`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A27`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A34`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A39`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A40`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A50`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A62`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A54`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A56`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A58`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A60`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A65`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A68`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A70`).font = {
        size: 14,
        bold: true,
      };

      sheet3.getRow(24).hidden = true;
      sheet3.getRow(68).hidden = true;
      sheet3.getRow(69).hidden = true;
      sheet3.getRow(70).hidden = true;
      sheet3.getRow(71).hidden = true;
      sheet3.getRow(76).hidden = true;
      sheet3.getRow(77).hidden = true;
      sheet3.getRow(78).hidden = true;
      sheet3.getRow(79).hidden = true;
      sheet3.getRow(80).hidden = true;
      sheet3.getRow(81).hidden = true;
      sheet3.getRow(82).hidden = true;
      sheet3.getRow(98).hidden = true;
      sheet3.getRow(99).hidden = true;
      sheet3.getRow(100).hidden = true;
      sheet3.getRow(101).hidden = true;
      sheet3.getRow(102).hidden = true;
      sheet3.getRow(103).hidden = true;
      sheet3.getRow(104).hidden = true;
      sheet3.getRow(105).hidden = true;
      // sheet3.insertRow(24, 0, style = 'n')
    }
  }

  // if (sheet3.getCell(`C27`).formula > 60000) {
  //   sheet3.getCell(`C27`).fill = {
  //     type: "gradient",
  //     gradient: "angle",
  //     degree: 0,
  //     stops: [
  //       { position: 0, color: { argb: "ffffff" } },
  //       { position: 0.5, color: { argb: "FF2626" } },
  //       { position: 1, color: { argb: "BD1616" } },
  //     ],
  //   };
  // }

  console.log("Last Column", cols[189]);
  console.log(cols.length);

  var filename = "public/dashboard.xlsx";
  workbook.xlsx.writeFile(filename).then(async function () {
    // createDashboardXLSX()
    // await createDatafromXlsx()
    // done
  });
};

module.exports = router;

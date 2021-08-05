const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
// const { checktoken, jwtSignUser } = require("./checkToken");
// const moment = require("moment");
const dayjs = require('dayjs')
// var fs = require("fs");
// const { response } = require("express");
// const runReport = require("./reportsPDF");



router.post("/getFinanceInput", (req, res) => {
    let mysql1 = `select f.id, f.category, f.development,  c.discipline, f.budgetAmount, f.actualAmount, f.paymentDate, f.invoiceDate, f.invoiceNumber, f.supplier, f.supplierTerms as supplierTermsId, s.supplierTerms, f.vatable, f.drawNumber as drawId,d.drawNumber,  f.vatDate, f.paid
    from  financeInput f
    left join dashboardCategories c on 
    c.id = f.category
    left join draws d
    on f.drawNumber = d.id
    left join supplierTerms s
    on f.supplierTerms = s.id
    where f.development = ${req.body.id}
    order by f.paymentDate`;
    let mysql2 = `select * from dashboardCategories`
    let mysql3 = `select * from draws`
    let mysql4 = `select * from supplierTerms`
    let mysql = `${mysql1};${mysql2};${mysql3};${mysql4}`
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


router.post("/editFinanceInput", (req, res) => {
 
  let invoiceNumber;
  if (req.body.invoiceNumber === null) {
    invoiceNumber = null
  } else {
    invoiceNumber = `'${req.body.invoiceNumber}'`
  }
  console.log(req.body)
    let mysql = `UPDATE financeInput set category = ${req.body.category}, budgetAmount = ${parseFloat(req.body.budgetAmount)}, actualAmount = ${parseFloat(req.body.actualAmount)},
    paymentDate = '${req.body.paymentDate}', invoiceDate = '${req.body.invoiceDate}', supplierTerms  = ${req.body.supplierTermsId}, invoiceNumber = ${invoiceNumber}, supplier = '${req.body.supplier}',
     vatable = ${req.body.vatable}, drawNumber = ${req.body.drawId}, vatDate = '${req.body.vatDate}', paid = ${req.body.paid} where id = ${req.body.id}`;
     console.log(chalk.red(mysql)) 
   

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
  let invoiceNumber;
  let invoiceDate;
  if (req.body.invoiceNumber === null || req.body.invoiceNumber === "") {
    invoiceNumber = null;
    invoiceDate = null;
  } else {
    invoiceNumber = `'${req.body.invoiceNumber}'`;
    invoiceDate = `'${req.body.invoiceDate}'`;
  }
    let mysql = `insert into financeInput (development,category ,budgetAmount,actualAmount,paymentDate, invoiceDate,invoiceNumber, supplier, supplierTerms, vatable, drawNumber ,vatDate, paid) values (
      ${req.body.development},${req.body.category},${parseFloat(req.body.budgetAmount)}, ${parseFloat(req.body.actualAmount)}, '${req.body.paymentDate}',
    ${invoiceDate},${invoiceNumber}, '${req.body.supplier}', ${req.body.supplierTermsId},
     ${req.body.vatable}, ${req.body.drawId}, '${req.body.vatDate}', ${req.body.paid}
     )`;
     console.log(chalk.red(mysql)) 
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
     console.log(chalk.red(mysql)) 
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
router.post("/getSalesData", (req, res) => {
  // res.json({awesome: "This Far!!"})
    let mysql = `select s.id, s.unit, u.unitName, s.development, s.beds,s.bath,s.unit_type,s.size,s.base_price,s.contract_price,s.sold,s.isEnclosed,s.bathAdd,s.study,s.parking,
    s.bay_no,s.mood_board,s.extras,s.notes,s.deductions,s.sale_date,s.bond_app_date,s.lodge_date,s.transfer_date 
    from salesData s, units u
    where u.id = s.unit and s.development = ${req.body.id}
    order by u.unitName
    `;
     console.log(chalk.red(mysql)) 
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
router.post("/getInvestmentData", (req, res) => {
  // res.json({awesome: "This Far!!"})
    let mysql1 = `select i.id,i.development, i.unit,u.unitName,i.investor_code,i.investor,i.la_email_date,i.la_sign_date,i.pledged,i.attorney_inv_amount,i.fica_inv_date,i.amount,
    i.quinteDate,i.draw, d.drawNumber,i.interest_rate,i.repayment_date, 
    i.trust_account_interest,i.supplementary_interest,i.opc_comm from units u,investorDetails i
    left join  draws d
    on i.draw = d.id
    where i.unit = u.id and i.development = ${req.body.id}
    `;
    let mysql2 = `select * from draws`
    let mysql3 = `select * from units`
    let mysql = `${mysql1};${mysql2};${mysql3}`
     console.log(chalk.red(mysql)) 
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
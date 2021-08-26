const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
// const { checktoken, jwtSignUser } = require("./checkToken");
// const moment = require("moment");
const dayjs = require("dayjs");
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
var Excel = require("exceljs");
var { cols } = require("./columnsXLS");
// import { cols } from "./cols"
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

router.post("/editFinanceInput", (req, res) => {
  let invoiceNumber;
  let invoiceDate;
  if (req.body.invoiceNumber === null) {
    invoiceNumber = null;
  } else {
    invoiceNumber = `'${req.body.invoiceNumber}'`;
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
  console.log(req.body);
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
  }, vatDate = '${req.body.vatDate}', paid = ${req.body.paid} where id = ${
    req.body.id
  }`;
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
router.post("/getSalesData", (req, res) => {
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

router.post("/editsalesData", (req, res) => {
  // res.json({ awesome: "This Far!!" });
  console.log(req.body);
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

  let mysql = `Update salesData set base_price = ${parseFloat(
    req.body.base_price
  )}, contract_price = ${parseFloat(req.body.contract_price)},
                  parking = ${parseFloat(req.body.parking)}, bay_no = '${
    req.body.bay_no
  }', mood_board = '${req.body.mood_board}', extras = ${parseFloat(
    req.body.extras
  )},
                  notes = '${req.body.notes}', deductions =  ${parseFloat(
    req.body.deductions
  )}, sale_date = ${sale_date},
                  bond_app_date = ${bond_app_date}, lodge_date = ${lodge_date}, transfer_date = ${transfer_date}, actualsale_date = ${actualsale_date},
                  sold = ${sold} where id = ${req.body.id}   
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

// Investment DATA
router.post("/getInvestmentData", (req, res) => {
  // res.json({awesome: "This Far!!"})
  let mysql1 = `select i.id, i.development, i.unit,u.unitName,i.investor_code,i.investor,i.la_email_date,i.la_sign_date,i.pledged,i.attorney_inv_amount,i.fica_inv_date,i.amount,
    i.quinteDate,i.draw, d.drawNumber,i.drawn,  i.drawAdjustment, i.interest_rate,i.repayment_date, 
    i.trust_account_interest,i.supplementary_interest,i.opc_comm from units u,investorDetails i
    left join  draws d
    on i.draw = d.id
    where i.unit = u.id and i.development = ${req.body.id}
    order by unit, id
    `;
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
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/editInvestmentData", (req, res) => {
  console.log(req.body);
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
  let interest_rate = parseFloat(req.body.interest_rate) / 100;
  let trust_account_interest =
    parseFloat(req.body.trust_account_interest) / 100;
  let supplementary_interest =
    parseFloat(req.body.supplementary_interest) / 100;
  let opc_comm = parseFloat(req.body.opc_comm) / 100;

  let mysql = `insert into investorDetails (unit,investor_code,investor,la_email_date,la_sign_date,pledged,attorney_inv_amount,
            fica_inv_date,amount,quinteDate,draw,interest_rate,trust_account_interest,supplementary_interest,opc_comm, development, 
            drawAdjustment, drawn) values (
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
            ${parseFloat(req.body.drawAdjustment)}, ${req.body.drawn})`;
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

//UNIT SALES

router.post("/getunitSalesProjection", (req, res) => {
  // res.json({awesome: "It Works!!!!"})
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
  let mysql6 = `select t.development, t.unitNumber,u.unitName, u.subsection, ss.subsectionName, if(s.vatVendor = 1,t.price, t.price / 1.15) as price, t.supplier,s.terms,s.vatVendor, t.endDate  from suppliers s,tasks t, subsection ss, units u
  where s.id = t.supplier and u.id = t.unitNumber and ss.id = u.subsection and t.development = ${req.body.id} and ss.development = ${req.body.id} and u.development = ${req.body.id}`;
  let mysql7 = `select monthEnd as paymentDate, sum(budgetAmount) as budgetAmount, sum(actualAmount) as actualAmount from pandg where development = ${req.body.id} 
  group by monthEnd`;
  let mysql8 = `select "Loan Agreement Emailed" as discipline,la_email_date as dashboardDate, sum(pledged) as amount from investorDetails where attorney_inv_amount = 0 and development = ${req.body.id} and la_sign_date is null
  group by discipline,la_email_date
  union all
  select "Loan Agreement Expected" as discipline,la_sign_date  as dashboardDate, sum(pledged) as amount from investorDetails where attorney_inv_amount = 0 and la_sign_date is not null and development = ${req.body.id}
   group by discipline,la_sign_date
  union all
  select "Received In Attorney Trust Acc" as discipline,fica_inv_date  as dashboardDate, sum(attorney_inv_amount) as amount from investorDetails where attorney_inv_amount != 0 and fica_inv_date is not null and development = ${req.body.id}
  group by discipline,fica_inv_date
  union all
  select "Actual Draws Done" as discipline,quinteDate  as dashboardDate, sum(amount) as amount from investorDetails where amount != 0 and QuinteDate is not null and development = ${req.body.id} and drawn = 1
  group by discipline,quinteDate
  union all
  select "Draw (prepopulated - Debbie)" as discipline,quinteDate  as dashboardDate, sum(amount) as amount from investorDetails where amount != 0 and QuinteDate is not null and development = ${req.body.id} and drawn = 0
  group by discipline,quinteDate`;
  let mysql9 = ` select "Contract Interest" as discipline, i.quinteDate as startingDate ,i.repayment_date as endingDate,
  (i.attorney_inv_amount * (i.interest_rate))/365 as dailyInterest 
 from investorDetails i
   where i.development = ${req.body.id} and attorney_inv_amount != 0  and i.quinteDate is not null
 union all
 select  "Trust Interest" as discipline, fica_inv_date as startingDate, if(i.quinteDate is not null,i.quinteDate, s.transfer_date) as endingDate ,
  (i.attorney_inv_amount * (i.supplementary_interest + i.trust_account_interest))/365 as dailyInterest
 from investorDetails i
 left join salesData s
 on s.unit = i.unit
  where (i.development = ${req.body.id} and attorney_inv_amount != 0) and s.development = ${req.body.id}`;
  let mysql10 = `select "Transfer Income" as discipline, s.contract_price - (s.contract_price/1.15*.04025) - 16591.33 - 16851.69 - 1789 - (s.contract_price * .005) as amount, s.transfer_date as dashboardDate from salesData s where s.development = ${req.body.id}`;

  let mysql11 = `select "Transfer to Loan - Repay Investor" as discipline, coalesce(amount + (amount * (trust_account_interest + supplementary_interest) * datediff(quinteDate,fica_inv_date)/365) + (amount * interest_rate * datediff(repayment_date, quinteDate)/365),0) as amount, repayment_date as dashboardDate  from investorDetails where amount != 0  and development = ${req.body.id}`;

  let mysql12 = `select "Unit/s Transferred" as discipline, count(transfer_date) as amount, transfer_date as dashboardDate from salesData where development = ${req.body.id}
  group by transfer_date`;

  let mysql13 = `select "Actual draws" as discipline,  sum(amount + drawAdjustment) as amount, quinteDate as dashboardDate from investorDetails where amount != 0 and development = ${req.body.id} and draw is not null
  group by draw, quinteDate
  `;
  let mysql14 = `select "VAT Expenses" as discipline, if(f.actualAmount = 0, f.budgetAmount /1.15 * .15, f.actualAmount /1.15 * .15) as amount, f.vatDate as dashboardDate from financeInput f where f.vatable = 1 and f.development = ${req.body.id}
  union all
  select "TRANSFER FEES" as discipline, if(f.actualAmount = 0, f.budgetAmount, f.actualAmount) as amount, vatDate as dashboardDate from financeInput f where category = 2 and f.development = ${req.body.id}
  union all
  select "VAT Construction" as discipline, t.price / 1.15 * .15 as amount, 
   if(MOD(month(t.endDate), 2) = 0, DATE_ADD(LAST_DAY(t.endDate), INTERVAL 2 MONTH), DATE_ADD(LAST_DAY(t.endDate), INTERVAL 3 MONTH)) as dashboardDate  from suppliers s,tasks t, subsection ss, units u
    where s.id = t.supplier and u.id = t.unitNumber and ss.id = u.subsection and t.development = ${req.body.id} and s.vatVendor = 1 and t.price != 0 and u.development = ${req.body.id} and ss.development = ${req.body.id}
    union all
    select "VAT ON Sales" as discipline, contract_price / 1.15 * .15 as amount,  if(MOD(month(transfer_date), 2) = 0, DATE_ADD(LAST_DAY(transfer_date), INTERVAL 2 MONTH), DATE_ADD(LAST_DAY(transfer_date), INTERVAL 3 MONTH)) as dashboardDate  from  salesData
where development = ${req.body.id}`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5};${mysql6};${mysql7};${mysql8};${mysql9};${mysql10};${mysql11};${mysql12};${mysql13};${mysql14}`;
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
        // result[2].sort();

        result[2].sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
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
          // console.log(calculationArray);
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
          if (el.subsectionName === "Common Area") {
            el.discipline = el.unitName;
          } else {
            el.discipline = el.subsectionName;
          }
          if (el.vatVendor === 0) {
            el.price = parseFloat(el.price) / 1.15;
          }
          el.budgetAmount = el.price;
          el.actualAmount = 0; //Come Back To This
          if (el.terms === 1) {
            el.paymentDate = dayjs(el.endDate)
              .add(30, "day")
              .format("YYYY-MM-DD");
          } else if (el.terms === 2) {
            el.paymentDate = dayjs(el.endDate)
              .add(30, "day")
              .endOf("month")
              .format("YYYY-MM-DD");
          } else if (el.terms === 3) {
            el.paymentDate = dayjs(el.endDate)
              .add(7, "day")
              .endOf("week")
              .subtract(2, "day")
              .format("YYYY-MM-DD");
          } else if (el.terms === 4) {
            el.paymentDate = dayjs(el.endDate)
              .endOf("month")
              .format("YYYY-MM-DD");
          }
        });
        // console.log(result[5])
        // let result5 = result[5]
        let result5 = result[5].filter((el) => {
          return el.price !== 0;
        });

        console.log("result 5", result5);
        result5.forEach((el, index, arr) => {
          if (index > 0 && el.discipline !== arr[index - 1].discipline) {
            console.log(el.discipline);
          }
        });
        let disciplineArray = [];
        result[6].forEach((el) => {
          el.discipline = "CPC P&G";
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });
        result5.forEach((el) => {
          result[3].push(el);
          disciplineArray.push(el.discipline);
        });
        disciplineArray.sort();
        disciplineArray = Array.from(new Set(disciplineArray));
        // console.log(disciplineArray)
        disciplineArray.forEach((el) => {
          let insert = {
            discipline: el,
          };
          result[4].push(insert);
        });

        // console.log(result[6]);

        // console.log(result[3][5])
        // console.log(result[3][result[3].length - 1]);

        // console.log(result[4]);
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
          // console.log("el.dashboardDate",el.dashboardDate)
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
          // console.log("dataToAffect",dataToAffect)
          if (dataToAffect.length > 0) {
            dataToAffect.forEach((el3) => {
              if (el3.actualAmount !== 0) {
                el[el3.discipline] =
                  el[el3.discipline] + parseFloat(el3.actualAmount);
                // el[el3.discipline] = el3.budgetAmount;
              } else {
                el[el3.discipline] =
                  el[el3.discipline] + parseFloat(el3.budgetAmount);
                // el[el3.discipline] = el3.actualAmount;
              }
            });
          }
        });

        // let test = dashboardData.filter((el) => {
        //   el.amount === NaN
        // })

        // console.log(test)

        // console.log(result[4]);

        let summaryDisciplines = [
          { discipline: "Loan Agreement Emailed" },
          { discipline: "Loan Agreement Expected" },
          { discipline: "Funds Due" },
          { discipline: "Received In Attorney Trust Acc" },
          { discipline: "Actual Draws Done" },
          { discipline: "Draw (prepopulated - Debbie)" },
          { discipline: "Available to Draw" },
          { discipline: "Planned Draws" },
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
        ];

        let interestArray = result[8];

        let interestCalcArray = [];
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
        console.timeEnd("Interest");
        console.log(interestArray.length);
        console.log(interestCalcArray.length);

        // console.log(result[10])

        console.time("Merge 7 & 10");
        result[7] = [
          ...result[7],
          ...result[9],
          ...result[10],
          ...result[11],
          ...result[12],
          ...result[13],
        ];

        console.timeEnd("Merge 7 & 10");

        console.time("interest Array Calc");

        let resultForSummaryPage = [...interestCalcArray, ...result[7]];

        // console.log(resultForSummaryPage.length);

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
          // console.time("DataToAffect")
          if (dataToAffect.length > 0) {
            dataToAffect.forEach((el3) => {
              if (el3.amount !== 0) {
                el[el3.discipline] =
                  el[el3.discipline] + parseFloat(el3.amount);
              }
            });
          }
          // console.timeEnd("DataToAffect")
        });
        console.timeEnd("Populate Data3");

        // res.json(result);
        createDashboardXLSX(result[0], dashboardData, summaryPageData);
        console.timeEnd("Start");
        res.json({ fileWritten: true });
      }
    });

    connection.release();
  });
});

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
    "object60",
    "object61",
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
    object52[`${dashboardDate}`] = 0;
    object50[`${dashboardDate}`] = 0;
    object49[`${dashboardDate}`] = 0;
    object38[`${dashboardDate}`] = el["Block D"];
    object39[`${dashboardDate}`] = el["Block E"];
    object40[`${dashboardDate}`] = el["Block F"];
    object44[`${dashboardDate}`] = el["CPC P&G"];
    object41[`${dashboardDate}`] = el["Refuse Room"];
    object42[`${dashboardDate}`] = el["Guard House"];
    object43[`${dashboardDate}`] = el["Boundary Walls_DP2"];
    object51[`${dashboardDate}`] = el["Substation Slab"];
    object56[`${dashboardDate}`] = el["External Works"];
    object57[`${dashboardDate}`] = el["Security"];
    object58[`${dashboardDate}`] = el["Boundary Wall"];
    object59[`${dashboardDate}`] = el["Play Equipment"];
    object60[`${dashboardDate}`] = 0;
    object61[`${dashboardDate}`] = 0;
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
      el["Security"] +
      el["Boundary Wall"] +
      el["Play Equipment"];

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
      object60.description = "Escalations";
      object61.description = "Contingencies";
      object48.description = "Total Construction & Building";

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

  // console.log("totalTotals", totalTotals);

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

  let summaryObjects = [
    "summaryObject1",
    "summaryObject2",
    "summaryObject3",
    "summaryObject4",
    "summaryObject5",
    "summaryObject50",
    "summaryObject51",
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
    "summaryObject17",
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
  ];

  // { discipline: "Loan Agreement Emailed" },
  // { discipline: "Loan Agreement Expected" },
  // { discipline: "Funds Due" },
  // { discipline: "Received In Attorney Trust Acc" },
  // { discipline: "Released From Attornet T/Acc (Draws)" },
  // { discipline: "Available to Draw" },
  // { discipline: "Planned Draws" },
  // { discipline: "Nett Available to Draw" },
  // { discipline: "Trust / supplementary Interest - Project" },
  // {
  //   discipline: "Trust / supplementary Interest - Project (Cumulative)",
  // },
  // { discipline: "Transactional Interest" },
  // { discipline: "Cumulative Interest Project" },
  // { discipline: "Transfer Income" },
  // { discipline: "Company Income" },
  // { discipline: "Transfer to Loan - Repay Investor" },
  // { discipline: "% Company Income to Loan" },
  // { discipline: "Unit/s Transferred" },
  // { discipline: "Remaining" },
  // { discipline: "Actual draws" },
  // { discipline: "Costs" },
  // { discipline: "Income From Sales" },
  // { discipline: "VAT Income" },
  // { discipline: "VAT Expense" },
  // { discipline: "Group Loan Incurred (USED)" },
  // { discipline: "Group Loan repay" },
  // { discipline: "Anticipated Draws" },
  // { discipline: "Company Cashflow Balance" },
  // { discipline: "Owing on Group Loan" },
  // { discipline: "VAT Expenses" },
  // { discipline: "VAT Construction" },
  // { discipline: "TRANSFER FEES" },
  // { discipline: "Total Claimable VAT" },
  // { discipline: "% to Bond" },
  // { discipline: "VAT ON Sales" },
  // { discipline: "NETT VATT" },
  // { discipline: "Repayments" },
  // { discipline: "Draws to date" },
  // { discipline: "Int Cumulative to date" },
  // { discipline: "Bond" },
  // { discipline: "Repayment" },
  // { discipline: "Current BOND" },

  data3.forEach((el, index, arr) => {
    let dashboardDate = el.dashboardDate;

    summaryObject1[`${dashboardDate}`] = el["Loan Agreement Emailed"];
    summaryObject2[`${dashboardDate}`] = el["Loan Agreement Expected"];
    summaryObject3[`${dashboardDate}`] =
      el["Loan Agreement Emailed"] + el["Loan Agreement Expected"];
    summaryObject4[`${dashboardDate}`] = el["Received In Attorney Trust Acc"];
    summaryObject5[`${dashboardDate}`] = el["Actual Draws Done"];
    summaryObject50[`${dashboardDate}`] = el["Draw (prepopulated - Debbie)"];
    summaryObject51[`${dashboardDate}`] = 0;
    summaryObject6[`${dashboardDate}`] = 0;
    summaryObject7[`${dashboardDate}`] = 0;
    summaryObject8[`${dashboardDate}`] = 0;
    summaryObject9[`${dashboardDate}`] = el["Trust Interest"];
    summaryObject10[`${dashboardDate}`] = el["Contract Interest"];
    summaryObject11[`${dashboardDate}`] = el["Transfer Income"];
    summaryObject12[`${dashboardDate}`] =
      el["Transfer to Loan - Repay Investor"];
    summaryObject13[`${dashboardDate}`] = 0;
    summaryObject14[`${dashboardDate}`] = 0;
    summaryObject15[`${dashboardDate}`] = el["Unit/s Transferred"];
    summaryObject16[`${dashboardDate}`] = 0;
    summaryObject17[`${dashboardDate}`] = el["Actual draws"];
    summaryObject18[`${dashboardDate}`] = 0;
    summaryObject19[`${dashboardDate}`] = 0;
    summaryObject20[`${dashboardDate}`] = 0;
    summaryObject21[`${dashboardDate}`] = 0;
    summaryObject22[`${dashboardDate}`] = 0;
    summaryObject23[`${dashboardDate}`] = 0;
    summaryObject24[`${dashboardDate}`] = 0;
    // summaryObject25[`${dashboardDate}`] = 0;
    // summaryObject26[`${dashboardDate}`] = 0;
    summaryObject27[`${dashboardDate}`] = el["VAT Expenses"];
    summaryObject28[`${dashboardDate}`] = el["VAT Construction"];
    summaryObject29[`${dashboardDate}`] = el["TRANSFER FEES"];
    summaryObject30[`${dashboardDate}`] = 0;
    summaryObject31[`${dashboardDate}`] = 0;
    summaryObject32[`${dashboardDate}`] = el["VAT ON Sales"];
    summaryObject33[`${dashboardDate}`] = 0;
    summaryObject34[`${dashboardDate}`] = 0;
    summaryObject35[`${dashboardDate}`] = 0;
    summaryObject36[`${dashboardDate}`] = 0;
    summaryObject37[`${dashboardDate}`] = 0;
    summaryObject38[`${dashboardDate}`] = 0;
    summaryObject39[`${dashboardDate}`] = 0;

    if (index === arr.length - 1) {
      summaryObject1.description = "Loan Agreement Emailed Not signed";
      summaryObject2.description = "Loan Agreement Signed - Not deposited";
      summaryObject3.description = "Funds Due";
      summaryObject4.description = "Received In Attorney Trust Acc";
      summaryObject5.description = "Actual Draws Done";
      summaryObject50.description = "Draw (prepopulated - Debbie)";
      summaryObject51.description = "Raising Capital Required";
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
      summaryObject14.description = "% Company Income to Loan";
      summaryObject15.description = "Unit/s Transferred";
      summaryObject16.description = "Remaining";
      summaryObject17.description = "Actual Cash";
      summaryObject18.description = "Draw";
      summaryObject19.description = "Income from Sales";
      summaryObject20.description = "VAT Income";
      summaryObject21.description = "VAT Expense";
      summaryObject22.description = "Group Loan Incurred (USED)";
      summaryObject23.description = "Group Loan repay";
      summaryObject24.description = "Raising Required";
      // summaryObject25.description = "Company Cashflow Balance";
      // summaryObject26.description = "Owing on Group Loan";
      summaryObject27.description = "VAT Expenses";
      summaryObject28.description = "VAT Construction";
      summaryObject29.description = "TRANSFER FEES";
      summaryObject30.description = "Total Claimable VAT";
      summaryObject31.description = "% to Bond";
      summaryObject32.description = "VAT ON Sales";
      summaryObject33.description = "NETT VATT";
      summaryObject34.description = "Repayments";
      summaryObject35.description = "Draws to date";
      summaryObject36.description = "Int Cumulative to date";
      summaryObject37.description = "Bond";
      summaryObject38.description = "Repayment";
      summaryObject39.description = "Current Bond";

      sheet3.addRow({});
      sheet3.addRow({ description: "LOAN DETAILS" });
      sheet3.addRow({ description: "Pledges" });
      // sheet3.addRow({description: "Loan"});

      summaryObjects.forEach((el, index) => {
        if (
          index === 0 ||
          index === 7 ||
          // index === 7 ||
          index === 10 ||
          index === 12 ||
          // index === 31 ||
          index === 30 ||
          index === 31 ||
          index === 32 ||
          index === 33
        ) {
          sheet3.addRow({});
          // sheet3.addRow({});
          // sheet3.addRow({});
        }
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
        if (index === 17) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "PROJECT CASHFLOW" });
        }
        if (index === 25) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "VAT CALC" });
        }
        if (index === 33) {
          sheet3.addRow({});
          sheet3.addRow({});
          sheet3.addRow({ description: "BOND" });
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

  sheet3.getCell("D14").value = {
    formula: "+D13+D12",
    result: 0,
  };
  sheet3.fillFormula(
    `E14:${cols[sheet3.columns.length - 1]}14`,
    "+E13+E12+D14"
  );

  sheet3.fillFormula(`D20:${cols[sheet3.columns.length - 1]}20`, "+D45");

  sheet3.getCell("C22").value = {
    formula: "C17",
    result: sheet3.getCell("C17").value,
  };
  sheet3.getCell("D22").value = {
    formula: "D17",
    result: sheet3.getCell("D17").value,
  };
  sheet3.fillFormula(`E22:${cols[sheet3.columns.length - 1]}22`, "E17+D22");

  sheet3.getCell("C23").value = {
    formula: "C18",
    result: 0,
  };
  sheet3.getCell("D23").value = {
    formula: "D18",
    result: 0,
  };
  sheet3.fillFormula(`E23:${cols[sheet3.columns.length - 1]}23`, "E18+D23+E19");
  sheet3.fillFormula(`C24:${cols[sheet3.columns.length - 1]}24`, "C22-C23");
  sheet3.fillFormula(`C31:${cols[sheet3.columns.length - 1]}31`, "C29-C30");
  sheet3.getCell("D34").value = {
    formula: "-D33+C33",
    result: 0,
  };

  sheet3.fillFormula(`E34:${cols[sheet3.columns.length - 1]}34`, "-E33+D34");

  sheet3.fillFormula(
    `D38:${cols[sheet3.columns.length - 1]}38`,
    "+D24+D40+D41-D42+D43-D44"
  );
  sheet3.fillFormula(`D39:${cols[sheet3.columns.length - 1]}39`, "+D7-D18-D19");
  sheet3.fillFormula(
    `D40:${cols[sheet3.columns.length - 1]}40`,
    "+D31*(1-D32)"
  );
  sheet3.fillFormula(
    `D41:${cols[sheet3.columns.length - 1]}41`,
    "+D52*(1-D54)"
  );
  sheet3.fillFormula(`C42:${cols[sheet3.columns.length - 1]}42`, "+C56");
  sheet3.fillFormula(
    `D45:${cols[sheet3.columns.length - 1]}45`,
    "=IF((E38)<0,-E38+100000,0)"
  );
  sheet3.fillFormula(`C52:${cols[sheet3.columns.length - 1]}52`, "C49+C50+C51");
  sheet3.fillFormula(
    `D60:${cols[sheet3.columns.length - 1]}60`,
    "=(+D30+(D31*D32))+((D52*D54))"
  );
  sheet3.fillFormula(`C64:${cols[sheet3.columns.length - 1]}64`, "+C18");
  sheet3.getCell("D65").value = {
    formula: `+D24+D25`,
    result: 0,
  };
  sheet3.fillFormula(
    `E65:${cols[sheet3.columns.length - 1]}65`,
    "+E24+E25+D65"
  );
  sheet3.fillFormula(`D66:${cols[sheet3.columns.length - 1]}66`, "+D64+D65");
  sheet3.fillFormula(`D67:${cols[sheet3.columns.length - 1]}67`, "+D60");
  sheet3.fillFormula(`D68:${cols[sheet3.columns.length - 1]}68`, "+D66-D67");

  sheet3.getCell("C65").numFmt = "";
  sheet3.getCell("C65").value = "";
  sheet3.getCell("C66").numFmt = "";
  sheet3.getCell("C66").value = "";
  sheet3.getCell("C67").numFmt = "";
  sheet3.getCell("C67").value = "";
  sheet3.getCell("C68").numFmt = "";
  sheet3.getCell("C68").value = "";

  console.log("actualRowCoun", sheet3.columns.length);

  // for (i = 0; i < rows.length; i++) {
  for (x = 0; x < sheet3.columns.length; x++) {
    sheet3.getCell(`${cols[x]}1`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "7FC8A9" },
    };

    sheet3.getCell(`${cols[x]}32`).numFmt = "0.00%";
    sheet3.getCell(`${cols[x]}33`).numFmt = "0";
    sheet3.getCell(`${cols[x]}34`).numFmt = "0";
    sheet3.getCell(`${cols[x]}54`).numFmt = "0.00%";

   
    if (x >= 3 && x <= 90) {
      sheet3.getColumn(`${cols[x]}`).hidden = true;
    }
    if (x >= 2 && x <= sheet3.columns.length) {
      sheet3.getCell(`${cols[x]}7`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}7`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}14`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}14`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}24`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}24`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };

      // sheet3.getCell(`${cols[x]}32`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "2D46B9" },
      // };
      //  sheet3.getCell(`${cols[x]}32`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}32`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7AE" },
      };
      sheet3.getCell(`${cols[x]}38`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}38`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}45`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}45`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}52`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}52`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}58`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}58`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}66`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}66`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}68`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3DB2FF" },
      };
      // sheet3.getCell(`${cols[x]}68`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      sheet3.getCell(`${cols[x]}54`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7AE" },
      };
      // sheet3.getCell(`${cols[x]}7`).font = {
      //   // color: { argb: "FFFFFF" },
      //   size: 14,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}30`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "FFF7AE" },
      // };
      // sheet3.getCell(`${cols[x]}54`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "FFF7AE" },
      // };
      // sheet3.getCell(`${cols[x]}7`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}7`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}14`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}14`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}24`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}24`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}44`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}44`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}52`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}52`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}58`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}58`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}65`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}65`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
      // sheet3.getCell(`${cols[x]}67`).fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   fgColor: { argb: "AE00FB" },
      // };
      // sheet3.getCell(`${cols[x]}67`).font = {
      //   color: { argb: "FFFFFF" },
      //   size: 13,
      //   bold: true,
      // };
    }
    if (x <= 1) {
      sheet3.getCell(`A7`).font = {
        size: 14,
        bold: true,
      };
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
      sheet3.getCell(`A24`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A32`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A37`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A38`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A45`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A48`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A49`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A52`).font = {
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
      sheet3.getCell(`A63`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A66`).font = {
        size: 14,
        bold: true,
      };
      sheet3.getCell(`A68`).font = {
        size: 14,
        bold: true,
      };
    }
  }
  // }

  console.log("Last Column", cols[189]);
  console.log(cols.length);

  var filename = "public/dashboard.xlsx";
  workbook.xlsx.writeFile(filename).then(function () {
    // done
  });
};

module.exports = router;

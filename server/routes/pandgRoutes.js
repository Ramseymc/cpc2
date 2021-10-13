const express = require("express");
const router = express.Router();
const pool = require("./connection");
const multer = require("multer");
const fs = require("fs");
// var cloudinary = require("cloudinary").v2;
const xlsx = require("xlsx");
const dayjs = require("dayjs");
// const imageConversion = require("image-conversion")

//MULTER FILE FILTER
const fileFilter = function (req, file, cb) {
  // accept=".xlsx, .xls, .csv"
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type");
    error.code = "LIMIT_FILE_TYPES";
    console.log(req.path, error);
    return cb(error, false);
  }
  cb(null, true);
};

let MAX_SIZE = 10000000;
const upload = multer({
  dest: "./public/uploads/",
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
    fieldSize: 100 * 1024 * 1024,
  },
});

router.post("/updateEscalations", (req, res) => {
  let mysql1 = "";

  if (req.body.deletion) {
    mysql1 = `delete from escalations where development = ${req.body.infoToPost[0].development};`;
  }
  let mysql2 = ""
  req.body.infoToPost.forEach((el) => {
    mysql2 = `${mysql2} insert into escalations ( processed,development,paymentDate,draw,amount) values (
      ${el.processed},${el.development},'${el.paymentDate}',${el.draw},${el.amount}
    );`;
  })
  let mysql = `${mysql1}${mysql2}`;
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

router.post("/getEscalations", (req, res) => {
  console.log(req.body.id);

  let mysql1 = `select DATE_FORMAT(paymentDate,'%Y-%m-%d') as paymentDate, paid, sum(budgetAmount) as budgetAmount from financeConstructionInput where  development = ${req.body.id}  group by DATE_FORMAT(paymentDate,'%Y-%m-%d'), paid order by DATE_FORMAT(paymentDate,'%Y-%m-%d')`;
  let mysql2 = `select * from contingenciesAndEscalationsBudget where development = ${req.body.id} and category = 'Escalations'`;
  let mysql3 = `select * from escalations where development = ${req.body.id} and processed = 1`;
  let mysql4 = `select * from draws`;
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

router.post("/updateContingencies", (req, res) => {
  let mysql1 = "";

  if (req.body.deletion) {
    mysql1 = `delete from contingencies where development = ${req.body.infoToPost[0].development};`;
  }
  let mysql2 = ""
  req.body.infoToPost.forEach((el) => {
    mysql2 = `${mysql2} insert into contingencies ( processed,development,paymentDate,draw,amount) values (
      ${el.processed},${el.development},'${el.paymentDate}',${el.draw},${el.amount}
    );`;
  })
  let mysql = `${mysql1}${mysql2}`;
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

router.post("/getContingencies", (req, res) => {
  console.log(req.body.id);
  // paid = 0 and paid = 0 and
  let mysql1 = `select DATE_FORMAT(paymentDate,'%Y-%m-%d') as paymentDate, paid, sum(budgetAmount) as budgetAmount from financeConstructionInput where  development = ${req.body.id}  group by DATE_FORMAT(paymentDate,'%Y-%m-%d'), paid order by DATE_FORMAT(paymentDate,'%Y-%m-%d')`;
  let mysql2 = `select * from contingenciesAndEscalationsBudget where development = ${req.body.id} and category = 'Contingincies'`;
  let mysql3 = `select * from contingencies where development = ${req.body.id} and processed = 1`;
  let mysql4 = `select * from draws`;
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

router.post("/importPandG", upload.single("PandG"), (req, res) => {
  fs.rename(
    `public/uploads/${req.file.filename}`,
    `public/uploads/${req.file.originalname}`,
    (err) => {
      if (err) {
        console.log("Error renaming");
      } //throw err
    }
  );
  let mysql2 = "";
  setTimeout(() => {
    const wb = xlsx.readFile(`public/uploads/${req.file.originalname}`, {
      cellDates: true,
    });
    const ws = wb.Sheets["Import"];
    const data = xlsx.utils.sheet_to_json(ws);

    data.forEach((el) => {
      el.effectiveDate = dayjs(el.Date).format("YYYY-MM-DD");
      el.development = `${parseInt(req.body.development)}`;
      delete el.Date;
      if (el.Processed === "No") {
        el.Processed = 0;
      } else {
        el.Processed = 1;
      }
      mysql2 = `${mysql2} INSERT into pandgNew (effectiveDate,	Processed,	Draw,development,	OFFICE_BASED_MANAGEMENT,	SITE_BASED_MANAGEMENT,
      	INSURANCE,	MAINTENANCE_ALLOWANCE,	SITE_STAFF,	SITE_ESTABLISHMENT,	TRAINING,	SITE_SECURITY,	TEMPORARY_FENCING__GATES_ETC,
        	PHONES_FAX_INTERNET_RADIOS,	TEMPORARY_ELECTRICAL_SERVICES,	TEMPORARY_WATER_SUPPLY,	SETTING_OUT__GENERAL_Assistance,	
          SITE_SAFETY_AND_SAFETY_EQUIPMENT,	MEDICALS,	COMPUTER_EXPENSES,	PRINTING__STATIONARY_EXPENSES,	MINOR_PLANT_AND_LOOSE_TOOLS,
          	HOUSEKEEPING_SITE_TIDINESS,	HAND_OVER_CLEANING_,	PROTECTION_OF_WORKS,	HIRED_PLANT_INTERNAL_incl_weekends,	GENERAL_TRANSPORT,
            	RUBBLE_MANAGEMENT,	SCAFFOLDING,	MATERIALS_HANDLING,	PETTY_CASH) values (
                '${el.effectiveDate}',	${el.Processed},	'${el.Draw}',${el.development},	${el.OFFICE_BASED_MANAGEMENT},	${el.SITE_BASED_MANAGEMENT},
                  ${el.INSURANCE},	${el.MAINTENANCE_ALLOWANCE},	${el.SITE_STAFF},	${el.SITE_ESTABLISHMENT},	${el.TRAINING},	${el.SITE_SECURITY},	${el.TEMPORARY_FENCING__GATES_ETC},
                    ${el.PHONES_FAX_INTERNET_RADIOS},	${el.TEMPORARY_ELECTRICAL_SERVICES},	${el.TEMPORARY_WATER_SUPPLY},	${el.SETTING_OUT__GENERAL_Assistance},	
                      ${el.SITE_SAFETY_AND_SAFETY_EQUIPMENT},	${el.MEDICALS},	${el.COMPUTER_EXPENSES},	${el.PRINTING__STATIONARY_EXPENSES},${el.MINOR_PLANT_AND_LOOSE_TOOLS},
                        ${el.HOUSEKEEPING_SITE_TIDINESS},	${el.HAND_OVER_CLEANING_},	${el.PROTECTION_OF_WORKS},	${el.HIRED_PLANT_INTERNAL_incl_weekends},	${el.GENERAL_TRANSPORT},
                          ${el.RUBBLE_MANAGEMENT},	${el.SCAFFOLDING},	${el.MATERIALS_HANDLING},	${el.PETTY_CASH}
              );`;
    });
    // console.log(data[2]);
    // console.log(data[5]);
    // console.log("mysql", mysql);
    let mysql1 = `delete from pandgNew where development = ${parseInt(
      req.body.development
    )}`;
    let mysql = `${mysql1};${mysql2}`;
    // let mysql = `select * from siteImages where development = ${req.body.id} order by id desc`;

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
          fs.unlink(`public/uploads/${req.file.originalname}`, (err) => {
            if (err) {
              return console.log("Eror Deleting");
            }
            console.log("File Deleted");
          });
        }
      });
      connection.release();
    });
  }, 500);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("./connection");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const chalk = require("chalk");

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

// Server Methods



// get blocks for development
// router.post("/getblocksforoptions", (req, res) => {

//   console.log("TESTING")
//   let mysql = `select * from subsection where subsectionName not like 'Common Area' and  development = ${req.body.id}`;
//   pool.getConnection(function (err, connection) {
//     if (err) {
//       connection.release();
//       resizeBy.send("Error with connection");
//     }
//     connection.query(mysql, function (error, result) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(result);
//         res.json(result);
//       }
//     });
//     connection.release();
//   });
// });

router.post("/getSalesDataForSale", (req, res) => {
  let mysql = `select * from salesData where unit = ${req.body.unit}`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("RESULT New",result)
        res.json(result);
      }
    });
    connection.release();
  });
})


router.post("/getUnitPlanTypes", (req, res) => {
  console.log(req.body)
  let mysql = `select unit_type from salesData s, units u where u.id = s.unit and u.unitName = '${req.body.unitValue}'`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("RESULT",result)
        res.json(result);
      }
    });
    connection.release();
  });
})






router.post("/getAvailableUnits", (req,res) =>{
  console.log(req.body)
    let mysql = `select u.id, s.unit, u.unitName from salesData s, units u where u.id = s.unit and u.subsection = ${req.body.subsection} and s.sold = false and s.development = ${req.body.id}`

  console.log("Hello",mysql);
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

})



// console.log("WTF2")
// get avail units for selected development and block
router.post("/getUnitsForOptions", (req, res) => {
  // let mysql = `SELECT 
  //     u.unitName 
  //   FROM units u 
  //   LEFT JOIN subsection s ON s.id = u.subsection 
  //   LEFT JOIN salesinfo si ON si.unit = u.unitName AND si.block = s.subsectionName 
  //   WHERE u.unitName NOT IN 
  //     ( SELECT 
  //       u.unitName 
  //       FROM units u JOIN subsection s ON s.id = u.subsection 
  //       JOIN salesinfo si ON si.unit = u.unitName AND si.block = s.subsectionName 
  //       WHERE s.subsectionName = '${req.body.subsectionName}' ) 
  //   AND s.subsectionName = '${req.body.subsectionName}';`;
  console.log(req.body)
    let mysql = `select s.unit, u.unitName from salesData s, units u where u.id = s.unit and u.subsection = ${req.body.subsection} and s.sold = false and s.development = ${req.body.development}`

  console.log("Hello",mysql);
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

// get all valid salesInfo
router.post("/getClientInfoForSalesInfo", (req, res) => {
  let mysql = `select * from salesinfo where id > 0 and firstName > '';`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("SERVER-SIDE, RESULT in salesRoutes.js", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

// delete salesinfo record matching 'id'
router.post("/deleteSalesRecord", (req, res) => {
  let mysql = `delete from salesinfo where id = ${req.body.id}`;
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

router.post("/sendSalesInfoEmail", (req, res) => {
  //let mysql = `select first_name, last_name, emailAddress from suppliers where contactID = '${req.body.supplier}'`;
  //let filename = req.body.PONumber;
  console.log("XXXX", req.body);
  let subject = `New Sales Agreement Signed - Block: ${req.body.info[0].block}, Unit ${req.body.info[0].unit}`;
  let recipient = "connorm11111@gmail.com";
  // ${req.body.info[0].firstname} ${req.body.info[0].firstname}

  // The following documents have been received
  let output = `Dear Debbie/Donovan,
          Please find the attached information regarding a client sale;
          <br><br><br>
          
          <strong> 
            First Name: ${req.body.info[0].firstname} 
            <br>
            Last Name: ${req.body.info[0].lastname}
            <br>
            Block: ${req.body.info[0].block}
            <br>
            Unit: ${req.body.info[0].unit}
          </strong>
          
          <br><br>          
          Kind regards
          <br><br>
  
          <strong>Sales Sytem</strong><br>
          Oppurtunity Private Capital<br>
          CPC<br><br>
          `;

  sendMail(subject, recipient, output).then(() => {
    let mysql = `update salesinfo set salesEmailSent = 'Y' where id = ${req.body.info[0].id}`;
    console.log(chalk.blue(mysql));
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        resizeBy.send("Error with connection");
      }
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log("THE ERROR", error);
        } else {
          console.log(result);
          res.json({
            success: true,
            hello: "Goodbye",
            fileName: recipient,
          });
        }
      });
      connection.release();
    });
    // .catch((e) => {
    //   console.log(e)
    //   res.json({ success: false });
    // });
  });
});

async function sendMail(subject, recipient, output) {
  let mailOptions = {
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: ["waynebruton@icloud.com"],
    subject: `${subject}`,
    text: "Sale Info",
    html: output,
    // attachments: [
    //   {
    //     filename: `${filename}.pdf`,
    //     path: `public/purchaseorders/${filename}.pdf`, // stream this file
    //   },
    // ],
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection", error);
    }
  });
}

// upload via multer.single()
router.post("/updateClientOTP", upload.single("fileOTP"), (req, res) => {
  console.log("ID:", req.body.id);

  // rename with file on server the extension appended
  fs.rename(
    `public/uploads/${req.file.filename}`,
    `public/uploads/${req.file.filename}.${req.file.mimetype.split("/")[1]}`,
    (err) => {
      if (err) {
        console.log("Error renaming");
      } //throw err
    }
  );

  // insert the filename with extension into the fileOTP db field
  let fileOTP = `${req.file.filename}.${req.file.mimetype.split("/")[1]}`;
  if (
    req.body.fileOTP !== null ||
    req.body.fileOTP !== "undefined" ||
    req.body.fileOTP !== ""
  ) {
    let mysql = `UPDATE salesinfo 
      SET fileOTP = '${fileOTP}', signedOff = true WHERE id = ${req.body.id}`;
    console.log("||OVERRIDE OTP||", mysql);
    //console.log("OVERRIDE OTP SQL = ", mysql);
    // execute the sql and return the res.json
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
          console.log("After UpdateOTP stmnt");
          console.log(result);
        }
      });
      connection.release();
    });
  }
});

// update the salesinfo record matching 'id'
router.post("/updateClient", upload.array("documents"), (req, res) => {
  console.log("Files: ", req.files);
  console.log("Info: ", req.body);

  let fileDetails = [];
  if (req.files.length) {
    //console.log(req.body.contains)
    let contains = [];
    try {
      contains = req.body.contains.split(",");
    } catch {
      contains.push(req.body.contains);
    }
    contains = Array.from(new Set(contains));

    contains.forEach((el, index) => {
      // let mainIndex = index
      // req.files.forEach((el2) => {
      // el2.filenameA = `${el2.filename}.${el2.mimetype.split("/")[1]}`
      let update = {
        fileType: el,
        fileName: `${req.files[index].filename}.${
          req.files[index].mimetype.split("/")[1]
        }`,
        originalName: req.files[index].filename,
      };
      fileDetails.push(update);
      // })
    });

    // contains.forEach((el, index) => {
    //   //1 - 5 loops
    //   let mainIndex = index

    //   // req.files[mainIndex]
    //   // req.files.forEach((el2) => {
    //     //another 5 loops (maybe more if multi)

    //     // el2.filenameA = `${el2.filename}.${el2.mimetype.split("/")[1]}`
    //     let insert = {
    //       fileType: el,
    //       fileName: `${req.files[mainIndex].filename}.${req.files[mainIndex].mimetype.split("/")[1]}`,
    //       originalName: req.files[mainIndex].filename
    //     }
    //     fileDetails.push(insert)

    // })

    // renaming files if required
    fileDetails.forEach((el) => {
      let filtered = req.files.filter((el2) => {
        return el2.filename === el.originalName;
      });
      // el.fileNameUpdated = `${el.fileName}.${filtered[0].mimetype.split("/")[1]}`
      el.fileNameUpdated = `${el.fileName}`;
      fs.rename(
        `public/uploads/${el.originalName}`,
        `public/uploads/${el.fileNameUpdated}`,
        (err) => {
          if (err) console.log("Error renaiming");
          //throw err
        }
      );
    });
  }

  let mysql = `UPDATE salesinfo 
      SET 
       firstName='${req.body.firstName}',
       lastName='${req.body.lastName}',
       iDNumber='${req.body.iDNumber}',
       email='${req.body.email}',
       bankName='${req.body.bankName}',
       accountNumber='${req.body.accountNumber}',
       accountType='${req.body.accountType}',
       block='${req.body.block}',
       unit='${req.body.unit}',
       mood='${req.body.mood}',
       flooring='${req.body.flooring}',
       floorplan='${req.body.floorplan}',
       mobile='${req.body.mobile}',
       landline='${req.body.landline}',
       residentialAddress='${req.body.residentialAddress}',
       postalAddress='${req.body.postalAddress}' `;

  // dynamicSQL file uploads
  let otpSQL = fileDetails.filter((el) => {
    return el.fileType === "fileOTP";
  }); // does this below need to be inside the loop?
  console.log(chalk.green("otpSQL = ", otpSQL));
  let additionalSQL = "";
  if (otpSQL.length > 0) {
    //
    otpSQL.forEach((el) => {
      additionalSQL = `${additionalSQL}, fileOTP = '${el.fileName}'`;
    });
  }

  let idSQL = fileDetails.filter((el) => {
    console.log("Element in the filter file details array:", el);
    return el.fileType === "fileId";
  }); // does this below need to be inside the loop?
  console.log(chalk.green("idSQL = ", idSQL));

  if (idSQL.length > 0) {
    //
    idSQL.forEach((el) => {
      additionalSQL = `${additionalSQL}, fileId = '${el.fileName}'`;
    });
  }

  // should we get filebank from the control (OKAY2) message ? // Ramsey 1 - file uploads in update using dynamic sql
  let bankSQL = fileDetails.filter((el) => {
    console.log("Element in the filter file details array:", el);
    return el.fileType === "fileBank";
  });
  console.log(chalk.green("bankSQL = ", bankSQL));
  if (bankSQL.length > 0) {
    //
    bankSQL.forEach((el) => {
      additionalSQL = `${additionalSQL}, fileBank = '${el.fileName}'`;
    });
  }

  let ficaSQL = fileDetails.filter((el) => {
    console.log("Element in the filter file details array:", el);
    return el.fileType === "fileFica";
  }); // does this below need to be inside the loop?
  console.log(chalk.green("ficaSQL = ", ficaSQL));
  let insertArrayFica = [];

  if (ficaSQL.length > 0) {
    ficaSQL.forEach((el) => {
      insertArrayFica.push(el.fileName);
    });
    additionalSQL = `${additionalSQL}, fileFica = '${insertArrayFica.join(
      ","
    )}'`;
  }

  let paySlipSQL = fileDetails.filter((el) => {
    console.log("Element in the filter file details array:", el);
    return el.fileType === "filePaySlip";
  }); // does this below need to be inside the loop?
  console.log(chalk.green("paySlipSQL = ", paySlipSQL));
  let insertArrayPaySlip = [];

  if (paySlipSQL.length > 0) {
    paySlipSQL.forEach((el) => {
      insertArrayPaySlip.push(el.fileName);
    });
    additionalSQL = `${additionalSQL}, filePaySlip = '${insertArrayPaySlip.join(
      ","
    )}'`;
  }
  // dynamic inserts for files, done  ( does input two of each for multiple )

  mysql = `${mysql} ${additionalSQL} WHERE id = ${req.body.id}`;
  console.log(
    chalk.red("FINALmySQL UPDATE Satement, in salesRoutes.js = ", mysql)
  );

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
        console.log("After Update stmnt");
        console.log(result);
      }
    });
    connection.release();
  });
});

router.post("/createClient", upload.array("documents"), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  // pull the mimetype from req.files - futureproof
  let fileDetails = [];

  if (req.files.length) {
    let contains = req.body.contains.split(",");

    contains.forEach((el, index) => {
      //1 - 5 loops
      let mainIndex = index;

      // req.files[mainIndex]
      // req.files.forEach((el2) => {
      //another 5 loops (maybe more if multi)

      // el2.filenameA = `${el2.filename}.${el2.mimetype.split("/")[1]}`
      let insert = {
        fileType: el,
        fileName: `${req.files[mainIndex].filename}.${
          req.files[mainIndex].mimetype.split("/")[1]
        }`,
        originalName: req.files[mainIndex].filename,
      };
      fileDetails.push(insert);
    });

    console.log("fileDetails", fileDetails);

    fileDetails.forEach((el) => {
      let filtered = req.files.filter((el2) => {
        return el2.filename === el.originalName;
      });
      el.fileNameUpdated = `${el.fileName}`;
      fs.rename(
        `public/uploads/${el.originalName}`,
        `public/uploads/${el.fileNameUpdated}`,
        (err) => {
          if (err) console.log("Error renaming", err);
          //throw err
        }
      );
    });
  }

  let fileFica;
  let fileOTP;
  let filePaySlip;
  let fileBank;
  let fileId;

  if (fileDetails.length) {
    fileOTP = fileDetails.filter((el) => {
      return el.fileType === "fileOTP";
    });
    if (fileOTP.length) {
      fileOTP = fileOTP[0].fileName;
    } else {
      fileOTP = "";
    }
    fileBank = fileDetails.filter((el) => {
      return el.fileType === "fileBank";
    });
    if (fileBank.length) {
      fileBank = fileBank[0].fileName;
    } else {
      fileBank = "";
    }
    fileId = fileDetails.filter((el) => {
      return el.fileType === "fileId";
    });
    if (fileId.length) {
      fileId = fileId[0].fileName;
    } else {
      fileId = "";
    }
    fileFica = fileDetails.filter((el) => {
      return el.fileType === "fileFica";
    });
    if (fileFica.length === 1) {
      fileFica = fileFica[0].fileName;
    } else if (fileFica.length > 1) {
      let ficaData = [];
      fileFica.forEach((el) => {
        ficaData.push(el.fileName);
      });
      fileFica = ficaData.join(",");
    } else {
      fileFica = "";
    }

    filePaySlip = fileDetails.filter((el) => {
      return el.fileType === "filePaySlip";
    });
    if (filePaySlip.length === 1) {
      filePaySlip = filePaySlip[0].fileName;
    } else if (filePaySlip.length > 1) {
      let fileData = [];
      filePaySlip.forEach((el) => {
        fileData.push(el.fileName);
      });
      filePaySlip = fileData.join(",");
    } else {
      filePaySlip = "";
    }
  }
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  let mysql = `INSERT INTO salesinfo (firstname, lastname, iDNumber, email, bankName, accountNumber, accountType, block, unit, mood, flooring, fileOTP, fileId, fileBank, filePaySlip, fileFica, dateCreated, floorplan, mobile, landline, postalAddress, residentialAddress) VALUES (
                '${req.body.firstName}','${req.body.lastName}','${req.body.iDNumber}','${req.body.email}','${req.body.bankName}','${req.body.accountNumber}','${req.body.accountType}','${req.body.block}','${req.body.unit}','${req.body.mood}','${req.body.flooring}','${fileOTP}','${fileId}',
                '${fileBank}','${filePaySlip}','${fileFica}','${dateTime}','${req.body.floorplan}','${req.body.mobile}','${req.body.landline}','${req.body.postalAddress}','${req.body.residentialAddress}' 
      );`;

  console.log(chalk.red(mysql));

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
        console.log("After INSERT stmnt");
        console.log(result);
      }
    });
    connection.release();
  });
});

// CRM 1 : Transporter / formatting here
let transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: 465, //587
  secure: true,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// router.post("/test", (req, res) => {
//   res.json({ Awesome: "It Works!!!!!" });
// });

// console.log("WTF3")

router.post("/getblocksforoptionsA", (req,res) => {
  console.log("Awesome")
  // res.json({awesome: "It Works"})
    console.log("TESTING")
  let mysql = `select * from subsection where subsectionName not like 'Common Area' and  development = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
})




module.exports = router;

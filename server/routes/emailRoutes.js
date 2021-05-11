const express = require("express");
const router = express.Router();
const pool = require("./connection");
const nodemailer = require("nodemailer");
const chalk = require("chalk");
const axios = require("axios");

var https = require("https");
var fs = require("fs");

// var download = function (url, dest, cb) {
//   var file = fs.createWriteStream(dest);
//   var request = http
//     .get(url, function (response) {
//       response.pipe(file);
//       file.on("finish", function () {
//         file.close(cb); // close() is async, call cb after close completes.
//       });
//     })
//     .on("error", function (err) {
//       // Handle errors
//       fs.unlink(dest); // Delete the file async. (But we don't check the result)
//       if (cb) cb(err.message);
//     });
// };

router.post("/sendEmailImage", (req, res) => {
  console.log(req.body);
  let url = req.body.image;
  const file = fs.createWriteStream(
    `public/${req.body.development}${req.body.unit}.jpg`
  );
  const request = https.get(url, function (response) {
    response.pipe(file);
  });
  let subject = req.body.subject;
  let recipient = req.body.recipients;
  let output = req.body.message + `<br>`;
  console.log(output);
  let filename = `${req.body.development}${req.body.unit}.jpg`;
  console.log(filename);
  let personToCC = req.body.sentBy;
  let complete = false;

  setTimeout(() => {
    sendImageMail(subject, recipient, output, filename, personToCC)
      .then(console.log("SENT EMAIL"))
      .catch((e) => {
        console.log("ERROR", e);
      });
    complete = true;
    res.json({ awesome: "It Works!!!" });
    setTimeout(() => {
      fs.unlink(`public/${req.body.development}${req.body.unit}.jpg`, (err) => {
        if (err) throw err;
        console.log("FILES DELETED");
      });
    }, 3000);
  }, 750);
});

router.post("/postSignatures", (req, res) => {
  let mysql2;
  let processSMS;
  if (req.body.userTitle === 3) {
    if (req.body.financeSignature) {
      processSMS = true;
    } else {
      processSMS = false;
    }
    mysql2 = `select userName, userMobile from users where jobTitle = 4`;
  } else if (req.body.userTitle === 4) {
    if (req.body.managementSignature) {
      processSMS = true;
    } else {
      processSMS = false;
    }
    mysql2 = `select userName, userMobile from users where jobTitle = 3`;
  } else {
    mysql2 = `select userName, userMobile from users where jobTitle = 1`;
    processSMS = true;
  }

  let mysql1 = `update signatures set financeSignature = ${req.body.financeSignature}, managementSignature = ${req.body.managementSignature}, signatureDate = '${req.body.signatureDate}', fileDetails = '${req.body.fileDetails}' where id = 1`;
  let mysql = `${mysql1};${mysql2}`;

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
        if (processSMS) {
          let mobile = result[1][0].userMobile.split(" ");
          mobile = mobile.join("");
          mobile = mobile.split("");
          mobile.shift();
          mobile.unshift("+27");

          mobile = mobile.join("");

          let smstoken = process.env.SMSToken;
          let recipient = mobile;

          params = {
            to: `${recipient}`,
            body: `${req.body.userName} has signed the payment schedule.`,
          };

          axios.defaults.headers.post["Authorization"] = `${smstoken}`; // for POST requests
          let resultA = axios
            .post("https://api.bulksms.com/v1/messages", params)
            .then((result) => {
              smsResult = result.status;
            })
            .catch((error) => {
              let data = {
                status: error,
              };
              // res.json(data);
            });
        } else {
        }
      }
    });
    connection.release();
  });
});

router.get("/getSignatures", (req, res) => {
  let mysql = `select * from signatures`;
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

router.post("/sendpurchaseorder", (req, res) => {
  let mysql = `select first_name, last_name, emailAddress from suppliers where contactID = '${req.body.supplier}'`;
  let filename = req.body.PONumber;
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
        let subject = `Purchase Order- ${req.body.PONumber}`;
        let recipient = `${result[0].emailAddress}`;
        let output = `Dear ${result[0].first_name} ${result[0].last_name},
        Please find attached abovementioned Purchase Order.<br><br><br>
        
        <strong>Please would you supply the items therein contained.</strong><br><br>
        
        Please achknowledge receipt of this email
        Kind regards<br><br>

        <strong>Herbert du Plessis</strong><br>
        Project Manager<br>
        CPC<br><br>
        `;
        sendPOMail(subject, recipient, output, filename)
          .then(() => {
            // console.log(fileName)
            let mysql2 = `update purchaseOrders set sentToSupplier = true where PONumber = '${req.body.PONumber}'`;
            console.log(chalk.blue(mysql2));
            connection.query(mysql2, function (error, result) {
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
          })
          .catch((e) => {
            res.json({ success: false });
          });

        // res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/sendpaymentcertificate", (req, res) => {
  let mysql = `select first_name, last_name, emailAddress from suppliers where id = ${req.body.supplier}`;
  let filename = req.body.certificateNumber;
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
        let subject = `Payment Certificate Issued - ${req.body.certificateNumber}`;
        let recipient = `${result[0].emailAddress}`;
        let output = `Dear ${result[0].first_name} ${result[0].last_name},
        Please find attached abovementioned Payment Certificate.<br><br><br>
        
        <strong>Please ensure the Certificate number and Unit Number is on your invoice.</strong><br><br>
        

        Kind regards<br><br>

        <strong>Herbert du Plessis</strong><br>
        General Dogs Body<br>
        CPC<br><br>
        `;
        sendMail(subject, recipient, output, filename)
          .then(() => {
            res.json({ success: true });
            let mysql2 = `update paymentCertificates set sentToSupplier = true where certificateNumber = '${filename}'`;
            connection.query(mysql2, function (error, result) {
              if (error) {
                console.log("THE ERROR", error);
              } else {
              }
            });
          })
          .catch((e) => {
            res.json({ success: false });
          });

        // res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/sendpaymentcertificateBulK", (req, res) => {
  let mysql1 = `select first_name, last_name, emailAddress from suppliers where id = ${req.body.supplier}`;
  let mysql2 = ``;
  if (req.body.allStatements) {
    mysql2 = `select certificateNumber from paymentCertificates where supplier = ${req.body.supplier}`;
  } else {
    mysql2 = `select certificateNumber from paymentCertificates where supplier = ${req.body.supplier} and sentToSupplier = 0`;
  }
  // let filename = req.body.certificateNumber;
  let mysql = `${mysql1};${mysql2}`;
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
        let attachments = [];
        result[1].forEach((el) => {
          let insert = {
            filename: `${el.certificateNumber}.pdf`,
            path: `public/${el.certificateNumber}.pdf`, // stream this file
          };
          // let insert2 = {
          //   filename: `${el.certificateNumber}Annex.pdf`,
          //   path: `public/${el.certificateNumber}Annex.pdf`,
          // };
          attachments.push(insert);
          // attachments.push(insert2);
        });
        // res.json(result)

        let subject = `Payment Certificate Issued - ${req.body.certificateNumber}`;
        let recipient = `${result[0][0].emailAddress}`;
        let output = `Dear ${result[0][0].first_name} ${result[0][0].last_name},
        Please find attached abovementioned Payment Certificates.<br><br><br>
        
        <strong>Please ensure each Certificate number and Unit Number is on your invoice.</strong><br><br>
        

        Kind regards<br><br>

        <strong>Herbert du Plessis</strong><br>
        CPC<br><br>
        `;

        sendBulkMail(subject, recipient, output, attachments)
          .then(() => {
            res.json({ success: true });
            let mysql3 = `update paymentCertificates set sentToSupplier = true where supplier = ${req.body.supplier}`;
            connection.query(mysql3, function (error, result) {
              if (error) {
                console.log("THE ERROR", error);
              } else {
                console.log("BULK Update Done", result);
              }
            });
          })
          .catch((e) => {
            res.json({ success: false });
          });
      }
    });
    connection.release();
  });
});

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

//   let mailError;

// const resutting =

//   function mailErrorResult() {
//     return mailError
//   }

async function sendImageMail(subject, recipient, output, filename, personToCC) {
  // let mailError;
  let mailOptions = {
    // from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: [
      `${personToCC}`,
      // 'wynand@capeprojects.co.za',
    ],
    subject: `${subject}`,
    text: "Hello world?",
    html: output,
    attachments: [
      {
        // file on disk as an attachment
        filename: `${filename}`,
        path: `public/${filename}`, // stream this file
        // path: `../public/${filename}.pdf`, // stream this file
      },
      // {
      //   // file on disk as an attachment
      //   filename: `${filename}Annex.pdf`,
      //   path: `public/${filename}Annex.pdf`, // stream this file
      // },
    ],
  };
  console.log("MailOptions:", mailOptions);
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection", error);
    } else {
      console.log(info);
    }
    // else {

    // }
  });
}

async function sendPOMail(subject, recipient, output, filename) {
  // let mailError;
  let mailOptions = {
    // from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: [
      "herbert@capeprojects.co.za",
      // 'wynand@capeprojects.co.za',
    ],
    subject: `${subject}`,
    text: "Hello world?",
    html: output,
    attachments: [
      {
        // file on disk as an attachment
        filename: `${filename}.pdf`,
        path: `public/purchaseorders/${filename}.pdf`, // stream this file
        // path: `../public/${filename}.pdf`, // stream this file
      },
      // {
      //   // file on disk as an attachment
      //   filename: `${filename}Annex.pdf`,
      //   path: `public/${filename}Annex.pdf`, // stream this file
      // },
    ],
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection", error);
    }
    // else {

    // }
  });
}

async function sendMail(subject, recipient, output, filename) {
  // let mailError;
  let mailOptions = {
    // from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: [
      "herbert@capeprojects.co.za",
      // 'wynand@capeprojects.co.za',
    ],
    subject: `${subject}`,
    text: "Hello world?",
    html: output,
    attachments: [
      {
        // file on disk as an attachment
        filename: `${filename}.pdf`,
        path: `public/${filename}.pdf`, // stream this file
        // path: `../public/${filename}.pdf`, // stream this file
      },
      // {
      //   // file on disk as an attachment
      //   filename: `${filename}Annex.pdf`,
      //   path: `public/${filename}Annex.pdf`, // stream this file
      // },
    ],
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection", error);
    }
    // else {

    // }
  });
}

async function sendBulkMail(subject, recipient, output, attachments) {
  let mailOptions = {
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: [
      "herbert@capeprojects.co.za",
      // 'wynand@capeprojects.co.za',
    ],
    subject: `${subject}`,
    text: "Hello world?",
    html: output,
    attachments: attachments,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection", error);
    }
    // else {

    // }
  });
}

let deliveryNotice;

router.post("/deliveryVariance", (req, res) => {
  console.log(req.body);
  deliveryNotice = "";
  // res.json({ Awesome: "It Works!!!" });
  let filename = req.body.data[0].PONumber;
  let text = "";
  let length = req.body.data.length - 1;
  req.body.data.forEach((el) => {
    text = `${text} <li>${el.itemDescription} - delivered: ${el.delivered} expected: ${el.quantity} variance: ${el.difference}</li>`;
    // if (index < length) {

    // }
  });

  let subject = `Delivery Variance - ${filename}`;
  let recipient = `${req.body.supplierToEmail[0].emailAddress}`;
  let output = `Dear ${req.body.supplierToEmail[0].supplierName},<b></b>
        There were variances on the following deliveries:<br>
        
        <ol>
        ${text}
        </ol>
        
        Please follow up and inform myself when we can expect the completed delivery.<br><br>
        

        Kind regards<br><br>

        <strong>Herbert du Plessis</strong><br>
        CPC<br><br>
        `;
  console.log(output);
  // sendDeliveryVariance(subject, recipient, output, attachments)
  sendDeliveryVariance(subject, recipient, output)
    .then(() => {
      setTimeout(() => {
        console.log("deliveryNotice", deliveryNotice);
        if (deliveryNotice === "error") {
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }
      }, 500);
    })
    .catch((e) => {
      res.json({ success: false });
    });
});

// async function sendDeliveryVariance(subject, recipient, output, attachments) {
async function sendDeliveryVariance(subject, recipient, output) {
  let mailOptions = {
    from: "Cape Projects Construction <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    cc: [
      "herbert@capeprojects.co.za",
      // 'wynand@capeprojects.co.za',
    ],
    subject: `${subject}`,
    text: "Hello world?",
    html: output,
    // attachments: attachments,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.log("Error with connection", error);
      deliveryNotice = "error";
    } else {
      console.log(info);
      deliveryNotice = "success";
    }
  });
}

module.exports = router;

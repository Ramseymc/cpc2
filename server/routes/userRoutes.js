const express = require("express");
const router = express.Router();
const pool = require("./connection");
const bcrypt = require("bcryptjs");
// const { checktoken, jwtSignUser } = require("./checkToken");
const { checktoken, jwtSignUser } = require("./checkToken");
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const chalk = require("chalk");
const otpGenerator = require('otp-generator')
const axios = require("axios");


router.post("/resetOTP", (req, res) => {

  let OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  
  let mysql = `select userMobile, userName from users where userEmail = '${req.body.email}'`
  console.log(mysql) 
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection AAA");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
      } else {
     
          let mobile = result[0].userMobile.split(" ")
          mobile = mobile.join("")
          mobile = mobile.split("")
          mobile.shift()
          mobile.unshift('+27')

          mobile = mobile.join("")
      

          let smstoken = process.env.SMSToken;
          let recipient = mobile;

          params = {
            to: `${recipient}`,
            body: `Here is your One Time Pin for to Login
                    => ${OTP} <=`,
          };

          axios.defaults.headers.post["Authorization"] = `${smstoken}`; // for POST requests
          let resultA = axios
            .post("https://api.bulksms.com/v1/messages", params)
            .then((result) => {
              smsResult = result.status;
     
        res.json({OTP: OTP})

              
            })
            .catch((error) => {
              let data = {

                status: error,
              };
              res.json(data);
            });
      }
    });
    connection.release();
  });
  //BulmSMS
});

router.get("/getUsers",checktoken, (req, res) => {
    let mysql1 = `select id, userName, userEmail, userMobile, userRole, jobTitle, isActive, isNew from users`
    let mysql2 = `select * from userRoles`
    let mysql3 = `select * from jobTitle`
    let mysql = `${mysql1};${mysql2};${mysql3}`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection AAA");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
      } else {
        res.json({ result });
      }
    });
    connection.release();
  });
});

router.post("/editUser",checktoken, (req, res) => {



    let mysql = `update users set userName = '${req.body.userName}', userEmail = '${req.body.userEmail}', userMobile = '${req.body.userMobile}', 
    userRole = ${req.body.userRole}, jobTitle = ${req.body.userJobType}, isActive = ${req.body.isActive}, isNew = ${req.body.isNew} where id = ${req.body.id}`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection AAA");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
      } else {
        res.json({ result });
      }
    });
    connection.release();
  });
});

router.get("/getRoles",checktoken, (req, res) => {
    let mysql1 = `select * from userRoles`
    let mysql2 = `select * from jobTitle`
    let mysql = `${mysql1};${mysql2}`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection AAA");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
      } else {
        res.json({ result });
      }
    });
    connection.release();
  });
});

router.get("/checkName/:name", (req, res) => {
    let mysql = `select userName from users where userName = '${req.params.name}'`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection AAA");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
      } else {
        res.json({ result });
      }
    });
    connection.release();
  });
});

router.get("/checkEmail/:email", (req, res) => {
    let mysql = `select userEmail from users where userEmail = '${req.params.email}' and isActive = true`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection AAA");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
      } else {
        res.json({ result });
      }
    });
    connection.release();
  });
});

router.post("/createUser", (req, res) => {

  let password = req.body.userPassword

  

  let finalPassword = bcrypt.hash(password, saltRounds, function (err, hash) {

   

    let mysql = `insert into users (userName, userEmail, userPassword, userMobile, userRole, jobTitle, isActive, isNew) values ('${req.body.userName}', '${req.body.userEmail}', '${hash}', '${req.body.userMobile}', ${req.body.userRole}, ${req.body.userJobType}, true, true)`;

    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        resizeBy.send("Error with connection AAA");
      }
      connection.query(mysql, function (error, result) {
        if (error) {
          console.log(error)
        } else {
        res.json(result)
        }
      });
      connection.release();
    });
  });
});

//RESET PASSWORD
router.post("/resetPassword", (req, res) => {
  let mysql = `select * from users where userEmail = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.json({ error: "Error with connection. Are you online?" });
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        res.json({ error: "No such user" });
      } else {
        if (!result.length) {
          res.json({
            error: `No user registered under "${req.body.email}", try signup and register as a user.`,
          });
        } else {
          let password = req.body.password;
          let finalPassword = bcrypt.hash(
            password,
            saltRounds,
            function (err, hash) {
              let mysql2 = `update users set userPassword = '${hash}' where userEmail = '${req.body.email}'`;

              connection.query(mysql2, function (error, result) {
                if (error) {
                  res.json({ success: false });
                } else {
                  res.json({ success: true });
                }
              });
            }
          );
        }
      }
    });
    connection.release();
  });
});

//LOGIN
router.post("/login", (req, res) => {
  let user_password = req.body.password;
  let hashedPassword = "";
  let mysql = `select * from users where userEmail = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.json({ error: "Error with connection. Are you online?" });
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        res.json({ error: "No such user" });
      } else {
        if (!result.length) {
          res.json({
            error: `No user registered under "${req.body.email}", try signup and register as a user.`,
          });
        } else {
          let hash = result[0].userPassword;
          let userJson = {
            id: result[0].id,
            userEmail: result[0].userEmail,
            userName: result[0].userName,
            userRole: result[0].userRole,
            userTitle: result[0].jobTitle,
            userMobile: result[0].userMobile
          };
          bcrypt.compare(user_password, hash, function (err, response) {
            if (response) {
              res.json({
                user: userJson,
                token: jwtSignUser(userJson),
              });
            } else {
              res.json({
                error: "Password is incorrect. Please try again",
              });
            }
          });
        }
      }
    });
    connection.release();
  });
});

module.exports = router

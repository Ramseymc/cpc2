const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");

router.post("/importTasks", checktoken, (req, res) => {
  let post = [];
  let postData = [];
  postData.push(req.body);
  post = postData;
  let mysql = `insert into tasks (development, taskType, unitNumber, taskDescription, cost, quantity, fix, duration, startDate, endDate, supplier) values ?`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, post, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.get("/getUnits/:id", checktoken, (req, res) => {
  let post = [];
  let postData = [];
  postData.push(req.body);
  post = postData;
  let mysql1 = `select id from units where development = ${req.params.id}`;
  let mysql2 = `select id from taskTypes`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, post, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getDataforTemplate", (req, res) => {
  let mysql1 = `select id, developmentName from developments where id = ${req.body.developmentId}`;
  let mysql2 = `select id, development, subsectionName from subsection where development = ${req.body.developmentId} order by subsectionName`;
  let mysql3 = `select id, development, subsection, unitName from units where development = ${req.body.developmentId} order by unitName`;
  let mysql4 = `select id, development,taskName from taskTypes where development = ${req.body.developmentId} order by taskName`;
  let mysql5 = `select id, supplierName from suppliers order by supplierName`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5}`;
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

router.post("/deleteTestData", checktoken, (req, res) => {
  let mysql1 = `delete from progress where task > 162`;
  let mysql2 = `delete from tasks where id > 162`;
  let mysql = `${mysql1};${mysql2}`;
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

router.get("/taskTypes", checktoken, (req, res) => {
  let post = [];
  let postData = [];
  postData.push(req.body);
  post = postData;
  let mysql = `select id, taskName from  taskTypes`;

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

router.post("/addTaskTypes", checktoken, (req, res) => {

  let mysql = `insert into taskTypes (development, taskName) values(${req.body.development},'${req.body.taskName}')`;
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

module.exports = router;

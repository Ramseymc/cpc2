const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
const moment = require("moment");
const fs = require("fs");
const runReport = require("./qualityControlPDF");
const path = require("path");
const multer = require("multer");
var cloudinary = require("cloudinary").v2;
var uniqid = require("uniqid");

//MULTER FILE FILTER
const fileFilter = function (req, file, cb) {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
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
  // dest: `${process.env.DRAFT_INITIAL_UPLOADS}`,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
    fieldSize: 100 * 1024 * 1024,
  },
});

// CLOUDINARY CONFIG - STICK THIS IN ENV FILE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/qcshortname", (req, res) => {
  let mysql = `select distinct shortName from qcquestionnaireTemplate order by shortName`;

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

router.post("/getqctemplate", (req, res) => {
  let mysql1 = `select * from qcquestionnaireTemplate where shortName = '${req.body.shortName}'`;
  let mysql2 = `select * from qcquestionnaireDone where shortName = '${req.body.shortName}' and development = ${req.body.development} and unit = '${req.body.unit}' and section = '${req.body.section}'`;
  let mysql = `${mysql1};${mysql2}`;
  console.log(mysql2);
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

router.post("/getqcPDF", (req, res) => {
  console.log(req.body);
  try {
    if (
      fs.existsSync(
        path.join(__dirname, "..", "public", `${req.body.cert}QCReport.pdf`)
      )
    ) {
      console.log("The file exists.");
      res.json({ exists: true });
    } else {
      console.log("The file does not exist.");
      res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/removeQCImage", (req, res) => {
  // res.json({ Awesome: "It works" });
  cloudinary.uploader.destroy(`${req.body.url_id}`, function (result, error) {
    console.log(result), console.log(error);
    let response = {
      id: req.body.id,
      deletion: "successful",
    };
    res.json(response);
  });
});

router.post("/uploadImageWB", upload.single("image"), (req, res) => {
  console.log(req.file);
  console.log(req.body.id);
  const directory = "public/uploads/";
  let path;

  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    console.log(files);

    for (const file of files) {
      fs.unlink(`${directory}${file}`, (err) => {
        if (err) throw err;
        console.log("FILES DELETED");
      });
    }
  });

  let filename;

  let public_id = "";

  filename = req.file.filename;
  path = `public/uploads/${filename}`;

  try {
    cloudinary.uploader.upload(`${path}`, function (error, result) {
      console.log("RES", result), console.log("ERR", error);
      public_id = result.public_id;
      let returnInfo = {
        public_id: public_id,
        id: req.body.id,
      };
      // console.log(public_id);
      res.json(returnInfo);
    });
  } catch (e) {
    res.json({ Error: "There was an error" });
  }
});



router.post("/postQC", (req, res) => {
  // console.log(req.body);
  console.log(req.body.unit);
  console.log(req.body.info);
  console.log("file", req.file);
  // console.log(req.body.info)
  // req.body.info = JSON.parse(req.body.info);
  // console.log(req.body.info);
  let length = req.body.info.length - 1;


  let uniqueID = uniqid();
  if (req.body.scSignature !== "") {
    var image = req.body.scSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${uniqueID}SC.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE SC");
      console.log(fileName);
    });
  }
  if (req.body.cmSignature !== "") {
    var image = req.body.cmSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${uniqueID}CM.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! CM");
    });
  }
  if (req.body.sfSignature !== "") {
    var image = req.body.sfSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${uniqueID}SF.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! SF");
    });
  }

  let mysql = `Insert into qcquestionnaireDone (development, section, unit, controlDate, controlTimestamp, shortName, name, category, comments, constructionManager, subcontractor, siteforeman, signedConstructionManager, signedSubcontractor, signedSiteforeman,signedConstructionManagerimage, signedSubcontractorimage, signedSiteforemanimage,signedConstructionManagerDate, signedSubcontractorDate, signedSiteforemanDate, image) values `;
  let mysqlAdd = "";
  console.log(req.body.info);
  req.body.info.forEach((el, index) => {
    if (
      el.subcontractor &&
      !el.signedSubcontractor &&
      req.body.scSignature === ""
    ) {
      el.subcontractor = false;
      el.signedSubcontractorImage = null;
    } else if (
      el.subcontractor &&
      !el.signedSubcontractor &&
      req.body.scSignature !== ""
    ) {
      el.signedSubcontractorImage = `'${uniqueID}SC'`;
      el.signedSubcontractor = true;
      el.signedSubcontractorDate = req.body.saveDate
    } else {
      // el.signedSubcontractorImage = null;
      el.signedSubcontractorImage = `'${el.signedSubcontractorImage}'`;
    }
    if (
      el.constructionManager &&
      !el.signedConstructionManager &&
      req.body.cmSignature === ""
    ) {
      el.constructionManager = false;
      el.signedConstructionManagerImage = null;
    } else if (
      el.constructionManager &&
      !el.signedConstructionManager &&
      req.body.cmSignature !== ""
    ) {
      el.signedConstructionManagerImage = `'${uniqueID}CM'`;
      el.signedConstructionManager = true;
      el.signedConstructionManagerDate = req.body.saveDate
    } else {
      el.signedConstructionManagerImage = `'${el.signedConstructionManagerImage}'`;
      // el.signedConstructionManagerImage = null;
    }
    if (
      el.siteforeman &&
      !el.signedSiteforeman &&
      req.body.cmSignature === ""
    ) {
      el.siteforeman = false;
      el.signedSiteforemanImage = null;
    } else if (
      el.siteforeman &&
      !el.signedSiteforeman &&
      req.body.sfSignature !== ""
    ) {
      el.signedSiteforemanImage = `'${uniqueID}SF'`;
      el.signedSiteforeman = true;
      el.signedSiteforemanDate = req.body.saveDate
    } else {
      el.signedSiteforemanImage = `'${el.signedSiteforemanImage}'`;
      // el.signedSiteforemanImage = null;
    }

    if (index < length) {
      mysqlAdd = `${mysqlAdd} (${req.body.development}, "${req.body.section}", "${req.body.unit}", "${req.body.controlDate}", "${req.body.controlTimestamp}",
                           "${el.shortName}", "${el.name}", "${el.category}", "${el.comments}", ${el.constructionManager}, ${el.subcontractor}, ${el.siteforeman}, ${el.signedConstructionManager}, ${el.signedSubcontractor}, ${el.signedSiteforeman}, ${el.signedConstructionManagerImage}, ${el.signedSubcontractorImage}, ${el.signedSiteforemanImage}, '${el.signedConstructionManagerDate}', '${el.signedSubcontractorDate}', '${el.signedSiteforemanDate}','${el.image}'),`;
    } else {
      mysqlAdd = `${mysqlAdd} (${req.body.development}, "${req.body.section}", "${req.body.unit}", "${req.body.controlDate}", ${req.body.controlTimestamp},
                           "${el.shortName}", "${el.name}", "${el.category}", "${el.comments}", ${el.constructionManager}, ${el.subcontractor}, ${el.siteforeman}, ${el.signedConstructionManager}, ${el.signedSubcontractor}, ${el.signedSiteforeman}, ${el.signedConstructionManagerImage}, ${el.signedSubcontractorImage}, ${el.signedSiteforemanImage},'${el.signedConstructionManagerDate}', '${el.signedSubcontractorDate}', '${el.signedSiteforemanDate}','${el.image}');`;
    }
  });
  mysql = `${mysql}${mysqlAdd}`;
  // console.log(mysql);
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
        let data = [];
        data.push(req.body);
        runReport(data);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/editQC", (req, res) => {
  console.log(req.body);
  let uniqueID = uniqid();
  if (req.body.scSignature !== "") {
    var image = req.body.scSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${uniqueID}SC.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE SC");
      console.log(fileName);
    });
  }
  if (req.body.cmSignature !== "") {
    var image = req.body.cmSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${uniqueID}CM.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! CM");
    });
  }
  if (req.body.sfSignature !== "") {
    var image = req.body.sfSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${uniqueID}SF.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! SF");
    });
  }
  console.log(uniqid());
  // runReport(data)

  let mysql = "";
  // console.log(req.body.controlTimestamp);
  req.body.info.forEach((el) => {
    if (
      el.subcontractor &&
      !el.signedSubcontractor &&
      req.body.scSignature === ""
    ) {
      el.subcontractor = false;
      el.signedSubcontractorImage = null;
    } else if (
      el.subcontractor &&
      !el.signedSubcontractor &&
      req.body.scSignature !== ""
    ) {
      el.signedSubcontractorImage = `'${uniqueID}SC'`;
      el.signedSubcontractor = true;
      el.signedSubcontractorDate = req.body.saveDate
    } else {
      el.signedSubcontractorImage = `'${el.signedSubcontractorImage}'`;
      // el.signedSubcontractorImage = null;
    }
    if (
      el.constructionManager &&
      !el.signedConstructionManager &&
      req.body.cmSignature === ""
    ) {
      el.constructionManager = false;
      el.signedConstructionManagerImage = null;
    } else if (
      el.constructionManager &&
      !el.signedConstructionManager &&
      req.body.cmSignature !== ""
    ) {
      el.signedConstructionManagerImage = `'${uniqueID}CM'`;
      el.signedConstructionManager = true;
      el.signedConstructionManagerDate = req.body.saveDate
    } else {
      el.signedConstructionManagerImage = `'${el.signedConstructionManagerImage}'`;
      // el.signedConstructionManagerImage = null;
    }
    if (
      el.siteforeman &&
      !el.signedSiteforeman &&
      req.body.cmSignature === ""
    ) {
      el.siteforeman = false;
      el.signedSiteforemanImage = null;
    } else if (
      el.siteforeman &&
      !el.signedSiteforeman &&
      req.body.sfSignature !== ""
    ) {
      el.signedSiteforemanImage = `'${uniqueID}SF'`;
      el.signedSiteforeman = true;
      el.signedSiteforemanDate = req.body.saveDate
    } else {
      el.signedSiteforemanImage = `'${el.signedSiteforemanImage}'`;
      // el.signedSiteforemanImage = null;
    }

    mysql = `${mysql} update qcquestionnaireDone set development = ${req.body.development}, section = "${req.body.section}", unit =  "${req.body.unit}", controlDate =  "${req.body.controlDate}", controlTimestamp =  "${req.body.controlTimestamp}",
            shortName =  "${el.shortName}", name = "${el.name}", category = "${el.category}", comments = "${el.comments}",constructionManager  =  ${el.constructionManager}, subcontractor = ${el.subcontractor}, siteforeman = ${el.siteforeman}, signedConstructionManager =  ${el.signedConstructionManager},  signedSubcontractor = ${el.signedSubcontractor}, signedSiteforeman = ${el.signedSiteforeman},signedSubcontractorimage = ${el.signedSubcontractorImage},signedSiteforemanimage = ${el.signedSiteforemanImage},signedConstructionManagerimage = ${el.signedConstructionManagerImage},
            signedConstructionManagerDate = '${el.signedConstructionManagerDate}',signedSubcontractorDate = '${el.signedSubcontractorDate}', signedSiteforemanDate = '${el.signedSiteforemanDate}', image = "${el.image}" where id = ${el.id};`;
  });

  // console.log(req.body.info)
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
        let data = [];
        data.push(req.body);
        runReport(data);
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;

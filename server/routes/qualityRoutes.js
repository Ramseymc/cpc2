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

let MAX_SIZE = 2000000;
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
      deletion: "successful"
    }
    res.json(response)
  });
});

router.post("/uploadImage", upload.single("image"), (req, res) => {
  console.log(req.file)
  console.log(req.body.id)
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
  // let publicId,
  let public_id = "";


    filename = req.file.filename;
    path = `public/uploads/${filename}`;

    try {
      cloudinary.uploader.upload(`${path}`, function (error, result) {
        console.log("RES", result), console.log("ERR", error);
        public_id = result.public_id;
        let returnInfo = {
          public_id: public_id,
          id: req.body.id
        }
        // console.log(public_id);
        res.json(returnInfo)

      });
    } catch (e) {
      res.json({ Error: "There was an error" });
    }

})

router.post("/postQC", (req, res) => {
  // console.log(req.body);
  console.log(req.body.unit);
  console.log("file", req.file);
  // console.log(req.body.info)
  // req.body.info = JSON.parse(req.body.info);
  // console.log(req.body.info);
  let length = req.body.info.length - 1;
  // console.log("LENGTH", length);

  

  if (req.body.scSignature !== "") {
    var image = req.body.scSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    // let fileName = "public/aaaa.png"
    let fileName = `public/${req.body.controlTimestamp}SC.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE SC");
    });
  }
  if (req.body.cmSignature !== "") {
    var image = req.body.cmSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${req.body.controlTimestamp}CM.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! CM");
    });
  }
  if (req.body.sfSignature !== "") {
    var image = req.body.sfSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${req.body.controlTimestamp}SF.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! SF");
    });
  }

  let mysql = `Insert into qcquestionnaireDone (development, section, unit, controlDate, controlTimestamp, shortName, name, category, comments, constructionManager, subcontractor, siteforeman, signedConstructionManager, signedSubcontractor, signedSiteforeman, image) values `;
  let mysqlAdd = "";
  req.body.info.forEach((el, index) => {
    if (index < length) {
      mysqlAdd = `${mysqlAdd} (${req.body.development}, '${req.body.section}', '${req.body.unit}', '${req.body.controlDate}', '${req.body.controlTimestamp}',
                           '${el.shortName}', '${el.name}', '${el.category}', '${el.comments}', ${el.constructionManager}, ${el.subcontractor}, ${el.siteforeman}, ${req.body.signedConstructionManager}, ${req.body.signedSubcontractor}, ${req.body.signedSiteforeman},'${el.image}'),`;
    } else {
      mysqlAdd = `${mysqlAdd} (${req.body.development}, '${req.body.section}', '${req.body.unit}', '${req.body.controlDate}', ${req.body.controlTimestamp},
                           '${el.shortName}', '${el.name}', '${el.category}', '${el.comments}', ${el.constructionManager}, ${el.subcontractor}, ${el.siteforeman}, ${req.body.signedConstructionManager}, ${req.body.signedSubcontractor}, ${req.body.signedSiteforeman},'${el.image}');`;
    }
  });
  mysql = `${mysql}${mysqlAdd}`;
  console.log(mysql);
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
  // console.log("XXX", req.body);

  // const oldPath = `public/${req.body.info[0].controlTimestamp}CM.png`;
  // const newPath = `public/${req.body.controlTimestamp}CM.png`;

  // console.log(oldPath);
  // console.log(newPath);
  // fs.rename(oldPath, newPath, function (err) {
  //   if (err) console.log("ERROR: " + err);
  //   console.log("RENAMED!!!!");
  // });
  // fs.rename(oldPath, newPath)

  try {
    if (fs.existsSync(`public/${req.body.info[0].controlTimestamp}CM.png`)) {
      fs.unlink(`public/${req.body.info[0].controlTimestamp}CM.png`, (err) => {
        if (err) throw err;
        console.log("FILES DELETED");
      });
      console.log("The file exists.");
    } else {
      console.log("The file does not exist.");
    }
  } catch (err) {
    console.error(err);
  }
  try {
    if (fs.existsSync(`public/${req.body.info[0].controlTimestamp}SC.png`)) {
      fs.unlink(`public/${req.body.info[0].controlTimestamp}SC.png`, (err) => {
        if (err) throw err;
        console.log("FILES DELETED");
      });
      console.log("The file exists.");
    } else {
      console.log("The file does not exist.");
    }
  } catch (err) {
    console.error(err);
  }
  try {
    if (fs.existsSync(`public/${req.body.info[0].controlTimestamp}SF.png`)) {
      fs.unlink(`public/${req.body.info[0].controlTimestamp}SF.png`, (err) => {
        if (err) throw err;
        console.log("FILES DELETED");
      });
      console.log("The file exists.");
    } else {
      console.log("The file does not exist.");
    }
  } catch (err) {
    console.error(err);
  }
  try {
    if (
      fs.existsSync(`public/${req.body.info[0].controlTimestamp}QCReport.pdf`)
    ) {
      fs.unlink(
        `public/${req.body.info[0].controlTimestamp}QCReport.pdf`,
        (err) => {
          if (err) throw err;
          console.log("FILES DELETED");
        }
      );
      console.log("The file exists.");
    } else {
      console.log("The file does not exist.");
    }
  } catch (err) {
    console.error(err);
  }

  console.log("HELLOOOOOOOO");
  // res.json({awesome: "It works!!!!"})
  if (req.body.scSignature !== "") {
    var image = req.body.scSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    // let fileName = "public/aaaa.png"
    let fileName = `public/${req.body.controlTimestamp}SC.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE SC");
    });
  }
  if (req.body.cmSignature !== "") {
    var image = req.body.cmSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${req.body.controlTimestamp}CM.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! CM");
    });
  }
  if (req.body.sfSignature !== "") {
    var image = req.body.sfSignature;
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    let fileName = `public/${req.body.controlTimestamp}SF.png`;
    fs.writeFile(fileName, data, { encoding: "base64" }, function (err) {
      console.log("DONE!! SF");
    });
  }
  // runReport(data)

  let mysql = "";
  console.log(req.body.controlTimestamp);
  req.body.info.forEach((el) => {
    mysql = `${mysql} update qcquestionnaireDone set development = ${req.body.development}, section = '${req.body.section}', unit =  '${req.body.unit}', controlDate =  '${req.body.controlDate}', controlTimestamp =  '${req.body.controlTimestamp}',
            shortName =  '${el.shortName}', name = '${el.name}', category = '${el.category}', comments = '${el.comments}',constructionManager  =  ${el.constructionManager}, subcontractor = ${el.subcontractor}, siteforeman = ${el.siteforeman}, signedConstructionManager =  ${req.body.signedConstructionManager}, signedSubcontractor = ${req.body.signedSubcontractor}, signedSiteforeman = ${req.body.signedSiteforeman}, image = '${el.image}' 
            where id = ${el.id};`;
  });

  // console.log(mysql)
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

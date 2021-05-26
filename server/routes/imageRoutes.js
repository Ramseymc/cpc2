const express = require("express");
const router = express.Router();
const pool = require("./connection");
const multer = require("multer");
const fs = require("fs");
var cloudinary = require("cloudinary").v2;
const { checktoken } = require("./checkToken");

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

//IMAGE REMOVE
router.post("/removeImage", (req, res) => {
  // res.json({ Awesome: "It works" });
  cloudinary.uploader.destroy(`${req.body.url_id}`, function (result, error) {
    console.log(result), console.log(error);
    let mysql = `delete from siteImages where id = ${req.body.id}`;
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
          res.json({ image: "Destroyed" });
        }
      });
      connection.release();
    });
  });
});

//REMOVE PROFILE IMAGE
// router.post("/removeProfileImage", (req, res) => {
//   res.json({ Awesome: "It works" });
//   cloudinary.uploader.destroy(
//     `${req.body.profileId}`,
//     function (result, error) {
//       console.log(result), console.log(error);
//     }
//   );
// });

//UPLOAD IMAGE INSIDE ARTICLE
// router.post("/uploadImageInEditor", upload.single("image"), (req, res) => {
//   let thisMimeType = req.file.mimetype.split("/")[1];
//   let filename = req.file.filename;
//   let path = `public/uploads/${filename}`;
//   let responseToApp;
//   cloudinary.uploader.upload(`${path}`, function (error, result) {
//     responseToApp = { url: result.secure_url, url_id: result.public_id };
//     res.json(responseToApp);
//     console.log(result), console.log(error);
//   });
//   fs.unlink(path, function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("File Deleted!!");
//     }
//   });
// });
router.post("/uploadDeliveryImage", upload.array("files"), (req, res) => {
  const directory = "public/uploads/";
  let path;

  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(`${directory}${file}`, (err) => {
        if (err) throw err;
        console.log("FILES DELETED");
      });
    }
  });
  function callback() {
    console.log("all done");
    res.json(filesToReturn);
  }
  var itemsProcessed = 0;
  let filesToReturn = [];

  req.files.forEach(async (el) => {
    let filename = el.filename;
    let path = `public/uploads/${filename}`;
    try {
      await cloudinary.uploader.upload(
        `${path}`,
        async function (error, result) {
          await console.log("RES", result.public_id), console.log("ERR", error);
          await filesToReturn.push(result.public_id);
          itemsProcessed++;
          if (itemsProcessed === req.files.length) {
            callback();
          }
        }
      );
    } catch (e) {
      res.json({ Error: "There was an error" });
    }
  });
});

//UPLOAD COVER IMAGE OF ARTICLE
router.post("/uploadCoverImage", upload.array("files"), (req, res) => {
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

  let length = req.files.length;
  let done = 0;

  req.files.forEach((el) => {
    let thisMimeType = el.mimetype.split("/")[1];
    let filename = el.filename;
    let path = `public/uploads/${filename}`;
    let responseToApp;
    try {
      cloudinary.uploader.upload(`${path}`, function (error, result) {
        console.log("RES", result), console.log("ERR", error);
        let mysql = `Insert into siteImages (development, blockName, unitName, comments, secure_url, publicId, uploadedBy) values 
  (${req.body.development},'${req.body.block}','${req.body.unit}','${req.body.comments}','${result.secure_url}','${result.public_id}','${req.body.uploadedBy}')`;

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
              done = done + 1;
              console.log(done);
              if (done === length) {
                res.json({ done: true });
              }
              // console.log(done)
              // res.json(result);
            }
          });
          connection.release();
        });
      });
    } catch (e) {
      res.json({ Error: "There was an error" });
    }
  });
});

router.post("/saveImagesToDatabase", (req, res) => {
  console.log(req.body);

  let mysql = `Insert into siteImages (development, blockName, unitName, comments, secure_url, publicId, uploadedBy) values 
  (${req.body.development},'${req.body.block}','${req.body.unit}','${req.body.comments}','${req.body.secure_url}','${req.body.publicId}','${req.body.uploadedBy}')`;

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

router.post("/getImagesFromDatabase", (req, res) => {
  console.log(req.body);

  let mysql = `select * from siteImages where development = ${req.body.id} order by id desc`;

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

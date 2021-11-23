const express = require("express");
const router = express.Router();
const pool = require("./connection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const  { fetch } =  require('node-fetch');
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");

// var cloudinary = require("cloudinary").v2;
const dayjs = require("dayjs");

//MULTER FILE FILTER
const fileFilter = function (req, file, cb) {
  // accept=".xlsx, .xls, .csv"
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

let MAX_SIZE = 10000000;
const upload = multer({
  dest: "./public/",
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
    fieldSize: 100 * 1024 * 1024,
  },
});

router.post("/getuploadDataWB", (req, res) => {
  console.log("THE BODY", req.body);
  // res.json({awesome: "It Works"})
  let mysql = `select * from smartUploads order by id desc`;
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

router.post("/getsmartsheetControlWB", (req, res) => {
  console.log("THE BODY", req.body);
  // res.json({awesome: "It Works"})
  let mysql1 = `select * from smartsheetControl where development = ${req.body.id}`;
  let mysql2 = `select * from smartToken where development = ${req.body.id}`;
  let mysql3 = `select * from subsection where development = ${req.body.id}`;
  let mysql4 = `select * from developments where id = ${req.body.id}`;
  let mysql  = `${mysql1};${mysql2};${mysql3};${mysql4}`
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
// upload.single("POP")
router.post("/SignPDFWB", upload.single("file"), async (req, res) => {
  console.log("THE BODY", req.body);
  console.log("THE File", req.file);
  // res.json({ awesome: "It Works" });
  let fileName = req.body.fileName;
  let signedFileName = `App${fileName.substring(3, fileName.length)}`;
  console.log("signedFileName", signedFileName);
  fileName = `public/${fileName}`;

  console.log("fileName", fileName);

  await fs.rename(
    `public/${req.file.filename}`,
    `public/${req.file.originalname}`,
    (err) => {
      if (err) console.log("Error renaming", err);
      //throw err
    }
  );

  console.log("TEST");
  const pdfDoc = await PDFDocument.load(fs.readFileSync(fileName));
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const firstPage = pages[pages.length - 1];

  const { width, height } = firstPage.getSize();

  const pngUrl = `public/${req.file.originalname}`;
  console.log("pngUrl", pngUrl);
  let pngImageBytes;

  const promise = fs.promises.readFile(path.join(pngUrl));

  await Promise.resolve(promise).then(function (buffer) {
    console.log("buffer", buffer);
    pngImageBytes = buffer;
  });

  let pngImage;
  try {
    pngImage = await pdfDoc.embedPng(pngImageBytes);
  } catch (e) {
    console.log("e", e);
  }

  const pngDims = pngImage.scale(0.2);

  await firstPage.drawImage(pngImage, {
    x: 300,
    y: 111,
    width: pngDims.width,
    height: pngDims.height,
  });

  let text = `Wayne Bruton, 6 Parkside \n 5 The Close, Tokai, 7975 \n Cape town`;

  await firstPage.drawText(text, {
    x: 90,
    y: 130,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  let now = dayjs(new Date()).format("YYYY-MM-DD");

  await firstPage.drawText(now, {
    x: 480,
    y: 102,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });

  await fs.writeFileSync(`public/${signedFileName}`, await pdfDoc.save());

  await fs.unlink(pngUrl, (err) => {
    if (err) console.log(err);
  });

  console.log("Done!!");

  let mysql = `update smartUploads set uploadSignedDoc1 = '${signedFileName}', uploadSignedDocUser = '${req.body.user}', uploadSignedDocDate = '${req.body.signDate}' where id = ${req.body.idToEdit}`;

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

router.post("/getUsersForEmailWB", (req, res) => {
  console.log("THE BODY", req.body);
  // res.json({awesome: "It Works"})
  let mysql = `select userName, userEmail from users where isActive = 1 order by userName`;
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

router.post("/deleteuploadSDocumentWB", (req, res) => {
  console.log("THE BODY", req.body);
  // res.json({awesome: "It Works"})

  //     uploadUnsignedDoc1
  // uploadUnsignedDoc2
  // uploadUnsignedDoc3
  // uploadUnsignedDoc4
  // uploadUnsignedDoc5
  // uploadSignedDoc1
  // uploadSignedDoc2
  // uploadSignedDoc3
  // uploadSignedDoc4
  // uploadSignedDoc5

  let deleteArray = [];
  for (const key in req.body) {
    console.log(`${key}: ${req.body[key]}`);
    if (
      key === "uploadUnsignedDoc1" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadUnsignedDoc2" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadUnsignedDoc3" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadUnsignedDoc4" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadUnsignedDoc5" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadSignedDoc1" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadSignedDoc2" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadSignedDoc3" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadSignedDoc4" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
    if (
      key === "uploadSignedDoc5" &&
      req.body[key] !== null &&
      req.body[key] !== ""
    ) {
      deleteArray.push(req.body[key]);
    }
  }
  console.log(deleteArray);
  if (deleteArray.length > 0) {
    deleteArray.forEach((el) => {
      console.log("DOC TO DELETE", el);

      el = el.split("/");
      el = `public/${el[el.length - 1]}`;
      console.log(el);
      fs.unlink(el, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file: example_file.txt");
        }
      });
    });

    // deleteArray.forEach((el) => {

    // })
  }

  let mysql = `delete from smartUploads where id = ${req.body.id}`;
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

router.post(
  "/uploadUnsignedDocumentsWB",
  upload.array("files"),
  async (req, res) => {
    console.log("THE BODY", req.body);
    console.log("Files", req.files);
    // res.json({awesome: "It Works"})
    let uploadUnsignedDoc1 = "";
    let uploadUnsignedDoc2 = "";
    let uploadUnsignedDoc3 = "";
    let uploadUnsignedDoc4 = "";
    let uploadUnsignedDoc5 = "";

    await req.files.forEach((el, index) => {
      if (index === 0) {
        uploadUnsignedDoc1 = `Sub${req.body.subNumber}A`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadUnsignedDoc1}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadUnsignedDoc1 = `${uploadUnsignedDoc1}${el.originalname}`;
      }

      if (index === 1) {
        uploadUnsignedDoc2 = `Sub${req.body.subNumber}B`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadUnsignedDoc2}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadUnsignedDoc2 = `${uploadUnsignedDoc2}${el.originalname}`;
      }

      if (index === 2) {
        uploadUnsignedDoc3 = `Sub${req.body.subNumber}C`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadUnsignedDoc3}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadUnsignedDoc3 = `${uploadUnsignedDoc3}${el.originalname}`;
      }

      if (index === 3) {
        uploadUnsignedDoc4 = `Sub${req.body.subNumber}D`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadUnsignedDoc4}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadUnsignedDoc4 = `${uploadUnsignedDoc4}${el.originalname}`;
      }

      if (index === 4) {
        uploadUnsignedDoc5 = `Sub${req.body.subNumber}E`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadUnsignedDoc5}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadUnsignedDoc5 = `${uploadUnsignedDoc5}${el.originalname}`;
      }
    });
    let doc1 = "";
    let doc2 = "";
    let doc3 = "";
    let doc4 = "";
    let doc5 = "";
    let deleteArray = [];
    const doc = await PDFDocument.create();

    if (uploadUnsignedDoc1 !== "") {
      doc1 = await PDFDocument.load(
        fs.readFileSync(`public/${uploadUnsignedDoc1}`)
      );
      let contentPages = await doc.copyPages(doc1, doc1.getPageIndices());
      for (const page of contentPages) {
        doc.addPage(page);
      }
      deleteArray.push(uploadUnsignedDoc1);
    }
    if (uploadUnsignedDoc2 !== "") {
      doc2 = await PDFDocument.load(
        fs.readFileSync(`public/${uploadUnsignedDoc2}`)
      );
      let contentPages = await doc.copyPages(doc2, doc2.getPageIndices());
      for (const page of contentPages) {
        doc.addPage(page);
      }
      deleteArray.push(uploadUnsignedDoc2);
    }
    if (uploadUnsignedDoc3 !== "") {
      doc3 = await PDFDocument.load(
        fs.readFileSync(`public/${uploadUnsignedDoc3}`)
      );
      let contentPages = await doc.copyPages(doc3, doc3.getPageIndices());
      for (const page of contentPages) {
        doc.addPage(page);
      }
      deleteArray.push(uploadUnsignedDoc3);
    }
    if (uploadUnsignedDoc4 !== "") {
      doc4 = await PDFDocument.load(
        fs.readFileSync(`public/${uploadUnsignedDoc4}`)
      );
      let contentPages = await doc.copyPages(doc4, doc4.getPageIndices());
      for (const page of contentPages) {
        doc.addPage(page);
      }
      deleteArray.push(uploadUnsignedDoc4);
    }
    if (uploadUnsignedDoc5 !== "") {
      doc5 = await PDFDocument.load(
        fs.readFileSync(`public/${uploadUnsignedDoc5}`)
      );
      let contentPages = await doc.copyPages(doc5, doc5.getPageIndices());
      for (const page of contentPages) {
        doc.addPage(page);
      }
      deleteArray.push(uploadUnsignedDoc5);
    }

    fs.writeFileSync(
      `public/Sub${req.body.subNumber}-uploaded.pdf`,
      await doc.save()
    );
    console.log("deleteArray", deleteArray);
    if (deleteArray.length > 0) {
      deleteArray.forEach((el) => {
        console.log("DOC TO DELETE", el);

        // el = el.split("/");
        el = `public/${el}`;
        console.log(el);
        fs.unlink(el, (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file: example_file.txt");
          }
        });
      });
    }
    newUpload = `Sub${req.body.subNumber}-uploaded.pdf`;

    let mysql = `insert into smartUploads (uploadUnsignedDoc1,  uploadUnsignedDocUser, uploadUnsignedDocDate, submissionNumber) values (
        '${newUpload}', '${req.body.user}', '${req.body.date}', ${req.body.subNumber}
    )`;
    // let mysql = `insert into smartUploads (uploadUnsignedDoc1, uploadUnsignedDoc2, uploadUnsignedDoc3, uploadUnsignedDoc4, uploadUnsignedDoc5, uploadUnsignedDocUser, uploadUnsignedDocDate, submissionNumber) values (
    //     '${uploadUnsignedDoc1}', '${uploadUnsignedDoc2}', '${uploadUnsignedDoc3}', '${uploadUnsignedDoc4}', '${uploadUnsignedDoc5}', '${req.body.user}', '${req.body.date}', ${req.body.subNumber}
    // )`;
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
  }
);

router.post(
  "/uploadSignedDocumentsWB",
  upload.array("files"),
  async (req, res) => {
    console.log("THE BODY", req.body);
    console.log("Files", req.files);
    // res.json({awesome: "It Works"})
    let uploadSignedDoc1 = "";
    let uploadSignedDoc2 = "";
    let uploadSignedDoc3 = "";
    let uploadSignedDoc4 = "";
    let uploadSignedDoc5 = "";

    await req.files.forEach((el, index) => {
      if (index === 0) {
        uploadSignedDoc1 = `App${req.body.subNumber}A`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadSignedDoc1}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadSignedDoc1 = `${uploadSignedDoc1}${el.originalname}`;
      }

      if (index === 1) {
        uploadSignedDoc2 = `App${req.body.subNumber}B`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadSignedDoc2}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadSignedDoc2 = `${uploadSignedDoc2}${el.originalname}`;
      }

      if (index === 2) {
        uploadSignedDoc3 = `App${req.body.subNumber}C`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadSignedDoc3}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadSignedDoc3 = `${uploadSignedDoc3}${el.originalname}`;
      }

      if (index === 3) {
        uploadSignedDoc4 = `App${req.body.subNumber}D`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadSignedDoc4}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadSignedDoc4 = `${uploadSignedDoc4}${el.originalname}`;
      }

      if (index === 4) {
        uploadSignedDoc5 = `App${req.body.subNumber}E`;
        fs.rename(
          `public/${el.filename}`,
          `public/${uploadSignedDoc5}${el.originalname}`,
          (err) => {
            if (err) console.log("Error renaming", err);
            //throw err
          }
        );
        uploadSignedDoc5 = `${uploadSignedDoc5}${el.originalname}`;
      }
    });
    let mysql = `update smartUploads set uploadSignedDoc1 = '${uploadSignedDoc1}', uploadSignedDoc2 = '${uploadSignedDoc2}' , uploadSignedDoc3 = '${uploadSignedDoc3}', uploadSignedDoc4 = '${uploadSignedDoc4}', uploadSignedDoc5 = '${uploadSignedDoc5}', uploadSignedDocUser = '${req.body.user}', uploadSignedDocDate = '${req.body.date}' where id = ${req.body.id}`;
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
  }
);

//   fs.rename(
//     `public/uploads/${req.file.filename}`,
//     `public/uploads/${req.body.newImageName}`,
//     (err) => {
//       if (err) console.log("Error renaming", err);
//       //throw err
//     }
//   );

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
var fs = require("fs");
const { response } = require("express");
const runReport = require("./purchaseOrderPDF");

router.post("/POEdit", (req, res) => {
  console.log(req.body);
  let PONumber;
  if (req.body.purchaseOrderPDFData.length) {
    runReport(req.body.purchaseOrderPDFData);
    PONumber = req.body.purchaseOrderPDFData[0].PONumber;
  }
  // let postData = [];
  // postData.push(req.body.purchaseOrderToProcess);
  let mysql2 = "";
  if (req.body.stockItemsToUpdate.length) {
    req.body.stockItemsToUpdate.forEach((el) => {
      mysql2 = `${mysql2} update stockItems set itemDescription = '${
        el.itemDescription
      }', unitDescription = '${el.unitDescription}', unitCost = ${parseFloat(
        el.unitCost
      )} where id = ${el.id};`;
    });
  }
  let mysql3 = "";
  if (req.body.stockItemsToAdd.length) {
    req.body.stockItemsToAdd.forEach((el) => {
      mysql3 = `${mysql3}insert into stockItems (itemDescription, unitCost) values ('${
        el.description
      }', ${parseFloat(el.price)});`;
    });
  }
  let mysqla = "";
  if (req.body.purchaseOrderToUpdate.length) {
    req.body.purchaseOrderToUpdate.forEach((el) => {
      mysqla = `${mysqla} update purchaseOrders set subsection = ${el.subsection}, unitNumber = ${el.unitNumber}, supplier = ${el.supplierId}, reference = '${el.reference}', deliveryDate = '${el.deliveryDate}',
        itemDescription = '${el.itemDescription}', quantity = ${el.quantity}, unitDescription = '${el.unitDescription}', unitCost = ${el.price}, totalCost = ${el.totalCost}, vat = ${el.vat}, nettCost = ${el.nettCost} where id = ${el.id};`;
    });
  }
  let mysql1 = "";
  if (req.body.purchaseOrderToInsert.length) {
    req.body.purchaseOrderToInsert.forEach((el) => {
      mysql1 = `${mysql1}insert into purchaseOrders (PONumber,development,subsection, unitNumber, supplier, reference, deliveryDate, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost ) values
    ('${el.PONumber}', ${el.development}, ${el.subsection}, ${el.unitNumber}, ${
        el.supplierId
      }, '${el.reference}', '${el.deliveryDate}', '${
        el.description
      }', ${parseInt(el.quantity)},
    '${el.unit}', ${parseFloat(el.price)}, ${parseFloat(
        el.gross
      )}, ${parseFloat(el.vat)}, ${parseFloat(el.nett)});`;
    });
  }
  let mysql4 = "";
  if (req.body.purchaseOrdersToDelete.length) {
    req.body.purchaseOrdersToDelete.forEach((el) => {
      mysql4 = `${mysql4} delete from PurchaseOrders where id = ${el};`;
    });
  }
  // let mysql1 = `insert into purchaseOrders (PONumber,development,subsection, unitNumber, supplier, reference, deliveryDate, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost ) values ?`;
  let mysql = `${mysqla}${mysql1}${mysql2}${mysql3}${mysql4}`;
  // console.log(chalk.red(mysql))
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

router.post("/POPosting", (req, res) => {
  console.log(req.body);
  runReport(req.body.purchaseOrderPDFData);
  let postData = [];
  let PONumber = req.body.purchaseOrderPDFData[0].PONumber;
  postData.push(req.body.purchaseOrderToProcess);
  let mysql2 = "";
  if (req.body.stockItemsToUpdate.length) {
    req.body.stockItemsToUpdate.forEach((el) => {
      mysql2 = `${mysql2} update stockItems set itemDescription = '${
        el.itemDescription
      }', unitDescription = '${el.unitDescription}', unitCost = ${parseFloat(
        el.unitCost
      )} where id = ${el.id};`;
    });
  }
  let mysql3 = "";
  if (req.body.stockItemsToAdd.length) {
    req.body.stockItemsToAdd.forEach((el) => {
      mysql3 = `${mysql3}insert into stockItems (itemDescription, unitCost) values ('${
        el.description
      }', ${parseFloat(el.price)});`;
    });
  }

  let mysql1 = `insert into purchaseOrders (PONumber,development,subsection, unitNumber, supplier, reference, deliveryDate, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost ) values ?`;
  let mysql = `${mysql1};${mysql2}${mysql3}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, postData, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json({ hrefCert: PONumber });
      }
    });
    connection.release();
  });
});

router.post("/POInformation", (req, res) => {
  console.log(req.body);
  let mysql1 = `select * from suppliers order by supplierName`;
  let mysql2 = `select * from stockItems order by itemDescription`;
  let mysql3 = `select * from purchaseOrders where development = ${req.body.id} order by id desc limit 1`;
  let mysql = `${mysql1};${mysql2};${mysql3}`;
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

router.post("/deletePurchaseOrder", (req, res) => {
  console.log(req.body);

  let mysql = `delete from purchaseOrders where PONumber = '${req.body.PO}'`;
  console.log(mysql);
  // res.json({ awesome: "It works!!!!" });
  fs.unlink(`public/purchaseorders/${req.body.PO}.pdf`, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log("File deleted!");

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
});

router.post("/POInformationForEdit", (req, res) => {
  console.log(req.body);
  let mysql1 = `select * from suppliers order by supplierName`;
  let mysql2 = `select * from stockItems order by itemDescription`;
  // let mysql3 = `select * from purchaseOrders where development = ${req.body.id} order by id desc limit 1`;
  let mysql = `${mysql1};${mysql2}`;
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

router.post("/purchaseOrders", (req, res) => {
  let mysql = `select p.PONumber, s.supplierName,s.contactID, p.reference,p.invoiceNumber,p.invoiceAmount, p.xeroStatus, p.deliveryDate, p.fulfilled,p.sentToSupplier, sum(p.totalCost) as totalCost, sum(p.vat) as vat, sum(p.nettCost) as nettCost from purchaseOrders p, suppliers s
    where p.supplier = s.id and p.development = ${req.body.id}
    group by p.PONumber, s.supplierName, p.reference,p.invoiceNumber,p.invoiceAmount, p.xeroStatus, p.deliveryDate, p.fulfilled, p.sentToSupplier
    order by p.deliveryDate`;
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

router.post("/POreceived", (req, res) => {
  let mysql = `select  distinct s.supplierName, s.id from purchaseOrders p, suppliers s
    where p.supplier = s.id and p.development = ${req.body.id} and p.fulfilled = false
    group by p.PONumber, s.supplierName, p.reference, p.deliveryDate, p.fulfilled
    order by s.supplierName`;
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

router.post("/PONumbers", (req, res) => {
  let mysql = `select  distinct p.PONumber from purchaseOrders p, suppliers s
    where p.supplier = ${req.body.supplier} and p.development = ${req.body.id} and p.fulfilled = false
    group by p.PONumber, s.supplierName, p.reference, p.deliveryDate, p.fulfilled
    order by p.PONumber`;
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

router.post("/getPO", (req, res) => {
  let mysql = `select  p.id,p.delivered, s.subsectionName as subsection,   p.PONumber,p.deliveryDate, p.itemDescription, p.reference, p.quantity, p.unitDescription from purchaseOrders p, subsection s
    where p.PONumber = '${req.body.poNumber}' and p.development = ${req.body.id} and p.fulfilled = false and p.subsection = s.id`;

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
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/postdeliveries", (req, res) => {
  console.log(req.body);

  let sql1 = "";
  let sql2 = "";
  req.body.forEach((el) => {
    sql1 =
      sql1 +
      `Update purchaseOrders set delivered = ${el.delivered}, fulfilled = ${el.fulfilled} where id = ${el.id};`;
    sql2 =
      sql2 +
      `insert into deliveries (PONumber, purchaseNumber, development, supplier, expectedDeliveryDate, quantityExpected, quantityDelivered, enteredBy) values 
                    ('${el.PONumber}', ${el.id}, ${el.development}, ${el.supplier}, '${el.deliveryDate}', ${el.quantity}, ${el.delivered}, '${el.enteredBy}');`;
  });

  let mysql = `${sql1}${sql2}`;
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

router.post("/processInvoiceNumber", (req, res) => {
  console.log("HELLO", req.body);
  let mysql = `update purchaseOrders set invoiceNumber = '${req.body.invoiceNumber}', invoiceDate = '${req.body.invoiceDate}' where development = ${req.body.id} and PONumber = '${req.body.PONumber}' and fulfilled = true`;
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

router.post("/processXeroUpdates", (req, res) => {
  console.log(req.body);
  let mysql = `update purchaseOrders set invoiceAmount = ${req.body.invoiceAmount}, xeroStatus = '${req.body.status}' where development = ${req.body.id} and invoiceNumber = '${req.body.invoiceNumber}' and fulfilled = true`;
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

router.post("/POEditData", (req, res) => {
  console.log(req.body);
  let mysql = `select  p.id, p.PONumber, p.subsection, p.unitNumber, p.supplier, p.reference, p.deliveryDate, p.itemDescription, p.quantity, p.unitDescription, p.unitCost, p.totalCost, p.vat, p.nettCost from purchaseOrders p
  where p.development = ${req.body.id} and PONumber = '${req.body.PONumber}'`;
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

router.post("/getAllUnits", (req, res) => {
  console.log(req.body);
  let mysql = `select * from units
  where development = ${req.body.id}`;
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
        console.log("RESULT", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;

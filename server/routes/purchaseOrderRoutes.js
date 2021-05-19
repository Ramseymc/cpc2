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
  // let mysql3 = "";
  // if (req.body.stockItemsToAdd.length) {
  //   req.body.stockItemsToAdd.forEach((el) => {
  //     mysql3 = `${mysql3}insert into stockItems (itemDescription, unitCost) values ('${
  //       el.description
  //     }', ${parseFloat(el.price)});`;
  //   });
  // }
  let mysqla = "";
  if (req.body.purchaseOrderToUpdate.length) {
    req.body.purchaseOrderToUpdate.forEach((el) => {
      mysqla = `${mysqla} update purchaseOrders set subsection = ${
        el.subsection
      }, unitNumber = ${el.unitNumber}, supplier = ${
        el.supplierId
      }, reference = '${el.reference}', deliveryDate = '${el.deliveryDate}',
      itemCode = '${el.itemCode}',
        itemDescription = '${el.itemDescription}', quantity = ${
        el.quantity
      }, unitDescription = '${el.unitDescription}', unitCost = ${
        el.price
      }, totalCost = ${parseFloat(el.gross)}, vat = ${el.vat}, nettCost = ${
        el.nett
      } where id = ${el.id};`;
    });
  }
  let mysql1 = "";
  if (req.body.purchaseOrderToInsert.length) {
    req.body.purchaseOrderToInsert.forEach((el) => {
      mysql1 = `${mysql1}insert into purchaseOrders (PONumber,development,subsection, unitNumber, supplier, reference, deliveryDate,itemCode, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost ) values
    ('${el.PONumber}', ${el.development}, ${el.subsection}, ${el.unitNumber}, ${
        el.supplierId
      }, '${el.reference}', '${el.deliveryDate}','${el.itemCode}', '${
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
  let mysql5 = `update purchaseOrders set overBudget = ${req.body.purchaseOrderToUpdate[0].overBudget} where PONumber = '${req.body.purchaseOrderToUpdate[0].PONumber}'`
  // let mysql1 = `insert into purchaseOrders (PONumber,development,subsection, unitNumber, supplier, reference, deliveryDate, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost ) values ?`;
  let mysql = `${mysqla}${mysql1}${mysql2}${mysql4}${mysql5}`;
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
  let purchaseData = [];

  let PONumber = req.body.purchaseOrderPDFData[0].PONumber;
  postData.push(req.body.purchaseOrderToProcess);
  purchaseData.push(req.body.stockPurchases);
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
  // let mysql3 = "";
  // if (req.body.stockItemsToAdd.length) {
  //   req.body.stockItemsToAdd.forEach((el) => {
  //     mysql3 = `${mysql3}insert into stockItems (itemDescription, unitCost) values ('${
  //       el.description
  //     }', ${parseFloat(el.price)});`;
  //   });
  // }

  let mysql1 = `insert into purchaseOrders (PONumber,development,subsection, unitNumber, supplier, reference, deliveryDate,stockId, itemCode, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost, overBudget, available ) values ?`;
  let mysql3 = `insert into stockPurchased (stockItem,quantityPurchased,costPerItem, totalCost, vatAmount, nettCost, supplier,PONumber, datePurchased, development,section, unitNumber  ) values ?`;
  // let mysql = `${mysql1};${mysql2}${mysql3}`;
  let mysql = `${mysql1};${mysql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      res.json(err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, postData, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
        res.json("1st Query", error);
      } else {
        // res.json({ hrefCert: PONumber });

        connection.query(mysql3, purchaseData, function (error, result) {
          if (error) {
            console.log("THE ERROR", error);
            res.json("2nd Qry", error);
          } else {
            res.json({ hrefCert: PONumber });
          }
        });
      }
    });
    connection.release();
  });
});

router.post("/POInformation", (req, res) => {
  console.log(req.body);
  let mysql1 = `select * from suppliers where isSubcontractor = false order by supplierName`;
  let mysql2 = `select * from stockItems order by itemDescription`;
  let mysql3 = `select * from purchaseOrders where development = ${req.body.id} order by id desc limit 1`;
  let mysql4 = `select distinct si.id as siId, si.itemCode as siItemCode, si.itemDescription as siItemDescription, si.unitCost as siUnitCost,sb.id as sbId,  sb.stockItem as sbStockItem, sb.quantityBudgetted as sbQuantityBudgetted, 
  sb.costPerItem as sbCostPerItem, sb.unitNumber as sbUnitNumber, sp.id as spId, sp.stockItem as spStockItem, coalesce(sp.quantityPurchased,0) as spQuantityPurchased, coalesce(sp.costPerItem,0) as spCostPerItem, sp.unitNumber as spUnitNumber, coalesce(sb.quantityBudgetted,0) - coalesce(sp.quantityPurchased,0) as available
   from stockBudget sb
  left join stockItems si
  on si.id = sb.stockItem
  left join stockPurchased sp
  on si.id = sp.stockItem and sb.unitNumber = sp.unitNumber`
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
  let mysql1 = `select * from suppliers where isSubcontractor = false order by supplierName`;
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
  let mysql = `select p.PONumber, s.supplierName,s.contactID, p.reference,p.invoiceNumber,p.invoiceAmount, p.xeroStatus, p.deliveryDate, p.comments, p.fulfilled,p.sentToSupplier, p.overBudget,coalesce(sum(d.quantityDelivered),0) as quantityDelivered,coalesce(sum(d.quantityExpected),0) as quantityExpected, sum(p.totalCost) as totalCost, sum(p.vat) as vat, sum(p.nettCost) as nettCost
  from  suppliers s, purchaseOrders p
  left join deliveries d
  on p.id = d.purchaseNumber
     where p.supplier = s.id and p.development = ${req.body.id}
     group by p.PONumber, s.supplierName, p.reference,p.invoiceNumber,p.invoiceAmount, p.xeroStatus, p.deliveryDate,p.comments, p.fulfilled, p.sentToSupplier, p.overBudget
     order by p.deliveryDate`;
  // let mysql = `select p.PONumber, s.supplierName,s.contactID, p.reference,p.invoiceNumber,p.invoiceAmount, p.xeroStatus, p.deliveryDate, p.comments, p.fulfilled,p.sentToSupplier, sum(p.totalCost) as totalCost, sum(p.vat) as vat, sum(p.nettCost) as nettCost from purchaseOrders p, suppliers s
  //   where p.supplier = s.id and p.development = ${req.body.id}
  //   group by p.PONumber, s.supplierName, p.reference,p.invoiceNumber,p.invoiceAmount, p.xeroStatus, p.deliveryDate,p.comments, p.fulfilled, p.sentToSupplier
  //   order by p.deliveryDate`;
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
  let mysql = `select  distinct s.supplierName,s.emailAddress, s.id from purchaseOrders p, suppliers s
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
  // let mysql = `select  p.id,p.delivered, s.subsectionName as subsection,u.unitName as unitNumber,   p.PONumber,p.deliveryDate, p.itemDescription, p.reference, p.quantity, p.unitDescription, p.comments from purchaseOrders p, subsection s, units u
  //   where p.PONumber = '${req.body.poNumber}' and p.development = ${req.body.id} and p.fulfilled = false and p.subsection = s.id  and p.unitNumber = u.id`;

  let mysql = `select  p.id,p.delivered, s.subsectionName as subsection, u.unitName as unit,  p.PONumber,p.deliveryDate, p.itemDescription, p.reference, p.quantity, p.unitDescription, p.comments, d.id as deliveryId, d.quantityDelivered, d.quantityExpected from  subsection s, units u, purchaseOrders p
    left join deliveries d
    on p.id = d.purchaseNumber
        where p.PONumber = '${req.body.poNumber}' and p.development = ${req.body.id} and p.fulfilled = false and p.subsection = s.id and p.unitNumber = u.id`;

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
        console.log(result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/postdeliveries", (req, res) => {
  console.log("&*&*", req.body);

  let sql1 = "";
  let sql2 = "";
  req.body.forEach((el) => {
    sql1 =
      sql1 +
      `Update purchaseOrders set delivered = ${el.delivered}, fulfilled = ${el.fulfilled}, comments = '${el.comments}' where id = ${el.id};`;
    if (el.deliveredPreviously === 0) {
      sql2 =
        sql2 +
        `insert into deliveries (PONumber, purchaseNumber, development, supplier, expectedDeliveryDate, quantityExpected, quantityDelivered, enteredBy, comments) values 
                    ('${el.PONumber}', ${el.id}, ${el.development}, ${el.supplier}, '${el.deliveryDate}', ${el.quantity}, ${el.delivered}, '${el.enteredBy}', '${el.comments}');`;
    } else {
      sql2 = `${sql2} update deliveries set quantityDelivered = ${el.delivered}, quantityExpected = ${el.quantity} where purchaseNumber = ${el.id};`;
    }
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

router.post("/pofulfilled", (req, res) => {
  // console.log("HELLO", req.body);
  // res.json({awesome: "It Works!!"})
  let mysql = `update purchaseOrders set fulfilled = true where PONumber = '${req.body.info[0].PONumber}' and delivered > 0`;
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
  let mysql = `select  p.id, p.PONumber, p.subsection,p.stockId, p.unitNumber, p.supplier, p.reference, p.deliveryDate,p.itemCode, p.itemDescription, p.quantity, p.unitDescription, p.unitCost, p.totalCost, p.vat, p.nettCost, p.comments, p.overBudget, p.available from purchaseOrders p
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

router.post("/getPOUnits", (req, res) => {
  console.log(req.body.info);
  console.log("#######################################");
  let ids = "";
  // let mysql = ''
  if (req.body.info.length > 1) {
    for (let i = 0; i < req.body.info.length; i++) {
      if (i === 0) {
        ids = `subsection = ${req.body.info[i]}`;
      }
      if (i < req.body.info.length && i > 0) {
        ids = `${ids} or subsection = ${req.body.info[i]}`;
      }
      // if (i === req.body.info.length - 1) {
      //   ids = `${ids} `
      // }
    }
  } else {
    ids = `subsection = ${req.body.info[0]}`;
  }
  let mysql = `select * from units where development = ${req.body.id} and ${ids}`;
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
        // console.log("RESULT", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/addStockItem", (req, res) => {
  console.log(req.body);

  // res.json({awesome: "It works!!!"})
  let mysql = `insert into stockItems (itemCode, itemDescription, quantity, unitDescription, unitCost, totalCost, vat, nettCost) values (
   '${req.body.itemCode}','${req.body.itemDescription}',${req.body.quantity},'${req.body.unitDescription}',${req.body.unitCost},${req.body.totalCost},${req.body.vat}, ${req.body.nettCost}
 )`;
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
        // console.log("RESULT", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getStock", (req, res) => {
  console.log(req.body);

  // res.json({awesome: "It works!!!"})
  let mysql = `select * from stockItems order by itemDescription`;
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
        // console.log("RESULT", result);
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getBudget", (req, res) => {
  console.log("Bla Bla", req.body);
  let unit = req.body.unit;
  console.log(unit);
  let unitsChosen = ""
  req.body.unit.forEach((el, index) => {
    if (req.body.unit.length === 1) {
      unitsChosen = `( ${parseInt(el.split("-")[1])} )`
    } else {
      if (index === 0) {
        unitsChosen = `( ${parseInt(el.split("-")[1])} ,`
      } else if (index === req.body.unit.length - 1) {
        unitsChosen = `${unitsChosen} ${parseInt(el.split("-")[1])} )`
      } else {
        unitsChosen = `${unitsChosen} ${parseInt(el.split("-")[1])},`
      }
    }
  })
  console.log(unitsChosen)

  // res.json({awesome: "It works!!!"})
  let mysql1 = `select coalesce(sum(s.quantityBudgetted),0) as quantity from stockBudget s where s.stockItem = ${req.body.id} and s.unitNumber in ${unitsChosen}`;
  let mysql2 = `select coalesce(sum(s.quantityPurchased),0) as quantity from stockPurchased s where s.stockItem = ${req.body.id} and s.unitNumber in ${unitsChosen}`;
  let mysql = `${mysql1};${mysql2}`;
  console.log(mysql)
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

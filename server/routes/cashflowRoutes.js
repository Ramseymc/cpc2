const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
// const moment = require("moment");
var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

router.post("/getCashflowInfo", (req, res) => {
  console.log(req.body);
  // res.json({awesome: "It Works!!!"})
  let mysql = `select p.id, p.development,'Payment Certificate' as documentType ,p.certificateNumber as documentNumber, p.supplier,s.terms, s.supplierName,p.certificateDate as documentDate,p.certificateDate as documentDate2, p.invDate as invoiceDate, coalesce(p.invoiceNumber, 'Not Received') as invoiceNumber , coalesce(p.amtPaid,0) as amountPaid, p.netCurrentCertificateValue as documentValue from paymentCertificates p, suppliers s
    where s.id = p.supplier and p.development = ${req.body.id} and coalesce(p.amtPaid,0) < p.netCurrentCertificateValue and p.payStatus <> 'PAID'
    union
    select distinct po.id, po.development, 'Purchase Order' as documentType, po.PONumber as documentNumber, po.supplier,s.terms, s.supplierName,po.deliveryDate as documentDate,coalesce(d.actualDeliveryDate, po.deliveryDate) as documentDate2, po.invoiceDate as invoiceDate, coalesce(po.invoiceNumber, 'Not Received') as invoiceNumber, po.invoiceAmount as amountPaid, po.nettCost as documentValue  from suppliers s, purchaseOrders po
    left join deliveries d
    on d.purchaseNumber = po.id
    where s.id = po.supplier and po.development = ${req.body.id} and po.invoiceAmount < po.nettCost and coalesce(po.xeroStatus,'AWAITING INVOICE') <> 'PAID'`;

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
        result.forEach((el) => {
          el.documentValue = el.documentValue - el.amountPaid
          switch (el.terms) {
            case 1:
              el.dueDate = dayjs(el.documentDate2)
                .endOf("month")
                .add(1, "month")
                .format("YYYY-MM-DD");
              break;
            case 2:
              el.dueDate = dayjs(el.documentDate2)
                .endOf("week")
                .add(2, "week")
                .format("YYYY-MM-DD");
              break;
            case 3:
              if (dayjs(el.documentDate2).day() === 5) {
                el.dueDate = dayjs(el.documentDate2)
                  .endOf("week")
                  .add(1, "week")
                  .format("YYYY-MM-DD");
              } else {
                el.dueDate = dayjs(el.documentDate2)
                  .endOf("week")
                  .format("YYYY-MM-DD");
              }
              break;
            case 4:
              el.dueDate = dayjs(el.documentDate2)
                .endOf("week")
                .add(1, "week")
                .format("YYYY-MM-DD");
          }
          el.dayOfWeek = dayjs(el.dueDate).day();
          switch (el.dayOfWeek) {
            case 0:
              el.day = "Sunday";
              el.dueDate = dayjs(el.dueDate)
                .subtract(2, "day")
                .format("YYYY-MM-DD");
              break;
            case 1:
              el.day = "Monday";
              break;
            case 2:
              el.day = "Tuesday";
              break;
            case 3:
              el.day = "Wednesday";
              break;
            case 4:
              el.day = "Thursday";
              break;
            case 5:
              el.day = "Friday";
              break;
            case 6:
              el.day = "Saturday";
              el.dueDate = dayjs(el.dueDate)
                .subtract(1, "day")
                .format("YYYY-MM-DD");
          }
          el.dayOfMonth = dayjs(el.dueDate).date().toString()
        //   el.amount = 100
        // el.documentValue = parseInt(Math.round(el.documentValue))
        el.month = dayjs(el.dueDate).format("MMMM")
        el.year = dayjs(el.dueDate).format("YYYY")
        });


        let newResult = []
        result.forEach((el) => {
            let insert = {
                dueDate: el.dueDate,
                dayOfMonth: el.dayOfMonth,
                documentValue: el.documentValue,
                documentType: el.documentType,
                supplierName: el.supplierName,
                year: el.year,
                month: el.month
            }
            newResult.push(insert)
        })
        
        console.log(result);
        // console.log(newResult);
        res.json(newResult);
      }
    });
    connection.release();
  });
});

module.exports = router;

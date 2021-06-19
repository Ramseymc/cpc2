const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
var Excel = require("exceljs");
var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
// const { restore } = require("pdfkit/js/mixins/vector");
dayjs.extend(utc);
dayjs.extend(timezone);

const alphabet = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ,AR,AS,AT,AU,AV,AW,AX,AY,AZ,BA,BB,BC,BD,BE,BF,BG,BH,BI,BJ,BK,BL,BM,BN,BO,BP,BQ,BR,BS,BT,BU,BV,BW,BX,BY,BZ"
let testA = alphabet.split(",")
let maxColumns = []
testA.forEach((el) => {
  maxColumns.push(`${el}1`)
})

const createCFXLSX = async (data) => {
  var workbook = new Excel.Workbook();

  var sheet = workbook.addWorksheet("Raw Data");

  sheet.columns = [
    { header: "Document Type", key: "documentType", width: 25 },
    { header: "supplier", key: "supplierName", width: 32 },
    { header: "Due Date", key: "dueDate", width: 25 },
    {
      header: "Value",
      key: "documentValue",
      width: 25,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' },
    },
  ];

  data.forEach((el) => {
    sheet.addRow({
      documentType: el.documentType,
      supplierName: el.supplierName,
      dueDate: el.dueDate,
      documentValue: el.documentValue,
    });
  });

  var sheet2 = workbook.addWorksheet("Cashflow");
  let dates = [];
  data.forEach((el) => {
    dates.push(el.dueDate);
  });

  dates.sort();
  dates = Array.from(new Set(dates));
  let columns = [
    { header: "Document Type", key: "documentType", width: 25 },
    { header: "Supplier", key: "supplierName", width: 25 },
  ];

  dates.forEach((el, index) => {
    let insert = {
      header: el,
      key: el,
      width: 18,
      style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' },
    };
    columns.push(insert);
  });

  sheet2.columns = columns;

  let rowData = [];
  data.forEach((el) => {
    let insert = {
      documentType: el.documentType,
      supplierName: el.supplierName,
    };
    rowData.push(insert);
  });
  //REMOVE DUPLICATES
  rowData = rowData.filter(
    (el, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.documentType === el.documentType &&
          t.supplierName === el.supplierName
      )
  );
  //TOTAL VALUES BY DOCTYPE && SUPPLIER
  rowData.forEach((el) => {
    dates.forEach((el3) => {
      let newData = data.filter((el2) => {
        return (
          el2.supplierName === el.supplierName &&
          el2.documentType === el.documentType &&
          el2.dueDate === el3
        );
      });
      let sumOfData = newData.reduce((prev, curr) => {
        return prev + curr.documentValue;
      }, 0);
      //KEY FOR KEY VALUE PAIR
      let key = el3;
      el[key] = sumOfData;
    });
  });

  let insertData = [];
  rowData.forEach((el) => {
    let insert = {
      [Object.keys(el)[0]]: el,
    };

    insertData.push(insert);
  });

  insertData.forEach((el) => {
    sheet2.addRow(el.documentType);
  });

  let totalObject = [];
  let sumTotals = [];
  var myObject = rowData[0];
  var keyNames = Object.keys(myObject);
  totalObject = keyNames;

  for (i = 2; i < totalObject.length; i++) {
    let total = insertData.reduce((prev, curr) => {

      return prev + curr.documentType[totalObject[i]];
    }, 0);

    let key = totalObject[i];

    let insert = {
      [key]: total,
    };
    sumTotals.push(insert);
  }

  sumTotals.unshift({ documentType: "", supplierName: "Total" });

  let totalRowData = Object.assign({}, ...sumTotals);

  sheet2.addRow(totalRowData);

  sheet2.getRow(insertData.length + 2).font = { size: 13, bold: true };

  sheet2.autoFilter = {
    from: "A1",
    to: "H1",
  };

  sheet2.views = [
    {
      state: "frozen",
      xSplit: 2,
      ySplit: 1,
      topLeftCell: "G10",
      activeCell: "A1",
    },
  ];

  let colsArray = [];
  for (i = 0; i < Object.keys(insertData[0].documentType).length; i++) {
    colsArray.push(maxColumns[i]);
  }

  colsArray.map((key) => {
    sheet2.getCell(key).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "96C8FB" },
      bgColor: { argb: "96C8FB" },
    };
    sheet2.getCell(key).font = {
      bold: true,
    };
  });

  var filename = "public/cashflow.xlsx";
  workbook.xlsx.writeFile(filename).then(function () {
    // done
  });
};

const getJBCC = (data) => {
  var workbook = new Excel.Workbook();
  var sheet = workbook.addWorksheet("JBCC Data");

  sheet.columns = [
    { header: "Description", key: "subsection", width: 25},
    { header: "Document Type", key: "type", width: 25},

    { header: "Total Task Value", key: "totalTaskValue", width: 32, style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' } },
    { header: "Amount Sent To Supplier / subcontractor", key: "amountSentToSupplier", width: 32, style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' } },
    { header: "Amount Not sent to supplier / subcontractor", key: "amountNotSentToSupplier", width: 25, style: { numFmt: '"R"#,##0.00;[Red]-"R"#,##0.00' } },
  ];
  data.forEach((el) => {
    sheet.addRow(el)
  })
  var filename = "public/JBCC.xlsx";
  workbook.xlsx.writeFile(filename).then(function () {
    // done
  });
};

// createCFXLSX(newData);
router.post("/getJBCC", (req, res) => {
  let mysql1 = `select s.subsectionName,su.vatVendor,pc.sentToSupplier, sum(p.toDate) as gross,sum(p.afterRetention) as afterRetention, coalesce(sum(p.amountPaid),0) as paid 
  from  units u, subsection s, suppliers su, paymentCertificatesDetails p
  left join 
  paymentCertificates pc
  on pc.certificateNumber = p.certificateNumber
  where u.unitName = p.unitName and u.subsection = s.id and p.supplier = su.id and p.development = ${req.body.id}  and s.development = ${req.body.id} 
  group by s.id, su.vatVEndor, pc.sentToSupplier
  `;
  let mysql2 = `select s.subsectionName,su.vatVendor,p.sentToSupplier,sum(p.quantity) as quantity, sum(p.delivered) as delivered,if(su.vatVendor = 1, sum((p.unitCost * p.delivered) * 1.15), sum((p.unitCost * p.delivered) * 1)) as deliveredPrice, sum(p.nettCost) as nettCost, sum(p.invoiceAmount) as invoiceAmount
  from purchaseOrders p, subsection s, suppliers su
  where s.id = p.subsection and p.supplier = su.id and p.development = ${req.body.id} and s.development = ${req.body.id}
  group by s.subsectionName, su.vatVendor, p.sentToSupplier
  `;
  let mysql3 = `select t.supplier,su.vatVendor, u.subsection, s.subsectionName, if(su.vatVendor = 1,sum(t.price),sum(t.price) / 1.15)  as price  from tasks t, units u, subsection s, suppliers su
  where u.id = t.unitNumber and u.subsection = s.id and su.id = t.supplier and t.development = ${req.body.id}
  group by t.supplier, su.vatVendor, u.subsection, s.subsectionName`
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
        let subsections = [];
        result[0].forEach((el) => {
          subsections.push(el.subsectionName);
        });
        result[1].forEach((el) => {
          subsections.push(el.subsectionName);
        });
        result[2].forEach((el) => {
          subsections.push(el.subsectionName);
        });
        subsections = Array.from(new Set(subsections)).sort();
        let poData = [];
        let pcData = [];
        subsections.forEach((el) => {
          let poFilter = result[1].filter((el2) => {
            return el === el2.subsectionName;
          });
          let insert = {
            subsection: el,
            type: "Purchase Order",
            totalTaskValue: 0,
            amountSentToSupplier: poFilter.reduce((prev, curr) => {
              if (curr.sentToSupplier === 1) {
                return prev + curr.nettCost;
              } else {
                return prev;
              }
            }, 0),
            amountNotSentToSupplier: poFilter.reduce((prev, curr) => {
              if (curr.sentToSupplier === 0) {
                return prev + curr.nettCost;
              } else {
                return prev;
              }
            }, 0),
          };
          poData.push(insert);
          let pcFilter = result[0].filter((el2) => {
            return el === el2.subsectionName;
          });
          let secondFilter = result[2].filter((el2) => {
            return el === el2.subsectionName;
          });
          console.log("secondFilter",secondFilter)
          let insert2 = {
            subsection: el,
            type: "Payment Certificate",
            totalTaskValue: secondFilter.reduce((prev, curr) => {
              // if (curr.sentToSupplier === 1) {
                return prev + curr.price;
              // } else {
              //   return prev;
              // }
            },0),
            amountSentToSupplier: pcFilter.reduce((prev, curr) => {
              if (curr.sentToSupplier === 1) {
                return prev + curr.gross;
              } else {
                return prev;
              }
            }, 0),
            amountNotSentToSupplier: pcFilter.reduce((prev, curr) => {
              if (curr.sentToSupplier === 0) {
                return prev + curr.gross;
              } else {
                return prev;
              }
            }, 0),
          };
          pcData.push(insert2);
        });
        console.log("PC DATA",pcData)

        const mergedArray = [...pcData, ...poData];
        let finalData = [];
        subsections.forEach((el) => {
          let filtered = mergedArray.filter((el2) => {
            return el === el2.subsection;
          });
          console.log(filtered)
          let insert3 = {
            subsection: el,
            type: filtered[0].type,
            totalTaskValue: filtered.reduce((prev, curr) => {   
              return prev + curr.totalTaskValue;
          }, 0),
            amountSentToSupplier: filtered.reduce((prev, curr) => {   
                return prev + curr. amountSentToSupplier;
            }, 0),
            amountNotSentToSupplier: filtered.reduce((prev, curr) => {   
                return prev + curr. amountNotSentToSupplier;
            }, 0),
          }
          finalData.push(insert3)
        });
        getJBCC(finalData)
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getCashflowInfo", (req, res) => {
  let mysql = `select p.id, p.development,'Payment Certificate' as documentType ,p.certificateNumber as documentNumber, p.supplier,s.terms, s.supplierName,p.certificateDate as documentDate,p.certificateDate as documentDate2, p.invDate as invoiceDate, coalesce(p.invoiceNumber, 'Not Received') as invoiceNumber , coalesce(p.amtPaid,0) as amountPaid, p.netCurrentCertificateValue as documentValue from paymentCertificates p, suppliers s
  where s.id = p.supplier and p.development = ${req.body.id} and coalesce(p.amtPaid,0) < p.netCurrentCertificateValue and p.payStatus <> 'PAID'
  union
  select distinct po.id, po.development, 'Purchase Order' as documentType, po.PONumber as documentNumber, po.supplier,s.terms, s.supplierName,po.deliveryDate as documentDate,coalesce(d.actualDeliveryDate, po.deliveryDate) as documentDate2, po.invoiceDate as invoiceDate, coalesce(po.invoiceNumber, 'Not Received') as invoiceNumber, po.invoiceAmount as amountPaid, po.nettCost as documentValue  from suppliers s, purchaseOrders po
  left join deliveries d
  on d.purchaseNumber = po.id
  where s.id = po.supplier and po.development = ${req.body.id} and po.invoiceAmount < po.nettCost and coalesce(po.xeroStatus,'AWAITING INVOICE') <> 'PAID'
  union
  select i.id, i.development,'Instruction to Commence' as documentType, i.itcRefNumber as documentNumber, i.supplier, s.terms as terms, s.supplierName,i.startDate as documentDate, i.startDate as documentDate2, i.startDate as invoiceDate, 'Not Received' as invoiceNumber, 0 as amountPaid, i.netVal as documentValue
  from instructionToCommence i, subsection ss, units u, suppliers s, taskTypes t
  where ss.id = i.subsection and u.id = i.unit and s.id = i.supplier and i.development =  ${req.body.id} and t.id = i.taskType`;
  
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
          el.documentValue = el.documentValue - el.amountPaid;
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
          el.dayOfMonth = dayjs(el.dueDate).date().toString();
          //   el.amount = 100
          // el.documentValue = parseInt(Math.round(el.documentValue))
          el.month = dayjs(el.dueDate).format("MMMM");
          el.year = dayjs(el.dueDate).format("YYYY");
        });

        let newResult = [];
        result.forEach((el) => {
          let insert = {
            dueDate: el.dueDate,
            dayOfMonth: el.dayOfMonth,
            documentValue: el.documentValue,
            documentType: el.documentType,
            supplierName: el.supplierName,
            year: el.year,
            month: el.month,
          };
          newResult.push(insert);
        });
        createCFXLSX(newResult);
        res.json(newResult);
      }
    });
    connection.release();
  });
});

module.exports = router;

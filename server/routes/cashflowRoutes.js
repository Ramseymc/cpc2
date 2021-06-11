const express = require("express");
const router = express.Router();
const pool = require("./connection");
const chalk = require("chalk");
const { checktoken, jwtSignUser } = require("./checkToken");
const xl = require("excel4node");
var Excel = require("exceljs");
// const moment = require("moment");
var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const newData = [
  {
    dueDate: "2021-06-30",
    dayOfMonth: "30",
    documentValue: 15519.92,
    documentType: "Payment Certificate",
    supplierName: "Electro Man",
    year: "2021",
    month: "June",
  },
  {
    dueDate: "2021-06-11",
    dayOfMonth: "11",
    documentValue: 11047.87,
    documentType: "Payment Certificate",
    supplierName: "ER Plumbing",
    year: "2021",
    month: "June",
  },
  {
    dueDate: "2021-05-28",
    dayOfMonth: "28",
    documentValue: 12825.93,
    documentType: "Payment Certificate",
    supplierName: "Forest Flooring",
    year: "2021",
    month: "May",
  },
  {
    dueDate: "2021-05-28",
    dayOfMonth: "28",
    documentValue: 496.8,
    documentType: "Purchase Order",
    supplierName: "Builders Warehouse",
    year: "2021",
    month: "May",
  },
  {
    dueDate: "2021-05-28",
    dayOfMonth: "28",
    documentValue: 496.8,
    documentType: "Purchase Order",
    supplierName: "Builders Warehouse",
    year: "2021",
    month: "May",
  },
  {
    dueDate: "2021-06-04",
    dayOfMonth: "4",
    documentValue: 119.13,
    documentType: "Purchase Order",
    supplierName: "Moore Plumbing",
    year: "2021",
    month: "June",
  },
  {
    dueDate: "2021-06-04",
    dayOfMonth: "4",
    documentValue: 119.13,
    documentType: "Purchase Order",
    supplierName: "Moore Plumbing",
    year: "2021",
    month: "June",
  },
  {
    dueDate: "2021-07-16",
    dayOfMonth: "16",
    documentValue: 29.9,
    documentType: "Purchase Order",
    supplierName: "Builders Warehouse",
    year: "2021",
    month: "July",
  },
  {
    dueDate: "2021-07-16",
    dayOfMonth: "16",
    documentValue: 14.95,
    documentType: "Purchase Order",
    supplierName: "Builders Warehouse",
    year: "2021",
    month: "July",
  },
  {
    dueDate: "2021-06-04",
    dayOfMonth: "4",
    documentValue: 1078.7,
    documentType: "Purchase Order",
    supplierName: "Builders Warehouse",
    year: "2021",
    month: "June",
  },
  {
    dueDate: "2021-06-11",
    dayOfMonth: "11",
    documentValue: 632.5,
    documentType: "Purchase Order",
    supplierName: "Builders Warehouse",
    year: "2021",
    month: "June",
  },
  {
    dueDate: "2021-07-30",
    dayOfMonth: "30",
    documentValue: 26206.84,
    documentType: "Instruction to Commence",
    supplierName: "Electro Man",
    year: "2021",
    month: "July",
  },
  {
    dueDate: "2021-07-30",
    dayOfMonth: "30",
    documentValue: 6507.26,
    documentType: "Instruction to Commence",
    supplierName: "Electro Man",
    year: "2021",
    month: "July",
  },
];

let maxColumns = [
  "A1",
  "B1",
  "C1",
  "D1",
  "E1",
  "F1",
  "G1",
  "H1",
  "I1",
  "J1",
  "K1",
  "L1",
  "M1",
  "N1",
  "O1",
  "P1",
  "Q1",
  "R1",
  "S1",
  "T1",
  "U1",
  "V1",
  "W1",
  "X1",
  "Y1",
  "Z1",
  "AA1",
  "AB1",
  "AC1",
  "AD1",
  "AE1",
  "AF1",
  "AG1",
  "AH1",
  "AI1",
  "AJ1",
  "AK1",
  "AL1",
  "AM1",
  "AN1",
  "AO1",
  "AP1",
  "AQ1",
  "AR1",
  "AS1",
  "AT1",
  "AU1",
  "AV1",
  "AW1",
  "AX1",
  "AY1",
  "AZ1",
  "BA1",
  "BB1",
  "BC1",
  "BD1",
  "BE1",
  "BF1",
  "BG1",
  "BH1",
  "BI1",
  "BJ1",
  "BK1",
  "BL1",
  "BM1",
  "BN1",
  "BO1",
  "BP1",
  "BQ1",
  "BR1",
  "BS1",
  "BT1",
  "BU1",
  "BV1",
  "BW1",
  "BX1",
  "BY1",
  "BZ1",
  "CA1",
  "CB1",
  "CC1",
  "CD1",
  "CE1",
  "CF1",
  "CG1",
  "CH1",
  "CI1",
  "CJ1",
  "CK1",
  "CL1",
  "CM1",
  "CN1",
  "CO1",
  "CP1",
  "CQ1",
  "CR1",
  "CS1",
  "CT1",
  "CU1",
  "CV1",
  "CW1",
  "CX1",
  "CY1",
  "CZ1",
  "DA1",
  "DB1",
  "DC1",
  "DD1",
  "DE1",
  "DF1",
  "DG1",
  "DH1",
  "DI1",
  "DJ1",
  "DK1",
  "DL1",
  "DM1",
  "DN1",
  "DO1",
  "DP1",
  "DQ1",
  "DR1",
  "DS1",
  "DT1",
  "DU1",
  "DV1",
  "DW1",
  "DX1",
  "DY1",
  "DZ1",
  "EA1",
  "EB1",
  "EC1",
  "ED1",
  "EE1",
  "EF1",
  "EG1",
  "EH1",
  "EI1",
  "EJ1",
  "EK1",
  "EL1",
  "EM1",
  "EN1",
  "EO1",
  "EP1",
];

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

  console.log(rowData[0]);

  

  let insertData = [];
  rowData.forEach((el) => {
    let insert = {
      [Object.keys(el)[0]]: el,
    };
    console.log("INSERT",insert)
    // console.log(insert.length)
    insertData.push(insert);
  });

  // console.log("InsertData", insertData);
  insertData.forEach((el) => {
    sheet2.addRow(el.documentType);
  });

  let totalObject = [];
  let sumTotals = []
  var myObject = rowData[0];
  var keyNames = Object.keys(myObject);
  totalObject = keyNames;
  // console.log(totalObject);
  for(i = 2; i < totalObject.length; i++ ) {
    let total = insertData.reduce((prev, curr) => {
      // console.log(curr.documentType)
      return  prev + curr.documentType[totalObject[i]]
    },0)
    // console.log(i, total)
    let key = totalObject[i]
    console.log("KEY",key)
    let insert = {
      [key]: total,
    }
    sumTotals.push(insert)
  }

  sumTotals.unshift({documentType: '',
  supplierName: 'Total',})

  console.log(sumTotals)

  let totalRowData = Object.assign({}, ...sumTotals)
  console.log(totalRowData)

  sheet2.addRow(totalRowData)

  console.log(insertData.length)

  sheet2.getRow(insertData.length + 2).font = { size: 13, bold: true };

  // sheet2.getCell('A8').formula === 'subtotal(A1:A7)'

  

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

  // console.log(Object.keys(insertData[0].documentType).length)

  let colsArray = [];
  for (i = 0; i < Object.keys(insertData[0].documentType).length; i++) {
    colsArray.push(maxColumns[i]);
  }

  // console.log(colsArray)

  // ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"].map((key) => {
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
    console.log("Done");
  });
};

// createCFXLSX(newData);

router.post("/getCashflowInfo", (req, res) => {
  console.log("BOSY", req.body);
  // res.json({awesome: "It Works!!!"})
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
  // let mysql = `select p.id, p.development,'Payment Certificate' as documentType ,p.certificateNumber as documentNumber, p.supplier,s.terms, s.supplierName,p.certificateDate as documentDate,p.certificateDate as documentDate2, p.invDate as invoiceDate, coalesce(p.invoiceNumber, 'Not Received') as invoiceNumber , coalesce(p.amtPaid,0) as amountPaid, p.netCurrentCertificateValue as documentValue from paymentCertificates p, suppliers s
  //   where s.id = p.supplier and p.development = ${req.body.id} and coalesce(p.amtPaid,0) < p.netCurrentCertificateValue and p.payStatus <> 'PAID'
  //   union
  //   select distinct po.id, po.development, 'Purchase Order' as documentType, po.PONumber as documentNumber, po.supplier,s.terms, s.supplierName,po.deliveryDate as documentDate,coalesce(d.actualDeliveryDate, po.deliveryDate) as documentDate2, po.invoiceDate as invoiceDate, coalesce(po.invoiceNumber, 'Not Received') as invoiceNumber, po.invoiceAmount as amountPaid, po.nettCost as documentValue  from suppliers s, purchaseOrders po
  //   left join deliveries d
  //   on d.purchaseNumber = po.id
  //   where s.id = po.supplier and po.development = ${req.body.id} and po.invoiceAmount < po.nettCost and coalesce(po.xeroStatus,'AWAITING INVOICE') <> 'PAID'`;

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

        // console.log("Good Result",result);
        // setTimeout
        // setTimeout(() => {
        createCFXLSX(newResult);
        // }, 1000);
        res.json(newResult);
      }
    });
    connection.release();
  });
});

let weatherData = {
  cod: "200",
  message: 0.0204,
  cnt: 96,
  list: [
    {
      dt: 1553709600,
      main: {
        temp: 272.09,
        temp_min: 271.358,
        temp_max: 272.09,
        pressure: 1018.01,
        sea_level: 1018.01,
        grnd_level: 997.153,
        humidity: 100,
        temp_kf: 0.73,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 60,
      },
      wind: {
        speed: 3.25,
        deg: 287.822,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-27 18:00:00",
    },
    {
      dt: 1553713200,
      main: {
        temp: 271.59,
        temp_min: 271.1,
        temp_max: 271.59,
        pressure: 1018.335,
        sea_level: 1018.335,
        grnd_level: 997.403,
        humidity: 100,
        temp_kf: 0.49,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "02n",
        },
      ],
      clouds: {
        all: 2,
      },
      wind: {
        speed: 3.4,
        deg: 294.075,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-27 19:00:00",
    },
    {
      dt: 1553716800,
      main: {
        temp: 271.15,
        temp_min: 270.907,
        temp_max: 271.15,
        pressure: 1018.794,
        sea_level: 1018.794,
        grnd_level: 997.864,
        humidity: 100,
        temp_kf: 0.24,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.47,
        deg: 300.189,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-27 20:00:00",
    },
    {
      dt: 1553720400,
      main: {
        temp: 270.722,
        temp_min: 270.722,
        temp_max: 270.722,
        pressure: 1019.211,
        sea_level: 1019.211,
        grnd_level: 998.29,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.55,
        deg: 305.558,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-27 21:00:00",
    },
    {
      dt: 1553724000,
      main: {
        temp: 270.63,
        temp_min: 270.63,
        temp_max: 270.63,
        pressure: 1019.58,
        sea_level: 1019.58,
        grnd_level: 998.674,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.59,
        deg: 309.126,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-27 22:00:00",
    },
    {
      dt: 1553727600,
      main: {
        temp: 270.421,
        temp_min: 270.421,
        temp_max: 270.421,
        pressure: 1019.849,
        sea_level: 1019.849,
        grnd_level: 998.886,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 0,
      },
      wind: {
        speed: 3.67,
        deg: 307.204,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-27 23:00:00",
    },
    {
      dt: 1553731200,
      main: {
        temp: 270.201,
        temp_min: 270.201,
        temp_max: 270.201,
        pressure: 1020.021,
        sea_level: 1020.021,
        grnd_level: 998.983,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "02n",
        },
      ],
      clouds: {
        all: 7,
      },
      wind: {
        speed: 3.94,
        deg: 304.735,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 00:00:00",
    },
    {
      dt: 1553734800,
      main: {
        temp: 269.942,
        temp_min: 269.942,
        temp_max: 269.942,
        pressure: 1020.24,
        sea_level: 1020.24,
        grnd_level: 999.091,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 66,
      },
      wind: {
        speed: 4.24,
        deg: 306.38,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 01:00:00",
    },
    {
      dt: 1553738400,
      main: {
        temp: 269.768,
        temp_min: 269.768,
        temp_max: 269.768,
        pressure: 1020.634,
        sea_level: 1020.634,
        grnd_level: 999.451,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 67,
      },
      wind: {
        speed: 4.63,
        deg: 313.941,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 02:00:00",
    },
    {
      dt: 1553742000,
      main: {
        temp: 270.054,
        temp_min: 270.054,
        temp_max: 270.054,
        pressure: 1021.2,
        sea_level: 1021.2,
        grnd_level: 1000.078,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 78,
      },
      wind: {
        speed: 5.05,
        deg: 323.001,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 03:00:00",
    },
    {
      dt: 1553745600,
      main: {
        temp: 270.255,
        temp_min: 270.255,
        temp_max: 270.255,
        pressure: 1021.887,
        sea_level: 1021.887,
        grnd_level: 1000.825,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 83,
      },
      wind: {
        speed: 4.77,
        deg: 325.587,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 04:00:00",
    },
    {
      dt: 1553749200,
      main: {
        temp: 270.544,
        temp_min: 270.544,
        temp_max: 270.544,
        pressure: 1022.26,
        sea_level: 1022.26,
        grnd_level: 1001.249,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 86,
      },
      wind: {
        speed: 4.6,
        deg: 325.37,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 05:00:00",
    },
    {
      dt: 1553752800,
      main: {
        temp: 270.867,
        temp_min: 270.867,
        temp_max: 270.867,
        pressure: 1022.629,
        sea_level: 1022.629,
        grnd_level: 1001.705,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 86,
      },
      wind: {
        speed: 4.72,
        deg: 327.239,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 06:00:00",
    },
    {
      dt: 1553756400,
      main: {
        temp: 271.3,
        temp_min: 271.3,
        temp_max: 271.3,
        pressure: 1023.002,
        sea_level: 1023.002,
        grnd_level: 1002.215,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 96,
      },
      wind: {
        speed: 4.78,
        deg: 329.474,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 07:00:00",
    },
    {
      dt: 1553760000,
      main: {
        temp: 271.8,
        temp_min: 271.8,
        temp_max: 271.8,
        pressure: 1023.327,
        sea_level: 1023.327,
        grnd_level: 1002.643,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 95,
      },
      wind: {
        speed: 4.79,
        deg: 331.284,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 08:00:00",
    },
    {
      dt: 1553763600,
      main: {
        temp: 272.6,
        temp_min: 272.6,
        temp_max: 272.6,
        pressure: 1023.522,
        sea_level: 1023.522,
        grnd_level: 1002.861,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 94,
      },
      wind: {
        speed: 4.85,
        deg: 331.928,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 09:00:00",
    },
    {
      dt: 1553767200,
      main: {
        temp: 273.2,
        temp_min: 273.2,
        temp_max: 273.2,
        pressure: 1023.577,
        sea_level: 1023.577,
        grnd_level: 1002.923,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 94,
      },
      wind: {
        speed: 4.79,
        deg: 332.483,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 10:00:00",
    },
    {
      dt: 1553770800,
      main: {
        temp: 273.733,
        temp_min: 273.733,
        temp_max: 273.733,
        pressure: 1023.539,
        sea_level: 1023.539,
        grnd_level: 1002.905,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 94,
      },
      wind: {
        speed: 4.74,
        deg: 332.007,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 11:00:00",
    },
    {
      dt: 1553774400,
      main: {
        temp: 274.088,
        temp_min: 274.088,
        temp_max: 274.088,
        pressure: 1023.439,
        sea_level: 1023.439,
        grnd_level: 1002.827,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 94,
      },
      wind: {
        speed: 4.67,
        deg: 330.692,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 12:00:00",
    },
    {
      dt: 1553778000,
      main: {
        temp: 274.3,
        temp_min: 274.3,
        temp_max: 274.3,
        pressure: 1023.462,
        sea_level: 1023.462,
        grnd_level: 1002.794,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 85,
      },
      wind: {
        speed: 4.34,
        deg: 330.72,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 13:00:00",
    },
    {
      dt: 1553781600,
      main: {
        temp: 274.221,
        temp_min: 274.221,
        temp_max: 274.221,
        pressure: 1023.597,
        sea_level: 1023.597,
        grnd_level: 1002.933,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 65,
      },
      wind: {
        speed: 3.85,
        deg: 328.604,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 14:00:00",
    },
    {
      dt: 1553785200,
      main: {
        temp: 273.5,
        temp_min: 273.5,
        temp_max: 273.5,
        pressure: 1023.736,
        sea_level: 1023.736,
        grnd_level: 1003.062,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 74,
      },
      wind: {
        speed: 2.52,
        deg: 320.741,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-28 15:00:00",
    },
    {
      dt: 1553788800,
      main: {
        temp: 272.231,
        temp_min: 272.231,
        temp_max: 272.231,
        pressure: 1023.865,
        sea_level: 1023.865,
        grnd_level: 1003.222,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 57,
      },
      wind: {
        speed: 2.22,
        deg: 311.882,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 16:00:00",
    },
    {
      dt: 1553792400,
      main: {
        temp: 271.795,
        temp_min: 271.795,
        temp_max: 271.795,
        pressure: 1024.036,
        sea_level: 1024.036,
        grnd_level: 1003.379,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 57,
      },
      wind: {
        speed: 2.03,
        deg: 304.168,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 17:00:00",
    },
    {
      dt: 1553796000,
      main: {
        temp: 271.649,
        temp_min: 271.649,
        temp_max: 271.649,
        pressure: 1024.147,
        sea_level: 1024.147,
        grnd_level: 1003.468,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 63,
      },
      wind: {
        speed: 1.99,
        deg: 296.025,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 18:00:00",
    },
    {
      dt: 1553799600,
      main: {
        temp: 271.7,
        temp_min: 271.7,
        temp_max: 271.7,
        pressure: 1024.107,
        sea_level: 1024.107,
        grnd_level: 1003.522,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.23,
        deg: 289.63,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 19:00:00",
    },
    {
      dt: 1553803200,
      main: {
        temp: 271.9,
        temp_min: 271.9,
        temp_max: 271.9,
        pressure: 1023.891,
        sea_level: 1023.891,
        grnd_level: 1003.246,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.2,
        deg: 281.821,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 20:00:00",
    },
    {
      dt: 1553806800,
      main: {
        temp: 271.974,
        temp_min: 271.974,
        temp_max: 271.974,
        pressure: 1023.761,
        sea_level: 1023.761,
        grnd_level: 1003.012,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.15,
        deg: 274.927,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 21:00:00",
    },
    {
      dt: 1553810400,
      main: {
        temp: 272.326,
        temp_min: 272.326,
        temp_max: 272.326,
        pressure: 1023.737,
        sea_level: 1023.737,
        grnd_level: 1003.014,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: "Snow",
          description: "light snow",
          icon: "13n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.25,
        deg: 277.655,
      },
      snow: {
        "1h": 0.063,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 22:00:00",
    },
    {
      dt: 1553814000,
      main: {
        temp: 272.3,
        temp_min: 272.3,
        temp_max: 272.3,
        pressure: 1023.548,
        sea_level: 1023.548,
        grnd_level: 1002.701,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.2,
        deg: 273.617,
      },
      snow: {},
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-28 23:00:00",
    },
    {
      dt: 1553817600,
      main: {
        temp: 271.7,
        temp_min: 271.7,
        temp_max: 271.7,
        pressure: 1023.206,
        sea_level: 1023.206,
        grnd_level: 1002.39,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.28,
        deg: 276.773,
      },
      snow: {},
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 00:00:00",
    },
    {
      dt: 1553821200,
      main: {
        temp: 271.9,
        temp_min: 271.9,
        temp_max: 271.9,
        pressure: 1022.834,
        sea_level: 1022.834,
        grnd_level: 1002.104,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.18,
        deg: 282.503,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 01:00:00",
    },
    {
      dt: 1553824800,
      main: {
        temp: 271.939,
        temp_min: 271.939,
        temp_max: 271.939,
        pressure: 1022.495,
        sea_level: 1022.495,
        grnd_level: 1001.799,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 1.98,
        deg: 276.512,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 02:00:00",
    },
    {
      dt: 1553828400,
      main: {
        temp: 271.765,
        temp_min: 271.765,
        temp_max: 271.765,
        pressure: 1022.26,
        sea_level: 1022.26,
        grnd_level: 1001.596,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 1.94,
        deg: 268.702,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 03:00:00",
    },
    {
      dt: 1553832000,
      main: {
        temp: 272.078,
        temp_min: 272.078,
        temp_max: 272.078,
        pressure: 1022.008,
        sea_level: 1022.008,
        grnd_level: 1001.44,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.08,
        deg: 265.156,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 04:00:00",
    },
    {
      dt: 1553835600,
      main: {
        temp: 272.882,
        temp_min: 272.882,
        temp_max: 272.882,
        pressure: 1021.719,
        sea_level: 1021.719,
        grnd_level: 1001.251,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.3,
        deg: 263.445,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 05:00:00",
    },
    {
      dt: 1553839200,
      main: {
        temp: 273.525,
        temp_min: 273.525,
        temp_max: 273.525,
        pressure: 1021.434,
        sea_level: 1021.434,
        grnd_level: 1001.049,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.31,
        deg: 257.458,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 06:00:00",
    },
    {
      dt: 1553842800,
      main: {
        temp: 274,
        temp_min: 274,
        temp_max: 274,
        pressure: 1021.167,
        sea_level: 1021.167,
        grnd_level: 1000.808,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: "Snow",
          description: "light snow",
          icon: "13d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.25,
        deg: 246.007,
      },
      snow: {
        "1h": 0.125,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 07:00:00",
    },
    {
      dt: 1553846400,
      main: {
        temp: 274.474,
        temp_min: 274.474,
        temp_max: 274.474,
        pressure: 1020.836,
        sea_level: 1020.836,
        grnd_level: 1000.485,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: "Snow",
          description: "light snow",
          icon: "13d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 2.42,
        deg: 240.812,
      },
      snow: {
        "1h": 0.125,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 08:00:00",
    },
    {
      dt: 1553850000,
      main: {
        temp: 275.451,
        temp_min: 275.451,
        temp_max: 275.451,
        pressure: 1020.481,
        sea_level: 1020.481,
        grnd_level: 1000.151,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 99,
      },
      wind: {
        speed: 2.76,
        deg: 244.039,
      },
      snow: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 09:00:00",
    },
    {
      dt: 1553853600,
      main: {
        temp: 276.225,
        temp_min: 276.225,
        temp_max: 276.225,
        pressure: 1020.127,
        sea_level: 1020.127,
        grnd_level: 999.749,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 95,
      },
      wind: {
        speed: 2.93,
        deg: 246.819,
      },
      snow: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 10:00:00",
    },
    {
      dt: 1553857200,
      main: {
        temp: 276.635,
        temp_min: 276.635,
        temp_max: 276.635,
        pressure: 1019.752,
        sea_level: 1019.752,
        grnd_level: 999.387,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 93,
      },
      wind: {
        speed: 2.99,
        deg: 253.222,
      },
      rain: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 11:00:00",
    },
    {
      dt: 1553860800,
      main: {
        temp: 276.588,
        temp_min: 276.588,
        temp_max: 276.588,
        pressure: 1019.321,
        sea_level: 1019.321,
        grnd_level: 998.972,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 94,
      },
      wind: {
        speed: 2.64,
        deg: 255.679,
      },
      rain: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 12:00:00",
    },
    {
      dt: 1553864400,
      main: {
        temp: 276.351,
        temp_min: 276.351,
        temp_max: 276.351,
        pressure: 1018.913,
        sea_level: 1018.913,
        grnd_level: 998.612,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 96,
      },
      wind: {
        speed: 2.03,
        deg: 249.394,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 13:00:00",
    },
    {
      dt: 1553868000,
      main: {
        temp: 275.845,
        temp_min: 275.845,
        temp_max: 275.845,
        pressure: 1018.448,
        sea_level: 1018.448,
        grnd_level: 998.222,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 89,
      },
      wind: {
        speed: 1.96,
        deg: 241.21,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 14:00:00",
    },
    {
      dt: 1553871600,
      main: {
        temp: 275.174,
        temp_min: 275.174,
        temp_max: 275.174,
        pressure: 1018.157,
        sea_level: 1018.157,
        grnd_level: 998.031,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 89,
      },
      wind: {
        speed: 2.1,
        deg: 239.814,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 15:00:00",
    },
    {
      dt: 1553875200,
      main: {
        temp: 274.625,
        temp_min: 274.625,
        temp_max: 274.625,
        pressure: 1018.082,
        sea_level: 1018.082,
        grnd_level: 998.044,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 91,
      },
      wind: {
        speed: 2.12,
        deg: 238.953,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-29 16:00:00",
    },
    {
      dt: 1553878800,
      main: {
        temp: 274.5,
        temp_min: 274.5,
        temp_max: 274.5,
        pressure: 1018.174,
        sea_level: 1018.174,
        grnd_level: 998.023,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 92,
      },
      wind: {
        speed: 2.02,
        deg: 224.759,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 17:00:00",
    },
    {
      dt: 1553882400,
      main: {
        temp: 274.545,
        temp_min: 274.545,
        temp_max: 274.545,
        pressure: 1018.077,
        sea_level: 1018.077,
        grnd_level: 997.801,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 92,
      },
      wind: {
        speed: 2.11,
        deg: 210.061,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 18:00:00",
    },
    {
      dt: 1553886000,
      main: {
        temp: 274.549,
        temp_min: 274.549,
        temp_max: 274.549,
        pressure: 1017.715,
        sea_level: 1017.715,
        grnd_level: 997.403,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 95,
      },
      wind: {
        speed: 2.25,
        deg: 206.588,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 19:00:00",
    },
    {
      dt: 1553889600,
      main: {
        temp: 274.6,
        temp_min: 274.6,
        temp_max: 274.6,
        pressure: 1017.301,
        sea_level: 1017.301,
        grnd_level: 996.986,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 97,
      },
      wind: {
        speed: 2.62,
        deg: 209.522,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 20:00:00",
    },
    {
      dt: 1553893200,
      main: {
        temp: 274.464,
        temp_min: 274.464,
        temp_max: 274.464,
        pressure: 1016.928,
        sea_level: 1016.928,
        grnd_level: 996.589,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 97,
      },
      wind: {
        speed: 3.11,
        deg: 210.986,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 21:00:00",
    },
    {
      dt: 1553896800,
      main: {
        temp: 273.996,
        temp_min: 273.996,
        temp_max: 273.996,
        pressure: 1016.55,
        sea_level: 1016.55,
        grnd_level: 996.183,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 94,
      },
      wind: {
        speed: 3.28,
        deg: 211.535,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 22:00:00",
    },
    {
      dt: 1553900400,
      main: {
        temp: 273.653,
        temp_min: 273.653,
        temp_max: 273.653,
        pressure: 1016.137,
        sea_level: 1016.137,
        grnd_level: 995.823,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 82,
      },
      wind: {
        speed: 3.29,
        deg: 213.579,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-29 23:00:00",
    },
    {
      dt: 1553904000,
      main: {
        temp: 273.451,
        temp_min: 273.451,
        temp_max: 273.451,
        pressure: 1015.574,
        sea_level: 1015.574,
        grnd_level: 995.131,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 68,
      },
      wind: {
        speed: 3.36,
        deg: 214.711,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 00:00:00",
    },
    {
      dt: 1553907600,
      main: {
        temp: 273.35,
        temp_min: 273.35,
        temp_max: 273.35,
        pressure: 1015.025,
        sea_level: 1015.025,
        grnd_level: 994.618,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.24,
        deg: 222.036,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 01:00:00",
    },
    {
      dt: 1553911200,
      main: {
        temp: 273.319,
        temp_min: 273.319,
        temp_max: 273.319,
        pressure: 1014.506,
        sea_level: 1014.506,
        grnd_level: 994.086,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.16,
        deg: 226.127,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 02:00:00",
    },
    {
      dt: 1553914800,
      main: {
        temp: 273.34,
        temp_min: 273.34,
        temp_max: 273.34,
        pressure: 1014.118,
        sea_level: 1014.118,
        grnd_level: 993.712,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.14,
        deg: 233.422,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 03:00:00",
    },
    {
      dt: 1553918400,
      main: {
        temp: 273.707,
        temp_min: 273.707,
        temp_max: 273.707,
        pressure: 1013.947,
        sea_level: 1013.947,
        grnd_level: 993.522,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.29,
        deg: 244.245,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 04:00:00",
    },
    {
      dt: 1553922000,
      main: {
        temp: 274.795,
        temp_min: 274.795,
        temp_max: 274.795,
        pressure: 1013.873,
        sea_level: 1013.873,
        grnd_level: 993.6,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      clouds: {
        all: 1,
      },
      wind: {
        speed: 3.57,
        deg: 260.303,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 05:00:00",
    },
    {
      dt: 1553925600,
      main: {
        temp: 275.777,
        temp_min: 275.777,
        temp_max: 275.777,
        pressure: 1013.782,
        sea_level: 1013.782,
        grnd_level: 993.761,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 801,
          main: "Clouds",
          description: "few clouds",
          icon: "02d",
        },
      ],
      clouds: {
        all: 16,
      },
      wind: {
        speed: 3.61,
        deg: 270.571,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 06:00:00",
    },
    {
      dt: 1553929200,
      main: {
        temp: 275.819,
        temp_min: 275.819,
        temp_max: 275.819,
        pressure: 1013.7,
        sea_level: 1013.7,
        grnd_level: 993.637,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: {
        all: 99,
      },
      wind: {
        speed: 3.44,
        deg: 264.201,
      },
      rain: {
        "1h": 0.062,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 07:00:00",
    },
    {
      dt: 1553932800,
      main: {
        temp: 275.977,
        temp_min: 275.977,
        temp_max: 275.977,
        pressure: 1013.518,
        sea_level: 1013.518,
        grnd_level: 993.373,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.5,
        deg: 258.7,
      },
      rain: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 08:00:00",
    },
    {
      dt: 1553936400,
      main: {
        temp: 276.604,
        temp_min: 276.604,
        temp_max: 276.604,
        pressure: 1013.255,
        sea_level: 1013.255,
        grnd_level: 993.063,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.41,
        deg: 256.131,
      },
      rain: {
        "1h": 0.063,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 09:00:00",
    },
    {
      dt: 1553940000,
      main: {
        temp: 277.804,
        temp_min: 277.804,
        temp_max: 277.804,
        pressure: 1012.961,
        sea_level: 1012.961,
        grnd_level: 992.7,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.98,
        deg: 262.425,
      },
      rain: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 10:00:00",
    },
    {
      dt: 1553943600,
      main: {
        temp: 277.804,
        temp_min: 277.804,
        temp_max: 277.804,
        pressure: 1012.739,
        sea_level: 1012.739,
        grnd_level: 992.55,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.22,
        deg: 266.821,
      },
      rain: {},
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 11:00:00",
    },
    {
      dt: 1553947200,
      main: {
        temp: 277.805,
        temp_min: 277.805,
        temp_max: 277.805,
        pressure: 1012.455,
        sea_level: 1012.455,
        grnd_level: 992.511,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: {
        all: 99,
      },
      wind: {
        speed: 4.29,
        deg: 271.709,
      },
      rain: {
        "1h": 0.063,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 12:00:00",
    },
    {
      dt: 1553950800,
      main: {
        temp: 277.631,
        temp_min: 277.631,
        temp_max: 277.631,
        pressure: 1012.288,
        sea_level: 1012.288,
        grnd_level: 992.464,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.03,
        deg: 271.664,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 13:00:00",
    },
    {
      dt: 1553954400,
      main: {
        temp: 277.448,
        temp_min: 277.448,
        temp_max: 277.448,
        pressure: 1012.378,
        sea_level: 1012.378,
        grnd_level: 992.699,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.74,
        deg: 270.291,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 14:00:00",
    },
    {
      dt: 1553958000,
      main: {
        temp: 277.1,
        temp_min: 277.1,
        temp_max: 277.1,
        pressure: 1012.714,
        sea_level: 1012.714,
        grnd_level: 992.953,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 98,
      },
      wind: {
        speed: 2.78,
        deg: 262.279,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 15:00:00",
    },
    {
      dt: 1553961600,
      main: {
        temp: 276.152,
        temp_min: 276.152,
        temp_max: 276.152,
        pressure: 1013.119,
        sea_level: 1013.119,
        grnd_level: 993.009,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 89,
      },
      wind: {
        speed: 2.18,
        deg: 239.343,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-30 16:00:00",
    },
    {
      dt: 1553965200,
      main: {
        temp: 275.7,
        temp_min: 275.7,
        temp_max: 275.7,
        pressure: 1013.589,
        sea_level: 1013.589,
        grnd_level: 993.402,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 85,
      },
      wind: {
        speed: 2.57,
        deg: 235.698,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 17:00:00",
    },
    {
      dt: 1553968800,
      main: {
        temp: 275.721,
        temp_min: 275.721,
        temp_max: 275.721,
        pressure: 1013.822,
        sea_level: 1013.822,
        grnd_level: 993.592,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 82,
      },
      wind: {
        speed: 2.8,
        deg: 243.718,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 18:00:00",
    },
    {
      dt: 1553972400,
      main: {
        temp: 275.707,
        temp_min: 275.707,
        temp_max: 275.707,
        pressure: 1013.862,
        sea_level: 1013.862,
        grnd_level: 993.665,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 70,
      },
      wind: {
        speed: 2.89,
        deg: 254,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 19:00:00",
    },
    {
      dt: 1553976000,
      main: {
        temp: 275.581,
        temp_min: 275.581,
        temp_max: 275.581,
        pressure: 1013.807,
        sea_level: 1013.807,
        grnd_level: 993.639,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 69,
      },
      wind: {
        speed: 2.91,
        deg: 258.86,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 20:00:00",
    },
    {
      dt: 1553979600,
      main: {
        temp: 275.331,
        temp_min: 275.331,
        temp_max: 275.331,
        pressure: 1013.801,
        sea_level: 1013.801,
        grnd_level: 993.655,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 67,
      },
      wind: {
        speed: 2.82,
        deg: 261.149,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 21:00:00",
    },
    {
      dt: 1553983200,
      main: {
        temp: 274.931,
        temp_min: 274.931,
        temp_max: 274.931,
        pressure: 1013.864,
        sea_level: 1013.864,
        grnd_level: 993.69,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 64,
      },
      wind: {
        speed: 2.66,
        deg: 260.435,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 22:00:00",
    },
    {
      dt: 1553986800,
      main: {
        temp: 274.755,
        temp_min: 274.755,
        temp_max: 274.755,
        pressure: 1013.837,
        sea_level: 1013.837,
        grnd_level: 993.657,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 63,
      },
      wind: {
        speed: 2.62,
        deg: 254.637,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-30 23:00:00",
    },
    {
      dt: 1553990400,
      main: {
        temp: 274.585,
        temp_min: 274.585,
        temp_max: 274.585,
        pressure: 1013.846,
        sea_level: 1013.846,
        grnd_level: 993.692,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 62,
      },
      wind: {
        speed: 2.65,
        deg: 245.748,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-31 00:00:00",
    },
    {
      dt: 1553994000,
      main: {
        temp: 274.389,
        temp_min: 274.389,
        temp_max: 274.389,
        pressure: 1013.843,
        sea_level: 1013.843,
        grnd_level: 993.659,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 60,
      },
      wind: {
        speed: 2.62,
        deg: 240.513,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-31 01:00:00",
    },
    {
      dt: 1553997600,
      main: {
        temp: 274.265,
        temp_min: 274.265,
        temp_max: 274.265,
        pressure: 1013.755,
        sea_level: 1013.755,
        grnd_level: 993.532,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 67,
      },
      wind: {
        speed: 2.57,
        deg: 238.267,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-31 02:00:00",
    },
    {
      dt: 1554001200,
      main: {
        temp: 274.202,
        temp_min: 274.202,
        temp_max: 274.202,
        pressure: 1013.723,
        sea_level: 1013.723,
        grnd_level: 993.454,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 72,
      },
      wind: {
        speed: 2.49,
        deg: 237.211,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-31 03:00:00",
    },
    {
      dt: 1554004800,
      main: {
        temp: 274.433,
        temp_min: 274.433,
        temp_max: 274.433,
        pressure: 1013.712,
        sea_level: 1013.712,
        grnd_level: 993.422,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 74,
      },
      wind: {
        speed: 2.42,
        deg: 234.88,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 04:00:00",
    },
    {
      dt: 1554008400,
      main: {
        temp: 275.3,
        temp_min: 275.3,
        temp_max: 275.3,
        pressure: 1013.555,
        sea_level: 1013.555,
        grnd_level: 993.358,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 79,
      },
      wind: {
        speed: 2.47,
        deg: 228.786,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 05:00:00",
    },
    {
      dt: 1554012000,
      main: {
        temp: 276.752,
        temp_min: 276.752,
        temp_max: 276.752,
        pressure: 1013.28,
        sea_level: 1013.28,
        grnd_level: 993.192,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 83,
      },
      wind: {
        speed: 2.82,
        deg: 223.432,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 06:00:00",
    },
    {
      dt: 1554015600,
      main: {
        temp: 278.277,
        temp_min: 278.277,
        temp_max: 278.277,
        pressure: 1013.087,
        sea_level: 1013.087,
        grnd_level: 992.961,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.19,
        deg: 218.663,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 07:00:00",
    },
    {
      dt: 1554019200,
      main: {
        temp: 279.833,
        temp_min: 279.833,
        temp_max: 279.833,
        pressure: 1012.831,
        sea_level: 1012.831,
        grnd_level: 992.742,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.54,
        deg: 217.859,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 08:00:00",
    },
    {
      dt: 1554022800,
      main: {
        temp: 281.306,
        temp_min: 281.306,
        temp_max: 281.306,
        pressure: 1012.452,
        sea_level: 1012.452,
        grnd_level: 992.5,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.02,
        deg: 222.601,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 09:00:00",
    },
    {
      dt: 1554026400,
      main: {
        temp: 282.568,
        temp_min: 282.568,
        temp_max: 282.568,
        pressure: 1012.038,
        sea_level: 1012.038,
        grnd_level: 992.133,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.48,
        deg: 228.197,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 10:00:00",
    },
    {
      dt: 1554030000,
      main: {
        temp: 283.3,
        temp_min: 283.3,
        temp_max: 283.3,
        pressure: 1011.796,
        sea_level: 1011.796,
        grnd_level: 991.829,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 91,
      },
      wind: {
        speed: 4.72,
        deg: 229.969,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 11:00:00",
    },
    {
      dt: 1554033600,
      main: {
        temp: 283.683,
        temp_min: 283.683,
        temp_max: 283.683,
        pressure: 1011.418,
        sea_level: 1011.418,
        grnd_level: 991.409,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 83,
      },
      wind: {
        speed: 4.76,
        deg: 231.009,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 12:00:00",
    },
    {
      dt: 1554037200,
      main: {
        temp: 283.821,
        temp_min: 283.821,
        temp_max: 283.821,
        pressure: 1011.044,
        sea_level: 1011.044,
        grnd_level: 991.069,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
        },
      ],
      clouds: {
        all: 48,
      },
      wind: {
        speed: 4.64,
        deg: 232.76,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 13:00:00",
    },
    {
      dt: 1554040800,
      main: {
        temp: 283.735,
        temp_min: 283.735,
        temp_max: 283.735,
        pressure: 1010.863,
        sea_level: 1010.863,
        grnd_level: 990.762,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
        },
      ],
      clouds: {
        all: 49,
      },
      wind: {
        speed: 4.19,
        deg: 229.135,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 14:00:00",
    },
    {
      dt: 1554044400,
      main: {
        temp: 282.8,
        temp_min: 282.8,
        temp_max: 282.8,
        pressure: 1010.924,
        sea_level: 1010.924,
        grnd_level: 990.638,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
        },
      ],
      clouds: {
        all: 50,
      },
      wind: {
        speed: 3.63,
        deg: 216.715,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 15:00:00",
    },
    {
      dt: 1554048000,
      main: {
        temp: 282.095,
        temp_min: 282.095,
        temp_max: 282.095,
        pressure: 1011.143,
        sea_level: 1011.143,
        grnd_level: 990.871,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: {
        all: 61,
      },
      wind: {
        speed: 4.29,
        deg: 221.046,
      },
      rain: {
        "1h": 0.063,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2019-03-31 16:00:00",
    },
    {
      dt: 1554051600,
      main: {
        temp: 281.5,
        temp_min: 281.5,
        temp_max: 281.5,
        pressure: 1011.332,
        sea_level: 1011.332,
        grnd_level: 991.048,
        humidity: 100,
        temp_kf: 0,
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04n",
        },
      ],
      clouds: {
        all: 63,
      },
      wind: {
        speed: 4.61,
        deg: 226.055,
      },
      rain: {},
      sys: {
        pod: "n",
      },
      dt_txt: "2019-03-31 17:00:00",
    },
  ],
  city: {
    id: 524901,
    name: "Moscow",
    coord: {
      lat: 55.7522,
      lon: 37.6156,
    },
    country: "RU",
  },
};

const processWeatherData = async () => {
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("Weather Data");
  var style = wb.createStyle({
    font: {
      color: "#000000",
      size: 10,
    },
  });
  //  ws.cell(1, 1)
  //     .string(Object.keys(weatherData.list[0].main)[0])
  //     .style(style);
  for (i = 0; i < Object.keys(weatherData.list[0].main).length; i++) {
    ws.cell(1, i + 1)
      .string(Object.keys(weatherData.list[0].main)[i])
      .style(style);
  }
  for (a = 0; a < weatherData.list.length; a++) {
    ws.cell(a + 2, 1)
      .number(weatherData.list[a].main.temp)
      .style(style);

    ws.cell(a + 2, 2)
      .number(weatherData.list[a].main.temp_min)
      .style(style);
    ws.cell(a + 2, 3)
      .number(weatherData.list[a].main.temp_max)
      .style(style);
    ws.cell(a + 2, 4)
      .number(weatherData.list[a].main.pressure)
      .style(style);
    ws.cell(a + 2, 5)
      .number(weatherData.list[a].main.sea_level)
      .style(style);
    ws.cell(a + 2, 6)
      .number(weatherData.list[a].main.grnd_level)
      .style(style);
    ws.cell(a + 2, 7)
      .number(weatherData.list[a].main.humidity)
      .style(style);
    ws.cell(a + 2, 8)
      .number(weatherData.list[a].main.temp_kf)
      .style(style);
  }
  console.log(Object.keys(weatherData.list[0].main).length);
  wb.write("public/weatherdata.xlsx");
};

// processWeatherData();

module.exports = router;

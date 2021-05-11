const path = require("path");

var fonts = {
  Roboto: {
    // normal: 'fonts/Roboto-Regular.ttf',
    normal: path.join(
      __dirname,
      "..",
      "public",
      "fonts/Roboto/Roboto-Regular.ttf"
    ),
    bold: path.join(
      __dirname,
      "..",
      "public",
      "fonts/Roboto/Roboto-Medium.ttf"
    ),
    italics: path.join(
      __dirname,
      "..",
      "public",
      "fonts/Roboto/Roboto-Italic.ttf"
    ),
    bolditalics: path.join(
      __dirname,
      "..",
      "public",
      "fonts/Roboto/Roboto-MediumItalic.ttf"
    ),
  },
};
// var fonts = '../pdfMake/vfs_fonts.js'

var PdfPrinter = require("pdfmake");
var printer = new PdfPrinter(fonts);
var fs = require("fs");
const { fontSize } = require("pdfkit");
// const { fontSize } = require("pdfkit/js/mixins/fonts");

const runReport = (data) => {
  let now = new Date().toISOString().substring(0, 10);
  let dataInput = [];
  let subDataInput = [];

  data.forEach((el) => {
    let insert1 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: el.description,
      fontSize: 8,
      alignment: "left",
      // vLineWidth: 2,
    };
    let insert3 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: el.quantity,
      alignment: "center",
      fontSize: 8,
      // vLineWidth: 2,
    };

    let insert2 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: `Block ${el.unitChosen.split('-')[0]}`,
      fontSize: 8,
      alignment: "center",
      // vLineWidth: 2,
    };

    let insert4 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: `${convertToString(el.price)}`,
      fontSize: 8,
      alignment: "right",
      // vLineWidth: 2,
    };

    let insert5 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: convertToString(el.gross),
      fontSize: 8,
      alignment: "right",
      // vLineWidth: 2,
    };
    let insert8 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: convertToString(el.vat),
      fontSize: 8,
      alignment: "right",
      // vLineWidth: 2,
    };
    let insert6 = {
      border: [true, true, true, true],
      // fillColor: "#eeeeff",
      text: convertToString(el.nett),
      fontSize: 8,
      alignment: "right",
      // bold: true,
      // vLineWidth: 2,
    };
    // let insert7 = {
    //   border: [true, true, true, true],
    //   // fillColor: "#eeeeff",
    //   text: el.block,
    //   fontSize: 8,
    //   alignment: "center",
    //   // bold: true,
    //   // vLineWidth: 2,
    //   //   color: "green"
    // };
    // let insert9 = {
    //   border: [true, true, true, true],
    //   // fillColor: "#eeeeff",
    //   text: el.unitChosen.split("-")[0],
    //   fontSize: 8,
    //   alignment: "center",
    //   // bold: true,
    //   // vLineWidth: 2,
    //   //   color: "green"
    // };
    // subDataInput.push(insert7);
    // subDataInput.push(insert9);
    subDataInput.push(insert1);
    subDataInput.push(insert2);
    subDataInput.push(insert3);
    subDataInput.push(insert4);
    subDataInput.push(insert5);
    subDataInput.push(insert8);
    subDataInput.push(insert6);

    dataInput.push(subDataInput);
    subDataInput = [];
  });

  let header = [
    // {
    //   text: "Block",
    //   style: "tableHeader",
    //   fontSize: 8,
    //   // fillColor: "#0d989c",
    // },
    // {
    //   text: "Unit",
    //   style: "tableHeader",
    //   fontSize: 8,
    //   // fillColor: "#0d989c",
    // },
    { text: "Description", style: "tableHeader", fontSize: 8 },
    { text: "Unit", style: "tableHeader", fontSize: 8 },
    { text: "Qty", style: "tableHeader", fontSize: 8 },
    {
      text: "Price",
      style: "tableHeader",
      fontSize: 8,
      // fillColor: "#0d989c",
    },
    {
      text: "Gross",
      style: "tableHeader",
      fontSize: 8,
      // fillColor: "#0d989c",
    },
    {
      text: "VAT",
      style: "tableHeader",
      fontSize: 8,
      // fillColor: "#0d989c",
    },
    {
      text: "Nett",
      style: "tableHeader",
      fontSize: 8,
      // fillColor: "#0d989c",
    },
  ];

  dataInput.unshift(header);

  let grossPrice = data.reduce((acc, el) => {
    return acc + parseFloat(el.gross);
  }, 0);
  let vatPrice = data.reduce((acc, el) => {
    return acc + parseFloat(el.vat);
  }, 0);
  let nettPrice = data.reduce((acc, el) => {
    return acc + parseFloat(el.nett);
  }, 0);
  let totalsData = [
    { price: grossPrice, type: "Gross" },
    { price: vatPrice, type: "Vat" },
    { price: nettPrice, type: "Nett" },
  ];
  let dataInput2 = [];
  let subDataInput2 = [];
  let tinsert1 = {
    border: [true, true, true, true],
    text: `\n Supplier: ${data[0].supplierName} \n Address: ${data[0].supplierStreet} \n `,
    fontSize: 8,
    alignment: "left",
  };
  let tinsert2 = {
    border: [true, true, true, true],
    text: `\n Delivery: SITE \n Delivery Date: ${data[0].deliveryDate}`,
    fontSize: 8,
    alignment: "left",
  };
  subDataInput2.push(tinsert1);
  subDataInput2.push(tinsert2);
  dataInput2.push(subDataInput2);

  let dataInput1 = [];
  let subDataInput1 = [];
  totalsData.forEach((el) => {
    let sinsert1 = {
      border: [false, false, false, false],
      text: "",
      fontSize: 8,
      alignment: "left",
    };
    let sinsert2 = {
      border: [false, false, false, false],
      text: "",
      alignment: "right",
      fontSize: 8,
    };

    let sinsert3 = {
      border: [false, false, false, false],
      text: "",
      fontSize: 8,
      alignment: "center",
    };

    let sinsert4 = {
      border: [false, false, false, false],
      text: ``,
      fontSize: 8,
      alignment: "right",
    };

    let sinsert5 = {
      border: [false, false, false, false],
      text: "",
      fontSize: 8,
      alignment: "right",
    };
    let sinsert8 = {
      border: [false, false, false, false],
      text: el.type,
      bold: true,
      fontSize: 8,
      alignment: "right",
    };
    let sinsert6 = {
      border: [true, true, true, true],
      text: convertToString(el.price),
      fontSize: 8,
      alignment: "right",
    };
    let sinsert7 = {
      border: [false, false, false, false],
      text: "",
      fontSize: 8,
      alignment: "center",
    };
    let sinsert9 = {
      border: [false, false, false, false],
      text: "",
      fontSize: 8,
      alignment: "center",
    };
    subDataInput1.push(sinsert7);
    subDataInput1.push(sinsert9);
    subDataInput1.push(sinsert1);
    subDataInput1.push(sinsert2);
    subDataInput1.push(sinsert3);
    subDataInput1.push(sinsert4);
    subDataInput1.push(sinsert5);
    subDataInput1.push(sinsert8);
    subDataInput1.push(sinsert6);

    dataInput1.push(subDataInput1);
    subDataInput1 = [];
  });

  //   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  var docDefinition = {
    pageSize: "A4",
    footer: function (currentPage, pageCount) {
      return [
        {
          text:
            "Page " + currentPage.toString() + " of " + pageCount + " Pages",
          fontSize: 8,
          alignment: "center",
        },
      ];
    },
    content: [
      //   {text: 'Column/row spans', pageBreak: 'before', style: 'subheader', pageOrientation: "landscape",},
      {
        image: "logo",
        width: 120,
        alignment: "center",
        // pageBreak: "before",
        // pageOrientation: "landscape",
      },
      // { text: "\n" },
      {
        text: `Purchase Order`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      // { text: "\n" },

      {
        text: `PO Number: ${data[0].PONumber}`,
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      { text: "\n" },
      //   "Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.",
      {
        // style: "tableExample",
        // widths: [60, 60, 60, 120, 120],
        table: {
          // headerRows: 1,
          body: dataInput2,
          widths: [246, 246],
          border: [true, true, true, true],
        },

        // layout: {
        //   hLineWidth: function (i, node) {
        //     return i === 0 || i === node.table.body.length ? 2 : 1;
        //   },
        //   vLineWidth: function (i, node) {
        //     return i === 0 || i === node.table.widths.length ? 2 : 1;
        //   },
        //   hLineColor: function (i, node) {
        //     return i === 0 || i === node.table.body.length ? "black" : "gray";
        //   },
        //   vLineColor: function (i, node) {
        //     return i === 0 || i === node.table.widths.length ? "black" : "gray";
        //   },
        // },
      },
      { text: "\n" },
      {
        // style: "tableExample",
        // widths: [60, 60, 60, 120, 120],
        table: {
          headerRows: 1,
          body: dataInput,
          widths: [120, 60, 30, 60, 60, 60, 60],
          border: [true, true, true, true],
        },

        // layout: {
        //   hLineWidth: function (i, node) {
        //     return i === 0 || i === node.table.body.length ? 2 : 1;
        //   },
        //   vLineWidth: function (i, node) {
        //     return i === 0 || i === node.table.widths.length ? 2 : 1;
        //   },
        //   hLineColor: function (i, node) {
        //     return i === 0 || i === node.table.body.length ? "black" : "gray";
        //   },
        //   vLineColor: function (i, node) {
        //     return i === 0 || i === node.table.widths.length ? "black" : "gray";
        //   },
        // },
      },
      { text: "\n" },
      {
        table: {
          body: dataInput1,
          widths: [40, 40, 120, 30, 40, 40, 20, 40, 58],
        },
        // layout: {
        //   hLineWidth: function (i, node) {
        //     return i === 0 || i === node.table.body.length ? 2 : 1;
        //   },
        //   vLineWidth: function (i, node) {
        //     return i === 0 || i === node.table.widths.length ? 2 : 1;
        //   },
        //   hLineColor: function (i, node) {
        //     return i === 0 || i === node.table.body.length ? "black" : "gray";
        //   },
        //   vLineColor: function (i, node) {
        //     return i === 0 || i === node.table.widths.length ? "black" : "gray";
        //   },
        // },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        // margin: [0, 0, 0, 0],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
        margin: [5, 5, 5, 5],
        // margin: [0, 0, 0, 0],
      },
    },
    defaultStyle: {
      // alignment: 'center'
    },
    images: {
      logo:
        // '../public/cpc.jpeg',
        path.join(__dirname, "..", "public", "cpc.png"),
    },
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(
    fs.createWriteStream(`public/purchaseorders/${data[0].PONumber}.pdf`)
  );
  //   pdfDoc.pipe(fs.createWriteStream("public/document.pdf"));
  pdfDoc.end();
};

const convertToString = function (factor) {
  //CONVERTS NUMBERS TO STRING WTH "R"
  if (typeof factor === "string" || factor instanceof String) {
    factor = parseFloat(factor);
  }
  let str = factor.toFixed(2).toString().split("").reverse();
  if (str.length > 9) {
    str.splice(9, 0, " ");
  }
  if (str.length > 6) {
    str.splice(6, 0, " ");
  }
  str.reverse().unshift("R");
  str = str.join("");
  return str;
};

module.exports = runReport;

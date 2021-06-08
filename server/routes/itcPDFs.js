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


let data = [
    {
      itcRefNumber: 'ITC-3',
      subsection: "Block F",
      unit: 'F103',
      floorLevel: 'Ground floor',
      supplier: 'Forest Flooring',
      netVal: 14251.012608695652,
      startDate: '2021-06-24',
      taskType: 'Timber & Iron',
      issuer: 'Wayne Bruton',
      notes: 'Final Test'
    }
  ]



const runReport = (data) => {
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
        text: `Instruction to commence work`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
        decoration: "underline"
      },
      // { text: "\n" },

      {
        text: `ITC Number: ${data[0].itcRefNumber}`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      { text: "\n" },
      {
        text: `Contractor: ${data[0].supplier}`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      {
        text: `TaskType: ${data[0].taskType}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      },

      {
        text: `Block: ${data[0].subsection}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      {
        text: `Unit: ${data[0].unit}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      {
        text: `${data[0].finalInfo}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      { text: "\n" },
      {
        text: `Total: ${data[0].netVal}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      },
     
      // {
      //   text: `Date to Start: ${data[0].startDate}`,
      //   alignment: "center",
      //   fontSize: 12,
      //   bold: true,
      //   margin: [0, 0, 0, 8],
      // },
      // {
      //   text: `Value of work: ${convertToString(data[0].netVal)}`,
      //   alignment: "center",
      //   fontSize: 12,
      //   bold: true,
      //   margin: [0, 0, 0, 8],
      // },
      {
        text: `Issued By: ${data[0].issuer}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      {
        text: `Notes:`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 8],
      
        decoration: "underline"
      },
      {
        text: `${data[0].notes}`,
        alignment: "center",
        fontSize: 11,
        bold: false,
        margin: [0, 0, 0, 8],
        border: [true,true,true,true]
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
    fs.createWriteStream(`public/purchaseorders/${data[0].itcRefNumber}.pdf`)
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
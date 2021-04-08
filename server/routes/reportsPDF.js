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

const runReport = (data, data2) => {
  let now = new Date().toISOString().substring(0, 10);
  let dataInput = [];
  let subDataInput = [];

  data2.forEach((el) => {
    let insert1 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: el.unitName,
      fontSize: 10,
      alignment: "center",
      vLineWidth: 2,
    };
    let insert2 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: el.taskDescription,
      fontSize: 10,
      vLineWidth: 2,
    };

    let insert3 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: el.fix,
      fontSize: 10,
      alignment: "center",
      vLineWidth: 2,
    };

    let insert4 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: `${el.progress} %`,
      fontSize: 10,
      alignment: "center",
      vLineWidth: 2,
    };

    let insert5 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: `${el.lastCertificateIssuedAt} %`,
      fontSize: 10,
      alignment: "center",
      vLineWidth: 2,
    };
    let insert8 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: el.price,
      fontSize: 10,
      alignment: "right",
      vLineWidth: 2,
    };
    let insert6 = {
      border: [true, true, true, true],
      fillColor: "#eeeeff",
      text: el.toDate,
      fontSize: 10,
      alignment: "right",
      bold: true,
      vLineWidth: 2,
    };
    let insert7 = {
      border: [false, true, true, true],
      fillColor: "#eeeeff",
      text: el.afterRetention,
      fontSize: 10,
      alignment: "right",
      bold: true,
      vLineWidth: 2,
      //   color: "green"
    };
    subDataInput.push(insert1);
    subDataInput.push(insert2);
    subDataInput.push(insert3);
    subDataInput.push(insert4);
    subDataInput.push(insert5);
    subDataInput.push(insert8);
    subDataInput.push(insert6);
    subDataInput.push(insert7);
    dataInput.push(subDataInput);
    subDataInput = [];
  });

  let header = [
    { text: "Unit", style: "tableHeader", fontSize: 12, fillColor: "#0d989c" },
    { text: "Task", style: "tableHeader", fontSize: 12, fillColor: "#0d989c" },
    { text: "Fix", style: "tableHeader", fontSize: 12, fillColor: "#0d989c" },
    {
      text: "Progress",
      style: "tableHeader",
      fontSize: 12,
      fillColor: "#0d989c",
    },
    {
      text: "Previous",
      style: "tableHeader",
      fontSize: 12,
      fillColor: "#0d989c",
    },
    {
      text: "Total Value",
      style: "tableHeader",
      fontSize: 12,
      fillColor: "#0d989c",
    },
    {
      text: "Current Value",
      style: "tableHeader",
      fontSize: 12,
      fillColor: "#0d989c",
    },
    {
      text: "After Retention",
      style: "tableHeader",
      fontSize: 12,
      fillColor: "#0d989c",
    },
  ];
  dataInput.unshift(header);

  //   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  var docDefinition = {
    pageSize: "A4",
    footer: function (currentPage, pageCount) {
      return [
        {
          text:
            "Page " + currentPage.toString() + " of " + pageCount + " Pages",
          fontSize: 8,
          alignment: 'center'
        },
      ];
    },
    content: [
      {
        image: "logo",
        width: 110,
        alignment: "left",
      },
      // { text: "\n" },

      {
        text: `CERTIFICATE FOR PAYMENT - ${now}`,
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 0],
      },
      // { text: "\n" },
      {
        text: `Unit: ${data[0].unitName}`,
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 0],
      },
      //   { text: "\n" },
      {
        text: `Certificate Number: ${data[0].certificateNumber}`,
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 4],
      },
      {
        text: `Issued in terms of Clause 19 of the
        Minor Works Agreement Edition 5.1 March 2014`,
        alignment: "center",
        fontSize: 5,
        bold: false,
        margin: [0, 0, 0, 8],
      },
      // { text: "\n" },
      {
        text: `Employer: Cape Projects Construction (pty) Ltd.`,
        alignment: "left",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 0],
      },
      {
        text: `Contractor: ${data[0].supplierName}: ${data[0].street_address}`,
        alignment: "left",
        fontSize: 9,
        bold: true,
        margin: [0, 0, 0, 0],
      },
      {
        text: `Site: Endulini Project, Cnr Kruis Road & Crammix Road, Brackenfell`,
        alignment: "left",
        fontSize: 9,
        bold: true,
        margin: [0, 0, 0, 0],
      },
      // { text: "\n" },

      //   "Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.",
      {
        style: "tableExample",
        widths: [75, 65, 65, 125, 125],
        //
        // heights: 60,
        table: {
          heights: [
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
          ],
          // heights: 8,
          body: [
            [
              "",
              "",
              "",

              {
                colSpan: 1,
                border: [false, false, false, true],
                // fillColor: "#eeffee",
                bold: true,
                alignment: "center",
                style: "tableHeader",
                fontSize: 10,
                noWrap: true,

                text: "Current Contract",
              },
              {
                colSpan: 1,
                border: [false, false, false, true],
                // fillColor: "#eeffee",
                bold: true,
                alignment: "center",
                style: "tableHeader",
                fontSize: 10,
                text: "Total Amount Due",
                noWrap: true,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Nett Contract Sum",
                fontSize: 9,
              },
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].ContractValue}`,
                alignment: "right",
                fontSize: 9,
              },
              "",
            ],

            // [
            //   {
            //     text: " ",
            //   },
            //   {
            //     text: " ",
            //   },
            //   {
            //     text: " ",
            //   },
            //   {
            //     text: " ",
            //   },
            //   {
            //     text: " ",
            //   },
            // ],
          
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Total Amount Certified",
                fontSize: 9,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].currentValue}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                fontSize: 9,
                colSpan: 3,
                text:
                  "Security adjustments applicable [8.3.1;19.3.3] if applicable, state %",
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].retained}`,
                alignment: "right",
                fontSize: 9,
              },
              
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text:
                  "less Previous amount certified [19.3.5] / Disbursed to date.",
                fontSize: 9,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].previousValues}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Nett Amount Certified",
                fontSize: 9,
                bold: true,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].grossValue}`,
                alignment: "right",
                fontSize: 9,
                bold: true,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text:
                  "Expenses and Loss Payable to the employer [Recovery Statement 1.1]",
                fontSize: 9,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].recoveries}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Penalties Levied and Payable [Recovery Statement 1.2]",
                fontSize: 9,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].penalties}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Damages Payable [Recovery Statement 12.2]",
                fontSize: 9,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].damages}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Subtotal",
                fontSize: 9,
                bold: true,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].netBeforVat}`,
                alignment: "right",
                fontSize: 9,
                bold: true,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Tax",
                fontSize: 9,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].vat}`,
                alignment: "right",
                fontSize: 9,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Certified Amount before deposit recovery",
                fontSize: 9,
                bold: true,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].netCurrentCertificateValue}`,
                alignment: "right",
                fontSize: 9,
                bold: true,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "Deposit Recovered",
                fontSize: 9,
                bold: true,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].depositRecoveredThisStatement}`,
                alignment: "right",
                fontSize: 9,
                bold: true,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                border: [false, false, false, false],
                // fillColor: "#eeeeee",
                colSpan: 3,
                text: "CERTIFIED AMOUNT DUE FOR PAYMENT",
                fontSize: 9,
                bold: true,
              },
              "",
              "",
              "",
              {
                border: [true, true, true, true],
                // fillColor: "#dddddd",
                text: `${data[0].afterDepositDeducted}`,
                alignment: "right",
                fontSize: 9,
                bold: true,
              },
            ],
            [
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
              {
                text: " ",
              },
            ],
            [
              {
                text: " ",
                border: [false, true, false, false],
              },
              {
                text: " ",
                border: [false, true, false, false],
              },
              {
                text: " ",
                border: [false, true, false, false],
              },
              {
                text: " ",
                border: [false, true, false, false],
              },
              {
                text: " ",
                border: [false, true, false, false],
              },
            ],
            [
              {
                text:
                  "Herbert du Plessis, \n Unit 3, Villa du Pre \n 20 Church Street, \n Wellington, WC ",
                // colSpan: 2,
                fontSize: 8,
                // border: [false, true, false, false],
              },
              {
                text: " ",
                // border: [false, true, false, false],
              },
              {
                text: " ",
                // border: [false, true, false, false],
              },
              {
                text: "\n \n Signature:",
                // border: [false, true, false, false],
              },
              {
                text: "\n \n ____________",
                // paddingTop: 10,
                // border: [false, true, false, false],
              },
            ],
          ],
        },
        layout: {
          defaultBorder: false,
        },
      },

      //   {text: 'Column/row spans', pageBreak: 'before', style: 'subheader', pageOrientation: "landscape",},
      {
        image: "logo",
        width: 80,
        alignment: "right",
        pageBreak: "before",
        pageOrientation: "landscape",
      },
      { text: "\n" },

      {
        text: `DETAILS - ${data[0].certificateNumber}`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      { text: "\n" },
      //   "Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.",
      {
        style: "tableExample",
        widths: [60, 60, 60, 120, 120],
        table: {
          headerRows: 1,
          body: dataInput,
          widths: [60, 220, 30, 60, 60, 80, 80, 80],
          border: [true, true, true, true],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "gray";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "black" : "gray";
          },
        },
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
  pdfDoc.pipe(fs.createWriteStream(`public/${data[0].certificateNumber}.pdf`));
  //   pdfDoc.pipe(fs.createWriteStream("public/document.pdf"));
  pdfDoc.end();
};

module.exports = runReport;

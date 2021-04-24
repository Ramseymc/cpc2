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

var PdfPrinter = require("pdfmake");
var printer = new PdfPrinter(fonts);
var fs = require("fs");
const { fontSize } = require("pdfkit");

const runReport = (data) => {
  console.log("DATA",data[0].info)
  let sc;
  let sf;
  let cm;
  try {
    if(fs.existsSync( path.join(__dirname, "..", "public", `${data[0].controlTimestamp}SC.png`))) {
        // console.log("The file exists.");
        sc = path.join(__dirname, "..", "public", `${data[0].controlTimestamp}SC.png`);
    } else {
        // console.log('The file does not exist.');
        sc = path.join(__dirname, "..", "public", `signatureBlank.png`);
    }
} catch (err) {
    console.error(err);
}
  try {
    if(fs.existsSync( path.join(__dirname, "..", "public", `${data[0].controlTimestamp}SF.png`))) {
        // console.log("The file exists.");
        sf = path.join(__dirname, "..", "public", `${data[0].controlTimestamp}SF.png`);
    } else {
        // console.log('The file does not exist.');
        sf = path.join(__dirname, "..", "public", `signatureBlank.png`);
    }
} catch (err) {
    console.error(err);
}
  try {
    if(fs.existsSync( path.join(__dirname, "..", "public", `${data[0].controlTimestamp}CM.png`))) {
        // console.log("The file exists.");
        cm = path.join(__dirname, "..", "public", `${data[0].controlTimestamp}CM.png`);
    } else {
        // console.log('The file does not exist.');
        cm = path.join(__dirname, "..", "public", `signatureBlank.png`);
    }
} catch (err) {
    console.error(err);
}

  let now = new Date().toISOString().substring(0, 10);
  let dataInput = [];
  let subDataInput = [];

  data[0].info.forEach((el) => {
    let sci;
    let insert0 = {
      border: [true, true, true, true],
      text: el.category,
      fontSize: 8,
      alignment: "left",
    };
    let insert1 = {
      border: [true, true, true, true],
      text: el.name,
      fontSize: 8,
      alignment: "left",
    };
    if (el.signedSubcontractor === 1 || el.signedSubcontractor === true) {
      let image = el.signedSubcontractorImage
      console.log(image)
      image = image.substring(1, image.length - 1)
      el.image =  `public/${image}.png`
      console.log(el.image)
    } else {
      el.image = "sc"
    }
    let insert2 = {
        image: el.image,
        border: [true, true, true, true],
        width: 40,
        alignment: "center" 
    }
    if (el.signedSiteforeman === 1 || el.signedSiteforeman === true) {
      let image = el.signedSiteforemanImage
      console.log(image)
      image = image.substring(1, image.length - 1)
      el.image =  `public/${image}.png`
      console.log(el.image)
    } else {
      el.image = "sc"
    }
    let insert3 = {
        image: el.image,
        border: [true, true, true, true],
        width: 40,
        alignment: "center" 
    }

    if (el.signedConstructionManager === 1 || el.signedConstructionManager === true) {
      let image = el.signedConstructionManagerImage
      console.log(image)
      image = image.substring(1, image.length - 1)
      el.image =  `public/${image}.png`
      console.log(el.image)
    } else {
      el.image = "sc"
    }
    let insert4 = {
        image: el.image,
        border: [true, true, true, true],
        width: 40,
        alignment: "center" 
    }
  
    // if (el.siteforeman === true || el.siteforeman === 1) {
    //   el.siteforeman = '√'
    // } else {
    //   el.siteforeman = ""
    // }
    // let insert3 = {
    //   border: [true, true, true, true],
    //   text: el.siteforeman,
    //   fontSize: 8,
    //   alignment: "center",
    //   color: "green"
    // };
    // if (el.constructionManager === true || el.constructionManager === 1) {
    //   el.constructionManager = '√'
    // } else {
    //   el.constructionManager = ""
    // }
    // let insert4 = {
    //   border: [true, true, true, true],
    //   text: `${(el.constructionManager)}`,
    //   fontSize: 8,
    //   alignment: "center",
    //   color: "green"
    // };

    let insert5 = {
      border: [true, true, true, true],
      text: (el.comments),
      fontSize: 8,
      alignment: "right",
    };
    subDataInput.push(insert0);
    subDataInput.push(insert1);
    subDataInput.push(insert2);
    subDataInput.push(insert3);
    subDataInput.push(insert4);
    subDataInput.push(insert5);

    dataInput.push(subDataInput);
    subDataInput = [];
  });

  let header = [
    { text: "Category", style: "tableHeader", fontSize: 8 },
    { text: "Description", style: "tableHeader", fontSize: 8 },
    { text: "Subcontractor", style: "tableHeader", fontSize: 8 },
    { text: "Site Foreman", style: "tableHeader", fontSize: 8 },
    {
      text: "Construction Manager",
      style: "tableHeader",
      fontSize: 8,
    },
    {
      text: "Comments",
      style: "tableHeader",
      fontSize: 8,
    },
  ];

  dataInput.unshift(header);

  var docDefinition = {
    pageSize: "A4",pageOrientation: "landscape",
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
      {
        image: "logo",
        width: 120,
        alignment: "center",
      },
      {
        text: `Quality Control Checklist`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      {
        text: `Date: ${data[0].controlDate} - ${data[0].section} - ${data[0].unit}`,
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      {
        text: `${data[0].info[0].shortName.toUpperCase()}`,
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      { text: "\n" },
      { text: "\n" },
      {
        // style: "tableExample",
        // widths: [60, 60, 60, 120, 120],
        table: {
          headerRows: 1,
          body: dataInput,
          widths: [120, 230, 65, 65, 65, 180],
          border: [true, true, true, true],
        },
      },
      { text: "\n" },
      { text: "\n" },
      // {
      //   table: {
      //     body: [
      //       [
      //         { text: "Signature Subcontractor", border: [false, false, false, false],fontSize: 8 },
      //         {
      //           image: "sc",
      //           border: [false, false, false, false],
      //           width: 90
      //         },
      //         {
      //           border: [false, false, false, false],
      //           text: ""
      //         },
      //         { text: "Signature Site Foreman", border: [false, false, false, false], fontSize: 8 },
      //         {
      //           image: "sf",
      //           border: [false, false, false, false],
      //           width: 90
      //         },
      //         {
      //           border: [false, false, false, false],
      //           text: ""
      //         },
      //         { text: "Signature Construction Manager", border: [false, false, false, false], fontSize: 8 },
      //         {
      //           image: "cm",
      //           border: [false, false, false, false],
      //           width: 90
      //         }
      //       ]
      //     ],
      //     widths: [100, 100, 40, 100, 100, 40, 100, 100]
      //   }
      // }
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
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
        margin: [5, 5, 5, 5],
      },
    },
    defaultStyle: {
    },
    images: {
      logo:
        path.join(__dirname, "..", "public", "cpc.png"),
        sc: sc,
        sf: sf,
        cm: cm,
    },
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(
    fs.createWriteStream(`public/${data[0].controlTimestamp}QCReport.pdf`)
  );
  pdfDoc.end();
};



module.exports = runReport;

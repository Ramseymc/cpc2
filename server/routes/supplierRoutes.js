const express = require("express");
const router = express.Router();
const pool = require("./connection");

const session = require("express-session");
const chalk = require("chalk");

import { XeroClient } from "xero-node";
import jwtDecode from "jwt-decode";
import { response } from "express";

const moment = require("moment");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URI;
const redirectUrl2 = process.env.REDIRECT_URI2;
const scopes =
  "openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access";

const xero = new XeroClient({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUris: [redirectUrl],
  scopes: scopes.split(" "),
});

router.use(
  session({
    secret: "something crazy",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

let originalURL;
let activeTenant1;
let finalTokenSet;

router.post("/redirect", (req, res) => {
  originalURL = req.body.redirect;
});

const getXeroCredentials = function () {
  let mysql = `select * from xeroCredentials`;
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
        finalTokenSet = {
          id_token: result[0].id_token,
          access_token: result[0].access_token,
          expires_at: result[0].expires_at,
          token_type: result[0].token_type,
          refresh_token: result[0].refresh_token,
          session_state: result[0].session_state,
        };
        activeTenant1 = result[0].active_tenant;
      }
    });
    connection.release();
  });
};

getXeroCredentials();

const postXeroCredentials = function (token, activeTenant) {
  let mysql = `update xeroCredentials set id_token = '${token.id_token}',
  access_token = '${token.access_token}',
  expires_at = ${token.expires_at},
  token_type = '${token.token_type}',
  refresh_token = '${token.refresh_token}',
  scope = '${token.scope}',
  session_state = '${token.session_state}',
  active_tenant = '${activeTenant}' where id = 1`;
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
      }
    });
    connection.release();
  });
};

router.get("/getCredentials", (req, res) => {
  try {
    getXeroCredentials();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

router.get("/connect", async (req, res) => {
  try {
    let consentUrl = await xero.buildConsentUrl();
    res.json({ consentUrl: consentUrl });
  } catch (err) {
    console.log(err);
    if (originalURL == "PmtCertificates") {
      res.redirect(process.env.REROUTE_URL2);
    } else if (originalURL == "PaymentsDue") {
      res.redirect(process.env.REROUTE_URL3);
    } else {
      res.redirect(process.env.REROUTE_URL);
    }
  }
});

const authenticationData = (req, res) => {
  return {
    decodedIdToken: req.session.decodedIdToken,
    decodedAccessToken: req.session.decodedAccessToken,
    tokenSet: req.session.tokenSet,
    allTenants: req.session.allTenants,
    activeTenant: req.session.activeTenant,
  };
};

router.get("/callback", async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    await xero.updateTenants();

    const decodedIdToken = jwtDecode(tokenSet.id_token);
    const decodedAccessToken = jwtDecode(tokenSet.access_token);

    req.session.decodedIdToken = decodedIdToken;
    req.session.decodedAccessToken = decodedAccessToken;
    req.session.tokenSet = tokenSet;
    req.session.allTenants = xero.tenants;
    req.session.activeTenant = xero.tenants[0];

    finalTokenSet = tokenSet;
    activeTenant1 = xero.tenants[0].tenantId;
    postXeroCredentials(finalTokenSet, activeTenant1);

    const authData = authenticationData(req, res);
    if (originalURL == "PmtCertificates") {
      res.redirect(process.env.REROUTE_URL2);
    } else if (originalURL == "paymentsdue") {
      res.redirect(process.env.REROUTE_URL3);
    } else {
      res.redirect(process.env.REROUTE_URL);
    }
  } catch (err) {
    console.log("The Error", err);
    res.redirect(process.env.REROUTE_URL);
  }
});

router.post("/getSuppliersUsed", async (req, res) => {
 let mysql = `select distinct t.supplier, s.supplierName, t.taskType,u.subsection, ss.subsectionName, t.unitNumber,u.unitName, tt.taskName
 from tasks t, taskTypes tt, suppliers s, units u, subsection ss
 where tt.id = t.taskType and s.id = t.supplier and u.id = t.unitNumber and u.subsection = ss.id
 and t.development = ${req.body.id} = u.development = ss.development`
    
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
        res.json(result)
      }
    });
    connection.release();
  });
});

router.post("/editSupplier", async (req, res) => {
  console.log(req.body.data)
  let mysql = `update suppliers set contactID = '${req.body.data.contactID}',
    vat_number = '${req.body.data.vat_number}',
    supplierName = '${req.body.data.supplierName}',
    first_name = '${req.body.data.first_name}',
    last_name = '${req.body.data.last_name}',
    emailAddress = '${req.body.data.emailAddress}',
    default_number = '${req.body.data.default_number}',
    mobile_number = '${req.body.data.mobile_number}',
    street_address = '${req.body.data.street_address}',
    postal_address = '${req.body.data.postal_address}',
    retention = ${req.body.data.retention},
    vatVendor = ${req.body.data.vatVendor},
    terms = ${req.body.data.terms} where id = ${req.body.data.id}`

    console.log(chalk.red(mysql))
    
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
        res.json(result)
      }
    });
    connection.release();
  });
});

router.get("/contacts", async (req, res) => {
  let mysqlResult;
  let mysql = `select * from suppliers order by supplierName`;
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
        mysqlResult = result;
        let suppliers = {
          message: "nothing to report"
        }
    res.json({ suppliers, mysqlResult });

      }
    });
    connection.release();
  });

  // try {
  //   await xero.setTokenSet(finalTokenSet);
  // } catch (e) {
  //   console.log(chalk.blue("ERR but get through"));
  // }
  // const xeroTenantId = activeTenant1;
  // // const order = 'Name ASC';
  // const where = "ContactStatus==ACTIVE";
  // const iDs = [
  //   "00000000-0000-0000-000-000000000000,00000000-0000-0000-000-000000000000",
  // ];
  // const includeArchived = true;
  // // const ifModifiedSince = new Date("2020-01-11T12:17:43.202-08:00");
  // const ifModifiedSince = new Date("2020-01-11");

  // try {
  //   const response = await xero.accountingApi.getContacts(
  //     activeTenant1,
  //     ifModifiedSince
  //   );
  //   let suppliers = response.body.contacts.filter((el) => {
  //     return (
  //       (el.isSupplier ||
  //         (el.isSupplier === false && el.isCustomer === false)) &&
  //       el.contactStatus === "ACTIVE"
  //     );
  //   });
  //   suppliers.sort((a, b) => (a.name > b.name ? 1 : -1));
  //   res.json({ suppliers, mysqlResult });
  // } catch (err) {
  //   console.log(err);
  //   res.json({ err: err });
  // }
});

router.post("/editSupplier", async (req, res) => {
  await xero.setTokenSet(finalTokenSet);

  const xeroTenantId = activeTenant1;
  const contactID = req.body.contactID; // {UUID} Unique identifier for a Contact

  try {
    const response = await xero.accountingApi.getContact(
      xeroTenantId,
      contactID
    );
    res.json(response.body);
  } catch (err) {
    const error = JSON.stringify(err.response.body, null, 2);
    console.log(`Status Code: ${err.response.statusCode} => ${error}`);
  }
});

router.post("/getInvoices", async (req, res) => {
  console.log(req.body)

  await xero.setTokenSet(finalTokenSet);

  const xeroTenantId = activeTenant1;

  const since = moment(req.body.fromDate)
    .subtract(3, "months")
    .format("YYYY-MM-DD")
    .toString();


  // const ifModifiedSince = new Date("2020-12-01");
  const ifModifiedSince = new Date(since);
  // const ifModifiedSince = since;

  const contactIDs = [req.body.contactID];

  let invoiceNumbers = req.body.data;
  invoiceNumbers = Array.from(new Set(invoiceNumbers));



  try {
    const response = await xero.accountingApi.getInvoices(
      xeroTenantId,
      ifModifiedSince,
      invoiceNumbers,
      contactIDs
    );
   
    let newResponse = response.body.invoices.filter((el) => {
      return el.contact.contactID === contactIDs[0];
    });
   
    let finalResponse = [];
    let result = [];
    invoiceNumbers.forEach((el) => {
      let invNumber = el;
      newResponse.forEach((el2) => {
       
        if (el2.invoiceNumber === invNumber) {
        result.push(el2);
        }
      });
    });
   

    result.forEach((el3) => {
      finalResponse.push(el3);
    });
  

    res.json(finalResponse);
   
  } catch (err) {
  
    console.log("ERR", err.response.body);

    res.json(err.response.body);
  }

});

router.post("/getInvoicesforPmtApproval", async (req, res) => {


  await xero.setTokenSet(finalTokenSet);

  const xeroTenantId = activeTenant1;

  const since = moment(req.body.fromDate)
    .subtract(3, "months")
    .format("YYYY-MM-DD")
    .toString();


  // const ifModifiedSince = new Date("2020-12-01");
  const ifModifiedSince = new Date(since);
  // const ifModifiedSince = since;



  let contactIDs = req.body.contactID;


  let invoiceNumbers = req.body.data;
  invoiceNumbers = Array.from(new Set(invoiceNumbers));

 

  try {
    const response = await xero.accountingApi.getInvoices(
      xeroTenantId,
      ifModifiedSince,
      invoiceNumbers,
      contactIDs
    );
//SAVE THIS TO FILTER ON CONTENTS OF ANOTHER ARRAY
    let newResponse = response.body.invoices.filter(
      function(el) {
        return this.indexOf(el.contact.contactID) > -1;
      },
      contactIDs
  );
 


    let finalResponse = [];
    let result = [];
    invoiceNumbers.forEach((el) => {
      let invNumber = el;
      newResponse.forEach((el2) => {
        if (el2.invoiceNumber === invNumber) {
        result.push(el2);
        }
      });
    });


    result.forEach((el3) => {
      finalResponse.push(el3);
    });
 

    res.json(finalResponse);

  } catch (err) {

    console.log("ERR", err.response.body);

    res.json(err.response.body);
  }

});

router.post("/addSupplier", (req, res) => {
  let post = req.body;
  let mysql = `Insert into suppliers (contactID, vat_number, supplierName, first_name, last_name, emailAddress, default_number, mobile_number, street_address, postal_address) values (?)`;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("THE ERR", err);
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, post, function (error, result) {
      if (error) {
        console.log("THE ERROR", error);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/getCreditorInfo", (req, res) => {
  let mysql = `select * from paymentCertificates where supplier = ${req.body.id}  and amtPaid < netCurrentCertificateValue`;

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
        let finalResult = {
          // xero: response.body,
          supplier: result,
        };
        res.json(finalResult);
      }
    });
    connection.release();
  });
});

module.exports = router;

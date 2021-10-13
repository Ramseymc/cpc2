const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const dotenv = require("dotenv").config();
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const pool = require("./routes/connection");

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// console.log("WTF")

app.use(
  cors({
    allowedHeaders: [
      "sessionId",
      "Content-Type",
      "Authorization",
      "authorization", 
    ],
    exposedHeaders: ["sessionId"],
    // 'origin': ['https://cape-projects.co.za', 'https://www.cape-projects.co.za', 'https://cape-projectsbe.co.za', 'https://www.cape-projectsbe.co.za'],
    origin: "http://localhost:8080",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: false,
    preflightContinue: false,
  })
);



// 'origin': ['https://eccentrictoad.com', 'https://www.eccentrictoad.com'],

// const emitter = new EventEmitter()
// emitter.setMaxListeners(0)

app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.static('public'))
// app.use("/public", express.static(path.join(__dirname, 'public')));

const progressRoutes = require("./routes/progressRoutes");
const progressResultsRoutes = require("./routes/progressResultRoutes");
const userRoutes = require("./routes/userRoutes");
const updateRoutes = require("./routes/updateRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const emailRoutes = require("./routes/emailRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const imageRoutes = require("./routes/imageRoutes");
const qualityRoutes = require("./routes/qualityRoutes");
const cashflowRoutes = require("./routes/cashflowRoutes");
const iTCRoutes = require("./routes/iTCRoutes");
const salesRoutes = require("./routes/salesRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const pandgRoutes = require("./routes/pandgRoutes");
app.use(
  progressRoutes,
  progressResultsRoutes,
  userRoutes,
  updateRoutes,
  supplierRoutes,
  paymentRoutes,
  emailRoutes,
  purchaseOrderRoutes,
  imageRoutes,
  qualityRoutes,
  cashflowRoutes,
  iTCRoutes,
  salesRoutes,
  dashboardRoutes,
  pandgRoutes
);

app.listen(port, () => {
  console.log(chalk.bold.red(`Wayne's App listening on port: ${port}`));
});

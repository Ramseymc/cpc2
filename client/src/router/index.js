import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Progress from "../views/Progress.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "About" */ "../views/About.vue")
  },
  {
    path: "/progress",
    name: "Progress",
    component: Progress
    // component: () =>
    //   import(/* webpackChunkName: "Progress" */ "../views/Progress.vue")
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () =>
      import(/* webpackChunkName: "Schedule" */ "../views/Schedule.vue")
  },
  // {
  //   path: "/gantt",
  //   name: "Gantt",
  //   component: () =>
  //     import(/* webpackChunkName: "Gantt" */ "../views/ProjectGant.vue")
  // },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue")
  },
  {
    path: "/CreateUser",
    name: "CreateUser",
    component: () =>
      import(/* webpackChunkName: "CreateUser" */ "../views/CreatUser.vue")
  },
  {
    path: "/EditUser",
    name: "EditUser",
    component: () =>
      import(/* webpackChunkName: "EditUser" */ "../views/EditUser.vue")
  },
  {
    path: "/ImportData",
    name: "importdata",
    component: () =>
      import(/* webpackChunkName: "importData" */ "../views/ImportData.vue")
  },
  {
    path: "/AddItems",
    name: "additems",
    component: () =>
      import(/* webpackChunkName: "additems" */ "../views/AddItems.vue")
  },
  {
    path: "/Suppliers",
    name: "Suppliers",
    component: () =>
      import(/* webpackChunkName: "Suppliers" */ "../views/Suppliers.vue")
  },
  {
    path: "/SupplierChange",
    name: "SupplierChange",
    component: () =>
      import(
        /* webpackChunkName: "SupplierChange" */ "../views/supplierChange.vue"
      )
  },
  {
    path: "/Images",
    name: "Images",
    component: () =>
      import(/* webpackChunkName: "Images" */ "../views/Images.vue")
  },
  {
    path: "/paymentCertificates",
    name: "paymentCertificates",
    component: () =>
      import(
        /* webpackChunkName: "paymentCertificates" */ "../views/PaymentCertificates.vue"
      )
  },
  {
    path: "/cashflow",
    name: "Cashflow",
    component: () =>
      import(/* webpackChunkName: "Cashflow" */ "../views/Cashflow.vue")
  },
  {
    path: "/paymentsdue",
    name: "paymentsdue",
    component: () =>
      import(/* webpackChunkName: "Paymentsdue" */ "../views/PaymentsDue.vue")
  },
  {
    path: "/retentions",
    name: "Retention",
    component: () =>
      import(/* webpackChunkName: "Retention" */ "../views/Retention.vue")
  },
  {
    path: "/deposits",
    name: "Deposits",
    component: () =>
      import(/* webpackChunkName: "Deposits" */ "../views/Deposits.vue")
  },
  {
    path: "/apartmentoptions",
    name: "apartment",
    component: () =>
      import(
        /* webpackChunkName: "apartment" */ "../views/ApartmentOptions.vue"
      )
  },
  {
    path: "/purchaseordercreate",
    name: "purchaseordercreate",
    component: () =>
      import(
        /* webpackChunkName: "purchaseordercreate" */ "../views/PurchaseOrderCreate.vue"
      )
  },
  {
    path: "/purchaseorderview",
    name: "POView",
    component: () =>
      import(/* webpackChunkName: "POView" */ "../views/PurchaseOrdersView.vue")
  },
  {
    path: "/purchaseorderdeliveries",
    name: "Deliveries",
    component: () =>
      import(/* webpackChunkName: "Deliveries" */ "../views/Deliveries.vue")
  },
  {
    path: "/pandg",
    name: "PandG",
    component: () =>
      import(/* webpackChunkName: "Deliveries" */ "../views/P&G.vue")
  },
  // {
  //   path: "/ganttv2",
  //   name: "ganttv2",
  //   component: () =>
  //     import(/* webpackChunkName: "ganttv2" */ "../views/GantView2.vue")
  // },
  // {
  //   path: "/ganttv3",
  //   name: "ganttv3",
  //   component: () =>
  //     import(/* webpackChunkName: "ganttv2" */ "../views/GanttView3.vue")
  // },
  // {
  //   path: "/ganttv3A",
  //   name: "ganttv3A",
  //   component: () =>
  //     import(/* webpackChunkName: "ganttv3A" */ "../views/Gantt3.vue")
  // },
  {
    path: "/gantt4",
    name: "gantt4",
    component: () =>
      import(/* webpackChunkName: "gantt4" */ "../views/Gantt4.vue")
  },
  // {
  //   path: "/DateReset",
  //   name: "DateReset",
  //   component: () =>
  //     import(/* webpackChunkName: "DateReset" */ "../views/DatesReset.vue")
  // },
  {
    path: "/qualitycontrol",
    name: "QualityControl",
    component: () =>
      import(
        /* webpackChunkName: "QualityControl" */ "../views/QualityControl.vue"
      )
  },
  {
    path: "/qualityreports",
    name: "QualityReports",
    component: () =>
      import(
        /* webpackChunkName: "QualityReports" */ "../views/QualityReports.vue"
      )
  },
  {
    path: "/taskList",
    name: "TaskList",
    component: () =>
      import(/* webpackChunkName: "TaskList" */ "../views/Tasklists.vue")
  },
  {
    path: "/projectStructure",
    name: "ProjectStructure",
    component: () =>
      import(
        /* webpackChunkName: "ProjectStructure" */ "../views/ProjectStructure.vue"
      )
  },
  {
    path: "/instructionToCommit",
    name: "ITC",
    component: () => import(/* webpackChunkName: "ITC" */ "../views/ITC.vue")
  },
  {
    path: "/salesinfo",
    name: "salesinfo",
    component: () =>
      import(/* webpackChunkName: "salesinfo" */ "../views/SalesInfo.vue")
  },
  {
    path: "/salesstart",
    name: "salesstart",
    component: () =>
      import(/* webpackChunkName: "salesstart" */ "../views/SalesStart.vue")
  },
  {
    path: "/financeinput",
    name: "FinanceInput",
    component: () =>
      import(/* webpackChunkName: "FinanceInput" */ "../views/FinanceInput.vue")
  },
  {
    path: "/salesData",
    name: "SalesData",
    component: () =>
      import(/* webpackChunkName: "SalesData" */ "../views/SalesData.vue")
  },
  {
    path: "/investorData",
    name: "InvestorData",
    component: () =>
      import(/* webpackChunkName: "InvestorData" */ "../views/InvestorData.vue")
  },
  {
    path: "/smartProgress",
    name: "SmartProgress",
    component: () =>
      import(
        /* webpackChunkName: "SmartProgress" */ "../views/smartProgress.vue"
      )
  },
  {
    path: "/smartUploads",
    name: "SmartUploads",
    component: () =>
      import(/* webpackChunkName: "SmartUploads" */ "../views/smartUploads.vue")
  },
  {
    path: "/smartSubcontractors",
    name: "SmartSubcontractors",
    component: () =>
      import(
        /* webpackChunkName: "SmartSubcontractors" */ "../views/smartSubcontractors.vue"
      )
  },
  {
    path: "/addsmartsheets",
    name: "AddSmartsheets",
    component: () =>
      import(
        /* webpackChunkName: "AddSmartsheet" */ "../views/smartSheetAdd.vue"
      )
  },
  {
    path: "/dashboardSummary",
    name: "DashboardSummary",
    component: () =>
      import(
        /* webpackChunkName: "DashboardSummary" */ "../views/DashboardSummary.vue"
      )
  },
  {
    path: "/percentageInvesors",
    name: "PercentageInvestors",
    component: () =>
      import(
        /* webpackChunkName: "PercentageInvestors" */ "../views/PercentageInvestors.vue"
      )
  },
  {
    path: "/investorDashboard",
    name: "investorDashboard",
    component: () =>
      import(
        /* webpackChunkName: "investorDashboard" */ "../views/InvestorDashboard.vue"
      )
  },
  {
    path: "/investoradd",
    name: "investoradd",
    component: () =>
      import(
        /* webpackChunkName: "investoradd" */ "../components/InvestorAdd.vue"
      )
  },
  {
    path: "/investorupdate/:id",
    name: "investorupdate",
    component: () =>
      import(
        /* webpackChunkName: "investoradd" */ "../components/InvestorUpdate.vue"
      )
  },

  {
    path: "/investorview",
    name: "investorview",
    component: () =>
      import(
        /* webpackChunkName: "investorview" */ "../views/InvestorViewMain.vue"
      )
  },

  {
    path: "/investmentview/:id",
    name: "investmentviewmain",
    // params: true,
    component: () =>
      import(
        /* webpackChunkName: "investmentview" */ "../views/InvestmentViewMain.vue"
      )
  },
  {
    path: "/investmentadd",
    name: "investmentadd",
    component: () =>
      import(
        /* webpackChunkName: "investmentadd" */ "../components/InvestmentAdd.vue"
      )
  },
  {
    path: "/investmentupdate/:id",
    name: "investmentupdate",
    component: () =>
      import(
        /* webpackChunkName: "investmentupdate" */ "../components/InvestmentUpdate.vue"
      )
  },
  {
    path: "/purchaseorderallocate",
    name: "PurchaseOrderAllocate",
    component: () =>
      import(
        /* webpackChunkName: "PurchaseOrderAllocate" */ "../views/PurchaseOrderAllocate.vue"
      )
  },
  {
    path: "/financeconstructioninput",
    name: "FinanceConstructionInput",
    component: () =>
      import(
        /* webpackChunkName: "FinanceConstructionInput" */ "../views/FinanceConstructionInput.vue"
      )
  },
  {
    path: "/Contingencies",
    name: "Contingencies",
    component: () =>
      import(
        /* webpackChunkName: "Contingencies" */ "../views/Contingencies.vue"
      )
  },
  {
    path: "/Escalations",
    name: "Escalations",
    component: () =>
      import(/* webpackChunkName: "Escalations" */ "../views/Escalations.vue")
  },
  {
    path: "/stocktrx",
    name: "StockTrx",
    component: () =>
      import(/* webpackChunkName: "StockTrx" */ "../views/StockTrx.vue")
  },
  {
    path: "/stocktake",
    name: "StockTake",
    component: () =>
      import(/* webpackChunkName: "StockTake" */ "../views/StockTake.vue")
  },
  {
    path: "/updateTaskDates",
    name: "UpdateTaskDates",
    component: () =>
      import(
        /* webpackChunkName: "UpdateTaskDates" */ "../views/UpdateTaskDates.vue"
      )
  },
  {
    path: "/unitinfo/:id",
    name: "UnitInfo",
    params: true,
    component: () =>
      import(/* webpackChunkName: "UnitInfo" */ "../views/UnitInfo.vue")
  },
  {
    path: "/*",
    name: "filenotfound",
    component: () =>
      import(/* webpackChunkName: "filenotfound" */ "../views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

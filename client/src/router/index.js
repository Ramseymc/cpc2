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

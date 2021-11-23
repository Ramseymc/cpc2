<template>
  <!-- <div> -->
  <v-app-bar app color="#393e46" dark class="mobile">
    <v-btn text min-width="100" style="font-size: 120%;" :to="{ name: 'Home' }"
      >CPC {{ this.$store.state.development.developmentName }}</v-btn
    >
    <v-spacer></v-spacer>
    <h2 v-if="this.$store.state.isLoggedIn && windowSize > 767">
      Hello {{ this.$store.state.userName }}
    </h2>
    <v-spacer></v-spacer>
    <!-- <v-btn text v-if="this.$store.state.isLoggedIn" :to="{ name: 'TaskList' }">
      <span class="mr-2">Issues</span>
      <v-icon>mdi-wall</v-icon>
    </v-btn>
    <v-spacer></v-spacer> -->

    <v-btn text v-if="this.$store.state.isLoggedIn" @click="switchDevelopment">
      <span class="mr-2">Switch Dev</span>
      <v-icon>mdi-key-change</v-icon>
    </v-btn>
    <v-btn text v-if="this.$store.state.isLoggedIn" @click="logout">
      <span class="mr-2">Logout</span>
      <v-icon>mdi-logout-variant</v-icon>
    </v-btn>
    <v-btn v-else text :to="{ name: 'Login' }">
      <span class="mr-2">Login</span>
      <v-icon>mdi-login-variant</v-icon>
    </v-btn>

    <div class="text-center">
      <v-menu
        dark
        text-align-left
        offsetX
        offsetY
        min-width="25%"
        max-width="100%"
        :close-on-content-click="closeOnClick"
        :value="shown"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark text v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list
          v-if="this.$store.state.userRole === 1"
          style="max-height: 90vh"
          class="overflow-y-auto"
        >
          <template>
            <div v-for="item in superUser" :key="item.id">
              <v-list-group v-if="item.items" no-action :group="'items'">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title
                      :close-on-content-click="false"
                      style="text-align: left;margin-left: 5%;"
                    >
                      <v-icon :color="item.color">{{ item.icon }}</v-icon>
                      {{ item.title }}</v-list-item-title
                    >
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="subItem in item.items"
                  :key="subItem.id"
                  :to="{ name: subItem.name }"
                  @click="closeMenu"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      style="text-align: left;margin-left: 5%;"
                    >
                      <v-icon :color="subItem.color">{{ subItem.icon }}</v-icon>
                      {{ subItem.title }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              <v-list-item v-else :to="{ name: item.name }" @click="closeMenu">
                <v-list-item-content>
                  <v-list-item-title style="text-align: left; margin-left: 5%;">
                    <v-icon :color="item.color">{{ item.icon }}</v-icon>
                    {{ item.title }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
          </template>
        </v-list>

        <v-list v-if="this.$store.state.userRole === 2">
          <v-list-item
            v-for="item in siteManager"
            :key="item.id"
            :to="{ name: item.name }"
          >
            <v-list-item-title>
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
        <v-list v-if="this.$store.state.userRole === 3">
          <v-list-item
            v-for="item in siteManager"
            :key="item.id"
            :to="{ name: item.name }"
            @click="closeMenu"
          >
            <v-list-item-title style="text-align: left; margin-left: 5%;">
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
              {{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
        <v-list v-if="this.$store.state.userRole === 4">
          <v-list-item
            v-for="item in Storeman"
            :key="item.id"
            :to="{ name: item.name }"
            @click="closeMenu"
          >
            <v-list-item-title style="text-align: left; margin-left: 5%;">
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
              {{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item
            v-for="item in anyUser"
            :key="item.id"
            :to="{ name: item.name }"
            @click="closeMenu"
          >
            <v-list-item-title>
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
              {{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
// import Development from "./Development"
export default {
  name: "Header",
  data: () => ({
    windowSize: 0,
    closeOnClick: false,
    shown: false,
    superUser: [
      {
        title: "Construction",
        name: "Construction",
        icon: "mdi-warehouse",
        role: 2,
        menu: 1,
        id: "construction",
        color: "yellow",
        items: [
          {
            title: "Quality Control",
            name: "QualityControl",
            icon: "mdi-quality-high",
            role: 3,
            menu: 1,
            id: "QualityControl",
            color: "orange"
          },
          {
            title: "Quality Reports",
            name: "QualityReports",
            icon: "mdi-cloud-print",
            role: 3,
            menu: 1,
            id: "QualityReports",
            color: "red"
          },
          {
            title: "Progress",
            name: "Progress",
            icon: "mdi-percent",
            role: 2,
            menu: 1,
            id: "signup",
            color: "lime accent-2"
          },
          {
            title: "SmartProgress",
            name: "SmartProgress",
            icon: "mdi-database-plus",
            role: 2,
            menu: 1,
            id: "SmartProgress",
            color: "yellow"
          },
          {
            title: "SmartSubcontractors",
            name: "SmartSubcontractors",
            icon: "mdi-factory",
            role: 2,
            menu: 1,
            id: "SmartSubcontractors",
            color: "yellow"
          },
          {
            title: "SmartUploads",
            name: "SmartUploads",
            icon: "mdi-auto-upload",
            role: 2,
            menu: 1,
            id: "SmartUploads",
            color: "yellow"
          },
          {
            title: "AddSmartsheet",
            name: "AddSmartsheets",
            icon: "mdi-table-row-plus-after",
            role: 2,
            menu: 1,
            id: "AddSmartsheet",
            color: "yellow"
          },
          {
            title: "Update Task Dates",
            name: "UpdateTaskDates",
            icon: "mdi-calendar-multiple",
            role: 3,
            menu: 1,
            id: "UpdateTaskDates",
            color: "light-green accent-2"
          },
          // {
          //   title: "Gantt Chart",
          //   name: "gantt4",
          //   icon: "mdi-chart-gantt",
          //   role: 3,
          //   menu: 1,
          //   id: "gantt4",
          //   color: "light-green accent-2"
          // },
          {
            title: "Payment Certificates",
            name: "paymentCertificates",
            icon: "mdi-certificate",
            role: 3,
            menu: 1,
            id: "paymentCertificates",
            color: "lime"
          },

          {
            title: "Schedule",
            name: "Schedule",
            icon: "mdi-calendar-check",
            role: 3,
            menu: 1,
            id: "schedule",
            color: "amber accent-3"
          },

          {
            title: "Retentions",
            name: "Retention",
            icon: "mdi-snake",
            role: 3,
            menu: 1,
            id: "retention",
            color: "cyan accent-2"
          },
          {
            title: "Images",
            name: "Images",
            icon: "mdi-camera",
            role: 3,
            menu: 1,
            id: "images",
            color: "yellow"
          },
          {
            title: "Stock Take",
            name: "StockTake",
            icon: "mdi-camera",
            role: 3,
            menu: 1,
            id: "StockTake",
            color: "orange"
          },
          {
            title: "Stock Transfer",
            name: "StockTrx",
            icon: "mdi-camera",
            role: 3,
            menu: 1,
            id: "StockTrx",
            color: "lime"
          }
          // {
          //   title: "P&G's",
          //   name: "PandG",
          //   icon: "mdi-food-fork-drink",
          //   role: 3,
          //   menu: 1,
          //   id: "P&G",
          //   color: "blue"
          // }
        ]
      },
      {
        title: "Investment App",
        name: "investorDashboard",
        icon: "mdi-warehouse",
        role: 3,
        menu: 1,
        id: "investmentApp",
        color: "blue"
      },

      {
        title: "Purchase Orders",
        name: "purchaseorders",
        icon: "mdi-fridge",
        role: 3,
        menu: 1,
        id: "pos",
        color: "orange",
        items: [
          {
            title: "Create Requisition",
            name: "purchaseordercreate",
            icon: "mdi-shopping",
            role: 3,
            menu: 1,
            id: "purchaseordercreate",
            color: "lime"
          },
          {
            title: "View Purchase Orders",
            name: "POView",
            icon: "mdi-cash-multiple",
            role: 3,
            menu: 1,
            id: "purchaseorderview",
            color: "pink"
          },
          {
            title: "Deliveries",
            name: "Deliveries",
            icon: "mdi-truck",
            role: 3,
            menu: 1,
            id: "Deliveries",
            color: "amber"
          },
          {
            title: "Instruction To Commence",
            name: "ITC",
            icon: "mdi-handshake",
            role: 3,
            menu: 1,
            id: "ITC",
            color: "white"
          }
        ]
      },
      {
        title: "Cashflow & Payments",
        name: "paymentCertificates",
        icon: "mdi-account-cash",
        role: 3,
        menu: 1,
        id: "paymentCertificates",
        color: "teal",
        items: [
          {
            title: "Cashflow",
            name: "Cashflow",
            icon: "mdi-cash-multiple",
            role: 3,
            menu: 1,
            id: "Cashflow",
            color: "purple accent-1"
          },
          {
            title: "Payments Due",
            name: "paymentsdue",
            icon: "mdi-basket",
            role: 3,
            menu: 1,
            id: "paymentsdue",
            color: "teal accent-2"
          }
        ]
      },
      {
        title: "Sales",
        name: "sales",
        icon: "mdi-point-of-sale",
        role: 2,
        menu: 1,
        id: "sales",
        color: "orange accent-1",
        items: [
          // {
          //   title: "Apartment Options",
          //   name: "apartment",
          //   icon: "mdi-table-furniture",
          //   role: 2,
          //   menu: 1,
          //   id: "apartment",
          //   color: "amber"
          // },
          {
            title: "Start Sales",
            name: "salesstart",
            icon: "mdi-home-variant",
            role: 2,
            menu: 1,
            id: "salesstart",
            color: "blue"
          },
          {
            title: "Sales Info",
            name: "salesinfo",
            icon: "mdi-account-check",
            role: 2,
            menu: 1,
            id: "salesinfo",
            color: "orange"
          }
        ]
      },

      {
        title: "Setup",
        name: "datainput",
        icon: "mdi-database-import",
        role: 3,
        menu: 1,
        id: "datainput",
        color: "yellow",
        items: [
          {
            title: "Project Structure",
            name: "ProjectStructure",
            icon: "mdi-chart-timeline",
            role: 3,
            menu: 1,
            id: "ProjectStructure",
            color: "amber"
          },
          {
            title: "Import Data",
            name: "importdata",
            icon: "mdi-database-import",
            role: 3,
            menu: 1,
            id: "importdata",
            color: "grey lighten-5"
          },
          {
            title: "Add Items",
            name: "additems",
            icon: "mdi-file",
            role: 3,
            menu: 1,
            id: "additems",
            color: "orange accent-1"
          },
          {
            title: "Deposits",
            name: "Deposits",
            icon: "mdi-credit-card-clock",
            role: 3,
            menu: 1,
            id: "Deposits",
            color: "yellow accent-2"
          },
          {
            title: "Suppliers",
            name: "Suppliers",
            icon: "mdi-cow",
            role: 3,
            menu: 1,
            id: "suppliers",
            color: "lime accent-3"
          },
          {
            title: "Change Subcontractors",
            name: "SupplierChange",
            icon: "mdi-notebook-edit",
            role: 3,
            menu: 1,
            id: "SupplierChange",
            color: "teal"
          }
          // {
          //   title: "Reset Dates",
          //   name: "DateReset",
          //   icon: "mdi-notebook-edit",
          //   role: 3,
          //   menu: 1,
          //   id: "DateReset",
          //   color: "yellow"
          // }
        ]
      },
      {
        title: "User Admin",
        name: "sysAdmin",
        icon: "mdi-account-cowboy-hat",
        role: 3,
        menu: 1,
        id: "sysadmin",
        color: "light-blue accent-1",
        items: [
          {
            title: "Create User",
            name: "CreateUser",
            icon: "mdi-account-plus",
            role: 3,
            menu: 1,
            id: "createuser",
            color: "deep-orange"
          },
          {
            title: "Edit User",
            name: "EditUser",
            icon: "mdi-account-edit",
            role: 3,
            menu: 1,
            id: "edituser",
            color: "yellow accent-2"
          }
        ]
      },
      {
        title: "DashBoard",
        name: "sysAdmin",
        icon: "mdi-view-dashboard",
        role: 3,
        menu: 1,
        id: "sdashboard",
        color: "yellow",
        items: [
          {
            title: "P&G's WIP",
            name: "PandG",
            icon: "mdi-diamond",
            role: 3,
            menu: 1,
            id: "P&G",
            color: "blue"
          },
          {
            title: "Finance Input WIP",
            name: "FinanceInput",
            icon: "mdi-cash-100",
            role: 3,
            menu: 1,
            id: "financeinput",
            color: "orange"
          },
          {
            title: "Finance Construction Input WIP",
            name: "FinanceConstructionInput",
            icon: "mdi-escalator",
            role: 3,
            menu: 1,
            id: "FinanceConstructionInput",
            color: "yellow"
          },
          {
            title: "Contingencies WIP",
            name: "Contingencies",
            icon: "mdi-escalator",
            role: 3,
            menu: 1,
            id: "Contingencies",
            color: "orange"
          },
          {
            title: "Escalations WIP",
            name: "Escalations",
            icon: "mdi-escalator",
            role: 3,
            menu: 1,
            id: "Escalations",
            color: "amber"
          },
          {
            title: "Allocate Tasks to PO WIP",
            name: "PurchaseOrderAllocate",
            icon: "mdi-checkbox-multiple-blank",
            role: 3,
            menu: 1,
            id: "PurchaseOrderAllocate",
            color: "orange"
          },
          {
            title: "Sales Input WIP",
            name: "SalesData",
            icon: "mdi-sale",
            role: 3,
            menu: 1,
            id: "salesdata",
            color: "amber"
          },
          {
            title: "Investor Data WIP",
            name: "InvestorData",
            icon: "mdi-bank",
            role: 3,
            menu: 1,
            id: "investordata",
            color: "yellow"
          },
          // {
          //   title: "% to Investor WIP",
          //   name: "PercentageInvestors",
          //   icon: "mdi-percent",
          //   role: 3,
          //   menu: 1,
          //   id: "PercentageInvestors",
          //   color: "amber"
          // },
          {
            title: "Dashboard Summary WIP",
            name: "DashboardSummary",
            icon: "mdi-view-dashboard",
            role: 3,
            menu: 1,
            id: "dashboardsummary",
            color: "pink"
          }
        ]
      }
    ],
    siteManager: [
      {
        title: "Progress",
        name: "Progress",
        icon: "mdi-percent",
        role: 2,
        menu: 1,
        id: "signup"
      },
      {
        title: "Gantt Chart",
        name: "gantt4",
        icon: "mdi-chart-gantt",
        role: 3,
        menu: 1,
        id: "gantt4",
        color: "light-green accent-2"
      },

      {
        title: "Create Requisition",
        name: "purchaseordercreate",
        icon: "mdi-shopping",
        role: 3,
        menu: 1,
        id: "purchaseordercreate",
        color: "lime"
      },
      {
        title: "View Purchase Orders",
        name: "POView",
        icon: "mdi-cash-multiple",
        role: 3,
        menu: 1,
        id: "purchaseorderview",
        color: "pink"
      },
      {
        title: "Deliveries",
        name: "Deliveries",
        icon: "mdi-truck",
        role: 3,
        menu: 1,
        id: "Deliveries",
        color: "amber"
      },
      {
        title: "Images",
        name: "Images",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "images",
        color: "yellow"
      },
      {
        title: "Quality Control",
        name: "QualityControl",
        icon: "mdi-quality-high",
        role: 3,
        menu: 1,
        id: "QualityControl",
        color: "orange"
      },
      {
        title: "Instruction To Commence",
        name: "ITC",
        icon: "mdi-handshake",
        role: 3,
        menu: 1,
        id: "ITC",
        color: "white"
      },
      {
        title: "Stock Take",
        name: "StockTake",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "StockTake",
        color: "orange"
      },
      {
        title: "Stock Transfer",
        name: "StockTrx",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "StockTrx",
        color: "lime"
      }
      // {
      //   title: "Schedule",
      //   name: "Schedule",
      //   icon: "mdi-calendar-check",
      //   role: 3,
      //   menu: 1,
      //   id: "schedule"
      // },
      // {
      //   title: "Gantt",
      //   name: "Gantt",
      //   icon: "mdi-chart-gantt",
      //   role: 3,
      //   menu: 1,
      //   id: "gantt"
      // }
    ],
    siteForeman: [
      {
        title: "Progress",
        name: "Progress",
        icon: "mdi-percent",
        role: 2,
        menu: 1,
        id: "signup"
      },
      {
        title: "Gantt V3A",
        name: "ganttv3A",
        icon: "mdi-chart-gantt",
        role: 3,
        menu: 1,
        id: "ganttv3A",
        color: "light-green accent-2"
      },
      {
        title: "Purchase Orders",
        name: "purchaseorders",
        icon: "mdi-fridge",
        role: 3,
        menu: 1,
        id: "pos",
        color: "orange",
        items: [
          {
            title: "Create Requisition",
            name: "purchaseordercreate",
            icon: "mdi-shopping",
            role: 3,
            menu: 1,
            id: "purchaseordercreate",
            color: "lime"
          },
          {
            title: "View Purchase Orders",
            name: "POView",
            icon: "mdi-cash-multiple",
            role: 3,
            menu: 1,
            id: "purchaseorderview",
            color: "pink"
          },
          {
            title: "Deliveries",
            name: "Deliveries",
            icon: "mdi-truck",
            role: 3,
            menu: 1,
            id: "Deliveries",
            color: "amber"
          }
        ]
      },
      {
        title: "Stock Take",
        name: "StockTake",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "StockTake",
        color: "orange"
      },
      {
        title: "Stock Transfer",
        name: "StockTrx",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "StockTrx",
        color: "lime"
      }
    ],
    Storeman: [
      {
        title: "Deliveries",
        name: "Deliveries",
        icon: "mdi-truck",
        role: 3,
        menu: 1,
        id: "Deliveries",
        color: "amber"
      },
      {
        title: "Stock Take",
        name: "StockTake",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "StockTake",
        color: "orange"
      },
      {
        title: "Stock Transfer",
        name: "StockTrx",
        icon: "mdi-camera",
        role: 3,
        menu: 1,
        id: "StockTrx",
        color: "lime"
      }
    ],
    anyUser: [
      {
        title: "About",
        name: "About",
        icon: "mdi-information",
        role: 3,
        menu: 0,
        id: "about",
        color: "amber"
      }
    ]
    // menu: false
  }),
  created() {
    this.windowSize = window.innerWidth;
  },
  components: {},
  watch: {},
  methods: {
    onScroll() {},
    switchDevelopment() {
      this.$store.dispatch("clearDevelopment");
      if (this.$route.name !== "Home") {
        this.$router.push({ name: "Home" });
      }
    },
    closeMenu() {
      this.closeOnClick = true;
      setTimeout(() => {
        this.closeOnClick = false;
      });
    },
    logout() {
      this.$store.dispatch("logout");
      if (this.$route.name !== "Home") {
        this.$router.push({ name: "Home" });
      }
    }
  }
};
</script>

<style scoped>
h2 {
  color: whitesmoke;
}
@media only screen and (max-width: 767px) {
  .mobile {
    font-size: 60%;
    /* max-width: 100vw; */
  }
}
</style>

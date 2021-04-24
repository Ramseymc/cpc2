<template>
  <!-- <div> -->
  <v-app-bar app color="#0F0F0F" dark class="mobile">
    <!-- <div class="d-flex align-center" v-if="windowSize > 767">
      <v-img
        :to="{ name: 'Home' }"
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        :src="require('../assets/CPCLogo.png')"
        transition="scale-transition"
        width="40"
      />
    </div> -->

    <v-btn text min-width="100" style="font-size: 120%;" :to="{ name: 'Home' }"
      >CPC {{ this.$store.state.development.developmentName }}</v-btn
    >
    <v-spacer></v-spacer>

    <!-- <h2 style="margin-left: 15px;">
      {{ this.$store.state.development.developmentName }}
    </h2>
    <v-spacer></v-spacer> -->
    <h2 v-if="this.$store.state.isLoggedIn && windowSize > 767">
      Hello {{ this.$store.state.userName }}
    </h2>
    <v-spacer></v-spacer>
    <v-btn color="red" :to="{ name: 'TaskList' }">Tasks</v-btn>

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

        <v-list v-if="this.$store.state.userRole === 1">
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
            title: "Progress",
            name: "Progress",
            icon: "mdi-percent",
            role: 2,
            menu: 1,
            id: "signup",
            color: "lime accent-2"
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
          }
        ]
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
            title: "Create Purchase Order",
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
          {
            title: "Apartment Options",
            name: "apartment",
            icon: "mdi-table-furniture",
            role: 2,
            menu: 1,
            id: "apartment",
            color: "amber"
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
            title: "Change Suppliers",
            name: "SupplierChange",
            icon: "mdi-notebook-edit",
            role: 3,
            menu: 1,
            id: "SupplierChange",
            color: "teal"
          },
          {
            title: "Reset Dates",
            name: "DateReset",
            icon: "mdi-notebook-edit",
            role: 3,
            menu: 1,
            id: "DateReset",
            color: "yellow"
          }
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
        title: "Gantt V3A",
        name: "ganttv3A",
        icon: "mdi-chart-gantt",
        role: 3,
        menu: 1,
        id: "ganttv3A",
        color: "light-green accent-2"
      },

      {
        title: "Create Purchase Order",
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
            title: "Create Purchase Order",
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
  watch: {
    // items: function() {
    //   if (this.$store.state.isLoggedIn) {
    //     console.log("AWESOME!!!");
    //   }
    // }
  },
  methods: {
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

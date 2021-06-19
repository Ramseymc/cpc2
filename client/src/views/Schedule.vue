<template>
  <div class="about">
    <br />
    <v-col class="mb-0">
      <h2>Schedule - {{ today }}</h2>
    </v-col>
    <v-col cols="10" offset="1" v-if="desserts.length" xs-12>
      <v-card xs-12 :max-height="maxHeight">
        <div style="display:flex; justify-content: space-around;">
          <v-card-title style="font-size: 80%;" @click="showSort"
            >Sort Options
            <v-btn icon
              ><v-icon x-large>mdi-chevron-down</v-icon></v-btn
            ></v-card-title
          >
          <v-btn
            v-if="filterUnitValue || filterBlockValue || filterTaskValue"
            @click="clearFilter"
            color="#0F0F0F"
            text
            >Clear Sort</v-btn
          >
        </div>
        <v-row v-if="showSorting">
          <v-col cols="4">
            <v-autocomplete
              class="ml-4"
              v-model="filterBlockValue"
              :items="filteredTable"
              item-text="subsectionName"
              dense
              filled
              label="Block"
              clearable
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="filterUnitValue"
              :items="filteredTable"
              item-text="unitName"
              dense
              filled
              label="Unit"
              clearable
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <!-- filterTask -->
            <v-autocomplete
              class="mr-4"
              v-model="filterTaskValue"
              :items="filteredTable"
              item-text="taskName"
              dense
              filled
              label="Task"
              clearable
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-row class="text-center">
      <v-col v-if="desserts.length" class="mb-0 md-4" offset="1" cols="10">
        <!-- TABLE WITH DATA -->
        <v-data-table
          style="padding-top: 5px;"
          fixed
          :headers="headers"
          :items="filteredTable"
          :itemsPerPage="5"
          :footer-props="{ 'items-per-page-options': [15, 30, 50, 100, -1] }"
          dense
          multi-sort
          item-key="index"
          :item-class="itemRowColor"
          class="elevation-15"
        >
          <template
            v-if="windowSize > 700"
            v-slot:header
            style="border-bottom: 1px solid black;"
          >
            <td class="totalsHeading">Totals</td>
            <td class="totals"></td>
            <td class="totals"></td>
            <td class="totals borderH"></td>
            <td class="totals">{{ totals.budget }}</td>
            <td class="totals">{{ totals.pcpaid }}</td>
            <td class="totals borderH">{{ totals.budgetLessPaid }}</td>
            <td class="totals">{{ totals.pcIssued }}</td>
            <td class="totals">{{ totals.retained }}</td>
            <td class="totals borderH">{{ totals.actual }}</td>
            <td class="totals borderH">{{ totals.due }}</td>
            <td class="totals"></td>
            <td class="totals borderH"></td>
            <td class="totals borderH"></td>
            <td class="totals borderH"></td>
            <td class="totals"></td>
          </template>
          <template v-slot:item.controls="props">
            <v-btn
              v-if="props.item.PCIssued != '0.00'"
              class="mx-2"
              text
              fab
              dark
              x-small
              color="green"
              @click="viewPayment(props.item)"
            >
              <v-icon dark>mdi-account-cash</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.action="props">
            <v-btn
              class="mx-2"
              text
              fab
              dark
              x-small
              color="pink"
              @click="viewItem(props.item)"
            >
              <v-icon dark>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500">
      <!-- PROGRESS DIALOG -->
      <v-card>
        <v-card-title>
          <span class="headline">View Tasks</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="viewItemObj.subsectionName"
                  label="Subsection"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="viewItemObj.unitName"
                  label="Unit"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="viewItemObj.taskName"
                  label="Task Type"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="viewItemObj.fix"
                  label="Fix No."
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-card max-width="100%" class="mx-auto">
                  <v-toolbar color="#111d5e" dark>
                    <v-spacer></v-spacer>
                    <v-toolbar-title>Tasks</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-list two-line dense>
                    <template v-for="item in items">
                      <v-list-item :key="item.title">
                        <v-list-item-content
                          style="border-bottom: 1px solid grey;"
                        >
                          <v-list-item-title
                            ><strong>
                              {{ item.taskDescription }}</strong
                            ></v-list-item-title
                          >

                          <v-list-item-subtitle
                            >Price: R {{ item.price }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle style="color: red;"
                            ><strong
                              >Progress: {{ item.progress }} %</strong
                            ></v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            >Remaining: R
                            {{ item.remaining }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="500">
      <v-container>
        <v-row>
          <v-card class="mx-auto">
            <v-toolbar color="#111d5e" dark>
              <v-spacer></v-spacer>
              <v-toolbar-title>Payment History</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-list three-line dense>
              <template v-for="(item, index) in items2">
                <v-list-item :key="index">
                  <v-list-item-content style="border-bottom: 1px solid grey;">
                    <v-list-item-title style="font-weight: bold;">
                      {{ item.unitName }}</v-list-item-title
                    >
                    <v-list-item-title style="font-weight: bold;">
                      {{ item.taskName }}</v-list-item-title
                    >
                    <v-list-item-title style="font-weight: bold;">
                      {{ item.certificateNumber }}</v-list-item-title
                    ><br />
                    <v-list-item-subtitle
                      >Gross: R
                      {{ item.netBeforeRetention }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Retention: {{ item.retention }} </v-list-item-subtitle
                    ><br />
                    <v-list-item-subtitle style="font-weight: bold;"
                      >Net: R {{ item.netAfterRetention }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle style="color: brown;"
                      >Invoice Number:
                      {{ item.invoiceNumber }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle style="font-weight: bold;"
                      >Amount Paid: R
                      {{ item.amountPaid }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "Shedule",
  metaInfo: {
    title: "Schedule",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Schedule here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      windowSize: 0,
      maxHeight: 50,
      showSorting: false,
      // darkMode: false,
      today: new Date().toISOString().substr(0, 10),
      dialog: false,
      dialog2: false,

      viewItemObj: {
        subsectionName: "",
        unitName: "",
        taskName: "",
        fix: ""
      },
      defaultItem: {
        subsectionName: "",
        unitName: "",
        taskName: "",
        fix: ""
      },
      viewIndex: -1,

      desserts: [],
      finalData: [],
      headers: [
        {
          text: "subsection",
          align: "start",
          sortable: false,
          value: "subsectionName",
          width: 18
        },
        { text: "Unit", value: "unitName", width: 25 },
        { text: "Task", value: "taskName", width: 130 },
        { text: "Fix", value: "fix", width: 25, divider: true },
        { text: "Budget", value: "totalBudgetStr", align: "end", width: 120 },
        {
          text: "Paid",
          value: "PCPaidStr",
          align: "end",
          width: 120,
          fixed: true
        },
        {
          text: "Budget less Paid",
          value: "budgetLessPaidStr",
          align: "end",
          fixed: true,
          width: 120,
          divider: true
        },
        {
          text: "Certificate Issued",
          value: "PCIssuedStr",
          align: "end",
          width: 120
        },
        {
          text: "Retention",
          value: "RetainedStr",
          align: "end",
          width: 120
        },
        {
          text: "Valuation to Date",
          value: "totalUsedStr",
          align: "end",
          width: 120,
          divider: true
        },

        {
          text: "Valued not Certified",
          value: "dueStr",
          align: "end",
          width: 120,
          divider: true
        },
        { text: "Start Date", value: "startDate", align: "center", width: 100 },
        {
          text: "End Date",
          value: "endDate",
          align: "center",
          width: 120,
          divider: true
        },
        { text: "Schedule", value: "schedule", width: 30, divider: true },
        {
          text: "View",
          value: "action",
          sortable: false,
          width: 20,
          divider: true
        },
        { text: "Cert Details", value: "controls", sortable: false, width: 20 }
      ],
      totals: {
        budget: 3600.0,
        actual: 4500,
        remaining: 105.1,
        usedPercent: "20%"
      },
      items: [],
      items2: [],

      filterUnit: [],
      filterUnitValue: null,
      filterBlock: [],
      filterBlockValue: null,
      filterTask: [],
      filterTaskValue: null
    };
  },
  computed: {
    filteredTable: function() {
      return this.createFilters();
    }
  },
  watch: {
    filteredTable: function() {
      return this.sumField();
    }
  },
  mounted() {
    this.checkToken();
    this.processNotifications();
    this.windowSize = window.innerWidth;
    this.getData();
  },
  methods: {
    showSort() {
      this.showSorting = !this.showSorting;
      if (this.showSorting) {
        this.maxHeight = 150;
      } else {
        this.maxHeight = 50;
      }
    },
    clearFilter() {
      //CLEARS THE FILTER
      this.desserts = this.finalData;
      this.filterUnitValue = null;
      this.filterBlockValue = null;
      this.filterTaskValue = null;
      this.createFilters();
      this.sumField();
    },
    async getData() {
      //GETS DATA TO POPULATE TABLE
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/progressResults/${this.$store.state.development.id}`
      }).then(
        response => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          this.desserts = response.data;
          this.finalData = this.desserts;
          this.createFilters();
          this.sumField();
        },
        error => {
          console.log(error);
        }
      );
    },

    createFilters() {
      if (
        !this.filterBlockValue &&
        !this.filterUnitValue &&
        !this.filterTaskValue
      ) {
        return this.desserts;
      } else if (
        this.filterBlockValue &&
        !this.filterUnitValue &&
        !this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return el.subsectionName === this.filterBlockValue;
        });
      } else if (
        this.filterBlockValue &&
        this.filterUnitValue &&
        !this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return (
            el.subsectionName === this.filterBlockValue &&
            el.unitName === this.filterUnitValue
          );
        });
      } else if (
        this.filterBlockValue &&
        this.filterUnitValue &&
        this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return (
            el.subsectionName === this.filterBlockValue &&
            el.unitName === this.filterUnitValue &&
            el.taskName === this.filterTaskValue
          );
        });
      } else if (
        !this.filterBlockValue &&
        this.filterUnitValue &&
        !this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return el.unitName === this.filterUnitValue;
        });
      } else if (
        !this.filterBlockValue &&
        this.filterUnitValue &&
        this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return (
            el.unitName === this.filterUnitValue &&
            el.taskName === this.filterTaskValue
          );
        });
      } else if (
        this.filterBlockValue &&
        this.filterUnitValue &&
        this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return (
            el.subsectionName === this.filterBlockValue &&
            el.unitName === this.filterUnitValue &&
            el.taskName === this.filterTaskValue
          );
        });
      } else if (
        !this.filterBlockValue &&
        !this.filterUnitValue &&
        this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return el.taskName === this.filterTaskValue;
        });
      } else if (
        this.filterBlockValue &&
        !this.filterUnitValue &&
        this.filterTaskValue
      ) {
        return this.desserts.filter(el => {
          return (
            el.subsectionName === this.filterBlockValue &&
            el.taskName === this.filterTaskValue
          );
        });
      }
    },
    async viewItem(item) {
      this.viewIndex = this.desserts.indexOf(item);
      this.items = [];
      this.viewItemObj = Object.assign({}, item);
      let data = {
        development: this.$store.state.development.id,
        fix: this.viewItemObj.fix,
        unitName: this.viewItemObj.unitName,
        taskName: this.viewItemObj.taskName
      };
      await axios({
        method: "post",
        url: `${url}/progressResultTasks`,
        data: data
      }).then(
        response => {
          this.items = response.data;
          this.dialog = true;
        },
        error => {
          console.log(error);
        }
      );
    },
    async viewPayment(item) {
      //VIEW PAYMENT CERTIFICATES RELATING TO THAT LINE ITEM
      this.items = [];

      this.viewIndex = this.desserts.indexOf(item);

      this.viewItemObj = Object.assign({}, item);
      let data = {
        development: this.$store.state.development.id,
        fix: this.viewItemObj.fix,
        unitName: this.viewItemObj.unitName,
        taskName: this.viewItemObj.taskName
      };
      // this.dialog2 = true;
      await axios({
        method: "post",
        url: `${url}/paymentCertificateHistory`,
        data: data
      }).then(
        response => {
          this.items2 = response.data;
          if (response.data.length) {
            this.dialog2 = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    close() {
      // CLOSE THE DIALOGS AND CLEAR THE OBJECT
      this.dialog = false;
      this.dialog2 = false;
      this.$nextTick(() => {
        this.viewItemObj = Object.assign({}, this.defaultItem);
        this.viewIndex = -1;
      });
    },
    itemRowColor(item) {
      //CHANGES ROW COLOR WHEN TASK BEHIND SCGEDULE
      if (item.schedule == "Behind") {
        return "red lighten-3";
      }
    }
  }
};
</script>

<style scoped>
.borderH {
  border-right: 1px solid rgba(128, 128, 128, 0.543);
  opacity: 0.8;
}
.totals {
  font-size: 85%;
  text-align: end;
  padding-right: 15px;
  padding-bottom: 6px;
  padding-top: 6px;
  font-weight: bold;
  color: #bc9654;
  /* background-color: greenyellow; */
  background-color: #0f0f0f;
  border-bottom: 1px solid grey;
  border-bottom-color: lightgray;
  opacity: 0.9;
}
.totalsHeading {
  font-size: 90%;
  text-align: center;
  padding-right: 15px;
  font-style: italic;
  font-weight: bold;
  color: #bc9654;
  /* background-color: greenyellow; */
  /* background-color: #bc9654; */
  background-color: #0f0f0f;
  border-bottom: 1px solid grey;
  border-bottom-color: lightgray;
  opacity: 0.9;
}
table.v-table {
  max-width: none;
}
</style>

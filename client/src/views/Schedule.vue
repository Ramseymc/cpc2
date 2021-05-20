<template>
  <div class="about">
    <br />
    <v-col class="mb-0">
      <h2>Schedule - {{ today }}</h2>
    </v-col>
    <v-col cols="10" offset="1" v-if="desserts.length" xs-12>
      <v-card xs-12 :max-height="maxHeight">
        <!-- FILTER DETAILS -->
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

        <!-- <v-row style="padding: 5px;"> -->
        <v-row v-if="showSorting">
          <v-col cols="4">
            <v-autocomplete
              class="ml-4"
              v-model="filterBlockValue"
              :items="filterBlock"
              dense
              filled
              label="Block"
              @change="createFilters"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="filterUnitValue"
              :items="filterUnit"
              dense
              filled
              label="Unit"
              @change="createFilters"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              class="mr-4"
              v-model="filterTaskValue"
              :items="filterTask"
              dense
              filled
              label="Task"
              @change="createFilters"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- <v-col cols="12">
          <v-btn
            v-if="filterUnitValue || filterBlockValue || filterTaskValue"
            @click="clearFilter"
            color="#0F0F0F"
            text
            >Clear Sort</v-btn
          >
        </v-col> -->
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
      <!-- PAYMENT HISTORY DIALOG -->
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
import * as moment from "moment/moment";
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
      darkMode: false,
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
      // return this.filterData();
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
      console.log("Show Sort");
      this.showSorting = !this.showSorting;
      if (this.showSorting) {
        this.maxHeight = 150;
      } else {
        this.maxHeight = 50;
      }
    },
    test() {
      console.log("table changed");
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
          let now = new Date();
          console.log("Hello", response.data[4]);
          console.log("Cool", response.data[0]);
          response.data[0].forEach(el => {
            if (!el.vatVendor) {
              console.log("cool");
              el.PCIssued = el.PCIssued / 1.15;
              el.PCPaid = el.PCPaid / 1.15;
              el.Remaining = parseFloat(el.Remaining) / 1.15;
              el.Retained = el.Retained / 1.15;
              el.budgetLessPaid = parseFloat(el.budgetLessPaid) / 1.15;
              el.due = parseFloat(el.due) / 1.15;
              el.totalBudget = el.totalBudget / 1.15;
              el.totalUsed = el.totalUsed / 1.15;
            }
            // let filteredData = response.data[4].filter(el2 => {
            //   return (
            //     el.taskType === el2.taskType &&
            //     el.fix === el2.fix &&
            //     el.subsectionName === el2.subsectionName &&
            //     el.supplier === el2.supplier &&
            //     el.unitNumber === el2.unitNumber
            //   );
            // });
            // // console.log(filteredData)

            // el.startDate = filteredData[0].startDate;
            // el.endDate = filteredData[filteredData.length - 1].endDate;
            if (
              moment(now) > moment(el.endDate) &&
              el.totalBudget - (el.totalBudget * (el.progress, 0)) / 100 > 0
            ) {
              el.schedule = "Behind";
            } else {
              el.schedule = "";
            }
            // if (now )
          });
          response.data[0].forEach(el => {
            el.PCIssuedArray = response.data[1].filter(el2 => {
              return (
                el2.fix === el.fix &&
                el2.unitName === el.unitName &&
                el2.taskName === el.taskName
              );
            });

            el.PCIssued = el.PCIssuedArray.reduce((acc, pv) => {
              return acc + pv.PCIssued;
            }, 0);
            el.Retained = el.PCIssuedArray.reduce((acc, pv) => {
              return acc + pv.Retained;
            }, 0);
            el.PCPaid = el.PCIssuedArray.reduce((acc, pv) => {
              return acc + pv.PCPaid;
            }, 0);

            // console.log(el.supplier)
            let startDate = new Date(el.startDate).toISOString();
            el.startDate = moment(startDate).format("YY-MM-DD");
            let endDate = new Date(el.endDate).toISOString();
            el.endDate = moment(endDate).format("YY-MM-DD");
            el.totalBudget = parseFloat(el.totalBudget.toFixed(2));
            el.totalUsed = parseFloat(el.totalUsed.toFixed(2));
            el.Remaining = el.Remaining.toFixed(2);
            el.percentRemaining =
              ((el.totalUsed / el.totalBudget) * 100).toFixed(0) + "%";
            el.due = (el.totalUsed - el.PCIssued - el.Retained).toFixed(2);
            el.budgetLessPaid = (el.totalBudget - el.PCPaid).toFixed(2);

            el.RetainedStr = this.convertToString(el.Retained);
            el.budgetLessPaidStr = this.convertToString(el.budgetLessPaid);
            el.dueStr = this.convertToString(el.due);
            el.PCIssuedStr = this.convertToString(el.PCIssued);
            el.PCPaidStr = this.convertToString(el.PCPaid);
            el.totalUsedStr = this.convertToString(el.totalUsed);
            el.totalBudgetStr = this.convertToString(el.totalBudget);
          });
          this.desserts = response.data[0];

          if (response.data[2].length) {
            response.data[2].forEach(el => {
              let unitName = el.unitName;
              let filtered = this.desserts.filter(el2 => {
                return el2.unitName === unitName;
              });
              let sumTotalBudget = filtered.reduce((acc, pv) => {
                return acc + pv.totalBudget;
              }, 0);
              this.desserts.forEach(el2 => {
                if (el2.unitName === unitName) {
                  el2.paidRetention =
                    (el.retentionPaid / sumTotalBudget) * el2.totalBudget;
                  el2.PCPaid = el2.PCPaid + el2.paidRetention;
                  el2.PCPaidStr = this.convertToString(el2.PCPaid);
                  el2.budgetLessPaid = el2.budgetLessPaid - el2.paidRetention;
                  el2.budgetLessPaidStr = this.convertToString(
                    el2.budgetLessPaid
                  );
                  el2.PCIssued = el2.PCIssued + el2.paidRetention;
                  el2.PCIssuedStr = this.convertToString(el2.PCIssued);
                  el2.Retained = el2.Retained - el2.paidRetention;
                  el2.RetainedStr = this.convertToString(el2.Retained);
                }
              });
            });
          }
          // TEST THIS OUT
          this.desserts.forEach(el => {
            // console.log(el.unitName.substring(1,2))
            if (el.unitName.substring(1, 2) === ".") {
              // console.log(el.unitName);
              // var ary = [8, 1, 2, 3, 4, 5, 6, 7];
              this.desserts.push(this.desserts.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
            }
          });
          if (response.data[3].length) {
            for (let i = 0; i < response.data[3].length; i++) {
              // console.log(response.data[3][i]);
              if (response.data[3].length === 1) {
                response.data[3][i].fixNumber = 1;
                // response.data[3][i].fix = this.convertNumber(response.data[3][i].fixNumber)
              } else {
                response.data[3][0].fixNumber = 1;
                if (i > 0) {
                  if (
                    response.data[3][i - 1].unitName ===
                      response.data[3][i].unitName &&
                    response.data[3][i - 1].supplier ===
                      response.data[3][i].supplier
                  ) {
                    response.data[3][i].fixNumber =
                      response.data[3][i - 1].fixNumber + 1;
                    // response.data[3][i].fix = this.convertNumber(response.data[3][i].fixNumber)
                  } else {
                    response.data[3][i].fixNumber = 1;
                    // response.data[3][i].fix = this.convertNumber(response.data[3][i].fixNumber)
                  }
                }
              }
            }
          }

          response.data[3].forEach(el => {
            el.fix = el.fixNumber.toString();
            el.fix = this.convertNumber(el.fix);
          });
          // this.convertNumber(2);

          response.data[3].forEach(el => {
            this.desserts.forEach(el2 => {
              if (
                el.unitName === el2.unitName &&
                el.supplier === el2.supplier &&
                el.fix === el2.fix
              ) {
                // console.log("This works")
                el2.PCPaid = el2.PCPaid + el.recovered;
                el2.PCPaidStr = this.convertToString(el2.PCPaid);
                el2.budgetLessPaid = el2.budgetLessPaid - el2.PCPaid;
                el2.budgetLessPaidStr = this.convertToString(
                  el2.budgetLessPaid
                );
                el2.PCIssued = el2.PCIssued - el2.PCPaid;
                el2.PCIssuedStr = this.convertToString(el2.PCIssued);
              }
            });
          });

          // console.log(response.data[3]);
          // console.log(this.desserts);
          this.finalData = this.desserts;
          this.createFilters();
          this.sumField();
        },
        error => {
          console.log(error);
        }
      );
    },
    convertNumber(number) {
      // let numStr = number.toString()
      let numStr = number;
      switch (numStr.substring(numStr.length - 1, 1)) {
        // switch (numStr) {
        case "1":
          numStr = `${numStr}st`;
          break;
        case "2":
          numStr = `${numStr}nd`;
          break;
        case "3":
          numStr = `${numStr}rd`;
          break;
        case "":
          numStr = "error";
          break;
        default:
          numStr = `${numStr}th`;
      }
      // console.log("AWESOME",numStr)

      return numStr;
    },
    createFilters() {
      //CREATES THE FILTERED DATA - Could REFACTOR
      let test = [];
      test.push(this.filterBlockValue);
      test.push(this.filterUnitValue);
      test.push(this.filterTaskValue);
      let res = [];
      test.forEach((el, index) => {
        if (el !== null) {
          res.push(index + 1);
        } else {
          res.push(0);
        }
      });
      res = res.reduce((acc, pv) => {
        return acc + pv;
      }, 0);
      if (res === 0) {
        this.filterBlock = [];
        this.filterUnit = [];
        this.filterTask = [];
        this.desserts.forEach(el => {
          this.filterBlock.push(el.subsectionName);
          this.filterUnit.push(el.unitName);
          this.filterTask.push(el.taskName);
        });
        this.filterTask = Array.from(new Set(this.filterTask));
        this.filterTask.sort();

        return this.desserts;
      } else if (res === 1) {
        this.filterUnit = [];
        this.filterTask = [];
        let filter = this.desserts.filter(el => {
          return el.subsectionName === this.filterBlockValue;
        });
        filter.forEach(el => {
          this.filterUnit.push(el.unitName);
          this.filterTask.push(el.taskName);
        });
        this.filterTask = Array.from(new Set(this.filterTask));
        this.filterTask.sort();

        return filter;
      } else if (res === 2) {
        this.filterBlock = [];
        this.filterTask = [];
        let filter = this.desserts.filter(el => {
          return el.unitName === this.filterUnitValue;
        });
        filter.forEach(el => {
          this.filterBlock.push(el.subsectionName);
          this.filterTask.push(el.taskName);
        });
        this.filterTask = Array.from(new Set(this.filterTask));
        this.filterTask.sort();

        return filter;
      } else if (res === 3 && test[2] !== null) {
        this.filterBlock = [];
        this.filterUnit = [];
        let filter = this.desserts.filter(el => {
          return el.taskName === this.filterTaskValue;
        });
        filter.forEach(el => {
          this.filterBlock.push(el.subsectionName);
          this.filterUnit.push(el.unitName);
        });
        return filter;
      } else if (res === 3 && test[2] === null) {
        this.filterTask = [];
        let filter = this.desserts.filter(el => {
          return (
            el.unitName === this.filterUnitValue &&
            el.subsectionName === this.filterBlockValue
          );
        });
        filter.forEach(el => {
          this.filterTask.push(el.taskName);
        });
        this.filterTask = Array.from(new Set(this.filterTask));
        this.filterTask.sort();

        return filter;
      } else if (res === 5) {
        this.filterBlock = [];
        let filter = this.desserts.filter(el => {
          return (
            el.unitName === this.filterUnitValue &&
            el.taskName === this.filterTaskValue
          );
        });
        filter.forEach(el => {
          this.filterBlock.push(el.subsectionName);
        });
        return filter;
      } else if (res === 4) {
        this.filterUnit = [];
        let filter = this.desserts.filter(el => {
          return (
            el.subsectionName === this.filterBlockValue &&
            el.taskName === this.filterTaskValue
          );
        });

        filter.forEach(el => {
          this.filterUnit.push(el.unitName);
        });
        return filter;
      } else if (res === 6) {
        let filter = this.desserts.filter(el => {
          return (
            el.subsectionName === this.filterBlockValue &&
            el.taskName === this.filterTaskValue &&
            el.unitName === this.filterUnitValue
          );
        });
        filter.forEach(el => {
          this.filterUnit.push(el.unitName);
        });
        return filter;
      }
    },
    async viewItem(item) {
      // VIEW PROGRESS DIALOG - THIS FETCHES THE DATA
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
          this.items.forEach(el => {
            el.price = el.price.toFixed(2);
            el.remaining = el.remaining.toFixed(2);
          });
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
      this.dialog2 = true;
      await axios({
        method: "post",
        url: `${url}/paymentCertificateHistory`,
        data: data
      }).then(
        response => {
          this.items2 = response.data;

          this.items2.forEach(el => {
            if (el.amountPaid === null) {
              el.amountPaid = 0;
            }
            el.amountPaid = el.amountPaid.toFixed(2);
          });
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
      // CLOSE THE GIALOGS AND CLEAR THE OBJECT
      this.dialog = false;
      this.dialog2 = false;
      this.$nextTick(() => {
        this.viewItemObj = Object.assign({}, this.defaultItem);
        this.viewIndex = -1;
      });
    },
    sumField() {
      //TOTAL ROW CALC FOR TOP OF TABLE - THIS ROW STILL NEEDS TO BE OPTIMISED FOR MOBILE
      let budget = 0,
        actual = 0,
        pcIssued = 0,
        remaining = 0,
        pcpaid = 0,
        due = 0,
        budgetLessPaid = 0,
        Retained = 0;
      this.filteredTable.forEach(el => {
        budget = budget + parseFloat(el.totalBudget);
        actual = actual + parseFloat(el.totalUsed);
        pcIssued = pcIssued + parseFloat(el.PCIssued);
        remaining = remaining + parseFloat(el.Remaining);
        pcpaid = pcpaid + parseFloat(el.PCPaid);
        due = due + parseFloat(el.due);
        budgetLessPaid = budgetLessPaid + parseFloat(el.budgetLessPaid);
        Retained = Retained + parseFloat(el.Retained);
      });
      this.totals.budget = budget.toFixed(2);
      this.totals.actual = actual.toFixed(2);
      this.totals.actual = actual.toFixed(2);
      this.totals.pcIssued = pcIssued.toFixed(2);
      this.totals.remaining = remaining.toFixed(2);
      this.totals.pcpaid = pcpaid.toFixed(2);
      this.totals.due = due.toFixed(2);
      this.totals.budgetLessPaid = budgetLessPaid.toFixed(2);
      this.totals.retained = Retained.toFixed(2);
      this.totals.usedPercent = `${((actual / budget) * 100).toFixed()}%`;

      this.totals.retained = this.convertToString(this.totals.retained);
      this.totals.budgetLessPaid = this.convertToString(
        this.totals.budgetLessPaid
      );
      this.totals.due = this.convertToString(this.totals.due);
      this.totals.pcpaid = this.convertToString(this.totals.pcpaid);
      this.totals.budget = this.convertToString(this.totals.budget);
      this.totals.pcIssued = this.convertToString(this.totals.pcIssued);
      this.totals.actual = this.convertToString(this.totals.actual);
      this.totals.remaining = this.convertToString(this.totals.remaining);
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

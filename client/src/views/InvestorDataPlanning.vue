<template>
  <div class="about">
    <v-row class="text-center">
      <v-col cols="12" offset="0">
        <v-data-table
          style="margin: 25px 25px;"
          :headers="headersP"
          :items="dessertsP"
          :search="searchP"
          @current-items="getFilteredP"
          dense
          class="elevation-1"
          multi-sort
          :items-per-page="itemsPerPageP"
        >
          <template v-slot:item.sold="{ item }">
            <v-chip :color="getColor(item.sold)" small dark>
              {{ item.sold }}
            </v-chip>
          </template>
          <template v-slot:item.drawn="{ item }">
            <v-simple-checkbox
              color="green"
              v-model="item.drawn"
              disabled
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.unitName="{ item }">
            <v-chip :id="item.id" small @click="redirectToUnitInfoP">{{
              item.unitName
            }}</v-chip>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title style="color: red;"
                >Investor Planning</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <small
                >Pledged: {{ pledgedTotalsP }} - Momentum :
                {{ momentumTotalsP }} - Drawn: {{ drawnTotalsP }} - Subscribed
                {{ subscribedTotalsP }}</small
              ><br />
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchP"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
                @keyup="testP($event)"
              ></v-text-field>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialogP" max-width="1200px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitleP }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            v-model="editedItemP.investor"
                            label="Investor"
                          ></v-text-field>
                        </v-col>
                        <!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ -->
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItemP.available"
                            label="Available"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-menu
                            v-model="available_dateMenuP"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItemP.available_date"
                                label="Available Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearavailable_dateP"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="available_dateChangeP"
                              v-model="available_dateP"
                              @input="available_dateMenuP = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItemP.amount"
                            :label="labelNameP"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-checkbox
                            v-if="showDrawnP"
                            v-model="editedItemP.drawn"
                            label="Drawn"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-menu
                            v-model="quinteDateMenuP"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItemP.quinteDate"
                                :label="labelDateNameP"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearquinteDateP"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="quinteDateChangeP"
                              v-model="quinteDateP"
                              @input="quinteDateMenuP = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-autocomplete
                            v-model="editedItemP.drawNumber"
                            :items="drawsP"
                            outlined
                            dense
                            chips
                            small-chips
                            item-text="drawNumber"
                            clearable
                            label="Draw"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItemP.trust_account_interest"
                            label="Trust Interest"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItemP.interest_rate"
                            label="Investor Interest"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItemP.opc_comm"
                            label="OPC Rate"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-menu
                            v-model="repayment_dateMenuP"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItemP.repayment_date"
                                label="Repayment Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearrepayment_dateP"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="repayment_dateChangeP"
                              v-model="repayment_dateP"
                              @input="repayment_dateMenuP = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeP">
                      Cancel
                    </v-btn>
                    <!-- v-if="showSave" -->
                    <v-btn color="blue darken-1" text @click="saveP">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDeleteP" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDeleteP"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteItemConfirmP"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-toolbar flat>
              <small>Planned Draws: {{ plannedDrawTotalsP }}</small>
              <v-divider class="mx-4" inset vertical></v-divider>
              <small>Required : R0</small>
              <v-divider class="mx-4" inset vertical></v-divider>
              <small>Variance: {{ plannedDrawTotalsP }}</small>
              <v-divider class="mx-4" inset vertical></v-divider>
              <small>Units: {{ unitCountP }}</small>
              <v-divider class="mx-4" inset vertical></v-divider>
              <small>Available: {{ availableTotalsP }}</small>
              <v-divider class="mx-4" inset vertical></v-divider>
              <small
                >Interest At Repayment:
                {{ totalInteresRepayableAtRepaymentP }}</small
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <small
                >Interest At Today: {{ totalInterestRepayableAtTodayP }}</small
              >
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="green" class="mr-2" @click="editItemP(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red" @click="deleteItemP(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary">
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-snackbar v-model="snackbarP" top color="amber">
        {{ snackbarMessageP }}
        <v-btn color="pink" text @click="snackbarP = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "InvestorDataPlanning",
  components: {},
  metaInfo: {
    title: "About us",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `About CPC here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      labelNameP: "",
      labelDateNameP: "",
      itemsPerPageP: 15,
      unitCountP: 0,
      dataTotalsP: 0,
      availableTotalsP: 0,
      pleadgedTotalsP: 0,
      momentumTotalsP: 0,
      plannedDrawTotalsP: 0,
      drawnTotalsP: 0,
      subscribedTotalsP: 0,
      searchP: "",
      snackbarP: false,
      snackbarMessageP: "",
      dialogP: false,
      dialogDeleteP: false,
      soldP: [],
      unitTypeP: [],
      showSaveP: false,
      totalInteresRepayableAtRepaymentP: 0,
      totalInterestRepayableAtTodayP: 0,
      la_email_dateP: "2020-06-04",
      la_email_dateMenuP: false,
      la_sign_dateP: new Date().toISOString().substr(0, 10),
      la_sign_dateMenuP: false,
      fica_inv_dateP: new Date().toISOString().substr(0, 10),
      fica_inv_dateMenuP: false,
      quinteDateP: new Date().toISOString().substr(0, 10),
      quinteDateMenuP: false,
      repayment_dateP: new Date().toISOString().substr(0, 10),
      repayment_dateMenuP: false,
      available_dateP: new Date().toISOString().substr(0, 10),
      available_dateMenuP: false,
      pledge_dateP: new Date().toISOString().substr(0, 10),
      pledge_dateMenuP: false,
      drawsP: [],
      unitsP: [],

      headersP: [
        {
          text: "Unit",
          align: "start",
          sortable: false,
          value: "unitName",
          width: 60
        },
        { text: "Code", value: "investor_code", width: 60 },
        { text: "Name", value: "investor", width: 140 },
        { text: "Available", value: "available", width: 90, align: "end" },
        {
          text: "Available Date",
          value: "available_date",
          width: 90,
          align: "end"
        },
        // { text: "Pledged", value: "pledged", width: 90, align: "end" },
        // { text: "email", value: "la_email_date", width: 120 },
        // { text: "signed", value: "la_sign_date", width: 120 },

        // {
        //   text: "Momentum",
        //   value: "attorney_inv_amount",
        //   width: 90,
        //   align: "end",
        // },
        // { text: "Deposit Date", value: "fica_inv_date", width: 120 },
        // {
        //   text: `${this.$store.state.development.developmentName} Amount`,
        //   // text: "Quinate Amount",
        //   value: "amount",
        //   width: 150,
        //   align: "end",
        // },
        {
          text: `${this.$store.state.development.developmentName} Date`,
          value: "quinteDate",
          width: 120
        },
        { text: "Drawn", value: "drawn", width: 90 },
        { text: "Draw", value: "drawNumber", width: 90 },
        // { text: "Draw Adj", value: "drawAdjustment", width: 90 },
        // { text: "Int Rate", value: "interest_rate", width: 60 },
        // { text: "Trust Rate", value: "trust_account_interest", width: 60 },
        // {
        //   text: "Supplementary Rate",
        //   value: "supplementary_interest",
        //   width: 60
        // },
        // { text: "OPC", value: "opc_comm", width: 60 },
        { text: "Int Today", value: "interestPayableAtToday", width: 120 },
        { text: "Int Repay", value: "interestPayableAtRepayment", width: 120 },
        { text: "Repay", value: "repayment_date", width: 120 },
        { text: "Actions", value: "actions", sortable: false, width: 100 }
      ],
      dessertsP: [],
      editedIndexP: -1,
      editedItemP: {
        amount: 0,
        attorney_inv_amount: 0,
        development: 0,
        draw: null,
        drawAdjustment: 0,
        drawNumber: null,
        fica_inv_date: "",
        drawn: false,
        id: 0,
        interest_rate: 0,
        investor: "",
        investor_code: "",
        la_email_date: "",
        la_sign_date: "",
        available_date: "",
        available: 0,
        opc_comm: 0,
        pledged: 0,
        quinteDate: "",
        repayment_date: "",
        pledge_date: "",
        pledgeUsed: false,
        supplementary_interest: 0,
        trust_account_interest: 0,
        unit: 0,
        unitName: ""
      },
      defaultItemP: {
        amount: 0,
        attorney_inv_amount: 0,
        development: 0,
        draw: null,
        drawAdjustment: 0,
        drawNumber: null,
        fica_inv_date: "",
        drawn: false,
        id: 0,
        interest_rate: 0,
        investor: "",
        investor_code: "",
        la_email_date: "",
        la_sign_date: "",
        available_date: "",
        available: 0,
        opc_comm: 0,
        pledged: 0,
        quinteDate: "",
        repayment_date: "",
        pledge_date: "",
        pledgeUsed: false,
        supplementary_interest: 0,
        trust_account_interest: 0,
        unit: 0,
        unitName: ""
      },
      availableUnitsFromInvestorData: []
    };
  },
  mounted() {
    this.la_email_dateP = new Date().toISOString().substr(0, 10);
    this.labelNameP = `${this.$store.state.development.developmentName} Amount`;
    this.labelDateNameP = `${this.$store.state.development.developmentName} Date`;
    this.initialDataP();
  },
  computed: {
    formTitleP() {
      return this.editedIndexP === -1 ? "New Item" : "Edit Item";
    },
    showDrawnP() {
      if (this.editedIndexP > -1 && this.editedItemP.drawn) {
        return false;
      } else {
        return true;
      }
    },
    totalRecords() {
      return this.dessertsP.length;
    },
    pageCount() {
      return this.totalRecordsP / this.itemsPerPageP;
    }
  },

  watch: {
    search(val) {
      if (val !== "" && val !== null) {
        return (this.itemsPerPageP = -1);
      } else {
        return (this.itemsPerPageP = 10);
      }
    },
    dialogP(val) {
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.la_email_date !== ""
      ) {
        this.la_email_dateP = new Date(this.editedItemP.la_email_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.la_sign_date !== ""
      ) {
        this.la_sign_dateP = new Date(this.editedItemP.la_sign_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.fica_inv_date !== ""
      ) {
        this.fica_inv_dateP = new Date(this.editedItemP.fica_inv_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.quinteDate !== ""
      ) {
        this.quinteDateP = new Date(this.editedItemP.quinteDate)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.repayment_date !== ""
      ) {
        this.repayment_dateP = new Date(this.editedItemP.repayment_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.available_date !== ""
      ) {
        this.available_dateP = new Date(this.editedItemP.available_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitleP === "Edit Item" &&
        this.editedItemP.pledge_date !== ""
      ) {
        this.pledge_dateP = new Date(this.editedItemP.pledge_date)
          .toISOString()
          .substr(0, 10);
      }

      val || this.closeP();
    },
    dialogDeleteP(val) {
      val || this.closeDeleteP();
    }
  },

  methods: {
    redirectToUnitInfoP(event) {
      let infoFiltered = this.dessertsP.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      let unitId = infoFiltered[0].unit;
      this.$router.push({ name: `UnitInfo`, params: { id: unitId } });
    },

    testP(event) {
      console.log(event);
    },
    async initialDataP() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getInvestmentDataPlanningForFile`,
        data: data
      })
        .then(response => {
          console.log("Initial Data", response.data);
          this.dessertsP = response.data[0];
          let unitCount = [];
          this.dessertsP.forEach(el => {
            unitCount.push(el.unitName);
            el.amount = el.amount.toFixed(2);
            el.pledged = el.pledged.toFixed(2);
            el.attorney_inv_amount = el.attorney_inv_amount.toFixed(2);
            if (el.fica_inv_date !== null) {
              el.fica_inv_date = dayjs(el.fica_inv_date).format("YYYY-MM-DD");
            } else {
              el.fica_inv_date = "";
            }
            if (el.la_email_date !== null) {
              el.la_email_date = dayjs(el.la_email_date).format("YYYY-MM-DD");
            } else {
              el.la_email_date = "";
            }
            if (el.la_sign_date !== null) {
              el.la_sign_date = dayjs(el.la_sign_date).format("YYYY-MM-DD");
            } else {
              el.la_sign_date = "";
            }
            if (el.quinteDate !== null) {
              el.quinteDate = dayjs(el.quinteDate).format("YYYY-MM-DD");
            } else {
              el.quinteDate = "";
            }
            if (el.repayment_date !== null) {
              el.repayment_date = dayjs(el.repayment_date).format("YYYY-MM-DD");
            } else {
              el.repayment_date = "";
            }
            if (el.available_date !== null) {
              el.available_date = dayjs(el.available_date).format("YYYY-MM-DD");
            } else {
              el.available_date = "";
            }
            if (el.pledge_date !== null) {
              el.pledge_date = dayjs(el.pledge_date).format("YYYY-MM-DD");
            } else {
              el.pledge_date = "";
            }
            // console.log(el.available_date)
            if (el.drawn === 1) {
              el.drawn = true;
            } else {
              el.drawn = false;
            }
            if (el.pledgeUsed === 1) {
              el.pledgeUsed = true;
            } else {
              el.pledgeUsed = false;
              el.pledge_date = "";
            }

            el.interest_rate = (el.interest_rate * 100).toFixed(2);
            el.opc_comm = (el.opc_comm * 100).toFixed(2);
            el.supplementary_interest = (
              el.supplementary_interest * 100
            ).toFixed(2);
            el.trust_account_interest = (
              el.trust_account_interest * 100
            ).toFixed(2);
            el.drawAdjustment = el.drawAdjustment.toFixed(2);
          });

          unitCount = unitCount.sort();
          unitCount = Array.from(new Set(unitCount));
          this.unitCountP = unitCount.length;
          // console.log(unitCount.length)
          console.log(this.dessertsP);
          this.dessertsP.forEach(el => {
            el.dailyTrustInterest =
              (parseFloat(el.attorney_inv_amount) *
                ((parseFloat(el.supplementary_interest) +
                  parseFloat(el.trust_account_interest)) /
                  100)) /
              365;
            el.dailyContractInterest =
              (parseFloat(el.available) * parseFloat(el.interest_rate)) /
              100 /
              365;
            el.trustInteresRepayableAtRepayment = 0;
            el.trustInterestRepayableAtToday = 0;
            if (el.dailyTrustInterest !== 0) {
              if (el.quinteDate !== "" && el.drawn) {
                el.trustInteresRepayableAtRepayment =
                  el.dailyTrustInterest *
                  dayjs(el.quinteDate).diff(dayjs(el.fica_inv_date), "day");

                el.trustInterestRepayableAtToday =
                  el.dailyTrustInterest *
                  dayjs(el.quinteDate).diff(dayjs(el.fica_inv_date), "day");
              } else if (el.quinteDate !== "" && !el.drawn) {
                el.trustInteresRepayableAtRepayment =
                  el.dailyTrustInterest *
                  dayjs(el.repayment_date).diff(dayjs(el.fica_inv_date), "day");
                el.trustInterestRepayableAtToday =
                  el.dailyTrustInterest *
                  dayjs(new Date()).diff(dayjs(el.fica_inv_date), "day");
              } else {
                el.trustInteresRepayableAtRepayment =
                  el.dailyTrustInterest *
                  dayjs(el.repayment_date).diff(dayjs(el.fica_inv_date), "day");
                el.trustInterestRepayableAtToday =
                  el.dailyTrustInterest *
                  dayjs(new Date()).diff(dayjs(el.fica_inv_date), "day");
              }
            }
            if (el.dailyContractInterest !== 0) {
              el.contractInteresRepayableAtRepayment =
                el.dailyContractInterest *
                (dayjs(el.repayment_date).diff(
                  dayjs(el.available_date),
                  "day"
                ) +
                  1);
              console.log(
                "Contract Interest",
                el.contractInteresRepayableAtRepayment
              );
              el.contractInterestRepayableAtToday =
                el.dailyContractInterest *
                (dayjs(new Date()).diff(dayjs(el.available_date), "day") + 1);
              // console.log(el.contractInterestRepayableAtToday)
            } else {
              el.contractInteresRepayableAtRepayment = 0;
              el.contractInterestRepayableAtToday = 0;
            }
            el.interestPayableAtRepayment = (
              el.trustInteresRepayableAtRepayment +
              el.contractInteresRepayableAtRepayment
            ).toFixed(2);
            el.interestPayableAtToday = (
              el.contractInterestRepayableAtToday +
              el.trustInterestRepayableAtToday
            ).toFixed(2);
          });
          console.log(this.dessertsP);

          this.totalInteresRepayableAtRepaymentP = this.convertToString(
            this.dessertsP.reduce((prev, el) => {
              return prev + parseFloat(el.interestPayableAtRepayment);
            }, 0)
          );
          this.totalInterestRepayableAtTodayP = this.convertToString(
            this.dessertsP.reduce((prev, el) => {
              return prev + parseFloat(el.interestPayableAtToday);
            }, 0)
          );

          this.drawsP = response.data[1];
          if (this.$store.state.development.id === 1) {
            this.unitsP = response.data[2].filter(el => {
              return el.subsection <= 6 && !el.unitName.includes(".");
            });
          } else {
            this.unitsP = response.data[2];
          }
          this.unitsP.sort((a, b) => (a.unitName > b.unitName ? 1 : -1));

          this.availableUnitsFromInvestorDataP = response.data[3];
          let updateInfoArrayP = [];
          this.dessertsP.forEach(el => {
            let filteredData = this.availableUnitsFromInvestorDataP.filter(
              el2 => {
                return el.unit === el2.unit;
              }
            );
            if (filteredData.length) {
              if (1000000 - filteredData[0].amount > 0) {
                let insert = {
                  unit: el.unit,
                  unitName: el.unitName,
                  available: 1000000 - filteredData[0].amount
                };
                updateInfoArrayP.push(insert);
              } else {
                let insert = {
                  unit: el.unit,
                  unitName: el.unitName,
                  available: 0
                };
                updateInfoArrayP.push(insert);
              }
            } else {
              let insert = {
                unit: el.unit,
                unitName: el.unitName,
                available: 1000000
              };
              updateInfoArrayP.push(insert);
            }
          });
          console.log("updateInfoArray", updateInfoArrayP);
          let finalUpdateArrayP = [];
          this.dessertsP.forEach(el => {
            let filteredData = updateInfoArrayP.filter(el2 => {
              return el.unit === el2.unit;
            });
            if (
              parseFloat(el.available.toFixed(2)) !==
              parseFloat(filteredData[0].available.toFixed(2))
            ) {
              finalUpdateArrayP.push(filteredData[0]);
            }
          });
          console.log("finalUpdateArray", finalUpdateArrayP);
          if (finalUpdateArrayP.length) {
            this.updateAvailableDataP(finalUpdateArrayP);
          }
          error => {
            console.log(error);
          };
        })
        .catch(e => {
          console.log(e);
        });
    },
    async updateAvailableDataP(data) {
      await axios({
        method: "post",
        url: `${url}/updateAvailableDataPlanning`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.initialData();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    editItemP(item) {
      this.editedIndexP = this.dessertsP.indexOf(item);
      this.editedItemP = Object.assign({}, item);
      this.dialogP = true;
    },

    deleteItemP(item) {
      this.editedIndexP = this.dessertsP.indexOf(item);
      this.editedItemP = Object.assign({}, item);
      this.dialogDeleteP = true;
    },
    // ADD DELETE TEXT HERE
    async deleteItemConfirmP() {
      let data = {
        id: this.dessertsP.filter((el, index) => {
          return index === this.editedIndexP;
        })[0].id
      };
      await axios({
        method: "post",
        url: `${url}/deleteInvestmentDataPlanning`,
        data: data
      })
        .then(
          response => {
            if (response.data.affectedRows === 1) {
              this.snackbarMessage = "Record succesfully Deleted!";
              this.desserts.splice(this.editedIndex, 1);
              this.closeDeleteP();
            } else {
              this.snackbarMessageP = "Error, please try again";
            }
            this.snackbarP = true;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    closeP() {
      this.dialogP = false;
      this.$nextTick(() => {
        this.editedItemP = Object.assign({}, this.defaultItemP);
        this.editedIndexP = -1;
      });
    },

    closeDeleteP() {
      this.dialogDeleteP = false;
      this.$nextTick(() => {
        this.editedItemP = Object.assign({}, this.defaultItemP);
        this.editedIndexP = -1;
      });
    },

    async saveP() {
      if (
        this.editedItemP.attorney_inv_amount !== 0 ||
        this.editedItemP.amount !== 0
      ) {
        this.pledgeUsedP = false;
        this.pledge_dateP = "";
      }
      if (this.editedItemP.drawNumber !== null) {
        let draw = this.drawsP.filter(el => {
          return el.drawNumber === this.editedItemP.drawNumber;
        });
        this.editedItemP.draw = draw[0].id;
      }
      let unit = this.unitsP.filter(el => {
        return el.unitName === this.editedItemP.unitName;
      });
      this.editedItemP.unit = unit[0].id;
      console.log(this.editedItemP);
      if (this.editedIndexP > -1) {
        Object.assign(this.dessertsP[this.editedIndexP], this.editedItemP);
        await axios({
          method: "post",
          url: `${url}/editInvestmentDataPlanning`,
          data: this.editedItemP
        })
          .then(
            response => {
              console.log(response.data);
              if (response.data.affectedRows === 1) {
                this.snackbarMessageP = "Input succesfully updated!";
              } else {
                this.snackbarMessageP = "Error, please try again";
              }
              this.snackbarP = true;
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      } else {
        this.editedItemP.development = this.$store.state.development.id;
        await axios({
          method: "post",
          url: `${url}/insertinvestorDetailsPlanning`,
          data: this.editedItemP
        })
          .then(
            response => {
              console.log(response.data);
              if (response.data.affectedRows === 1) {
                this.snackbarMessageP = "Input succesfully updated!";
                this.dessertsP.push(this.editedItem);
                this.initialDataP();
              } else {
                this.snackbarMessageP = "Error, please try again";
              }
              this.snackbarP = true;
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
      this.close();
    },

    getFilteredP(e) {
      if (this.searchP === "" || this.searchP === null) {
        this.dataTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            return parseFloat(curr.amount) + prev;
          }, 0)
        );
        this.availableTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            return parseFloat(curr.available) + prev;
          }, 0)
        );
        this.pledgedTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            return parseFloat(curr.pledged) + prev;
          }, 0) -
            this.dessertsP.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0)
        );
        this.momentumTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            return parseFloat(curr.attorney_inv_amount) + prev;
          }, 0) -
            this.dessertsP.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0)
        );

        this.drawnTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            if (curr.drawn) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        this.plannedDrawTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            if (!curr.drawn && curr.draw !== null) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        this.subscribedTotalsP = this.convertToString(
          this.dessertsP.reduce((prev, curr) => {
            return parseFloat(curr.pledged) + prev;
          }, 0) -
            this.dessertsP.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0) +
            this.dessertsP.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0) -
            this.dessertsP.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0) +
            this.dessertsP.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0)
        );
      } else {
        this.dataTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.amount) + prev;
          }, 0)
        );
        this.availableTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.available) + prev;
          }, 0)
        );
        this.pledgedTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.pledged) + prev;
          }, 0) -
            e.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0)
        );
        this.momentumTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.attorney_inv_amount) + prev;
          }, 0) -
            e.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev + 0;
              }
            }, 0)
        );
        this.drawnTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            if (curr.drawn) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev + 0;
            }
          }, 0)
        );
        this.plannedDrawTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            if (!curr.drawn && curr.draw !== null) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        this.subscribedTotalsP = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.pledged) + prev;
          }, 0) -
            e.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0) +
            e.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0) -
            e.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0) +
            e.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0)
        );
      }
    },

    clearquinteDateP() {
      this.editedItemP.quinteDate = "";
      this.quinteDateP = new Date().toISOString().substr(0, 10);
    },
    clearrepayment_dateP() {
      this.editedItemP.repayment_date = "";
      this.repayment_dateP = new Date().toISOString().substr(0, 10);
    },
    clearavailable_dateP() {
      this.editedItemP.available_date = "";
      this.available_dateP = new Date().toISOString().substr(0, 10);
    },

    quinteDateChangeP() {
      this.editedItemP.quinteDate = this.quinteDateP;
      this.showSaveBtnP();
    },
    repayment_dateChangeP() {
      this.editedItemP.repayment_date = this.repayment_dateP;
    },
    available_dateChangeP() {
      this.editedItemP.available_date = this.available_dateP;
    }
  }
};
</script>

<style scoped>
.layout {
  display: inline-block;
  width: 95%;
}
.corner {
  background-color: orange;
  cursor: pointer;
}
svg {
  height: 80vh;
}
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
.toolbar__items {
  flex-wrap: wrap;
}
</style>

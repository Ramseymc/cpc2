<template>
  <div class="about">
    <VatFinance
      v-if="vatDialog"
      :vatDialog="vatDialog"
      @closeVATForm="closeVATForm"
    />

    <!-- <v-dialog
      class="test"
      v-model="vatDialog"
      transition="dialog-top-transition"
      max-width="900"
    >
      <v-card>
        <v-toolbar color="primary" dark>Edit Vat</v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="vatHeaders"
            :items="vatData"
            dense
            class="elevation-1"
            :items-per-page="itemsPerPage"
            fixed-header
            height="410"
            id="virtual-scroll-table"
            multi-sort
          >
            <template v-slot:item.actions="{ item }">
              <v-icon color="green" class="mr-2" @click="editItem1(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                color="red"
                @click="deleteItem1(item)"
                v-if="
                  userName === 'Wayne Bruton' || userName === 'Deric Dudley'
                "
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="vatDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <v-row class="text-center">
      <v-col cols="12" offset="0">
        <v-btn
          color="primary"
          dark
          v-if="
            this.$store.state.userName === 'Deric Dudley' ||
              this.$store.state.userName === 'Wayne Bruton'
          "
          @click="vatDialog = true"
        >
          Edit Vat
        </v-btn>
        <v-data-table
          style="margin: 25px 25px;"
          :headers="headers"
          :items="desserts"
          :search="search"
          @current-items="getFiltered"
          sort-by="calories"
          dense
          class="elevation-1"
          :items-per-page="itemsPerPage"
          fixed-header
          height="610"
          id="virtual-scroll-table"
          multi-sort
        >
          <template v-slot:item.vatable="{ item }">
            <v-chip :color="getColor(item.vatable)" small dark>
              {{ item.vatable }}
            </v-chip>
          </template>

          <template v-slot:item.pop="{ item }">
            <a :href="item.pop" target="_blank" v-if="item.pop">
              PoP
            </a>
          </template>

          <template v-slot:item.paid="{ item }">
            <v-chip :color="getColor(item.paid)" small dark>
              {{ item.paid }}
            </v-chip>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>FINANCE INPUT</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              Budget: {{ dataTotals2 }} - Actual: {{ dataTotals }} variance:
              {{ diffTotal }}
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
              ></v-text-field>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialog" max-width="950px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.discipline"
                            :items="dashboardCategories"
                            item-text="discipline"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Discipline"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.budgetAmount"
                            label="Budget"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-menu
                            v-model="paymentMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.paymentDate"
                                label="Payment Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearPaymentDate"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="paymentDateChange"
                              v-model="paymentDate"
                              @input="paymentMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.actualAmount"
                            label="Actual"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-menu
                            v-model="invoiceMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.invoiceDate"
                                label="Invoice Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearInvoiceDate"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="invoiceDateChange"
                              v-model="invoiceDate"
                              @input="invoiceMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.invoiceNumber"
                            label="Invoice Number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-combobox
                            v-model="editedItem.supplier"
                            :items="suppliers"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Supplier"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.supplierTerms"
                            :items="supplierTerms"
                            item-text="supplierTerms"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Supplier Terms"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.vatable"
                            :label="
                              `Vat Vendor: ${editedItem.vatable.toString()}`
                            "
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="vatSwitch"
                            :label="
                              `Override VAT Date: ${vatSwitch.toString()}`
                            "
                            @change="vatDateDisabled = !vatDateDisabled"
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.vatDate"
                            label="VAT Date"
                            :disabled="vatDateDisabled"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.paid"
                            :label="
                              `Vendor Paid: ${editedItem.paid.toString()}`
                            "
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.drawNumber"
                            :items="draws"
                            item-text="drawNumber"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Draw Number"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-file-input
                            v-model="editedItem.pop"
                            label="POP"
                            accept=" application/pdf"
                            filled
                            hint="POP"
                            persistent-hint
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                      v-if="
                        editedItem.discipline !== '' &&
                          editedItem.paymentDate !== '' &&
                          editedItem.paymentDate !== null
                      "
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="green" class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon
              color="red"
              @click="deleteItem(item)"
              v-if="userName === 'Wayne Bruton' || userName === 'Deric Dudley'"
            >
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
      <v-snackbar v-model="snackbar" top color="amber">
        {{ snackbarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
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
import VatFinance from "../components/VATFinance";
export default {
  name: "FinanceInput",
  components: {
    VatFinance
  },
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
      editVat: false,
      vatDialog: false,
      userName: "",
      itemsPerPage: 15,
      vatSwitch: false,
      vatDateDisabled: true,
      dataTotals: 0,
      dataTotals2: 0,
      diffTotal: 0,
      search: "",
      snackbar: false,
      snackbarMessage: "",
      dialog: false,
      dialogDelete: false,
      dashboardCategories: [],
      draws: [],
      supplierTerms: [],
      suppliers: [],
      paymentDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      paymentMenu: false,
      invoiceDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      invoiceMenu: false,
      // vatHeaders: [
      //   {
      //     text: "Discipline",
      //     align: "start",
      //     sortable: false,
      //     value: "discipline",
      //     width: 150,
      //   },
      //   {
      //     text: "Amount",
      //     align: "start",
      //     sortable: false,
      //     value: "amount",
      //     width: 150,
      //   },
      //   {
      //     text: "Date",
      //     align: "start",
      //     sortable: false,
      //     value: "vatDate",
      //     width: 150,
      //   },
      //   {
      //     text: "Period",
      //     align: "start",
      //     sortable: false,
      //     value: "vatPeriod",
      //     width: 150,
      //   },
      //   {
      //     text: "Processed",
      //     align: "start",
      //     sortable: false,
      //     value: "processed",
      //     width: 150,
      //   },
      //   { text: "Actions", value: "actions", sortable: false, width: 100 },
      // ],
      // vatData: [],

      headers: [
        {
          text: "Discipline",
          align: "start",
          sortable: false,
          value: "discipline",
          width: 150
        },
        { text: "Budget", value: "budgetAmount", width: 80, align: "end" },
        { text: "Pay Date", value: "paymentDate", width: 120 },
        { text: "Actual", value: "actualAmount", width: 80, align: "end" },
        { text: "Invoice Date", value: "invoiceDate", width: 120 },
        { text: "Invoice No:", value: "invoiceNumber", width: 90 },
        { text: "Supplier", value: "supplier", width: 180 },
        { text: "VAT", value: "vatable", width: 80 },
        { text: "Draw", value: "drawNumber", width: 80 },
        { text: "Paid", value: "paid", width: 80 },
        { text: "POP", value: "pop", width: 80 },
        { text: "Actions", value: "actions", sortable: false, width: 100 }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        discipline: "",
        category: 0,
        budgetAmount: 0,
        paymentDate: "",
        actualAmount: 0,
        invoiceDate: "",
        invoiceNumber: "",
        supplier: "",
        paid: false,
        supplierTermsId: 0,
        supplierTerms: "",
        vatable: false,
        vatDate: "",
        drawId: 0,
        drawNumber: "",
        pop: null
      },
      defaultItem: {
        id: 0,
        discipline: "",
        category: 0,
        budgetAmount: 0,
        paymentDate: "",
        actualAmount: 0,
        invoiceDate: "",
        invoiceNumber: "",
        supplier: "",
        paid: false,
        supplierTermsId: 0,
        supplierTerms: "",
        vatable: true,
        vatDate: "",
        drawId: 0,
        pop: null,
        drawNumber: "",
        total: 0
      }
    };
  },
  mounted() {
    this.userName = this.$store.state.userName;
    this.initialData();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    search(val) {
      if (val !== "" && val !== null) {
        return (this.itemsPerPage = -1);
      } else {
        return (this.itemsPerPage = 10);
      }
    },
    dialog(val) {
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.paymentDate !== ""
      ) {
        this.paymentDate = new Date(this.editedItem.paymentDate)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.invoiceDate !== ""
      ) {
        this.invoiceDate = new Date(this.editedItem.invoiceDate)
          .toISOString()
          .substr(0, 10);
      }
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  methods: {
    closeVATForm(event) {
      console.log("EVENT", event);
      this.vatDialog = event;
    },
    async initialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getFinanceInput`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            let suppliers = [];
            response.data[0].forEach(el => {
              if (el.invoiceDate) {
                el.invoiceDate = dayjs(el.invoiceDate).format("YYYY-MM-DD");
              } else {
                el.invoiceDate = null;
              }
              el.paymentDate = dayjs(el.paymentDate).format("YYYY-MM-DD");
              el.vatDate = dayjs(el.vatDate).format("YYYY-MM-DD");
              if (el.vatable === 1) {
                el.vatable = true;
              } else {
                el.vatable = false;
              }
              if (el.supplier !== null && el.supplier !== "") {
                suppliers.push(el.supplier);
              }
              if (el.paid === 0) {
                el.paid = false;
              } else {
                el.paid = true;
              }
              el.budgetAmount = el.budgetAmount.toFixed(2);
              el.actualAmount = el.actualAmount.toFixed(2);
              if (el.pop) {
                el.pop = `${url}/uploads/${el.pop}`;
              }
            });
            this.suppliers = Array.from(new Set(suppliers));
            this.suppliers.sort();
            this.desserts = response.data[0];
            this.dashboardCategories = response.data[1];
            // console.log(this.dashboardCategories)
            this.draws = response.data[2];
            this.supplierTerms = response.data[3];
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    // ADD DELETE TEXT HERE
    async deleteItemConfirm() {
      let data = {
        id: this.desserts.filter((el, index) => {
          return index === this.editedIndex;
        })[0].id
      };
      await axios({
        method: "post",
        url: `${url}/deleteFinanceInput`,
        data: data
      })
        .then(
          response => {
            if (response.data.affectedRows === 1) {
              this.snackbarMessage = "Record succesfully Deleted!";
              this.desserts.splice(this.editedIndex, 1);
              this.closeDelete();
            } else {
              this.snackbarMessage = "Error, please try again";
            }
            this.snackbar = true;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.editedItem.category = this.dashboardCategories.filter(el => {
        return el.discipline === this.editedItem.discipline;
      })[0].id;
      console.log("CHECK THIS", this.editedItem);
      if (
        this.editedItem.drawNumber !== "" &&
        this.editedItem.drawNumber !== null
      ) {
        this.editedItem.drawId = this.draws.filter(el => {
          return el.drawNumber === this.editedItem.drawNumber;
        })[0].id;
      } else {
        this.editedItem.drawId = null;
      }
      if (
        this.editedItem.supplierTerms !== "" &&
        this.editedItem.supplierTerms !== null
      ) {
        this.editedItem.supplierTermsId = this.supplierTerms.filter(el => {
          return el.supplierTerms === this.editedItem.supplierTerms;
        })[0].id;
      } else {
        this.editedItem.supplierTermsId = 1;
      }
      let formData = new FormData();
      formData.append("POP", this.editedItem.pop);
      formData.append("invoiceNumber", this.editedItem.invoiceNumber);
      formData.append("invoiceDate", this.editedItem.invoiceDate);
      formData.append("category", this.editedItem.category);
      formData.append("budgetAmount", this.editedItem.budgetAmount);
      formData.append("paymentDate", this.editedItem.paymentDate);
      formData.append("actualAmount", this.editedItem.actualAmount);
      formData.append("supplier", this.editedItem.supplier);
      formData.append("vatable", this.editedItem.vatable);
      formData.append("drawId", this.editedItem.drawId);
      formData.append("vatDate", this.editedItem.vatDate);
      formData.append("paid", this.editedItem.paid);
      formData.append("supplierTermsId", this.editedItem.supplierTermsId);
      formData.append("id", this.editedItem.id);

      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);

        await axios({
          method: "post",
          url: `${url}/editFinanceInput`,
          data: formData
          // data: this.editedItem,
        })
          .then(
            response => {
              if (response.data.affectedRows === 1) {
                this.snackbarMessage = "Input succesfully updated!";
              } else {
                this.snackbarMessage = "Error, please try again";
              }
              this.snackbar = true;
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      } else {
        this.editedItem.development = this.$store.state.development.id;
        await axios({
          method: "post",
          url: `${url}/insertFinanceInput`,
          data: this.editedItem
        })
          .then(
            response => {
              if (response.data.affectedRows === 1) {
                this.snackbarMessage = "Input succesfully updated!";
                this.desserts.push(this.editedItem);
                this.initialData();
              } else {
                this.snackbarMessage = "Error, please try again";
              }
              this.snackbar = true;
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
    getColor(vatable) {
      if (vatable === true) return "green";
      else return "orange";
    },
    getFiltered(e) {
      if (this.search === "" || this.search === null) {
        this.dataTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.actualAmount) + prev;
          }, 0)
        );
        this.dataTotals2 = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.budgetAmount) + prev;
          }, 0)
        );

        this.diffTotal = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.budgetAmount) + prev;
          }, 0) -
            this.desserts.reduce((prev, curr) => {
              return parseFloat(curr.actualAmount) + prev;
            }, 0)
        );
      } else {
        this.dataTotals = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.actualAmount) + prev;
          }, 0)
        );

        this.dataTotals2 = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.budgetAmount) + prev;
          }, 0)
        );

        this.diffTotal = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.budgetAmount) + prev;
          }, 0) -
            e.reduce((prev, curr) => {
              return parseFloat(curr.actualAmount) + prev;
            }, 0)
        );
      }
    },
    clearPaymentDate() {
      this.editedItem.paymentDate = "";
    },
    clearInvoiceDate() {
      this.editedItem.invoiceDate = "";
    },
    invoiceDateChange() {
      this.editedItem.invoiceDate = this.invoiceDate;
      this.calulateVATDate();
    },
    paymentDateChange() {
      this.editedItem.paymentDate = this.paymentDate;
      this.calulateVATDate();
    },
    calulateVATDate() {
      let newVatDate = "";
      let testVatMonth = 0;
      if (
        (this.editedItem.paymentDate !== "" &&
          this.editedItem.paymentDate !== null &&
          this.editedItem.invoiceDate === "") ||
        this.editedItem.invoiceDate === null
      ) {
        newVatDate = dayjs(this.editedItem.paymentDate)
          .subtract(30, "d")
          .format("YYYY-MM-DD");
        testVatMonth = parseInt(newVatDate.split("-")[1]);
        if (testVatMonth % 2 === 0) {
          newVatDate = dayjs(newVatDate)
            .add(1, "months")
            .endOf("month")
            .format("YYYY-MM-DD");
        } else {
          newVatDate = dayjs(newVatDate)
            .add(2, "months")
            .endOf("month")
            .format("YYYY-MM-DD");
        }
      } else if (
        this.editedItem.paymentDate !== "" &&
        this.editedItem.paymentDate !== null &&
        this.editedItem.invoiceDate !== "" &&
        this.editedItem.invoiceDate !== null
      ) {
        newVatDate = dayjs(this.editedItem.invoiceDate).format("YYYY-MM-DD");
        testVatMonth = parseInt(newVatDate.split("-")[1]);
        if (testVatMonth % 2 === 0) {
          newVatDate = dayjs(newVatDate)
            .add(2, "months")
            .endOf("month")
            .format("YYYY-MM-DD");
        } else {
          newVatDate = dayjs(newVatDate)
            .add(3, "months")
            .endOf("month")
            .format("YYYY-MM-DD");
        }
      }
      this.editedItem.vatDate = newVatDate;
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
#virtual-scroll-table {
  max-height: 80vh;
  overflow: auto;
}
.test {
  z-index: -10;
}
a {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="about">
    <v-row class="text-center">
      <v-col cols="10" offset="1">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
          @current-items="getFiltered"
          sort-by="calories"
          dense
          class="elevation-1"
          :items-per-page="itemsPerPage"
          fixed-header
          height="410"
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
              <v-toolbar-title
                >Purchase orders & Payment Certificates</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <!-- Budget: {{ dataTotals2 }} - Actual: {{ dataTotals }} variance:
              {{ diffTotal }}
              <v-spacer></v-spacer>
              <v-spacer></v-spacer> -->
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
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.documentNumber"
                            label="Document Number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.documentValue"
                            label="Value"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-menu
                            v-model="payMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.payDate"
                                label="Payment Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearPayDate"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="payDateChange"
                              v-model="payDate"
                              @input="payMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.paidAmount"
                            label="Paid"
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
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            v-model="editedItem.supplierName"
                            label="Supplier"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-switch
                            v-model="editedItem.paid"
                            :label="
                              `Vendor Paid: ${editedItem.paid.toString()}`
                            "
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="green" class="mr-2" @click="editItem(item)">
              mdi-pencil
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
// import VatFinance from "../components/VATFinance";
export default {
  name: "FinanceConstructionInput",
  components: {
    // VatFinance
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
      userName: "",
      itemsPerPage: 10,

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
      payDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      payMenu: false,
      invoiceDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      invoiceMenu: false,

      headers: [
        {
          text: "Document",
          align: "start",
          sortable: false,
          value: "documentNumber",
          width: 150
        },
        { text: "Type", value: "documentType", width: 80, align: "end" },
        { text: "Value", value: "documentValue", width: 80, align: "end" },
        { text: "Pay Date", value: "payDate", width: 120 },
        { text: "Paid", value: "paidAmount", width: 80, align: "end" },
        { text: "Invoice Date", value: "invoiceDate", width: 120 },
        { text: "Invoice No:", value: "invoiceNumber", width: 90 },
        { text: "Supplier", value: "supplierName", width: 180 },
        { text: "Paid", value: "paid", width: 80 },
        { text: "Actions", value: "actions", sortable: false, width: 100 }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        documentNumber: "",
        documentValue: 0,
        invoiceDate: "",
        invoiceNumber: "",
        paid: false,
        paidAmount: 0,
        payDate: "",
        supplier: 0,
        supplierName: ""
      },
      defaultItem: {
        documentNumber: "",
        documentValue: 0,
        invoiceDate: "",
        invoiceNumber: "",
        paid: false,
        paidAmount: 0,
        payDate: "",
        supplier: 0,
        supplierName: ""
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
      if (this.formTitle === "Edit Item" && this.editedItem.payDate !== "") {
        this.payDate = new Date(this.editedItem.payDate)
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
    async initialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/insertFinanceConstructionInputWB`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.desserts = response.data;
            this.desserts.forEach(el => {
              if (el.paid === 0) {
                el.paid = false;
              } else {
                el.paid = true;
              }
              el.payDate = dayjs(el.payDate).format("YYYY-MM-DD");
              if (
                el.invoiceDate !== null &&
                el.invoiceDate !== "Invalid Date"
              ) {
                el.invoiceDate = dayjs(el.invoiceDate).format("YYYY-MM-DD");
              } else {
                el.invoiceDate = "";
              }
              if (el.invoiceDate === "Invalid Date") {
                el.invoiceDate = "";
              }
            });
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

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      // this.editedItem.category = this.dashboardCategories.filter(el => {
      //   return el.discipline === this.editedItem.discipline;
      // })[0].id;
      console.log("CHECK THIS", this.editedItem);

      if (this.editedIndex > -1) {
        this.editedItem.paidAmount = parseFloat(this.editedItem.paidAmount);
        Object.assign(this.desserts[this.editedIndex], this.editedItem);

        await axios({
          method: "post",
          url: `${url}/editFinanceConstructionInputWB`,
          data: this.editedItem
          // data: this.editedItem,
        })
          .then(
            response => {
              if (response.data) {
                this.snackbarMessage = "Input succesfully updated!";
              }
              // else {
              //   this.snackbarMessage = "Error, please try again";
              // }
              this.snackbar = true;
              this.initialData();
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
    clearPayDate() {
      this.editedItem.payDate = "";
    },
    clearInvoiceDate() {
      this.editedItem.invoiceDate = "";
    },
    invoiceDateChange() {
      this.editedItem.invoiceDate = this.invoiceDate;
      this.calulateVATDate();
    },
    payDateChange() {
      this.editedItem.payDate = this.payDate;
      this.calulateVATDate();
    }
  }
};
</script>

<style scoped>
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

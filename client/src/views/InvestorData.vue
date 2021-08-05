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
        >
          <template v-slot:item.sold="{ item }">
            <v-chip :color="getColor(item.sold)" small dark>
              {{ item.sold }}
            </v-chip>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Investor Input</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              Quinate Amount: {{ dataTotals }}
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

              <v-dialog v-model="dialog" max-width="1200px">
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
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.bath"
                            label="Bath"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.beds"
                            label="Beds"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-autocomplete
                            v-model="editedItem.unit_type"
                            :items="unitType"
                            outlined
                            dense
                            chips
                            small-chips
                            multiple
                            label="Unit Type"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.size"
                            label="Size"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.base_price"
                            label="Base Price"
                            background-color="light-blue"
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.isEnclosed"
                            label="Enclosed"
                            background-color="light-blue"
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.bathAdd"
                            label="Add Bath"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.study"
                            label="Study"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.parking"
                            label="Parking"
                            background-color="light-blue"
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            v-model="editedItem.bay_no"
                            label="Bay No:"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            v-model="editedItem.mood_board"
                            label="Mood Board"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.extras"
                            label="Extras"
                            background-color="light-blue"
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.deductions"
                            label="Deductions"
                            background-color="light-blue"
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="8" md="8">
                          <v-textarea
                            v-model="editedItem.notes"
                            label="Notes"
                            :rows="2"
                            outlined
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            v-model="saleMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.sale_date"
                                label="Sale Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearsale_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="sale_dateChange"
                              v-model="sale_date"
                              @input="saleMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            v-model="bondMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.bond_app_date"
                                label="Bond App Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearbond_app_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="bond_app_dateChange"
                              v-model="bond_app_date"
                              @input="bondMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            v-model="lodgeMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.lodge_date"
                                label="Lodge Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearlodge_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="lodge_dateChange"
                              v-model="lodge_date"
                              @input="lodgeMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            v-model="transferMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.transfer_date"
                                label="Transfer Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="cleartransfer_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="transfer_dateChange"
                              v-model="transfer_date"
                              @input="transferMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            type="number"
                            v-model="editedItem.contract_price"
                            label="Contract Price"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-autocomplete
                            v-model="editedItem.sold"
                            :items="sold"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Sold"
                          ></v-autocomplete>
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
            <v-icon color="red" @click="deleteItem(item)">
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
export default {
  name: "InvestorData",
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
      itemsPerPage: 10,
      dataTotals: 0,
      search: "",
      snackbar: false,
      snackbarMessage: "",
      dialog: false,
      dialogDelete: false,
      sold: [],
      unitType: [],
      sale_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      saleMenu: false,
      bond_app_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      bondMenu: false,
      lodge_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      lodgeMenu: false,
      transfer_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      transferMenu: false,
      headers: [
        {
          text: "Unit",
          align: "start",
          sortable: false,
          value: "unitName",
          width: 60
        },
        { text: "Code", value: "investor_code", width: 60 },
        { text: "Name", value: "investor", width: 150 },
        { text: "Pledged", value: "pledged", width: 100, align: "end" },
        { text: "email", value: "la_email_date", width: 120 },
        { text: "signed", value: "la_sign_date", width: 120 },

        {
          text: "Trust Acc",
          value: "attorney_inv_amount",
          width: 120,
          align: "end"
        },
        { text: "Fica/Inv Date", value: "fica_inv_date", width: 120 },
        {
          text: "Quinate Amount",
          value: "amount",
          width: 120,
          align: "end"
        },
        { text: "Quinate Date", value: "quinteDate", width: 120 },
        { text: "Draw", value: "drawNumber", width: 90 },
        { text: "Int Rate", value: "interest_rate", width: 60 },
        { text: "Trust Rate", value: "trust_account_interest", width: 60 },
        {
          text: "Supplementary Rate",
          value: "supplementary_interest",
          width: 60
        },
        { text: "OPC", value: "opc_comm", width: 60 },
        // { text: "Repay", value: "repayment_date", width: 120 },
        { text: "Actions", value: "actions", sortable: false, width: 100 }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        bath: 0,
        beds: 0,
        unit_type: "",
        size: 0,
        base_price: 0,
        contract_price: 0,
        sold: false,
        isEnclosed: 0,
        bathAdd: 0,
        study: 0,
        parking: 0,
        bay_no: "",
        mood_board: "",
        extras: 0,
        deductions: 0,
        notes: "",
        sale_date: "",
        bond_app_date: "",
        lodge_date: "",
        transfer_date: ""
      },
      defaultItem: {
        id: 0,
        bath: 0,
        beds: 0,
        unit_type: "",
        size: 0,
        base_price: 0,
        contract_price: 0,
        sold: false,
        isEnclosed: 0,
        bathAdd: 0,
        study: 0,
        parking: 0,
        bay_no: "",
        mood_board: "",
        extras: 0,
        deductions: 0,
        notes: "",
        sale_date: "",
        bond_app_date: "",
        lodge_date: "",
        transfer_date: ""
      }
    };
  },
  mounted() {
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
      if (this.formTitle === "Edit Item" && this.editedItem.sale_date !== "") {
        this.sale_date = new Date(this.editedItem.sale_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.bond_app_date !== ""
      ) {
        this.bond_app_date = new Date(this.editedItem.bond_app_date)
          .toISOString()
          .substr(0, 10);
      }
      if (this.formTitle === "Edit Item" && this.editedItem.lodge_date !== "") {
        this.lodge_date = new Date(this.editedItem.lodge_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.transfer_date !== ""
      ) {
        this.transfer_date = new Date(this.editedItem.transfer_date)
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
        url: `${url}/getInvestmentData`,
        data: data
      })
        .then(
          response => {
            console.log(response.data[0]);
            this.desserts = response.data[0];
            this.desserts.forEach(el => {
              el.amount = el.amount.toFixed(2);
              el.pledged = el.pledged.toFixed(2);
              el.attorney_inv_amount = el.attorney_inv_amount.toFixed(2);
              if (el.fica_inv_date !== null) {
                el.fica_inv_date = dayjs(el.fica_inv_date).format("YYYY-MM-DD");
              }
              if (el.la_email_date !== null) {
                el.la_email_date = dayjs(el.la_email_date).format("YYYY-MM-DD");
              }
              if (el.la_sign_date !== null) {
                el.la_sign_date = dayjs(el.la_sign_date).format("YYYY-MM-DD");
              }
              if (el.quinteDate !== null) {
                el.quinteDate = dayjs(el.quinteDate).format("YYYY-MM-DD");
              }
              if (el.repayment_date !== null) {
                el.repayment_date = dayjs(el.repayment_date).format(
                  "YYYY-MM-DD"
                );
              }
              el.interest_rate = (el.interest_rate * 100).toFixed(2);
              el.opc_comm = (el.opc_comm * 100).toFixed(2);
              el.supplementary_interest = (
                el.supplementary_interest * 100
              ).toFixed(2);
              el.trust_account_interest = (
                el.trust_account_interest * 100
              ).toFixed(2);
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
    // ADD DELETE TEXT HERE
    async deleteItemConfirm() {
      let data = {
        id: this.desserts.filter((el, index) => {
          return index === this.editedIndex;
        })[0].id
      };
      await axios({
        method: "post",
        url: `${url}/deleteFinanceInputzz`,
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
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
        await axios({
          method: "post",
          url: `${url}/editFinanceInputzz`,
          data: this.editedItem
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
          url: `${url}/insertFinanceInputzz`,
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
    getColor(sold) {
      if (sold === "Yes") return "green";
      else return "orange";
    },
    getFiltered(e) {
      if (this.search === "") {
        this.dataTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.amount) + prev;
          }, 0)
        );
      } else {
        this.dataTotals = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.amount) + prev;
          }, 0)
        );
      }
    },
    clearsale_date() {
      this.editedItem.sale_date = "";
    },
    clearbond_app_date() {
      this.editedItem.bond_app_date = "";
    },
    clearlodge_date() {
      this.editedItem.bond_app_date = "";
    },
    cleartransfer_date() {
      this.editedItem.bond_app_date = "";
    },

    sale_dateChange() {
      this.editedItem.sale_date = this.sale_date;
      this.editedItem.bond_app_date = dayjs(this.editedItem.sale_date)
        .add(20, "d")
        .format("YYYY-MM-DD");
      this.editedItem.lodge_date = dayjs(this.editedItem.bond_app_date)
        .add(20, "d")
        .format("YYYY-MM-DD");
      this.editedItem.transfer_date = dayjs(this.editedItem.lodge_date)
        .add(20, "d")
        .format("YYYY-MM-DD");
    },
    bond_app_dateChange() {
      this.editedItem.bond_app_date = this.bond_app_date;
      this.editedItem.lodge_date = dayjs(this.editedItem.bond_app_date)
        .add(20, "d")
        .format("YYYY-MM-DD");
      this.editedItem.transfer_date = dayjs(this.editedItem.lodge_date)
        .add(20, "d")
        .format("YYYY-MM-DD");
    },
    lodge_dateChange() {
      this.editedItem.lodge_date = this.lodge_date;
      this.editedItem.transfer_date = dayjs(this.editedItem.lodge_date)
        .add(20, "d")
        .format("YYYY-MM-DD");
    },
    transfer_dateChange() {
      this.editedItem.transfer_date = this.transfer_date;
    },
    changeContractPrice() {
      this.editedItem.contract_price =
        parseFloat(this.editedItem.base_price) +
        parseFloat(this.editedItem.isEnclosed) +
        parseFloat(this.editedItem.parking) +
        parseFloat(this.editedItem.extras) -
        parseFloat(this.editedItem.deductions);
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
</style>

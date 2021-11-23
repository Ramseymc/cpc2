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
              <v-toolbar-title>Sales Input</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              Contract Price: {{ dataTotals }}
              <v-spacer></v-spacer>
              <a :href="href">UpdateTransferDates</a>
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
                <v-card>
                  <v-card-title>
                    <span class="text-h5"
                      >{{ formTitle }} - {{ editedItem.unitName }}</span
                    >
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
                          <!-- <v-combobox
                            v-model="editedItem.unit_type"
                            :items="unitType"
                            label="Select a favorite activity or create a new one"
                            multiple
                          ></v-combobox> -->
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
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.isEnclosed"
                            label="Enclosed"
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
                            filled
                            @change="changeContractPrice"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.deductions"
                            label="Deductions"
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
                        <v-col cols="12" sm="12" md="12">
                          <v-menu
                            v-model="actualsaleMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            readonly
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.actualsale_date"
                                label="Actual Sale Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearactualsale_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="actualsale_dateChange"
                              v-model="actualsale_date"
                              @input="actualsaleMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.sale_date"
                            label="Projected Sale Date"
                            prepend-icon="mdi-calendar"
                            disabled
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.bond_app_date"
                            label="Projected Bond App Date"
                            prepend-icon="mdi-calendar"
                            disabled
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.lodge_date"
                            label="Projected Lodge Date"
                            prepend-icon="mdi-calendar"
                            disabled
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.transfer_date"
                            label="Projected Transfer Date"
                            prepend-icon="mdi-calendar"
                            disabled
                            clearable
                          ></v-text-field>
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
          <template v-slot:item.unitName="{ item }">
            <v-chip :id="item.id" small @click="redirectToUnitInfo">{{
              item.unitName
            }}</v-chip>
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
export default {
  name: "SalesData",
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
      href: "",
      dataTotals: 0,
      search: "",
      snackbar: false,
      snackbarMessage: "",
      dialog: false,
      dialogDelete: false,
      sold: [],
      unitType: [],
      actualsale_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      actualsaleMenu: false,
      headers: [
        {
          text: "Unit",
          align: "start",
          sortable: false,
          value: "unitName",
          width: 60
        },
        // { text: "Bath", value: "bath", width: 60,  },
        // { text: "Beds", value: "beds", width: 60 },
        { text: "Type", value: "unit_type", width: 80 },

        // { text: "Size", value: "size", width: 60 },
        { text: "Base Price", value: "base_price", width: 150, align: "end" },
        {
          text: "Contract Price",
          value: "contract_price",
          width: 150,
          align: "end"
        },
        { text: "Sold", value: "sold", width: 100 },

        // { text: "Enclosed", value: "isEnclosed", width:100 },
        // { text: "Bath Add", value: "bathAdd", width: 100 },
        // { text: "Study", value: "study", width: 100 },
        // { text: "Parking", value: "parking", width: 100 },
        // { text: "Bay No:", value: "bay_no", width: 90 },
        // { text: "Mood Board", value: "mood_board", width: 100 },
        // { text: "Extras", value: "extras", width: 100 },
        // { text: "Deductions", value: "deductions", width: 100 },
        // { text: "Notes", value: "notes", width: 80 },

        { text: "Sale Date", value: "sale_date", width: 120 },
        { text: "Bond Date", value: "bond_app_date", width: 120 },
        { text: "Lodge Date", value: "lodge_date", width: 120 },
        { text: "Transfer", value: "transfer_date", width: 120 },
        { text: "Actions", value: "actions", sortable: false, width: 100 }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        bath: 0,
        beds: 0,
        unit_type: [],
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
        actualsale_date: "",
        bond_app_date: "",
        lodge_date: "",
        transfer_date: ""
      },
      defaultItem: {
        id: 0,
        bath: 0,
        beds: 0,
        unit_type: [],
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
        actualsale_date: "",
        bond_app_date: "",
        lodge_date: "",
        transfer_date: ""
      }
    };
  },
  mounted() {
    this.href = `${process.env.VUE_APP_BASEURL}/authSmartsheets/${this.$store.state.development.id}`;
    console.log(this.href);
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
        this.editedItem.actualsale_date !== "" &&
        this.editedItem.actualsale_date !== null &&
        this.editedItem.actualsale_date !== undefined
      ) {
        this.actualsale_date = new Date(this.editedItem.actualsale_date)
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
    redirectToUnitInfo(event) {
      let infoFiltered = this.desserts.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      let unitId = infoFiltered[0].unit;
      this.$router.push({ name: `UnitInfo`, params: { id: unitId } });
    },
    async initialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getSalesDataWb`,
        data: data
      })
        .then(
          response => {
            let sold = [];
            let unitType = [];
            // console.log(response.data);
            this.desserts = response.data.filter(el => {
              return el.unitName !== "Existing House";
            });
            this.desserts.forEach(el => {
              el.sale_date = dayjs(el.sale_date).format("YYYY-MM-DD");
              el.bond_app_date = dayjs(el.bond_app_date).format("YYYY-MM-DD");
              el.lodge_date = dayjs(el.lodge_date).format("YYYY-MM-DD");
              el.transfer_date = dayjs(el.transfer_date).format("YYYY-MM-DD");
              el.base_price = el.base_price.toFixed(2);
              el.contract_price = el.contract_price.toFixed(2);
              if (el.actualsale_date !== null) {
                el.actualsale_date = dayjs(el.actualsale_date).format(
                  "YYYY-MM-DD"
                );
              }
              if (el.sold === 0) {
                el.sold = "No";
              } else if (el.sold === 1) {
                el.sold = "Yes";
              }

              sold.push(el.sold);
              // console.log(el.unitName);
              console.log("unit_type", el.unit_type);

              if (el.unit_type !== null && el.unit_type !== undefined) {
                if (el.unit_type.length > 1) {
                  let insertType = el.unit_type.split(",");

                  // console.log(el.unit_type)
                  // console.log(unitType)
                  insertType.forEach(el2 => {
                    unitType.push(el2.trim());
                  });
                } else {
                  unitType.push(el.unit_type);
                }
              }
              // el.unit_type = el.unit_type.split(",");
            });
            this.sold = Array.from(new Set(sold));
            unitType.sort();
            this.unitType = Array.from(new Set(unitType));
            console.log(this.unitType);
            console.log(this.desserts);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async checkDates() {
      // // let data = {
      // //   id: this.$store.state.development.id
      // // };
      // await axios({
      //   method: "get",
      //   url: `${url}/authSmartsheets`,
      // })
      //   .then(
      //     response => {
      //      console.log(response)
      //     },
      //     error => {
      //       console.log(error);
      //     }
      //   )
      //   .catch(e => {
      //     console.log(e);
      //   });
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
        console.log("editedItem", this.editedItem);
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
        await axios({
          method: "post",
          url: `${url}/editsalesDataWb`,
          data: this.editedItem
        })
          .then(
            response => {
              console.log("XXXXXXXXX", response.data);
              if (response.data[0].affectedRows === 1) {
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
      if (this.search === "" || this.search === null) {
        this.dataTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.contract_price) + prev;
          }, 0)
        );
      } else {
        this.dataTotals = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.contract_price) + prev;
          }, 0)
        );
      }
    },
    clearactualsale_date() {
      this.editedItem.actualsale_date = "";
    },
    actualsale_dateChange() {
      this.editedItem.actualsale_date = this.actualsale_date;
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

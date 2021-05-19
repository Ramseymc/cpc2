<template>
  <div>
    <v-dialog v-model="mainDialog" persistent width="80%">
      <v-card>
        <v-card-title class="headline">
          EDIT REQUISITION
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
          :item-class="itemRowColor"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>{{ PONumber }}</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Delivery Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-spacer></v-spacer>
              <span style="color: red;"
                ><strong>{{ comments }}</strong></span
              >
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="900px">
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
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col class="d-flex" cols="12" sm="6">
                          <v-autocomplete
                            v-model="supplierChosen"
                            label="supplier*"
                            :items="suppliers"
                            item-text="supplierName"
                            @change="changeSupplier"
                            prepend-icon="mdi-truck-delivery"
                          ></v-autocomplete>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6">
                          <!-- v-model="subsectionChosen" -->
                          <v-autocomplete
                            v-model="editedItem.block"
                            :items="subsection"
                            item-text="subsectionName"
                            label="Choose Block*"
                            prepend-icon="mdi-office-building"
                            color="#0F0F0F"
                            item-color="#0F0F0F"
                            @change="getUnits"
                          ></v-autocomplete>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6">
                          <!-- v-model="unitChosen" -->
                          <v-autocomplete
                            v-model="editedItem.unitChosen"
                            :items="units"
                            item-text="unitName"
                            label="Choose Unit"
                            clearable
                            prepend-icon="mdi-home-analytics"
                            color="#0F0F0F"
                            item-color="#0F0F0F"
                          ></v-autocomplete>
                        </v-col>
                        <v-col class="d-flex" cols="1" sm="1">
                          <v-btn icon @click="dialogAdd = true">
                            <v-icon color="orange">mdi-wall</v-icon>
                            <small>Add</small>
                          </v-btn>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="5">
                          <v-combobox
                            v-model="stockItemChosen"
                            :items="stockItems"
                            label="Choose  stock item*"
                            item-text="itemDescription"
                            dense
                            item-color="#111d5e"
                            @change="chooseStockItem"
                            @blur="chooseStockItem"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-combobox
                            v-model="editedItem.unit"
                            :items="items"
                            label="Choose Unit Measure*"
                            dense
                            item-color="#111d5e"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.quantity"
                            label="Quantity*"
                            @change="chooseQuantity"
                            @blur="chooseStockItem"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.price"
                            label="rate*"
                            @change="chooseQuantity"
                            @blur="chooseStockItem"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.gross"
                            label="Gross"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.vat"
                            label="vat"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.nett"
                            label="nett"
                            disabled
                          ></v-text-field>
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
                        editedItem.supplier &&
                          editedItem.block &&
                          editedItem.unitChosen &&
                          stockItemChosen &&
                          editedItem.unit &&
                          editedItem.quantity
                      "
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
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
            <v-icon small class="mr-2" @click="editItem(item)" color="green">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)" color="red">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>

        <v-col cols="12" sm="12" md="12">
          <div style="display:flex;">
            <v-text-field
              v-model="totalGross"
              label="Gross"
              disabled
            ></v-text-field>
            <!-- </v-col>
        <v-col cols="4" sm="4" md="4"> -->
            <v-text-field
              v-model="totalVAT"
              label="VAT"
              disabled
            ></v-text-field>
            <!-- </v-col>
        <v-col cols="4" sm="4" md="4"> -->
            <v-text-field
              v-model="totalNett"
              label="Nett"
              disabled
            ></v-text-field>
          </div>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeEdit">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="savePO">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="dialogAdd" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Add StockItem</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    label="Supplier*"
                    v-model="stockItemToAdd.supplier"
                    :items="suppliers"
                    item-text="supplierName"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Stock Code*"
                    v-model="stockItemToAdd.itemCode"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    label="Description"
                    v-model="stockItemToAdd.itemDescription"
                    hint="example of helper text only on focus"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Quantity*"
                    v-model="stockItemToAdd.quantity"
                    hint="example of persistent helper text"
                    type="number"
                    required
                    @blur="calculateCost"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    v-model="stockItemToAdd.unitDescription"
                    :items="items"
                    label="unit Measure"
                    @blur="calculateCost"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="stockItemToAdd.unitCost"
                    type="number"
                    label="unitCost"
                    required
                    @blur="calculateCost"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="stockItemToAdd.totalCost"
                    type="number"
                    label="total Cost"
                    required
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="stockItemToAdd.vat"
                    type="number"
                    label="VAT"
                    required
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="stockItemToAdd.nettCost"
                    type="number"
                    label="nett Cost"
                    required
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogAdd = false">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="addStockItem"
              v-if="
                stockItemToAdd.supplier !== '' &&
                  stockItemToAdd.itemCode !== '' &&
                  stockItemToAdd.itemDescription !== '' &&
                  stockItemToAdd.unitCost !== 0 &&
                  stockItemToAdd.quantity !== 0 &&
                  stockItemToAdd.unitDescription !== ''
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  props: {
    mainDialog: Boolean,
    PONumber: String
  },

  data: () => ({
    //   mainDialog: true,
    itemToDelete: [],
    subsection: [],
    suppliers: [],
    supplierChosen: "",
    units: [],
    unitChosen: "",
    stockItems: [],
    stockItemChosen: null,
    items: [
      "m",
      "m²",
      "m³",
      "t",
      "litre",
      "Each",
      "Item",
      "No.",
      "hour",
      "day"
    ],
    stockItemsToUpdate: [],
    stockItemsToAdd: [],
    stockItemToAdd: {
      supplier: "",
      itemCode: "",
      itemDescription: "",
      quantity: 1,
      unitDescription: "",
      unitCost: 0,
      totalCost: 0,
      vat: 0,
      nettCost: 0
    },
    totalGross: 0,
    totalVAT: 0,
    comments: "",
    totalNett: 0,
    deliveryDate: "",
    date: new Date().toISOString().substr(0, 10),
    menu: false,

    dialog: false,
    dialogDelete: false,
    dialogAdd: false,
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      {
        text: "Supplier",
        align: "start",
        sortable: false,
        value: "supplier",
        width: 120
      },
      {
        text: "Block",
        align: "start",
        sortable: false,
        value: "block",
        width: 90
      },
      {
        text: "Unit Chosen",
        align: "start",
        sortable: false,
        value: "unitChosen",
        width: 90
      },
      {
        text: "Stock Code",
        align: "start",
        sortable: false,
        value: "itemCode",
        width: 100
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
        width: 120
      },
      { text: "Quantity", value: "quantity", width: 50, align: "end" },
      { text: "Available", value: "available", width: 90, align: "end" },
      { text: "Unit", value: "unit", width: 90, align: "end" },
      { text: "Rate", value: "price", width: 90, align: "end" },
      { text: "Gross", value: "gross", width: 90, align: "end" },
      { text: "Tax", value: "vat", width: 90, align: "end" },
      { text: "Nett", value: "nett", width: 90, align: "end" }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      supplier: "",
      block: "",
      unitChosen: "",
      itemCode: "",
      description: "",
      quantity: 0,
      unit: "",
      price: 0,
      gross: 0,
      vat: 0,
      nett: 0
    },
    defaultItem: {
      supplier: "",
      block: "",
      unitChosen: "",
      itemCode: "",
      description: "",
      quantity: 0,
      unit: "",
      price: 0,
      gross: 0,
      vat: 0,
      nett: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    mainDialog: function() {
      if (this.mainDialog === true && this.PONumber) {
        this.getPODetails();
      }
    }
  },

  async mounted() {
    await this.getSubsections()
      .then(await this.getUnits())
      .then(await this.getStock())
      .then(await this.getPODetails());
    // await this.getUnits();
    // await this.getStock();
    // setTimeout(() => {
    //   this.getPODetails();

    // },500)
  },

  methods: {
    async addStockItem() {
      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.stockItemToAdd.supplier;
      });
      console.log(supplier);
      console.log(this.stockItemToAdd);
      this.stockItemToAdd.supplier = supplier[0].id;
      let data = this.stockItemToAdd;
      await axios({
        method: "post",
        url: `${url}/addStockItem`,
        data: data
      })
        .then(response => {
          console.log(response.data);
          this.getUpdatedStock();
        })
        .catch(() => {});
    },
    async getUpdatedStock() {
      await axios({
        method: "post",
        url: `${url}/getStock`
      })
        .then(response => {
          console.log(response.data);
          this.stockItems = response.data;
          this.dialogAdd = false;
        })
        .catch(() => {});
    },
    calculateCost() {
      this.stockItemToAdd.totalCost =
        this.stockItemToAdd.quantity * this.stockItemToAdd.unitCost;
      this.stockItemToAdd.vat = this.stockItemToAdd.totalCost * 0.15;
      this.stockItemToAdd.nettCost =
        this.stockItemToAdd.totalCost + this.stockItemToAdd.vat;
      this.stockItemToAdd.totalCost = this.stockItemToAdd.totalCost.toFixed(2);
      this.stockItemToAdd.vat = this.stockItemToAdd.vat.toFixed(2);
      this.stockItemToAdd.nettCost = this.stockItemToAdd.nettCost.toFixed(2);
    },
    changeSupplier() {
      this.editedItem.supplier = this.supplierChosen;
    },
    async savePO() {
      let overBudget = false;
      for (const value of this.desserts) {
        console.log(value.available); //value
        if (parseInt(value.available) < parseInt(value.quantity)) {
          overBudget = true;
          break;
        }
      }
      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.supplierChosen;
      });
      console.log(supplier);
      console.log(this.editedItem.supplier);
      this.desserts.forEach(el => {
        el.PONumber = this.PONumber;
        el.deliveryDate = this.date;
        el.supplierId = supplier[0].id;
        el.supplierName = supplier[0].supplierName;
        el.supplierEmail = supplier[0].emailAddress;
        el.supplierPostal = supplier[0].postal_address;
        el.supplierStreet = supplier[0].street_address;
        el.supplierVATNumber = supplier[0].vat_number;
        el.overBudget = overBudget;
      });
      console.log(this.desserts);
      let PODataInsert = this.desserts.filter(el => {
        return el.id === null || el.id === undefined;
      });
      let PODataEdit = this.desserts.filter(el => {
        return el.id !== null && el.id !== undefined;
      });
      PODataInsert.forEach(el => {
        el.development = this.$store.state.development.id;
        el.supplierId = supplier[0].id;
        el.subsection = this.subsection.filter(el2 => {
          return el2.subsectionName === el.block;
        })[0].id;
        el.unitNumber = this.units.filter(el4 => {
          return el4.unitName === el.unitChosen;
        })[0].id;
        el.reference = this.desserts[0].reference;
      });
      let itemToDelete = this.itemToDelete.filter(el => {
        return el !== undefined;
      });
      let data = {
        purchaseOrderPDFData: this.desserts,
        purchaseOrdersToDelete: itemToDelete,
        purchaseOrderToUpdate: PODataEdit,
        purchaseOrderToInsert: PODataInsert,
        stockItemsToAdd: this.stockItemsToAdd,
        stockItemsToUpdate: this.stockItemsToUpdate
      };
      console.log(data);

      await axios({
        method: "post",
        url: `${url}/POEdit`,
        data: data
      }).then(
        response => {
          console.log(response.data);
          this.closeEdit();
        },
        error => {
          console.log(error);
        }
      );
    },
    async getPODetails() {
      let data = {
        id: this.$store.state.development.id,
        PONumber: this.PONumber
      };
      await axios({
        method: "post",
        url: `${url}/POEditData`,
        data: data
      })
        .then(response => {
          console.log(response.data);
          this.desserts = response.data;

          this.desserts.forEach(el => {
            // let unit = [];
            // let unitChosen = `${el.unitChosen}-${el.unitNumber}`;
            // unit.push(unitChosen);
            // let data = {
            //   id: el.stockId,
            //   unit: unit,
            //   poId: el.id,
            // };

            // this.getBudgetted(data);
            el.supplier = this.suppliers.filter(el4 => {
              return el4.id === el.supplier;
            })[0].supplierName;
            el.block = el.subsection;
            el.block = this.subsection.filter(el2 => {
              return el2.id === el.block;
            })[0].subsectionName;
            el.unitChosen = el.unitNumber;
            if (el.unitChosen !== null) {
              el.unitChosen = this.units.filter(el3 => {
                return el3.id === el.unitChosen;
              })[0].unitName;
            } else {
              el.unitChosen = "None";
            }
            el.description = el.itemDescription;
            el.unit = el.unitDescription;
            el.price = el.unitCost;
            el.gross = el.totalCost;
            el.nett = el.nettCost;
          });
          console.log(this.desserts);
          this.comments = this.desserts[0].comments;
          this.deliveryDate = this.desserts[0].deliveryDate.substr(0, 10);
          this.date = this.deliveryDate;
          this.supplierChosen = this.desserts[0].supplier;
          this.editedItem.supplier = this.desserts[0].supplier;
          this.defaultItem.supplier = this.desserts[0].supplier;
          let totalGross = this.desserts.reduce((acc, el) => {
            return acc + parseFloat(el.gross);
          }, 0);
          this.totalGross = totalGross.toFixed(2);
          let totalVAT = this.desserts.reduce((acc, el) => {
            return acc + parseFloat(el.vat);
          }, 0);
          this.totalVAT = totalVAT.toFixed(2);
          let totalNett = this.desserts.reduce((acc, el) => {
            return acc + parseFloat(el.nett);
          }, 0);
          this.totalNett = totalNett.toFixed(2);
          this.totalGross = this.convertToString(this.totalGross);
          this.totalVAT = this.convertToString(this.totalVAT);
          this.totalNett = this.convertToString(this.totalNett);
        })
        .catch(() => {});
      // this.desserts.forEach((el) => {

      // });

      //   this.getSubsections();
      // setTimeout(() => {
      //   this.$nextTick(() => {
      //     this.getBudgetted();
      //   });
      // }, 1000);
    },
    async getBudgetted(data) {
      await axios({
        method: "post",
        url: `${url}/getBudget`,
        data: data
      }).then(
        response => {
          this.desserts.forEach(el => {
            if (el.id === data.poId) {
              el.available =
                response.data[0][0].quantity - response.data[1][0].quantity;
              el.quantity = parseInt(el.quantity);
            }
          });
        },
        error => {
          console.log(error);
        }
      );
      // });
    },
    closeEdit() {
      //   this.mainDialog = false
      this.$emit("exitEdit", false);
      //    this.$emit("child-checkbox", this.checkbox);
    },

    async editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.stockItemChosen = this.editedItem.description;
      this.supplier = this.editedItem.supplier;
      this.dialog = true;
      console.log(this.desserts);
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/POInformation`,
        data: data
      })
        .then(response => {
          this.suppliers = response.data[0];
        })
        .catch(() => {});
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);

      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      let deleteID = this.desserts[this.editedIndex].id;
      this.itemToDelete.push(deleteID);
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.stockItemChosen = "";
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

    save() {
      console.log(this.editedItem);
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      if (
        typeof this.stockItemChosen === "object" &&
        this.stockItemChosen !== null
      ) {
        this.stockItemChosen.unitDescription = this.editedItem.unit;
        this.stockItemChosen.unitCost = this.editedItem.price;
        this.stockItemsToUpdate.push(this.stockItemChosen);
      } else {
        this.stockItemsToAdd.push(this.editedItem);
      }
      let totalGross = this.desserts.reduce((acc, el) => {
        return acc + parseFloat(el.gross);
      }, 0);
      this.totalGross = totalGross.toFixed(2);
      let totalVAT = this.desserts.reduce((acc, el) => {
        return acc + parseFloat(el.vat);
      }, 0);
      this.totalVAT = totalVAT.toFixed(2);
      let totalNett = this.desserts.reduce((acc, el) => {
        return acc + parseFloat(el.nett);
      }, 0);
      console.log(this.editedIndex);
      console.log(this.editedItem);
      console.log(this.desserts);

      this.totalNett = totalNett.toFixed(2);
      this.totalGross = this.convertToString(this.totalGross);
      this.totalVAT = this.convertToString(this.totalVAT);
      this.totalNett = this.convertToString(this.totalNett);

      this.close();
    },
    async getSubsections() {
      this.subsection = [];
      let parameter = this.$store.state.development.id;
      this.developmentParam = parameter;
      await axios({
        method: "get",
        url: `${url}/subsection/${parameter}`
      }).then(
        response => {
          //   if (response.data.success === false) {
          //     return this.$router.push({ name: "Login" });
          //   }
          this.subsection = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    async getUnits() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getAllUnits`,
        data: data
      }).then(
        response => {
          this.units = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    async getStock() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/POInformationForEdit`,
        data: data
      }).then(
        response => {
          this.suppliers = response.data[0];
          this.stockItems = response.data[1];
          this.stockItems.forEach(el => {
            if (el.unitDescription !== null) {
              this.items.push(el.unitDescription);
            }
          });
        },
        error => {
          console.log(error);
        }
      );
    },
    chooseQuantity() {
      if (this.editedItem.quantity !== 0 && this.editedItem.quantity !== "") {
        this.editedItem.gross = (
          parseFloat(this.editedItem.quantity) *
          parseFloat(this.editedItem.price)
        ).toFixed(2);
        this.editedItem.vat = (
          parseFloat(this.editedItem.gross) * 0.15
        ).toFixed(2);
        this.editedItem.nett = (
          parseFloat(this.editedItem.gross) + parseFloat(this.editedItem.vat)
        ).toFixed(2);
      }
    },
    chooseStockItem() {
      console.log(this.stockItemChosen);
      if (
        typeof this.stockItemChosen === "object" &&
        this.stockItemChosen !== null
      ) {
        this.editedItem.description = this.stockItemChosen.itemDescription;
        this.editedItem.price = this.stockItemChosen.unitCost.toFixed(2);
        this.editedItem.itemCode = this.stockItemChosen.itemCode;
      } else {
        let stockFilter = this.stockItems.filter(el => {
          return this.stockItemChosen === el.itemDescription;
        });
        console.log("stockFilter", stockFilter);
        this.editedItem.price = stockFilter[0].unitCost;
        this.editedItem.itemCode = stockFilter[0].itemCode;
        this.editedItem.description = this.stockItemChosen;
      }
    },
    itemRowColor(item) {
      //CHANGES ROW COLOR WHEN TASK BEHIND SCGEDULE
      if (item.available < item.quantity) {
        return "yellow accent-2";
      }
    }
  }
};
</script>

<style scoped>
>>> .v-table__overflow {
  height: 99.9%;
  max-height: 99.9%;
  overflow-y: auto !important;
}
</style>

<template>
  <div>
    <!-- <h1>Create Purchase Order</h1> -->
    <v-row justify="center">
      <v-card width="75%">
        <v-card-title>
          <span class="headline">Create Requisition</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  v-model="supplier"
                  :items="suppliers"
                  dense
                  filled
                  item-text="supplierName"
                  label="Choose Supplier*"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Note / Comment"
                  v-model="reference"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Expected Delivery Date*"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        scrollable
                        show-adjacent-months
                        first-day-of-week="1"
                        :min="minDate"
                        show-week
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <small style="color: red;">*indicates required field</small>
          <v-data-table
            :headers="headers"
            :items="desserts"
            sort-by="calories"
            class="elevation-1"
            :item-class="itemRowColor"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Add Items</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="900px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="stockItemChosen = null"
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
                          <v-col class="d-flex" cols="12" sm="12">
                            <h2>{{ PONumber }}</h2>
                            <!-- <span class="headline">{{ PONumber}}</span> -->
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
                              multiple
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="6">
                            <!-- v-model="unitChosen" -->
                            <!-- v-model="editedItem.unitChosen" -->
                            <v-autocomplete
                              v-model="editedItem.unitChosen"
                              :items="units"
                              item-text="unitName"
                              label="Choose Unit"
                              clearable
                              prepend-icon="mdi-home-analytics"
                              color="#0F0F0F"
                              item-color="#0F0F0F"
                              multiple
                              @blur="filterStock"
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="1" sm="1">
                            <v-btn
                              icon
                              @click="dialogAdd = true"
                              style="margin-top: 12px;"
                            >
                              <v-icon color="orange">mdi-wall</v-icon>
                              <small>+</small>
                            </v-btn>
                          </v-col>
                          <v-col class="d-flex" cols="1" sm="1">
                            <v-checkbox
                              style="margin-top: 15px;"
                              v-model="showReleventStock"
                              label=""
                              color="indigo"
                            ></v-checkbox>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="5">
                            <v-autocomplete
                              v-model="stockItemChosen"
                              :items="stockItemsFiltered"
                              label="Choose stock item*"
                              item-text="siItemDescription"
                              item-color="#111d5e"
                              @change="chooseStockItem"
                              @blur="chooseStockItem"
                              clearable
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <label style="color: red;"
                              ><strong
                                >Avail: {{ stockAvailable }}</strong
                              ></label
                            >
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-combobox
                              v-model="editedItem.unit"
                              :items="items"
                              label="Choose Unit Measure*"
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
                        <small style="color: red;"
                          >*indicates required field</small
                        >
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
                          editedItem.quantity !== 0 &&
                            editedItem.price !== 0 &&
                            stockItemChosen &&
                            editedItem.unit &&
                            editedItem.block !== ''
                        "
                      >
                        Add
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
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon color="green" small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon color="red" small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <!-- <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">
                Reset
              </v-btn>
            </template> -->
          </v-data-table>
        </v-card-text>
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
          <v-btn color="blue darken-1" text @click="clearData">
            Clear
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="savePO"
            v-if="desserts.length && supplier"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
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
    <!-- <v-btn :id="item.id" icon @click="getPDF($event)"
      ><v-icon color="red">mdi-file-pdf-box</v-icon></v-btn
    > -->
    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "purchaseordercreate",
  components: {
    // PDFViewer,
    PDFViewer: () => import("../components/PDFViewer"),
  },
  data() {
    return {
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      hrefCert: "",
      showReleventStock: false,
      supplier: null,
      suppliers: [],
      stockItems: [],
      stockItemsDuplicated: [],
      date: new Date().toISOString().substr(0, 10),
      minDate: "",
      menu: false,
      // items: ["Each", "Roll", "l/m", "sqm", "hour"],
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
        "day",
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
        nettCost: 0,
      },
      // unitTypeChosen: null,
      stockItemChosen: null,
      totalGross: 0,
      totalVAT: 0,
      totalNett: 0,
      subsectionChosen: "",
      subsection: [],
      unitChosen: "",
      units: [],
      subsectionParam: null,
      PONumber: "",
      reference: "",

      // ###################
      dialog: false,
      dialogDelete: false,
      dialogAdd: false,
      headers: [
        {
          text: "Block",
          align: "start",
          sortable: false,
          value: "block",
          width: 90,
        },
        {
          text: "Unit Chosen",
          align: "start",
          sortable: false,
          value: "unitChosen",
          width: 90,
        },
        {
          text: "Stock Code",
          align: "start",
          sortable: false,
          value: "itemCode",
          width: 300,
        },
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
          width: 300,
        },
        { text: "Quantity", value: "quantity", width: 90, align: "end" },
        { text: "Available", value: "available", width: 90, align: "end" },
        { text: "Unit", value: "unit", width: 90, align: "end" },
        { text: "Rate", value: "price", width: 90, align: "end" },
        { text: "Gross", value: "gross", width: 90, align: "end" },
        { text: "Tax", value: "vat", width: 90, align: "end" },
        { text: "Nett", value: "nett", width: 90, align: "end" },

        { text: "Actions", value: "actions", sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        block: "",
        unitChosen: "",
        stockId: 0,
        itemCode: "",
        description: "",
        quantity: 0,
        unit: "",
        price: 0,
        gross: 0,
        vat: 0,
        nett: 0,
      },
      defaultItem: {
        block: "",
        unitChosen: "",
        stockId: 0,
        itemCode: "",
        description: "",
        quantity: 0,
        unit: "",
        price: 0,
        gross: 0,
        vat: 0,
        nett: 0,
      },
      stockAvailable: 0,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    stockItemsFiltered() {
      if (this.showReleventStock === false) {
        return this.stockItems;
      } else {
        let stockFilter = this.editedItem.unitChosen;
        let unitNumbers = [];
        stockFilter.forEach((el) => {
          unitNumbers.push(parseInt(el.split("-")[1]));
        });
        console.log(unitNumbers);
        // const array = [
        //   { id50: 1, bar: "test" },
        //   { id50: 2, bar: "test2" },
        //   { id50: 3, bar: "test3" },
        // ];
        // const ids = [1, 2];
        // const result = array.filter(({ id50 }) => !ids.includes(id50));
        return this.stockItems.filter(({ sbUnitNumber }) =>
          unitNumbers.includes(sbUnitNumber)
        );
        // console.log(result);
      }
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    this.initialLoad();
    let minDate = dayjs()
      .toISOString()
      .substr(0, 10);
    this.minDate = minDate;
  },

  methods: {
    filterStock() {
      this.showReleventStock = true;
      console.log(this.stockItemsFiltered);
      // let stockFilter = this.editedItem.unitChosen;
      // let unitNumbers = [];
      // stockFilter.forEach((el) => {
      //   unitNumbers.push(parseInt(el.split("-")[1]));
      // });
      // console.log(unitNumbers);

      // const result = this.stockItems.filter(({ sbUnitNumber }) =>
      //   unitNumbers.includes(sbUnitNumber)
      // );
      // console.log(result);
    },
    clearData() {
      this.dialog = false;
      this.desserts = [];
    },
    async addStockItem() {
      let supplier = this.suppliers.filter((el) => {
        return el.supplierName === this.stockItemToAdd.supplier;
      });
      console.log(supplier);
      console.log(this.stockItemToAdd);
      this.stockItemToAdd.supplier = supplier[0].id;
      let data = this.stockItemToAdd;
      await axios({
        method: "post",
        url: `${url}/addStockItem`,
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          this.getStock();
        })
        .catch(() => {});
    },
    async getStock() {
      await axios({
        method: "post",
        url: `${url}/getStock`,
      })
        .then((response) => {
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
    async initialLoad() {
      let data = {
        id: this.$store.state.development.id,
      };
      await axios({
        method: "post",
        url: `${url}/POInformation`,
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          this.suppliers = response.data[0];
          // this.stockItems = response.data[1];
          this.stockItems = response.data[3];
          this.stockItemsDuplicated = response.data[3];
          // console.log(this.stockItems);
          if (!response.data[2].length) {
            let PONumber = `PO-${this.$store.state.development.developmentName.substring(
              0,
              3
            )}-00000001`;
            this.PONumber = PONumber;
          } else {
            let PONumber = response.data[2][0].PONumber.split("-");
            PONumber = parseInt(PONumber[PONumber.length - 1]);
            PONumber = (PONumber + 1).toString();
            let PONumberArray = [];
            PONumberArray.push(PONumber);
            for (let i = 0; i < 8 - PONumber.length; i++) {
              PONumberArray.unshift("0");
            }
            PONumber = `PO-${this.$store.state.development.developmentName.substring(
              0,
              3
            )}-${PONumberArray.join("")}`;
            this.PONumber = PONumber;
          }
        })
        .catch(() => {});
      this.getSubsections();
    },
    getPDF() {
      this.showSrc = `${process.env.VUE_APP_BASEURL}/purchaseorders/${this.hrefCert}.pdf`;
      this.showFileName = `${this.hrefCert}`;
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    },
    async savePO() {
      let supplier = this.suppliers.filter((el) => {
        return el.supplierName === this.supplier;
      });
      let POData = [];
      let stockData = [];
      let overBudget = false;
      for (const value of this.desserts) {
        console.log(value.available); //value
        if (parseInt(value.available) < parseInt(value.quantity)) {
          overBudget = true;
          break;
        }
      }
      // console.log(overBudget)

      this.desserts.forEach((el) => {
        el.PONumber = this.PONumber;
        el.deliveryDate = this.date;
        el.supplierName = supplier[0].supplierName;
        el.supplierEmail = supplier[0].emailAddress;
        el.supplierPostal = supplier[0].postal_address;
        el.supplierStreet = supplier[0].street_address;
        el.supplierVATNumber = supplier[0].vat_number;
        let block = this.subsection.filter((el2) => {
          return el2.subsectionName == el.block;
        });
        let insert = [];
        insert.push(this.PONumber);
        insert.push(this.$store.state.development.id);
        insert.push(block[0].id);
        if (el.unitChosen !== "" && el.unitChosen !== null) {
          let unitChosenArray = el.unitChosen.split("-");
          insert.push(parseInt(unitChosenArray[unitChosenArray.length - 1]));
        } else {
          insert.push(null);
        }
        if (this.reference === "") {
          this.reference = "none";
        }
        insert.push(supplier[0].id);
        insert.push(this.reference);
        insert.push(this.date);
        insert.push(el.stockId);
        insert.push(el.itemCode);
        insert.push(el.description);
        insert.push(parseFloat(el.quantity));
        insert.push(el.unit);
        insert.push(parseFloat(el.price));
        insert.push(parseFloat(el.gross));
        insert.push(parseFloat(el.vat));
        insert.push(parseFloat(el.nett));
        insert.push(overBudget);
        insert.push(parseFloat(el.available));
        POData.push(insert);

        let stockInsert = [];

        stockInsert.push(el.stockId);
        stockInsert.push(parseFloat(el.quantity));
        stockInsert.push(parseFloat(el.price));
        stockInsert.push(parseFloat(el.gross));
        stockInsert.push(parseFloat(el.vat));
        stockInsert.push(parseFloat(el.nett));
        stockInsert.push(supplier[0].id);
        stockInsert.push(this.PONumber);
        stockInsert.push(new Date().toISOString().substr(0, 10));
        stockInsert.push(this.$store.state.development.id);
        stockInsert.push(block[0].id);
        // stockInsert.push(block[0].id)
        if (el.unitChosen !== "" && el.unitChosen !== null) {
          let unitChosenArray = el.unitChosen.split("-");
          stockInsert.push(
            parseInt(unitChosenArray[unitChosenArray.length - 1])
          );
        } else {
          stockInsert.push(null);
        }
        stockData.push(stockInsert);
      });

      //  stockItem int not null,
      // quantityPurchased float not null,
      // costPerItem decimal(18,2),
      // totalCost decimal(18,2),
      // vatAmount   decimal(18,2),
      // nettCost decimal(18,2),
      // supplier int,
      // PONumber varchar(160),
      // invoiceNumber   varchar(160), //NOT THIS AS YET
      // datePurchased TIMESTAMP default now(),
      // development int,
      // section int,
      // unitNumber int,
      // console.log(this.stockItemsToAdd); //NEW STOCK ITEMS
      console.log(this.stockItemsToUpdate); //AMEND STOCK ITEMS
      let data = {
        purchaseOrderPDFData: this.desserts,
        purchaseOrderToProcess: POData,
        stockPurchases: stockData,
        // stockItemsToAdd: this.stockItemsToAdd,
        stockItemsToUpdate: this.stockItemsToUpdate,
      };
      console.log(this.desserts);

      await axios({
        method: "post",
        url: `${url}/POPosting`,
        data: data,
      }).then(
        (response) => {
          console.log(response.data);

          this.hrefCert = response.data.hrefCert;
          setTimeout(() => {
            this.getPDF();
            this.initialLoad();
            this.desserts = [];
            this.reference = "";
            this.supplier = "";
            this.date = new Date().toISOString().substring(0, 10);
          }, 500);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async getSubsections() {
      this.subsection = [];
      let parameter = this.$store.state.development.id;
      this.developmentParam = parameter;
      await axios({
        method: "get",
        url: `${url}/subsection/${parameter}`,
      }).then(
        (response) => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          this.subsection = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getUnits() {
      console.log(this.editedItem.block);
      // let parameter = "";
      console.log(this.subsection);
      let data = [];
      if (this.subsection.length) {
        this.editedItem.block.forEach((el) => {
          let unit = this.subsection.filter((el2) => {
            return el2.subsectionName === el;
          });
          data.push(unit[0].id);
        });
        console.log(data);

        let getInfo = {
          id: this.$store.state.development.id,
          info: data,
        };

        // let unit = this.subsection.filter((el) => {
        //   return el.subsectionName === this.editedItem.block;
        // });
        // parameter = unit[0].id;
        // console.log(parameter);
        // this.subsectionParam = parameter;

        axios({
          method: "post",
          url: `${url}/getPOUnits`,
          data: getInfo,
        }).then(
          (response) => {
            this.units = response.data;

            this.units.sort((a, b) => {
              return a.unitName - b.unitName;
            });

            // this.units.forEach((el) => {
            //   if (el.unitName.substring(1, 2) == ".") {
            //     // this.units.push(this.units.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
            //     this.units.push(this.units.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
            //   }
            // });
            this.units.forEach((el) => {
              el.unitName = `${el.unitName}-${el.id}`;
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
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
    async chooseStockItem() {
      console.log(this.stockItemChosen);

      let stockFilter = this.editedItem.unitChosen;
      let unitNumbers = [];
      stockFilter.forEach((el) => {
        unitNumbers.push(parseInt(el.split("-")[1]));
      });
      console.log(unitNumbers);

      const result = this.stockItems
        .filter(({ sbUnitNumber }) => unitNumbers.includes(sbUnitNumber))
        .filter((el) => {
          return el.siItemDescription === this.stockItemChosen;
        })
        .reduce((prev, current) => {
          return prev + current.available;
        }, 0);
      console.log("RESULT:", result);
      this.stockAvailable = result;
      const result2 = this.stockItems
        .filter(({ sbUnitNumber }) => unitNumbers.includes(sbUnitNumber))
        .filter((el) => {
          return el.siItemDescription === this.stockItemChosen;
        });
      console.log("result 2",result2);
      this.editedItem.price = result2[0].sbCostPerItem;
      this.editedItem.itemCode = result2[0].siItemCode
      this.editedItem.description = result2[0].siItemDescription
      this.editedItem.stockId = result2[0].siId
      console.log("Edited Item",this.editedItem)
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

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
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
      console.log(this.editedItem.unitChosen);
      this.stockAvailable = 0;
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        if (this.editedItem.unitChosen.length > 1) {
          let unitsChosen = this.editedItem.unitChosen;
          unitsChosen.forEach((el) => {
            let unit = this.units.filter((el2) => {
              return el === el2.unitName;
            });

            let block = this.subsection.filter((el3) => {
              return el3.id === unit[0].subsection;
            });

            let insert = {
              block: block[0].subsectionName,
              unitChosen: el,
              stockId: this.editedItem.stockId,
              itemCode: this.editedItem.itemCode,
              description: this.editedItem.description,
              quantity: this.editedItem.quantity,
              unit: this.editedItem.unit,
              price: this.editedItem.price,
              gross: this.editedItem.gross,
              vat: this.editedItem.vat,
              nett: this.editedItem.nett,
            };

            this.desserts.push(insert);
          });
        } else {
          let unit = this.units.filter((el5) => {
            return this.editedItem.unitChosen[0] === el5.unitName;
          });
          let block = this.subsection.filter((el4) => {
            return el4.id === unit[0].subsection;
          });
          let insert = {
            block: block[0].subsectionName,
            unitChosen: this.editedItem.unitChosen[0],
            stockId: this.editedItem.stockId,
            itemCode: this.editedItem.itemCode,
            description: this.editedItem.description,
            quantity: this.editedItem.quantity,
            unit: this.editedItem.unit,
            price: this.editedItem.price,
            gross: this.editedItem.gross,
            vat: this.editedItem.vat,
            nett: this.editedItem.nett,
          };
          this.desserts.push(insert);
        }
      }
      this.desserts.forEach((el) => {
        let unit = [];
        let unitChosen = el.unitChosen;
        unit.push(unitChosen);
        let data = {
          id: this.editedItem.stockId,
          unit: unit,
        };
        axios({
          method: "post",
          url: `${url}/getBudget`,
          data: data,
        }).then(
          (response) => {
            console.log(response.data);
            console.log(response.data[0][0]);
            console.log(response.data[1][0]);
            el.available =
              response.data[0][0].quantity - response.data[1][0].quantity;
            el.quantity = parseInt(el.quantity);
          },
          (error) => {
            console.log(error);
          }
        );
      });
      console.log("CheckOut", this.desserts);

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
      this.totalNett = totalNett.toFixed(2);
      this.totalGross = this.convertToString(this.totalGross);
      this.totalVAT = this.convertToString(this.totalVAT);
      this.totalNett = this.convertToString(this.totalNett);
      this.close();
    },
    itemRowColor(item) {
      //CHANGES ROW COLOR WHEN TASK BEHIND SCGEDULE
      if (item.available < item.quantity) {
        return "yellow accent-2";
      }
    },
  },
};
</script>

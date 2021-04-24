<template>
  <div>
    <!-- <h1>Create Purchase Order</h1> -->
    <v-row justify="center">
      <v-card width="75%">
        <v-card-title>
          <span class="headline">Create Purchase Order</span>
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
                              prepend-icon="mdi-tag-heart"
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
                              prepend-icon="mdi-tag-heart"
                              color="#0F0F0F"
                              item-color="#0F0F0F"
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="6">
                            <v-combobox
                              v-model="stockItemChosen"
                              :items="stockItems"
                              label="Choose or enter new stock item*"
                              item-text="itemDescription"
                              dense
                              item-color="#111d5e"
                              @change="chooseStockItem"
                              @blur="chooseStockItem"
                              clearable
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
                              label="price*"
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
          <v-btn color="blue darken-1" text @click="dialog = false">
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
    PDFViewer: () => import("../components/PDFViewer")
  },
  data() {
    return {
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      hrefCert: "",

      supplier: null,
      suppliers: [],
      stockItems: [],
      date: new Date().toISOString().substr(0, 10),
      minDate: "",
      menu: false,
      items: ["Each", "Roll", "l/m", "sqm"],
      stockItemsToUpdate: [],
      stockItemsToAdd: [],

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
      headers: [
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
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
          width: 300
        },
        { text: "Quantity", value: "quantity", width: 90, align: "end" },
        { text: "Unit", value: "unit", width: 90, align: "end" },
        { text: "Price", value: "price", width: 90, align: "end" },
        { text: "Gross", value: "gross", width: 90, align: "end" },
        { text: "Tax", value: "vat", width: 90, align: "end" },
        { text: "Nett", value: "nett", width: 90, align: "end" },

        { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        block: "",
        unitChosen: "",
        description: "",
        quantity: 0,
        unit: "",
        price: 0,
        gross: 0,
        vat: 0,
        nett: 0
      },
      defaultItem: {
        block: "",
        unitChosen: "",
        description: "",
        quantity: 0,
        unit: "",
        price: 0,
        gross: 0,
        vat: 0,
        nett: 0
      }
    };
  },
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
    }
  },
  mounted() {
    this.initialLoad();
    let minDate = dayjs()
      .toISOString()
      .substr(0, 10);
    this.minDate = minDate;
  },

  methods: {
    async initialLoad() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/POInformation`,
        data: data
      })
        .then(response => {
          console.log(response.data[2]);
          this.suppliers = response.data[0];
          this.stockItems = response.data[1];
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
      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.supplier;
      });
      let POData = [];
      this.desserts.forEach(el => {
        el.PONumber = this.PONumber;
        el.deliveryDate = this.date;
        el.supplierName = supplier[0].supplierName;
        el.supplierEmail = supplier[0].emailAddress;
        el.supplierPostal = supplier[0].postal_address;
        el.supplierStreet = supplier[0].street_address;
        el.supplierVATNumber = supplier[0].vat_number;
        let block = this.subsection.filter(el2 => {
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
        insert.push(el.description);
        insert.push(parseFloat(el.quantity));
        insert.push(el.unit);
        insert.push(parseFloat(el.price));
        insert.push(parseFloat(el.gross));
        insert.push(parseFloat(el.vat));
        insert.push(parseFloat(el.nett));
        POData.push(insert);
      });
      console.log(this.stockItemsToAdd); //NEW STOCK ITEMS
      console.log(this.stockItemsToUpdate); //AMEND STOCK ITEMS
      let data = {
        purchaseOrderPDFData: this.desserts,
        purchaseOrderToProcess: POData,
        stockItemsToAdd: this.stockItemsToAdd,
        stockItemsToUpdate: this.stockItemsToUpdate
      };
      await axios({
        method: "post",
        url: `${url}/POPosting`,
        data: data
      }).then(
        response => {
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
        error => {
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
        url: `${url}/subsection/${parameter}`
      }).then(
        response => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          this.subsection = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    getUnits() {
      let parameter = "";
      if (this.subsection.length) {
        let unit = this.subsection.filter(el => {
          return el.subsectionName === this.editedItem.block;
        });
        parameter = unit[0].id;
        console.log(parameter);
        this.subsectionParam = parameter;

        axios({
          method: "get",
          url: `${url}/getUnits/${this.developmentParam}/${this.subsectionParam}`
        }).then(
          response => {
            this.units = response.data;

            this.units.forEach(el => {
              if (el.unitName.substring(1, 2) == ".") {
                // this.units.push(this.units.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
                this.units.push(this.units.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
              }
            });
            this.units.forEach(el => {
              el.unitName = `${el.unitName}-${el.id}`;
            });
          },
          error => {
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
    chooseStockItem() {
      if (
        typeof this.stockItemChosen === "object" &&
        this.stockItemChosen !== null
      ) {
        this.editedItem.description = this.stockItemChosen.itemDescription;

        // this.editedItem.unit = this.stockItemChosen.unit;
        this.editedItem.price = this.stockItemChosen.unitCost.toFixed(2);
      } else {
        this.editedItem.description = this.stockItemChosen;
      }
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

    save() {
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
      this.totalNett = totalNett.toFixed(2);
      this.totalGross = this.convertToString(this.totalGross);
      this.totalVAT = this.convertToString(this.totalVAT);
      this.totalNett = this.convertToString(this.totalNett);
      this.close();
    }
  }
};
</script>

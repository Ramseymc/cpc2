<template>
  <div>
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
            <v-btn color="blue darken-1" text @click="close">
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
    dialogAdd: Boolean,
    unitChosen: Array
  },
  data() {
    return {
      stockItemToAdd: {
        supplier: null,
        itemCode: null,
        itemDescription: null,
        quantity: 1,
        unitDescription: null,
        unitCost: null,
        totalCost: null,
        vat: null,
        nettCost: null
      },
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
      suppliers: [],
      unitNumbers: [],
      allUnits: []
    };
  },
  async mounted() {
    await this.getUnits();
    await axios({
      method: "post",
      url: `${url}/getSupplierForStock`
    })
      .then(response => {
        this.suppliers = response.data;
      })
      .catch(() => {});
  },
  methods: {
    async getUnits() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/unitsToAddStockTo`,
        data: data
      })
        .then(response => {
          this.allUnits = response.data;
          let unitNameOnly = [];
          // console.log(this.unitChosen)
          this.unitChosen.forEach(el => {
            let unitName = el.split("-")[0].split(".")[1];
            let startName = el.split("-")[0];
            // console.log("KKK",unitName)
            // if (unitName.includes(".SuperStr")) {
            this.allUnits.forEach(el2 => {
              if (el2.unitName.includes(unitName) && el2.subsection !== 7) {
                // console.log("!!!",el2.unitName);
                unitNameOnly.push(el2.id);
              } else if (!el2.unitName.includes(".") && el2.subsection !== 7) {
                console.log("@@@", el2.unitName);
                unitNameOnly.push(el2.id);
              } else if (el2.subsection === 7 && startName === el2.unitName) {
                // console.log("$$$",el2.unitName);
                unitNameOnly.push(el2.id);
              }
            });
            // }
          });

          console.log(this.allUnits);
          // console.log(this.unitChosen);
          console.log(unitNameOnly);
          this.unitNumbers = [];
          this.unitNumbers = unitNameOnly;
          console.log("Hello");
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
    async addStockItem() {
      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.stockItemToAdd.supplier;
      });

      // this.filterUnits();

      this.stockItemToAdd.supplier = supplier[0].id;
      let data = {
        stockItem: this.stockItemToAdd,
        units: this.unitNumbers,
        doneBy: this.$store.state.userName,
        development: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/addStockItem`,
        data: data
      })
        .then(() => {
          this.close();
        })
        .catch(() => {});
    },
    filterUnits() {
      this.unitNumbers = [];
      this.unitChosen.forEach(el => {
        let unit = parseInt(el.split("-")[1]);
        this.unitNumbers.push(unit);
      });
    },

    close() {
      this.$emit("closed", false);
    }
  }
  // components: {
  //      AddStockItem: () => import("../components/addStock/")
  // }
};
</script>

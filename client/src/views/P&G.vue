<template>
  <div>
    <v-row class="text-center">
      <v-col cols="10" offset="1" mb-4>
        <v-btn text @click="show = !show">Arrange Pivot</v-btn>
        <v-btn text @click="dialog = true">Edit Data</v-btn>
        <v-btn text>Chart</v-btn>
        <v-col cols="4" offset="4" mb-4>
          <!-- <v-switch
            v-model="switch1"
            :label="switch1 ? 'Show Claim' : 'Show Budget'"
            @change="switchActual"
          ></v-switch> -->
          <v-radio-group v-model="choices" row @change="switchActual">
            <v-radio label="Budget" value="Budget"></v-radio>
            <v-radio label="Claim" value="Claim"></v-radio>
            <v-radio label="Variance" value="Variance"></v-radio>
          </v-radio-group>
        </v-col>

        <v-card class="mx-auto" elevation="0">
          <v-list-item three-line max-width="1500">
            <v-list-item-content>
              <div class="overline mb-4">
                P & G's
              </div>
              <vue-pivottable-ui
                class="pivotOverflow"
                style="width: 1000px;"
                v-if="!show"
                :data="filteredPivot"
                :aggregator-name="aggregatorName"
                :renderer-name="rendererName"
                :rows="rows"
                :cols="cols"
                :vals="vals"
                :row-total="true"
                :col-total="true"
              >
              </vue-pivottable-ui>
              <v-col class="pivotOverflow">
                <vue-pivottable
                  style="width: 100%;"
                  v-if="show"
                  :data="filteredPivot"
                  :aggregator-name="aggregatorName"
                  :renderer-name="rendererName"
                  :rows="rows"
                  :cols="cols"
                  :vals="vals"
                  :row-total="true"
                  :col-total="true"
                >
                </vue-pivottable>
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="900px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit P&G's</span>
          </v-card-title>
          <v-card-subtitle>
            <span class="text-h5">[{{ originalDataTotal }}]</span> -
            <span class="text-h5">[{{ updatedTotal }}]</span> -
            <span class="text-h5"
              >[{{ originalDataTotal - updatedTotal }}]</span
            >
          </v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="editData"
                    label="Month"
                    item-text="monthEnd"
                    v-model="monthSelected"
                    @change="monthChosen"
                    clearable
                    required
                  ></v-select>
                </v-col>
                <!-- <v-col cols="12" sm="6">
                  <v-select
                    :items="editData"
                    label="Activity"
                    item-text="activity"
                    v-model="activitySelected"
                    @change="activityChosen"
                    clearable
                    required
                  ></v-select>
                </v-col> -->
                <v-col cols="12" sm="12" md="12">
                  <v-data-table
                    v-if="editDataFiltered.length > 0"
                    :headers="headers"
                    :items="editDataFiltered"
                    sort-by="activity"
                    class="elevation-1"
                    :items-per-page="5"
                  >
                    <template v-slot:top>
                      <v-toolbar flat>
                        <v-toolbar-title>Change Data</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          dark
                          text
                          class="mb-2"
                          @click="copyBudgetToActual"
                        >
                          Copy Entire Budget to Actual
                        </v-btn>
                        <v-dialog v-model="dialog1" max-width="500px">
                          <v-card>
                            <v-card-title>
                              <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.id"
                                      label="Id"
                                      disabled
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.budgetAmount"
                                      label="Budget"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.actualAmount"
                                      label="Actual"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.posted"
                                      label="Posted"
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
                              <v-btn color="blue darken-1" text @click="save">
                                Save
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <!-- <v-dialog v-model="dialogDelete" max-width="500px">
                          <v-card>
                            <v-card-title class="text-h5"
                              >Are you sure you want to delete this
                              item?</v-card-title
                            >
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="closeDelete"
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
                        </v-dialog> -->
                      </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <template v-slot:no-data>
                      <v-btn color="primary" @click="initialize">
                        Reset
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
            <!-- <small>*indicates required field</small> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeMainDialog">
              Close
            </v-btn>
            <v-btn
              v-if="showSaveButton"
              color="blue darken-1"
              text
              @click="saveAllChanges"
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
import dayjs from "dayjs";
import "vue-pivottable/dist/vue-pivottable.css";
import { VuePivottable, VuePivottableUi } from "vue-pivottable";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "PandG",
  data() {
    return {
      dialog: false,
      dialog1: false,
      monthSelected: null,
      choices: "Budget",
      activitySelected: "",
      switch1: true,
      loading: true,
      row: "both",
      show: true,
      pivotData: [],
      mainData: [],
      budgetData: [],

      aggregatorName: "Sum",
      rendererName: "Table Heatmap",

      rows: ["activity"], //Left
      cols: ["monthEnd"], //Top
      vals: ["budgetAmount"], //Adds

      disabledFromDragDrop: ["id"],
      hiddenFromDragDrop: ["id"],
      editData: [],
      editDataFiltered: [],
      originalData: [],
      originalDataTotal: 0,
      updatedTotal: 0,
      showSaveButton: false,

      dialogDelete: false,
      headers: [
        {
          text: "Activity",
          align: "start",
          sortable: false,
          value: "activity"
        },
        { text: "Description", value: "itemDescription" },
        { text: "Budget", value: "budgetAmount" },
        { text: "Actual", value: "actualAmount" },
        { text: "Month", value: "monthEnd" },
        { text: "Variance", value: "variance" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        budgetAmount: 0,
        actualAmount: 0,
        posted: 1
      },
      defaultItem: {
        id: 0,
        budgetAmount: 0,
        actualAmount: 0,
        posted: 1
      }
    };
  },
  components: {
    VuePivottable,
    VuePivottableUi
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  computed: {
    filteredPivot: function() {
      if (this.row === "both") {
        return this.pivotData;
      } else {
        return this.reFilter(this.row);
      }
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  mounted() {
    this.getData();
  },
  methods: {
    closeMainDialog() {
      this.monthSelected = null;
      this.showSaveButton = false;
      this.dialog = false;
    },
    copyBudgetToActual() {
      this.editDataFiltered.forEach(el => {
        el.actualAmount = el.budgetAmount;
        el.posted = 1;
        el.variance = el.budgetAmount - el.actualAmount;
      });
      this.showSaveButton = true;
    },
    switchActual() {
      if (this.choices === "Budget") {
        this.pivotData = this.mainData;
        // this.vals = ["budgetAmount"];
      } else if (this.choices === "Claim") {
        this.pivotData = this.budgetData;
        // this.vals = ["actualAmount"];
      }
    },
    monthChosen() {
      console.log(this.monthSelected);
      if (this.monthSelected !== null) {
        this.editDataFiltered = this.editData.filter(el => {
          return el.monthEnd === this.monthSelected;
        });
      } else {
        this.editDataFiltered = [];
      }
    },
    // activityChosen() {
    //   console.log(this.activitySelected);
    // },

    async getData() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getP&G`,
        data: data
      })
        .then(
          response => {
            console.log("TERST", response.data);
            if (!response.data.noInfo) {
              this.editData = [];
              this.editData = response.data[3];
              this.editData.forEach(el => {
                el.monthEnd = dayjs(el.monthEnd).format("MMMM YYYY");
                el.budgetAmount = el.budgetAmount.toFixed(2);
                el.actualAmount = el.actualAmount.toFixed(2);
                el.actualAmountInitial = el.actualAmount;
                el.variance = el.budgetAmount - el.actualAmount;
              });

              var myObject = response.data[0][0];
              var keyNames = Object.keys(myObject);
              this.pivotData = [];
              this.pivotData.push(keyNames);
              // console.log(this.pivotData);
              response.data[0].forEach(el => {
                let insert = [];
                insert.push(el.id);
                insert.push(el.activity);
                insert.push(el.itemDescription);
                insert.push(dayjs(el.monthEnd).format("YYYY MM"));
                insert.push(el.budgetAmount);
                insert.push(el.actualAmount);
                insert.push(el.posted);
                this.pivotData.push(insert);
              });
              console.log(this.pivotData);
              this.mainData = [];
              this.mainData = this.pivotData;

              var myObjectUsed = response.data[0][0];
              var keyNamesUsed = Object.keys(myObjectUsed);
              this.budgetData = [];

              this.budgetData.push(keyNamesUsed);

              let initialPostedData = response.data[0].filter(el => {
                return el.posted === 1;
              });
              initialPostedData.forEach(el => {
                el.budgetAmount = el.actualAmount;
              });
              let initialUnPostedData = response.data[0].filter(el => {
                return el.posted === 0;
              });
              initialPostedData.forEach(el => {
                let insert = [];
                insert.push(el.id);
                insert.push(el.activity);
                insert.push(el.itemDescription);
                insert.push(dayjs(el.monthEnd).format("YYYY MM"));
                insert.push(el.budgetAmount);
                insert.push(el.actualAmount);
                insert.push(el.posted);
                this.budgetData.push(insert);
              });

              initialUnPostedData.forEach(el => {
                let insert = [];
                insert.push(el.id);
                insert.push(el.activity);
                insert.push(el.itemDescription);
                insert.push(dayjs(el.monthEnd).format("YYYY MM"));
                insert.push(el.budgetAmount);
                insert.push(el.actualAmount);
                insert.push(el.posted);
                this.budgetData.push(insert);
              });

              this.editData.forEach(el => {
                el.monthEnd = dayjs(el.monthEnd).format("MMMM YYYY");
                // el.budgetAmount = el.budgetAmount;
                // el.actualAmount = el.actualAmount;
                el.variance = el.budgetAmount - el.actualAmount;
              });
              this.originalData = response.data[1];
              // console.log(this.editData);
              // console.log(this.originalData);
              this.updatedTotal = response.data[2]
                .reduce((prev, curr) => {
                  return prev + curr.expenditure_to_date;
                }, 0)
                .toFixed(2);

              this.originalDataTotal = response.data[4][0].totalBudget;
              console.log(response.data[4]);
              // this.originalDataTotal = this.originalData
              //   .reduce((prev, curr) => {
              //     return prev + curr.sumAmounts;
              //   }, 0)
              //   .toFixed(2);

              //  - response.data[2].reduce((prev, curr) => {
              //   return prev + curr.expenditure_to_date
              // },0)

              setTimeout(() => {
                this.show = true;
                this.loading = false;
              }, 1750);
            }
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = this.editDataFiltered.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.posted = 1;
      this.dialog1 = true;
    },
    close() {
      this.dialog1 = false;
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
      console.log(this.editedIndex);
      console.log(this.editedItem);
      if (this.editedIndex > -1) {
        Object.assign(this.editDataFiltered[this.editedIndex], this.editedItem);
      }
      this.editDataFiltered.forEach(el => {
        el.variance = el.budgetAmount - el.actualAmount;
        el.actualAmount = parseFloat(el.actualAmount).toFixed(2);
        el.variance = el.variance.toFixed(2);
      });
      this.showSaveButton = true;
      this.close();
    },
    async saveAllChanges() {
      // let postData = this.editDataFiltered.filter((el) => {
      //   return parseFloat(el.actualAmount) !== 0
      // })
      // postData.forEach((el) => {
      //   el.posted = 1
      // })
      console.log(this.editDataFiltered);
      // this.dialog = false

      await axios({
        method: "post",
        url: `${url}/updateP&G`,
        data: this.editDataFiltered
      })
        .then(
          response => {
            console.log(response.data);
            this.editDataFiltered = [];
            this.monthSelected = null;
            this.getData();
            this.dialog = false;
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
.pivotOverflow {
  display: flex;
  overflow-x: auto;
}

.horizontal-scroll {
  display: flex;
  width: 100%;
  height: 150px;
  border: solid 2px #2c3e50;
}
.outer {
  display: flex;
  flex: 1;
  width: auto;
  height: 100%;
  padding: 0 20px;
  flex-flow: row nowrap;
  align-items: center;
}
.inner-content {
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: calc(100% - 40px);
  border: solid 1px #2c3e50;
  border-radius: 5px;
}
.inner-content:not(:first-of-type) {
  margin-left: 30px;
}
a {
  text-decoration: none;
  color: black;
  margin-bottom: 10px;
}
</style>

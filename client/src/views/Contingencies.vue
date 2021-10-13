<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-data-table
          :headers="headers"
          :items="data"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>CONTINGENCIES</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <span>{{ contingencyTotal }}</span>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="900px">
                <!-- <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Item
                  </v-btn>
                </template> -->
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.paymentDate"
                            label="Date"
                            placeholder="YYYY-MM-DD"
                            hint="YYYY-MM-DD"
                            persistent-hint
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.amount"
                            label="Amount"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.processed"
                            label="Processed"
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.draw"
                            :items="draws"
                            item-text="drawNumber"
                            dense
                            filled
                            label="Draw"
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
            <v-icon small class="mr-2" @click="editItem(item)" color="green">
              mdi-pencil
            </v-icon>
            <!-- <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon> -->
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top shaped color="blue">
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import dayjs from "dayjs";
export default {
  name: "Contingencies",
  components: {
    // PlanType1
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
      snackbar: false,
      snackbarMessage: "",
      totalConstruction: 0,
      contingencyTotal: 0,
      coningencyTotalRemaining: 0,
      data: [],
      draws: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "paymentDate"
        },
        { text: "Amount", value: "amount", align: "end", sortable: true },
        {
          text: "Processed",
          value: "processed",
          align: "center",
          sortable: true
        },
        { text: "Draw", value: "draw", sortable: true },
        // { text: "Protein (g)", value: "protein" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        paymentDate: "",
        development: 0,
        amount: 0,
        processed: 0,
        draw: 0
      },
      defaultItem: {
        paymentDate: "",
        development: 0,
        amount: 0,
        processed: 0,
        draw: 0
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
    this.getInitialData();
  },
  methods: {
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getContingencies`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.contingencyTotal = response.data[1][0].amount;
            this.totalConstruction = response.data[0].reduce((prev, curr) => {
              return prev + curr.budgetAmount;
            }, 0);
            let contingencyTotal = response.data[2].reduce((prev, curr) => {
              if (curr.processed) {
                prev = prev + curr.amount;
              } else {
                prev;
              }
              return prev;
            }, 0);

            this.contingencyTotalRemaining =
              this.contingencyTotal - contingencyTotal;
            console.log(this.contingencyTotalRemaining);
            let processedData = [];
            let filteredContingency = response.data[2].filter(el => {
              return el.processed === 1;
            });
            filteredContingency.forEach(el => {
              processedData.push(el);
            });
            console.log(filteredContingency);
            console.log(processedData);

            response.data[0].forEach(el => {
              let insert = {
                processed: 0,
                development: this.$store.state.development.id,
                paymentDate: el.paymentDate,
                draw: null,
                amount:
                  (this.contingencyTotalRemaining / this.totalConstruction) *
                  el.budgetAmount
              };
              processedData.push(insert);
            });
            console.log("filteredContingency", filteredContingency);
            console.log("processedData", processedData);
            this.draws = response.data[3];
            this.data = processedData;
            this.data.forEach((el, index) => {
              el.index = index;
              el.amount = Math.round(el.amount * 100) / 100;
              el.paymentDate = dayjs(el.paymentDate).format("YYYY-MM-DD");
              if (el.processed === 0) {
                el.processed = false;
              } else {
                el.processed = true;
              }
              el.amountStr = this.convertToString(el.amount);
            });
            response.data[0].forEach(el => {
              el.paymentDate = dayjs(el.paymentDate).format("YYYY-MM-DD");
              let filteredData = this.data.filter(el2 => {
                return el2.paymentDate === el.paymentDate;
              });
              if (filteredData.length > 1) {
                console.log(filteredData);
                let refilteredData = filteredData.filter(el2 => {
                  return el2.processed === false;
                });
                console.log(refilteredData);
                this.data = this.data.filter(el3 => {
                  return el3.index !== refilteredData[0].index;
                });
              }
            });
            this.contingencyTotal = this.convertToString(this.contingencyTotal);
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
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.draw) {
        let filter = this.draws.filter(el => {
          return el.id === this.editedItem.draw;
        });
        this.editedItem.draw = filter[0].drawNumber;
      }
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.data.splice(this.editedIndex, 1);
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
      if (this.editedIndex > -1) {
        if (this.editedItem.draw) {
          let filtered = this.draws.filter(el => {
            return el.drawNumber === this.editedItem.draw;
          });
          if (filtered.length > 0) {
            this.editedItem.draw = filtered[0].id;
          }
        }
        if (new Date(this.editedItem.paymentDate) != "Invalid Date") {
          console.log("DATEEEEE", new Date(this.editedItem.paymentDate));

          Object.assign(this.data[this.editedIndex], this.editedItem);
          let deleteFactor = this.data.length;
          let info = this.data;
          while (info.length > 0) {
            let processDelete;
            if (info.length === deleteFactor) {
              processDelete = true;
            } else processDelete = false;

            let infoToPost = info.splice(0, 25);
            let data = {
              deletion: processDelete,
              infoToPost
            };
            await axios({
              method: "post",
              url: `${url}/updateContingencies`,
              data: data
            })
              .then(
                response => {
                  console.log(response.data);
                },
                error => {
                  console.log("the Error", error);
                }
              )
              .catch(e => {
                console.log(e);
              });
          }
          if (!info.length) {
            console.log("All Posted");
            this.close();
            this.getInitialData();
          }
        }
      } else {
        this.data.push(this.editedItem);
      }
    }
  }
};
</script>

<style scoped></style>

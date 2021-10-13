<template>
  <v-row justify="center">
    <v-dialog v-model="vatDialog" persistent max-width="900">
      <v-card>
        <v-data-table
          :headers="vatHeaders"
          :items="vatData"
          sort-by="calories"
          class="elevation-1"
          multi-sort
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>VAT</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
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
                            v-model="editedItem.discipline"
                            label="Discipline"
                            readonly
                            hint="readonly"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.vatDate"
                            label="Vat Date (Expected)"
                            hint="YYYY-MM-DD"
                            placeholder="YYYY-MM-DD"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.vatPeriod"
                            label="Vat Period"
                            hint="YYYYMM"
                            placeholder="YYYYMM"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="editedItem.amount"
                            label="Amount"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.processed"
                            :label="
                              !editedItem.processed
                                ? 'mark as correct'
                                : 'leave if unknown'
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
            <!-- <v-icon small @click="deleteItem(item)" color="red">
              mdi-delete
            </v-icon> -->
          </template>
          <!-- <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
              Reset
            </v-btn>
          </template> -->
        </v-data-table>
      </v-card>
      <v-btn @click="closeVatForm">Close</v-btn>
    </v-dialog>
  </v-row>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  props: {
    vatDialog: Boolean
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    itemsPerPage: 10,
    vatHeaders: [
      {
        text: "Discipline",
        align: "start",
        sortable: true,
        value: "discipline",
        width: 150
      },
      {
        text: "Amount",
        align: "end",
        sortable: true,
        value: "amountStr",
        width: 150
      },
      {
        text: "Date",
        align: "center",
        sortable: true,
        value: "vatDate",
        width: 150
      },
      {
        text: "Period",
        align: "center",
        sortable: true,
        value: "vatPeriod",
        width: 150
      },
      {
        text: "Processed",
        align: "center",
        sortable: true,
        value: "processed",
        width: 150
      },
      { text: "Actions", value: "actions", sortable: false, width: 100 }
    ],
    vatData: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      development: 0,
      discipline: "",
      amount: 0,
      processed: false,
      vatDate: "",
      vatPeriod: ""
    },
    defaultItem: {
      id: 0,
      development: 0,
      discipline: "",
      amount: 0,
      processed: false,
      vatDate: "",
      vatPeriod: ""
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
    }
  },

  mounted() {
    this.getInitialData();
  },

  methods: {
    closeVatForm() {
      this.$emit("closeVATForm", false);
    },
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getVATInfo`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.vatData = response.data[2];
            let vatCheck = [];
            this.vatData.forEach(el => {
              el.vatDate = dayjs(el.vatDate).format("YYYY-MM-DD");
              if (el.processed === 1) {
                el.processed = true;
              } else {
                el.processed = false;
              }
              el.amountStr = this.convertToString(el.amount);
              let insert = {
                discipline: el.discipline,
                vatPeriod: el.vatPeriod,
                vatDate: el.vatDate
              };
              vatCheck.push(insert);
            });
            console.log(vatCheck);
            let id;
            vatCheck.forEach(el => {
              let filteredData = this.vatData.filter(el2 => {
                return (
                  el.discipline === el2.discipline &&
                  el.vatPeriod === el2.vatPeriod
                );
              });
              if (filteredData.length > 1) {
                console.log(filteredData);
                let deleteData = filteredData.filter(el3 => {
                  return el3.processed === false;
                });
                id = deleteData[0].id;
                console.log(deleteData);
                this.deleteDuplicate(id);
                this.vatData = this.vatData.filter(el4 => {
                  return el4.id !== id;
                });
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
    async deleteDuplicate(id) {
      let data = {
        id: id
      };
      await axios({
        method: "post",
        url: `${url}/deleteDuplicate`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            // this.getInitialData()
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
      this.editedIndex = this.vatData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.vatData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.vatData.splice(this.editedIndex, 1);
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
        console.log("Edited Item", this.editedItem);

        if (new Date(this.editedItem.vatDate) != "Invalid Date") {
          // this.editedItem.processed = true
          Object.assign(this.vatData[this.editedIndex], this.editedItem);
          await axios({
            method: "post",
            url: `${url}/updateVATInfo`,
            data: this.editedItem
          })
            .then(
              response => {
                console.log(response.data);
                this.getInitialData();
              },
              error => {
                console.log(error);
              }
            )
            .catch(e => {
              console.log(e);
            });
          this.close();
        } else {
          console.log("Invalid Date");
        }
      } else {
        this.vatData.push(this.editedItem);
      }
      //   this.close();
    }
  }
};
</script>

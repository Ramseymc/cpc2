<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Allocate to Investors</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
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
                <v-card max-width="800">
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            v-model="dashboardDateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.dashboardDate"
                                label="Dashboard Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="cleardashboardDate"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="dashboardDateChange"
                              v-model="dashboardDate"
                              @input="dashboardDateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-autocomplete
                            v-model="editedItem.vatOrSales"
                            :items="items"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Category"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            type="number"
                            v-model="editedItem.percentageTransferred"
                            label="Percentage to Investors"
                            append-icon="mdi-percent"
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
            <v-icon small @click="deleteItem(item)" color="red">
              mdi-delete
            </v-icon>
          </template>
          <!-- <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
              Reset
            </v-btn>
          </template> -->
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
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "PercentageInvestors",
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
      snackbarMessage: "",
      snackbar: false,
      dialog: false,
      dialogDelete: false,
      items: ["Sales", "VAT"],
      headers: [
        {
          text: "Dashboard Date",
          align: "start",
          sortable: false,
          value: "dashboardDate"
        },
        { text: "Category", value: "vatOrSales" },
        { text: "Percentage", value: "percentageTransferred" },
        // { text: 'Carbs (g)', value: 'carbs' },
        // { text: 'Protein (g)', value: 'protein' },
        { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        development: 0,
        dashboardDate: "",
        Category: "",
        percentageTransferred: 0
      },
      defaultItem: {
        id: 0,
        development: 0,
        dashboardDate: "",
        Category: "",
        percentageTransferred: 0
      },
      dashboardDate: new Date().toISOString().substr(0, 10),
      dashboardDateMenu: false
    };
  },
  mounted() {
    this.getInitialData();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    // dialog(val) {
    //   val || this.close();
    // },
    dialog(val) {
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.dashboardDate !== ""
      ) {
        this.dashboardDate = new Date(this.editedItem.dashboardDate)
          .toISOString()
          .substr(0, 10);
      }
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    // this.initialize()
  },
  methods: {
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getPercentages`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.desserts = response.data;
            this.desserts.forEach(el => {
              // el.dashboardDate = dayjs(el.dashboardDate).format("YYYY-MM-DD")
              if (el.dashboardDate !== null) {
                el.dashboardDate = dayjs(el.dashboardDate).format("YYYY-MM-DD");
              } else {
                el.dashboardDate = "";
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

    async deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      await axios({
        method: "post",
        url: `${url}/deletePercentages`,
        data: this.editedItem
      })
        .then(
          response => {
            console.log(response.data);
            this.closeDelete();
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
      this.editedItem.development = this.$store.state.development.id;
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
        await axios({
          method: "post",
          url: `${url}/editPercentages`,
          data: this.editedItem
        })
          .then(
            response => {
              console.log(response.data);
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      } else {
        this.desserts.push(this.editedItem);
        await axios({
          method: "post",
          url: `${url}/insertPercentages`,
          data: this.editedItem
        })
          .then(
            response => {
              console.log(response.data);
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
    cleardashboardDate() {
      this.editedItem.dashboardDate = "";
      this.dashboardDate = new Date().toISOString().substr(0, 10);
    },
    dashboardDateChange() {
      this.editedItem.dashboardDate = this.dashboardDate;
    }
  }
};
</script>

<style scoped></style>

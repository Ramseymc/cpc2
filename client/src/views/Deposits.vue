<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col cols="10" offset="1">
        <h1>Deposits</h1>
      </v-col>
      <v-col cols="10" offset="1">
        <v-card class="mx-auto" max-width="800" tile>
          <v-col cols="10" offset="1">
            <v-autocomplete
              v-model="value"
              :items="items"
              item-text="supplierName"
              dense
              filled
              label="Supplier"
              @change="getDeposits"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
        </v-card>
      </v-col>

      <v-col class="mb-4" cols="10" offset="1">
        <v-card class="mx-auto" max-width="90%" tile v-if="value">
          <v-list>
            <br />
            <v-list-item-group color="primary">
              <v-toolbar color="#0F0F0F" dark>
                <v-spacer></v-spacer>
                <v-toolbar-title>Deposits</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="addDeposit" v-if="!deposits.length">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list-item v-for="(item, i) in deposits" :key="i">
                <v-list-item-content>
                  <div
                    style="display: flex; justify-content: space-evenly; margin-right: 20px;"
                  >
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="'Cert No: ' + item.certificateNumber"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="'Date: ' + item.dateDepositProcessed"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="'Deposit: ' + item.depositPaidStr"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="'Recovered: ' + item.depositRecoveredStr"
                    ></v-list-item-title>

                    <v-list-item-title
                      style="text-align: center;"
                      v-text="'Balance: ' + item.depositRemainingStr"
                    ></v-list-item-title>
                  </div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn :id="item.id" text @click="editItem">
                    <v-icon color="#0F0F0F">mdi-file-edit</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Supplier"
                    v-model="supplierName"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <div
                    style="display: flex; flex-direction: column; width: 60%;"
                  >
                    <v-label><small>Deposit</small></v-label>
                    <currency-input
                      style="margin-top: 10px;"
                      v-model="valueInput"
                      label="Deposit"
                      currency="ZAR"
                      locale="za"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="saveDeposit">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top>
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
export default {
  name: "Deposits",
  metaInfo: {
    title: "Deposits",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Deposits here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      value: null,
      items: [],
      deposits: [],
      dialog: false,
      supplierId: 0,
      supplierName: "",
      valueInput: 0,
      snackbar: false,
      snackbarMessage: ""
    };
  },
  mounted() {
    this.getSuppliers();
  },
  methods: {
    async getSuppliers() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/suppliers`
      })
        .then(
          response => {
            // console.log(response.data)
            this.items = response.data;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async getDeposits() {
      let newData = this.items.filter(el => {
        return el.supplierName === this.value;
      });
      let data = {
        supplier: newData[0].id,
        development: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/depositHistory`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.deposits = response.data;
            this.deposits.forEach(el => {
              el.dateDepositProcessed = el.dateDepositProcessed.substring(
                0,
                10
              );
              el.depositPaidStr = this.convertToString(el.depositPaid);
              el.depositRecoveredStr = this.convertToString(
                el.depositRecovered
              );
              el.depositRemainingStr = this.convertToString(
                el.depositRemaining
              );
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
    addDeposit() {
      let newData = this.items.filter(el => {
        return el.supplierName === this.value;
      });
      // console.log(newData);
      this.supplierId = newData[0].id;
      this.supplierName = newData[0].supplierName;
      this.dialog = true;
    },
    async saveDeposit() {
      if (this.valueInput > 0) {
        let data = {
          supplier: this.supplierId,
          development: this.$store.state.development.id,
          deposit: this.valueInput
        };
        console.log(data);
        await axios({
          method: "post",
          url: `${url}/addDeposit`,
          data: data
        })
          .then(
            response => {
              console.log(response.data);
              if (response.data.affectedRows === 1) {
                this.snackbarMessage = "Successfully posted!!";
                this.snackbar = true;
                this.getDeposits();
              } else {
                this.snackbarMessage =
                  "There was a problem, please try again later!";
                this.snackbar = true;
              }
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });

        this.dialog = false;

        this.valueInput = 0;
      }
    },
    editItem() {
      this.snackbarMessage = "Functionality coming Soon!!!";
      this.snackbar = true;
    }
  }
};
</script>

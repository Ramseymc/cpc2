<template>
  <div>
    <v-container>
      <v-row class="text-center" max-width="110%">
        <v-col cols="10" offset="1">
          <h3 v-if="suppliersInApp.length">Suppliers in App</h3>
        </v-col>
        <br />
        <v-col cols="8" offset="2">
          <v-card color="#0F0F0F" v-if="suppliersInApp.length">
            <v-toolbar color="#0F0F0F" height="85" dark>
              <v-spacer></v-spacer>
              <span style="color: white"
                >{{ suppliersInApp.length }} Suppliers in App</span
              >
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchApp"
                color="white"
                label="Search"
                prepend-icon="mdi-magnify"
                clearable
              ></v-text-field>
            </v-toolbar>
            <v-list two-line>
              <template v-for="item in suppliersInAppFiltered">
                <v-list-item :key="item.id" class="inApp">
                  <v-list-item-content color="red">
                    <div style="display: flex;">
                      <v-list-item-title
                        class="text-left"
                        v-text="item.supplierName"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        class="text-left"
                        v-text="'Vat Vendor: ' + item.vatVendor"
                      ></v-list-item-subtitle>
                      <v-list-item-subtitle
                        class="text-left"
                        v-text="'Terms: ' + item.pmtTerms"
                      ></v-list-item-subtitle>
                    </div>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      :id="item.id"
                      @click="editSupplierInApp"
                      color="black"
                      >mdi-pencil</v-icon
                    >
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="text-center" max-width="110%">
        <v-col cols="10" offset="1">
          <h3 v-if="items.length">Suppliers - XERO</h3>
        </v-col>
        <v-col cols="8" offset="2">
          <v-card color="#0F0F0F" v-if="items.length">
            <v-toolbar color="#0F0F0F" height="85" dark>
              <v-icon class="engine"></v-icon>
              <v-spacer></v-spacer>
              <span style="color: white"
                >{{ items.length }} Suppliers from Xero</span
              >
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                color="white"
                label="Search"
                prepend-icon="mdi-magnify"
                clearable
              ></v-text-field>
            </v-toolbar>
            <v-list two-line>
              <template v-for="(item, index) in suppliersFiltered">
                <v-list-item :key="index" class="inApp">
                  <v-list-item-content color="red">
                    <v-list-item-title
                      v-if="item.isSupplier"
                      class="text-left"
                      v-text="item.name"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="color: red;"
                      v-else
                      class="text-left"
                      v-text="item.name"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <div>
                      <v-btn :id="index" text @click="editSupplier($event)"
                        ><v-icon color="black"
                          >mdi-file-document-edit</v-icon
                        ></v-btn
                      >
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="800px">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h5>Add</h5>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Supplier ID"
                      v-model="supplierToAdd.contactID"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="VAT No:"
                      v-model="supplierToAdd.taxNumber"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="First Name"
                      v-model="supplierToAdd.firstName"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Last Name"
                      v-model="supplierToAdd.lastName"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Supplier Name"
                      v-model="supplierToAdd.name"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Email*"
                      required
                      v-model="supplierToAdd.emailAddress"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-textarea
                      name="input-7-1"
                      label="Street Address"
                      style="font-size: 80%;"
                      :value="supplierToAdd.streetAddress"
                      rows="8"
                      filled
                      readonly
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-textarea
                      name="input-7-1"
                      label="Postal Address"
                      style="font-size: 80%;"
                      :value="supplierToAdd.postalAddress"
                      rows="8"
                      filled
                      readonly
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="supplierToAdd.phones">
                    <v-text-field
                      label="Area Code"
                      style="font-size: 80%;"
                      v-model="supplierToAdd.phones[1].phoneAreaCode"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="supplierToAdd.phones" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      :label="supplierToAdd.phones[1].phoneType"
                      v-model="supplierToAdd.phones[1].phoneNumber"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="supplierToAdd.phones">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Area Code"
                      v-model="supplierToAdd.phones[3].phoneAreaCode"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="supplierToAdd.phones" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      :label="supplierToAdd.phones[3].phoneType"
                      v-model="supplierToAdd.phones[3].phoneNumber"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="#0F0F0F" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn color="#0F0F0F" text @click="addSupplier">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="dialog1" persistent max-width="850px">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h6>Edit</h6>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-checkbox
                      v-model="supplierToEdit.vatVendor"
                      label="Vat Vendor"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="VAT No:"
                      v-model="supplierToEdit.taxNumber"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="First Name"
                      v-model="supplierToEdit.first_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Last Name"
                      v-model="supplierToEdit.last_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Supplier Name"
                      v-model="supplierToEdit.supplierName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      style="font-size: 80%;"
                      label="Email*"
                      required
                      v-model="supplierToEdit.emailAddress"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-textarea
                      name="input-7-1"
                      label="Street Address"
                      style="font-size: 80%;"
                      v-model="supplierToEdit.street_address"
                      rows="4"
                      filled
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-textarea
                      name="input-7-1"
                      label="Postal Address"
                      style="font-size: 80%;"
                      v-model="supplierToEdit.postal_address"
                      rows="4"
                      filled
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <small>South African Mobiles</small>
                    <VuePhoneNumberInput
                      ref="mobile"
                      clearable
                      v-model="supplierToEdit.mobile_number"
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <small>Landline</small>
                    <VuePhoneNumberInput
                      ref="mobile"
                      clearable
                      v-model="supplierToEdit.default_number"
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="12" md="6" sm="6">
                    <v-autocomplete
                      v-model="termsChosen"
                      :items="terms"
                      item-text="terms"
                      outlined
                      dense
                      label="Terms"
                      @change="changeTerms"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      label="Retention"
                      v-model="supplierToEdit.retention"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="#0F0F0F" text @click="dialog1 = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="#0F0F0F" text @click="editInApp">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-btn v-if="consentUrl"
        ><a class="xeroBtn" :href="consentUrl">Xero Login</a></v-btn
      >
    </v-container>

    <v-snackbar v-model="snackbar" bottom top>
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "Suppliers",
  metaInfo: {
    title: "Suppliers",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Suppliers here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  // metaInfo: {
  //   title: "CPC",
  //   titleTemplate: "%s - Suppliers!",
  //   charset: "UTF-8",
  //   htmlAttrs: {
  //     lang: "en",
  //     amp: true
  //   }
  // },
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      consentUrl: "",
      src: "",

      snackbarMessage: "",
      snackbar: false,

      errorMessage: "",

      items: [],
      suppliers: [],
      suppliersInApp: [],
      selected: null,
      search: "",
      searchApp: "",

      dialog: false,
      dialog1: false,
      supplierToAdd: {},
      supplierToEdit: {},
      mobile: "",
      mobileResults: {},
      termsChosen: "",
      terms: [
        { termNumber: 1, terms: "30 from Statement" },
        { termNumber: 2, terms: "14 from Invoice" },
        { termNumber: 3, terms: "COD" },
        { termNumber: 4, terms: "Weekly" }
      ]
    };
  },
  async mounted() {
    this.checkToken();
    this.consentUrl = "";
    await this.getXeroCredentials();
  },
  computed: {
    suppliersFiltered() {
      if (this.search === "") {
        return this.items;
      } else {
        return this.items.filter(supplier => {
          return (
            !this.search ||
            supplier.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      }
    },
    suppliersInAppFiltered() {
      if (this.searchApp === "") {
        return this.suppliersInApp;
      } else {
        return this.suppliersInApp.filter(supplier => {
          return (
            !this.searchApp ||
            supplier.supplierName
              .toLowerCase()
              .indexOf(this.searchApp.toLowerCase()) > -1
          );
        });
      }
    }
  },
  methods: {
    mobileStuff() {},
    changeTerms() {
      this.supplierToEdit.terms = this.terms.filter(el => {
        return el.terms === this.termsChosen;
      })[0].termNumber;
    },
    editSupplierInApp(event) {
      this.supplierToEdit = this.suppliersInApp.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      })[0];

      if (this.supplierToEdit.vatVendor == 1) {
        this.supplierToEdit.vatVendor = true;
      } else {
        this.supplierToEdit.vatVendor = false;
      }
      if (this.supplierToEdit["terms"] === undefined) {
        this.supplierToEdit.terms = 1;
      }
      let testingTerms = this.terms.filter(el => {
        return el.termNumber === this.supplierToEdit.terms;
      });
      this.termsChosen = testingTerms[0].terms;
      this.dialog1 = true;
    },
    async editInApp() {
      console.log(this.supplierToEdit);
      let data = {
        data: this.supplierToEdit
      };
      await axios({
        method: "post",
        url: `${url}/editSupplier`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            // if (response.data.err) {
            //   // this.getConnected();
            // } else {
            //   this.getSuppliers();
            // }
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
      this.dialog1 = false;
    },
    async getXeroCredentials() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/getCredentials`
      })
        .then(
          response => {
            if (response.data.err) {
              this.getConnected();
            } else {
              this.getSuppliers();
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

    onLoad() {
      this.src = this.consentUrl;
    },
    async getSuppliers() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/contacts`
      })
        .then(
          response => {
            if (response.data.err) {
              this.getConnected();
            } else {
              let suppliers = response.data.suppliers;
              suppliers.forEach(el => {
                if (el.isSupplier === false && el.isCustomer === false) {
                  el.color = "red";
                }
              });
              this.suppliersInApp = response.data.mysqlResult;
              this.suppliersInApp.forEach(el => {
                el.pmtTerms = this.terms.filter(el2 => {
                  return el2.termNumber === el.terms;
                })[0].terms;
                if (el.vatVendor === 1) {
                  el.vatVendor = true;
                } else {
                  el.vatVendor = false;
                }
                let contactID = el.contactID;
                suppliers = suppliers.filter(el2 => {
                  return el2.contactID !== contactID;
                });
              });
              this.items = suppliers;
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
    async getConnected() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/connect`
      })
        .then(
          response => {
            this.consentUrl = response.data.consentUrl;
            this.onLoad();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async addSupplier() {
      let default_number = `${this.supplierToAdd.phones[1].phoneAreaCode}-${this.supplierToAdd.phones[1].phoneNumber}`;
      let mobile_number = `${this.supplierToAdd.phones[3].phoneAreaCode}-${this.supplierToAdd.phones[3].phoneNumber}`;
      let data = [];
      let postData = [];
      data.push(this.supplierToAdd.contactID);
      data.push(this.supplierToAdd.taxNumber);
      data.push(this.supplierToAdd.name);
      data.push(this.supplierToAdd.firstName);
      data.push(this.supplierToAdd.lastName);
      data.push(this.supplierToAdd.emailAddress);
      data.push(default_number);
      data.push(mobile_number);
      data.push(this.supplierToAdd.streetAddress);
      data.push(this.supplierToAdd.postalAddress);
      postData.push(data);
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/addSupplier`,
        data: postData
      })
        .then(
          response => {
            if (response.data.affectedRows === 1) {
              let appData = {
                supplierName: this.supplierToAdd.name
              };
              this.suppliersInApp.push(appData);
              this.suppliersInApp.sort((a, b) =>
                a.supplierName > b.supplierName ? 1 : -1
              );
            }
            this.items = this.items.filter(el => {
              return el.contactID !== this.supplierToAdd.contactID;
            });
            this.supplierToAdd = [];
            this.dialog = false;
          },
          error => {
            console.log(error);
            this.snackbarMessage = "There was a problem";
            this.snackbar = true;
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async editSupplier(event) {
      let supplier = this.suppliersFiltered.filter((el, index) => {
        return index === parseInt(event.currentTarget.id);
      });
      let contactID = supplier[0].contactID;
      let data = {
        contactID: contactID
      };
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/editSupplier`,
        data: data
      })
        .then(
          response => {
            this.supplierToAdd = response.data.contacts[0];
            let postalAddressArray = [];
            let streetAddressArray = [];
            let postalAddress = this.supplierToAdd.addresses[0];
            let streetAddress = this.supplierToAdd.addresses[1];

            for (var key of Object.keys(postalAddress)) {
              postalAddressArray.push(key + " : " + postalAddress[key]);
            }
            this.supplierToAdd.postalAddress = postalAddressArray.join("\n");

            for (var key1 of Object.keys(streetAddress)) {
              streetAddressArray.push(key1 + " : " + streetAddress[key1]);
            }
            this.supplierToAdd.streetAddress = streetAddressArray.join("\n");

            this.dialog = true;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    deleteSupplier(event) {
      console.log(event.currentTarget.id);
    }
  }
};
</script>

<style scoped>
.xeroBtn {
  text-decoration: none;
  color: blue;
  font-weight: bold;
}
.v-icon {
  height: 50px;
  width: 50px;
}
.engine {
  background-image: url("../assets/xero.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.inApp:nth-child(even) {
  background-color: antiquewhite;
}
.inApp:nth-child(odd) {
  background-color: azure;
}
</style>

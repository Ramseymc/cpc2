<template>
  <div class="about">
    <!-- <br /><br /> -->
    <v-col class="mb-4">
      <h2>Payment Certificates</h2>
    </v-col>
    <v-btn v-if="consentUrl"
      ><a class="xeroBtn" @click="redirect" :href="consentUrl"
        >Xero Login</a
      ></v-btn
    >
    <!-- <v-row> -->
    <v-col cols="8" offset="2">
      <div style="display: flex;">
        <v-checkbox
          v-model="showUnIssued"
          label="show Unissued"
          color="red darken-3"
          hide-details
        ></v-checkbox>
        <v-spacer></v-spacer>
        <v-checkbox
          v-model="showIssued"
          label="show Issued"
          color="black"
          hide-details
        ></v-checkbox>
      </div>
    </v-col>

    <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->
    <v-col class="mb-4" cols="10" offset="1" v-if="showUnIssued">
      <v-data-table
        :headers="headers"
        :items="valuationsToDateNotIssued"
        sort-by="calories"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title style="color: red;"
              >VALUATIONS TO CERTIFY</v-toolbar-title
            >

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field> -->
            <label>Total: {{ totalUnissued }}</label>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            :id="item.id"
            class="mr-2"
            color="red"
            @click="viewCertsUnissued"
          >
            mdi-certificate
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <v-col class="mb-4" cols="10" offset="1" v-if="showIssued">
      <v-data-table
        :headers="headers2"
        :items="valuationsToDateIssued"
        sort-by="calories"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>CERIFICATES PROCESSED</v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer></v-spacer>
            <!-- <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field> -->
            <label>Total: {{ totalIssued }}</label>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            :id="item.id"
            class="mr-2"
            color="red"
            @click="viewCertsIssued"
          >
            mdi-certificate
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->

    <v-col cols="10" offset="1">
      <v-card class="mx-auto" max-width="1050" tile>
        <v-col cols="12" offset="0">
          <v-autocomplete
            v-model="value"
            :items="items"
            item-text="supplierName"
            dense
            filled
            label="Supplier"
            @change="getPaymentCerticicates"
            color="#0F0F0F"
          ></v-autocomplete>
        </v-col>
      </v-card>
    </v-col>

    <v-col cols="10" offset="1">
      <v-card class="mx-auto" max-width="100%" tile v-if="certificates.length">
        <v-toolbar color="#0F0F0F" height="85" dark>
          <v-toolbar-title>Certificates Issued </v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-spacer></v-spacer> -->

          <v-text-field
            v-model="searchCerts"
            color="white"
            placeholder="Search cert number"
            prepend-icon="mdi-magnify"
            clearable
          ></v-text-field>
          <v-spacer></v-spacer>
          <span>Sum: {{ certificatesValue }}</span>
          <v-btn text @click="sendStatementAll">
            <v-icon color="green">mdi-email-multiple-outline</v-icon>
            <small>All</small>
          </v-btn>
          <v-btn text @click="sendStatementUnsent">
            <v-icon color="amber">mdi-email-multiple-outline</v-icon>
            <small>unsent</small>
          </v-btn>
        </v-toolbar>
        <v-list two-line>
          <v-list-item-group multiple>
            <!-- <template v-for="item in certificates"> -->
            <template v-for="item in certificatesFiltered">
              <v-list-item
                :key="item.id"
                style="border-bottom: 1px solid black;"
                :id="item.id"
              >
                <template>
                  <v-list-item-content>
                    <div style="display: flex;">
                      <v-list-item-title
                        v-text="'Unit: ' + item.unitName"
                      ></v-list-item-title>
                    </div>
                    <div style="display: flex;">
                      <v-list-item-title
                        v-text="item.certificateNumber"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="'Date Issued:' + item.certificateDate"
                      >
                      </v-list-item-subtitle>
                      <v-list-item-subtitle
                        v-text="'App Inv No::' + item.invoiceNumber"
                      >
                      </v-list-item-subtitle>
                      <div style="width: 40%;">
                        <v-list-item-subtitle
                          style="text-align: right;"
                          v-text="'Value:'"
                        >
                        </v-list-item-subtitle>
                      </div>
                      <div style="width: 40%;">
                        <v-list-item-subtitle
                          style="text-align: right;"
                          v-text="item.netCurrentCertificateValueStr"
                        >
                        </v-list-item-subtitle>
                      </div>
                    </div>
                    <div style="display: flex;">
                      <v-list-item-subtitle
                        style=" color: red;"
                        v-text="item.payStatus"
                      >
                      </v-list-item-subtitle>
                      <v-list-item-subtitle> </v-list-item-subtitle>
                      <v-list-item-subtitle
                        v-text="'Invoice No: ' + item.invNumber"
                      >
                      </v-list-item-subtitle>
                      <div style="width: 40%;">
                        <v-list-item-subtitle
                          v-text="'Paid:'"
                          style="text-align: right;"
                        >
                        </v-list-item-subtitle>
                      </div>
                      <div style="width: 40%;">
                        <v-list-item-subtitle
                          v-text="item.amtPaidStr"
                          style="text-align: right;"
                        >
                        </v-list-item-subtitle>
                      </div>
                    </div>
                  </v-list-item-content>

                  <v-list-item-action>
                    <div style="display: flex;">
                      <v-spacer></v-spacer>
                      <v-btn
                        v-tooltip.left="'Inv No:'"
                        :id="item.id"
                        text
                        @click="processInvNumber($event)"
                      >
                        <v-icon color="blue">mdi-clipboard-edit</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>

                      <!-- <v-btn
                        :id="item.id"
                        text
                        v-tooltip.top="{
                          content: 'Certificate',
                          class: 'tooltip-custom tooltip-other-custom',
                        }"
                      >
                        <a
                          style="text-decoration: none;"
                          :href="item.hrefCert"
                          download
                          target="_blank"
                          ><v-icon color="red">mdi-file-pdf-box</v-icon></a
                        >
                      </v-btn> -->
                      <v-btn :id="item.id" icon @click="getPDF($event)"
                        ><v-icon color="red">mdi-file-pdf-box</v-icon></v-btn
                      >
                      <v-btn :id="item.id" text @click="sendStatement($event)">
                        <v-icon v-if="item.sentToSupplier" color="purple"
                          >mdi-email-check</v-icon
                        >
                        <v-icon v-else color="brown">mdi-email-send</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />

    <v-col cols="10" offset="1" v-if="sumof > 0">
      <span v-if="certificates.length"
        >Last Certificate Number:
        {{ certificates[certificates.length - 1].certificateNumber }} </span
      ><br />
      <span>New Certificate Number: {{ certNumber }} </span><br />
      <span>Contract Price: R{{ contractPrice }} </span><br />
      <span>Before Retention: R{{ sumof.toFixed(2) }}</span
      ><br />
      <span style="color: brown;"
        >After Retention: R{{ sumofAfterRetention.toFixed(2) }}</span
      ><br />
      <v-btn
        @click="dialog = true"
        color="#0F0F0F"
        style="font-weight:bold; margin-top: 5px;"
        dark
        >Process Certificate</v-btn
      >
    </v-col>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
          <v-card-subtitle class="headline" style="margin-top: 5px;">
            Process Payment Certificate
          </v-card-subtitle>
          <v-card-subtitle class="headline">
            Are you sure about this?
          </v-card-subtitle>
          <v-card-text>
            <span>Certificate Number: {{ certNumber }} </span><br />
            <span>Contract Price: R{{ contractPrice }} </span><br />
            <span>Before Retention: R{{ sumof.toFixed(2) }}</span
            ><br />
            <span style="color: brown;"
              >After Retention: R{{ sumofAfterRetention.toFixed(2) }}</span
            ><br />
            <br />
            <v-btn color="transparent" @click="adjustCertificateValue">
              {{ adjustCertificate ? "Cancel" : "Edit" }}
              <v-icon v-if="!adjustCertificate" color="green"
                >mdi-content-save-edit</v-icon
              ><v-icon v-else color="red">mdi-cancel</v-icon></v-btn
            ><br /><br />
            <vue-numeric-input
              v-if="adjustCertificate"
              v-model="reduceValue"
              :min="-100"
              :max="100"
              :step="5"
            ></vue-numeric-input
            ><br /><br />
          </v-card-text>
          <v-card-actions>
            <v-btn color="#0F0F0F" text @click="cancelProcessing">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#0F0F0F" text @click="processCertificate">
              Process
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog2" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">
            Insert Supplier Invoice Number
          </v-card-title>
          <v-card-text>
            <masked-input
              v-model="invoiceDate"
              mask="1111/11/11"
              placeholder="yyyy/mm/dd"
              style="width: 100%; border: 1px solid black;"
            />
            <v-text-field
              ref="invoiceField"
              v-model="invoiceNumber"
              label="Supplier Invoice Number"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#0F0F0F" text @click="closeDialog2">
              No
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="#0F0F0F"
              text
              v-if="invoiceNumber !== null"
              @click="updateInvoiceNumber"
            >
              Yes
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

    <v-col cols="10" offset="1">
      <v-card class="mx-auto" max-width="100%" v-if="progress.length">
        <v-toolbar color="#0F0F0F" height="85" dark>
          <v-toolbar-title>Progress</v-toolbar-title>
          <v-spacer></v-spacer>
          <span>{{ progressFiltered.length }} items</span>
          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            color="white"
            placeholder="Search unit or fix or % complete"
            prepend-icon="mdi-magnify"
            clearable
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-checkbox
            v-model="hideFullyIssued"
            hide-details
            class="shrink mr-2 mt-0"
            label="Hide fully Issued"
          ></v-checkbox>
          <!-- <v-checkbox
            v-if="produceCertificate && hideFullyIssued"
            v-model="produceCertificate"
            hide-details
            class="shrink mr-2 mt-0"
            :label="produceCertificateLabelTrue"
            @change="selectAllProgress"
          ></v-checkbox>
          <v-checkbox
            v-else-if="!produceCertificate && hideFullyIssued"
            v-model="produceCertificate"
            hide-details
            class="shrink mr-2 mt-0"
            :label="produceCertificateLabelFalse"
            @change="selectAllProgress"
          ></v-checkbox> -->
        </v-toolbar>

        <v-list style="margin-bottom: 50px;">
          <v-list-group
            v-for="(item, index) in progressFiltered"
            :key="index"
            v-model="item.active"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <div style="display: flex;">
                  <v-list-item-title
                    v-text="'Unit:' + item.unitName"
                  ></v-list-item-title>
                  <v-list-item-title
                    v-text="'Task:' + item.taskName"
                  ></v-list-item-title>
                  <v-list-item-title
                    v-text="'Fix:' + item.fix"
                  ></v-list-item-title>
                </div>
                <div style="display: flex;">
                  <v-list-item-subtitle
                    style="color: red;"
                    v-text="'Progress: ' + item.progress + ' %'"
                  >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    style="color: red;"
                    v-text="'Total Price: R' + item.price"
                  >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    style="color: red;"
                    v-text="'Valuation: R' + item.toDate"
                  >
                  </v-list-item-subtitle>
                </div>
                <div style="display: flex;">
                  <v-list-item-subtitle
                    style="color: blue;"
                    v-text="'% issued: ' + item.lastCertificateIssuedAt + ' %'"
                  >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    style="color: blue;"
                    v-text="'Certificate Issued: ' + item.certificateIssued"
                  >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    style="color: blue;"
                    v-text="'After Retention: R' + item.afterRetention"
                  >
                  </v-list-item-subtitle>
                </div>
              </v-list-item-content>
              <v-list-item-action
                v-if="
                  item.progress !== item.lastCertificateIssuedAt ||
                    item.progress === 0
                "
              >
                <div style="display: flex;">
                  <v-row align="center">
                    <!-- v-if="
                        unitChosenForCertificate === '' ||
                          item.unitName === unitChosenForCertificate
                      " -->

                    <v-checkbox
                      v-model="item.produceCertificate"
                      hide-details
                      class="shrink mr-2 mt-0"
                      @click.native.stop="progressSelected"
                    ></v-checkbox>
                  </v-row>
                  <v-spacer></v-spacer>
                </div>
              </v-list-item-action>
            </template>

            <v-list-item
              class="childList"
              v-for="child in item.items"
              :key="child.id"
            >
              <v-list-item-content>
                <v-list-item-subtitle
                  v-text="child.taskDescription"
                  style="color: brown;"
                >
                </v-list-item-subtitle>
                <div style="display: flex;">
                  <v-list-item-subtitle v-text="'Price: R' + child.price">
                  </v-list-item-subtitle>

                  <v-list-item-subtitle v-text="'Valued: R' + child.toDate">
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-text="'After Retention: R' + child.afterRetention"
                  >
                  </v-list-item-subtitle>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-col>
  </div>
</template>

<script>
import axios from "axios";
import MaskedInput from "vue-masked-input";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "paymentCertificates",
  metaInfo: {
    title: "Payment Certificates",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Process Payment Certificates here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  components: {
    // PDFViewer,
    PDFViewer: () => import("../components/PDFViewer"),
    MaskedInput
  },
  data() {
    return {
      showIssued: false,
      showUnIssued: true,
      totalIssued: "",
      totalUnissued: "",
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      invoiceDate: new Date().toISOString().substr(0, 10),

      unitChosenForCertificate: "", //UNIT CHOSEN SO ONLY ONE UNIT PER CERTIFICATE
      reduceValue: 0, //NUMERIC INPUT
      certificatesValue: "",
      adjustCertificate: false,
      adjustedBeforeRetention: 0,
      adjustedAfterRetention: 0,
      snackbar: false,
      snackbarMessage: "",
      dialog: false,
      dialog2: false,
      // invNumber: "",
      certificateId: null,
      invoiceNumber: null,
      items: [],
      contactID: "",
      supplierRetention: 0,
      value: null,
      certificates: [],
      previousCertificatesIssued: [],
      paymentsMadeForCerificates: [],
      pmtDetails: [],
      progress: [],
      produceCertificate: false,
      produceCertificateLabelTrue: "Deselect All",
      produceCertificateLabelFalse: "Select All",
      search: "",
      searchCerts: "",
      sumof: 0,
      sumofAfterRetention: 0,
      certNumber: "",
      certificateDetailsToPost: [],
      contractPrice: 0,
      previousCertificateValues: 0,
      hideFullyIssued: true,
      consentUrl: "",
      src: "",
      depositDetails: [],
      valuationsToDateNotIssued: [],
      valuationsToDateIssued: [],
      headers: [
        {
          text: "Supplier",
          align: "start",
          sortable: false,
          value: "supplierName",
          width: 250
        },
        {
          text: "Task",
          align: "start",
          sortable: false,
          value: "taskName",
          width: 250
        },
        { text: "Unit", value: "unitName", width: 120 },
        { text: "Value", value: "unIssuedStr", width: 120 },
        // { text: "Value", value: "unIssuedStr", width: 120 },
        { text: "View", value: "actions", sortable: false }
      ],
      headers2: [
        {
          text: "Supplier",
          align: "start",
          sortable: false,
          value: "supplierName",
          width: 200
        },
        {
          text: "Task",
          align: "start",
          sortable: false,
          value: "taskName",
          width: 150
        },
        { text: "Value", value: "issuedStr", width: 120 },
        { text: "Retained", value: "issuedRetainedStr", width: 120 },
        { text: "Nett", value: "netValueStr", width: 120 },
        { text: "Paid", value: "issuedPaidStr", width: 120 },
        { text: "View", value: "actions", sortable: false }
      ]
    };
  },
  computed: {
    certificatesFiltered() {
      if (this.searchCerts === "") {
        return this.certificates;
      } else {
        return this.certificates.filter(el => {
          return (
            !this.searchCerts ||
            el.certificateNumber
              .toLowerCase()
              .indexOf(this.searchCerts.toLowerCase()) > -1
          );
        });
      }
    },
    progressFiltered() {
      if (this.search === "") {
        if (this.hideFullyIssued) {
          return this.progress.filter(el => {
            return (
              el.lastCertificateIssuedAt !== 100 &&
              el.lastCertificateIssuedAt !== el.progress &&
              el.progress !== 0
            );
          });
        } else {
          return this.progress;
        }
      } else {
        return this.progress.filter(progress => {
          return (
            !this.search ||
            progress.unitName.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            progress.fix.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            (progress.progress
              .toString()
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) > -1 &&
              progress.lastCertificateIssuedAt !== 100 > -1 &&
              progress.lastCertificateIssuedAt !== progress.progress)
          );
        });
      }
    }
  },
  watch: {
    reduceValue: function() {
      if (this.reduceValue !== 0) {
        // this.adjustCertificatesViewOnly();
      } else {
        this.adjustedAfterRetention = 0;
        this.adjustedBeforeRetention = 0;
      }
    },
    certificatesFiltered: function() {
      let certificatesValue = this.certificatesFiltered.reduce((acc, pv) => {
        return acc + pv.netCurrentCertificateValue;
      }, 0);
      return (this.certificatesValue = this.convertToString(certificatesValue));
    }
  },
  async mounted() {
    this.checkToken();
    this.consentUrl = "";
    await this.getSuppliers();
    await this.getValuationsToDate();
    this.processNotifications();
  },
  methods: {
    getPDF(event) {
      let targetId = event.currentTarget.id;

      let itemToFetch = this.certificates.filter(el => {
        return el.id === parseInt(targetId);
      });
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].certificateNumber;

      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    },
    async sendStatement(event) {
      let targetId = event.currentTarget.id;

      let fileInfo = this.certificatesFiltered.filter(el => {
        return el.id === parseInt(targetId);
      });

      let data = {
        supplier: fileInfo[0].supplier,
        certificateNumber: fileInfo[0].certificateNumber
      };

      await axios({
        method: "post",
        url: `${url}/sendpaymentcertificate`,
        data: data
      })
        .then(
          response => {
            if (response.data.success) {
              this.snackbarMessage = "Mail sent successfully";
              this.snackbar = true;
              this.getPaymentCerticicates();
            } else {
              this.snackbarMessage =
                "There was a problem, Please try again later.";
              this.snackbar = true;
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
    async sendStatementUnsent() {
      let supplier = this.certificatesFiltered[0].supplier;
      let data = {
        supplier: supplier,
        allStatements: false
      };

      this.sendStatements(data);
    },
    async sendStatements(data) {
      await axios({
        method: "post",
        url: `${url}/sendpaymentcertificateBulk`,
        data: data
      })
        .then(
          response => {
            if (response.data.success) {
              this.snackbarMessage = "Mail sent successfully";
              this.snackbar = true;
              this.getPaymentCerticicates();
            } else {
              this.snackbarMessage =
                "There was a problem, Please try again later.";
              this.snackbar = true;
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
    async sendStatementAll() {
      let supplier = this.certificatesFiltered[0].supplier;
      let data = {
        supplier: supplier,
        allStatements: true
      };
      this.sendStatements(data);
    },
    cancelProcessing() {
      this.adjustCertificateValue();
      this.adjustedBeforeRetention = 0;
      this.adjustedAfterRetention = 0;
      this.dialog = false;
    },
    adjustCertificateValue() {
      this.adjustCertificate = !this.adjustCertificate;
      this.reduceValue = 0;
    },
    closeDialog2() {
      this.invoiceNumber = null;
      this.dialog2 = false;
    },
    processInvNumber(event) {
      let targetId = event.currentTarget.id;
      let invoiceFilter = this.certificatesFiltered.filter(el => {
        return el.id === parseInt(targetId);
      });
      this.invoiceNumber = invoiceFilter[0].invNumber;
      this.certificateId = targetId;
      this.dialog2 = true;
    },
    async updateInvoiceNumber() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      let certificateNumberArray = this.certificates.filter(el => {
        return el.id === parseInt(this.certificateId);
      });
      let certificateNumber = certificateNumberArray[0].certificateNumber;
      let data = {
        id: this.certificateId,
        invoiceNumber: this.invoiceNumber,
        certificateNumber: certificateNumber,
        invoiceDate: this.invoiceDate
      };

      await axios({
        method: "post",
        url: `${url}/updatePaymentCertificateWithInvoiceNumber`,
        data: data
      })
        .then(
          () => {
            this.dialog2 = false;
            this.invoiceNumber = "";
            this.certificateId = null;
            this.getPaymentCerticicates();
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async redirect() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      let data = {
        redirect: "PmtCertificates"
      };
      await axios({
        method: "post",
        url: `${url}/redirect`,
        data: data
      })
        .then(
          () => {},
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
    onLoad() {
      this.src = this.consentUrl;
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
    async processCertificate() {
      if (this.reduceValue != 0) {
        this.certificateDetailsToPost.forEach(el => {
          let newValue = 100 + this.reduceValue;
          el.progress = (el.progress * newValue) / 100;
          el.toDate = (el.price * el.progress) / 100;
          el.afterRetention = el.toDate - (el.toDate * el.retention) / 100;
        });
        this.adjustCertificateValue();
        this.dialog = false;
      }

      let data = {
        depositDetails: this.depositDetails,
        previousCertificates: this.certificates,
        certificateDetailsToPost: this.certificateDetailsToPost,
        certificateNumber: this.certNumber,
        totalValue: this.sumof,
        contractPrice: this.contractPrice,
        previousCertificateValues: this.previousCertificateValues,
        developmentId: this.$store.state.development.id,
        supplier: this.certificateDetailsToPost[0].supplier,
        sumofAfterRetention: this.sumofAfterRetention,
        retention: this.supplierRetention,
        unitName: this.certificateDetailsToPost[0].unitName,
        fix: this.certificateDetailsToPost[0].fix
      };

      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/processCertificate`,
        data: data
      })
        .then(
          response => {
            if (response.data) {
              this.$nextTick(() => {
                this.progress = [];
                this.selectAll = false;
                this.getPaymentCerticicates();
                this.getValuationsToDate();
              });
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
      this.sumof = 0;
      this.search = "";
      this.unitChosenForCertificate = "";
    },
    async progressSelected() {
      this.sumof = 0.0;
      this.progress.forEach(el => {
        if (!el.produceCertificate) {
          this.produceCertificate = false;
        }
      });
      let unitChosenForCertificate = this.progress.filter(el => {
        return el.produceCertificate === true;
      });
      if (unitChosenForCertificate.length) {
        this.unitChosenForCertificate = unitChosenForCertificate[0].unitName;
      } else {
        this.unitChosenForCertificate = "";
      }
      let sumofArray = this.progress.filter(el => {
        return el.produceCertificate;
      });
      let sumof = 0.0;
      let sumofAfterRetention = 0.0;

      sumofArray.forEach(el => {
        let sum = el.items.reduce((pv, el2) => {
          return pv + parseFloat(el2.toDate);
        }, 0.0);
        sumof = sumof + sum;
        let sumafterRetention = el.items.reduce((pv, el2) => {
          return pv + el2.toDate - (el2.toDate * el2.retention) / 100;
        }, 0.0);
        if (!isNaN(sumafterRetention)) {
          sumofAfterRetention = sumofAfterRetention + sumafterRetention;
        } else {
          sumofAfterRetention = sumof;
        }
      });

      this.sumofAfterRetention = sumofAfterRetention;
      this.sumof = sumof;
      if (this.certificates.length) {
        let oldCertNumber = this.certificates[
          this.certificates.length - 1
        ].certificateNumber.split("-");
        let CertNumberInc = (parseInt(oldCertNumber[2]) + 1).toString();
        CertNumberInc = CertNumberInc.split("");
        if (CertNumberInc.length === 1) {
          CertNumberInc.unshift("00");
        } else if (CertNumberInc.length === 2) {
          CertNumberInc.unshift("0");
        }
        CertNumberInc = CertNumberInc.join("");
        oldCertNumber.pop();
        oldCertNumber.push(CertNumberInc);
        oldCertNumber = oldCertNumber.join("-");
        this.certNumber = oldCertNumber;
      } else {
        try {
          let certNumber = `${sumofArray[0].taskName.substring(
            0,
            4
          )}-${this.value.substring(0, 4)}-001`;
          this.certNumber = certNumber;
        } catch (e) {
          this.certNumber = "";
        }
      }
      let certificateDetailsToPost = [];
      sumofArray.forEach(el => {
        el.items.forEach(el2 => {
          certificateDetailsToPost.push(el2);
        });
      });
      this.certificateDetailsToPost = certificateDetailsToPost;

      let data = {
        supplier: this.certificateDetailsToPost[0].supplier,
        development: this.$store.state.development.id
      };

      this.depositDetails = [];
      await axios({
        method: "post",
        url: `${url}/depositHistory`,
        data: data
      })
        .then(
          response => {
            this.depositDetails = response.data;
            if (this.depositDetails.length) {
              let oldCertNumber;
              if (this.certificates.length) {
                oldCertNumber = this.certificates[this.certificates.length - 1]
                  .certificateNumber;
              } else {
                oldCertNumber = null;
              }
              let newInsert = {
                oldCertNumber: oldCertNumber,
                newCertNumber: this.certNumber
              };

              this.depositDetails.push(newInsert);
            }
          },

          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    selectAllProgress() {
      if (this.produceCertificate) {
        this.progressFiltered.forEach(el => {
          el.produceCertificate = true;
        });

        this.progressSelected();
      } else {
        this.progressFiltered.forEach(el => {
          el.produceCertificate = false;
        });
        this.sumof = 0;
      }
    },
    async getSuppliers() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/suppliers`
      })
        .then(
          response => {
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
    async getValuationsToDate() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/getValuations`
      })
        .then(
          response => {
            response.data[1].forEach(el => {
              let filteredData = response.data[0].filter(el2 => {
                return (
                  el.unitNumber === el2.unitNumber &&
                  el.supplier === el2.supplier &&
                  el.taskName === el2.taskName
                );
              });
              el.unIssued = filteredData.reduce((prev, curr) => {
                return prev + parseFloat(curr.unIssuedPrice);
              }, 0);
              el.issued = filteredData.reduce((prev, curr) => {
                return prev + parseFloat(curr.issuedPrice);
              }, 0);
              el.issuedStr = this.convertToString(el.issued);
              el.unIssuedStr = this.convertToString(el.unIssued);

              // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
              el.unissuedRetained = filteredData.reduce((prev, curr) => {
                return prev + parseFloat(curr.unIssuedRetained);
              }, 0);

              el.issuedRetained = filteredData.reduce((prev, curr) => {
                return prev + parseFloat(curr.issuedRetained);
              }, 0);

              el.issuedPaid = filteredData.reduce((prev, curr) => {
                return prev + parseFloat(curr.paid);
              }, 0);

              el.unissuedRetainedStr = this.convertToString(
                el.unissuedRetained
              );
              el.issuedRetainedStr = this.convertToString(el.issuedRetained);
              el.issuedPaidStr = this.convertToString(el.issuedPaid);

              // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

              let supplier = this.items.filter(el2 => {
                return el2.id === el.supplier;
              });
              el.supplierName = supplier[0].supplierName;
            });
            this.valuationsToDateNotIssued = response.data[1].filter(el => {
              return el.unIssued > 0;
            });

            this.valuationsToDateIssued = response.data[1].filter(el => {
              return el.issued > 0;
            });

            this.valuationsToDateNotIssued.forEach((el, index) => {
              el.id = index;
            });
            this.valuationsToDateIssued.forEach((el, index) => {
              el.id = index;
            });
            this.totalIssued = this.convertToString(
              this.valuationsToDateIssued.reduce((prev, curr) => {
                return prev + curr.issued;
              }, 0)
            );
            this.totalUnissued = this.convertToString(
              this.valuationsToDateNotIssued.reduce((prev, curr) => {
                return prev + curr.unIssued;
              }, 0)
            );

            let filteredUnique = [];
            this.valuationsToDateIssued.forEach(el => {
              filteredUnique.push(el.supplierName);
            });
            filteredUnique = Array.from(new Set(filteredUnique));

            let finalArray = [];
            filteredUnique.forEach(el => {
              let refilteredData = this.valuationsToDateIssued.filter(el2 => {
                return el2.supplierName === el;
              });
              let insert = {
                supplier: refilteredData[0].supplier,
                supplierName: refilteredData[0].supplierName,
                taskName: refilteredData[0].taskName,
                issued: refilteredData.reduce((prev, curr) => {
                  return prev + curr.issued;
                }, 0),
                issuedRetained: refilteredData.reduce((prev, curr) => {
                  return prev + curr.issuedRetained;
                }, 0),
                issuedPaid: refilteredData.reduce((prev, curr) => {
                  return prev + curr.issuedPaid;
                }, 0)
              };
              finalArray.push(insert);
            });

            finalArray.forEach((el, index) => {
              el.id = index;
              el.issuedStr = this.convertToString(el.issued);
              el.issuedRetainedStr = this.convertToString(el.issuedRetained);
              el.issuedPaidStr = this.convertToString(el.issuedPaid);
              el.netValue = el.issued - el.issuedRetained;
              el.netValueStr = this.convertToString(el.netValue);
            });
            this.valuationsToDateIssued = finalArray;
            // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    viewCertsUnissued(event) {
      let filter = this.valuationsToDateNotIssued.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      this.value = filter[0].supplierName;
      this.getPaymentCerticicates();
      this.showIssued = false;
      this.showUnIssued = false;
    },
    viewCertsIssued(event) {
      let filter = this.valuationsToDateIssued.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      this.value = filter[0].supplierName;
      this.getPaymentCerticicates();
      this.showIssued = false;
      this.showUnIssued = false;
    },
    async getPaymentCerticicates() {
      let certCheck = this.items.filter(el => {
        return el.supplierName === this.value;
      });
      this.supplierRetention = certCheck[0].retention;
      this.contactID = certCheck[0].contactID;
      let data = {
        id: certCheck[0].id,
        development: this.$store.state.development.id
      };
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/certificates`,
        data: data
      })
        .then(
          response => {
            this.certificates = response.data[0];
            if (this.certificates.length) {
              this.hideFullyIssued = true;
            }

            this.certificates.forEach(el => {
              el.hrefCert = `${process.env.VUE_APP_BASEURL}/${el.certificateNumber}.pdf`;

              el.certificateDate = el.certificateDate.substring(0, 10);
              if (el.amtPaid === null) {
                el.amtPaid = 0;
                el.amtPaid = el.amtPaid.toFixed(2);
              }
              if (el.payStatus === null) {
                el.payStatus = "AWAITING INVOICE";
              }
            });

            this.certificates.forEach(el => {
              el.netCurrentCertificateValue =
                el.netCurrentCertificateValue -
                el.depositRecoveredThisStatement;
              el.netCurrentCertificateValueStr = this.convertToString(
                el.netCurrentCertificateValue
              );
              el.amtPaidStr = this.convertToString(el.amtPaid);
            });

            let groupingByUnitFix = [];
            response.data[1].forEach(el => {
              if (!el.vatVendor) {
                el.price = el.price / 1.15;
                el.toDate = el.toDate / 1.15;
              }
              let insertStr = `${el.unitName}-${el.taskName}-${el.fix}`;
              groupingByUnitFix.push(insertStr);
            });
            response.data[3].forEach(el => {
              let insertStr = `${el.unitName}-${el.taskName}-${el.fix}`;
              groupingByUnitFix.push(insertStr);
            });

            groupingByUnitFix = Array.from(new Set(groupingByUnitFix));

            this.progress = [];
            groupingByUnitFix.forEach(el => {
              let filter = el;

              let insert = {
                title: filter,
                items: []
              };
              filter = filter.split("-");

              if (filter[filter.length - 1] !== "Retention") {
                let items = response.data[1].filter(el => {
                  return (
                    el.unitName === filter[0] &&
                    el.taskName === filter[1] &&
                    el.fix === filter[2]
                  );
                });
                // update taskTypes set taskName = 'Floors ~ Paving' where taskName = 'Floors - Paving';
                // update taskTypes set taskName = 'Floors ~ Laminate' where taskName = 'Floors - Laminate';
                // update taskTypes set taskName = 'Superstructure ~ Labour' where taskName = 'Superstructure - Labour';
                // update taskTypes set taskName = 'Substructure ~ Materials' where taskName = 'Substructure - Materials';
                // update taskTypes set taskName = 'Superstructure ~ Materials' where taskName = 'Superstructure - Materials';

                items.forEach(el => {
                  el.afterRetention = (
                    el.toDate -
                    (el.toDate * el.retention) / 100
                  ).toFixed(2);
                });

                insert.items = items;

                insert.lastCertificateIssuedAt =
                  insert.items[0].lastCertificateIssuedAt;

                insert.unitName = insert.items[0].unitName;
                insert.taskName = insert.items[0].taskName;
                insert.fix = insert.items[0].fix;
                insert.price = insert.items
                  .reduce((pv, el) => {
                    return pv + el.price;
                  }, 0)
                  .toFixed(2);
                insert.toDate = insert.items
                  .reduce((pv, el) => {
                    return pv + el.toDate;
                  }, 0)
                  .toFixed(2);
                insert.afterRetention = insert.items
                  .reduce((pv, el) => {
                    return pv + parseFloat(el.afterRetention);
                  }, 0)
                  .toFixed(2);
                insert.certificateIssued = insert.items[0].certificateIssued;
                insert.progress = Math.round(
                  (insert.toDate / insert.price) * 100
                );
                if (insert.certificateIssued === 1) {
                  insert.certificateIssued = true;
                } else {
                  insert.certificateIssued = false;
                }
                this.progress.push(insert);
              } else {
                let items = response.data[3].filter(el => {
                  return (
                    el.unitName === filter[0] &&
                    el.taskName === filter[1] &&
                    el.fix === filter[2]
                  );
                });

                items.forEach(el => {
                  el.afterRetention = el.toDate.toFixed(2);
                });

                insert.items = items;
                insert.progress = insert.items[0].progress;
                insert.lastCertificateIssuedAt =
                  insert.items[0].lastCertificateIssuedAt;
                insert.unitName = insert.items[0].unitName;
                insert.taskName = insert.items[0].taskName;
                insert.fix = insert.items[0].fix;
                insert.price = insert.items
                  .reduce((pv, el) => {
                    return pv + el.price;
                  }, 0)
                  .toFixed(2);
                insert.toDate = insert.items
                  .reduce((pv, el) => {
                    return pv + el.toDate;
                  }, 0)
                  .toFixed(2);
                insert.afterRetention = insert.items
                  .reduce((pv, el) => {
                    return pv + parseFloat(el.afterRetention);
                  }, 0)
                  .toFixed(2);
                insert.certificateIssued = insert.items[0].certificateIssued;
                if (insert.certificateIssued === 1) {
                  insert.certificateIssued = true;
                } else {
                  insert.certificateIssued = false;
                }
                this.progress.push(insert);
                // this.progress.push(insert);
              }
            });
            this.progress.sort(function(a, b) {
              return a.unitName - b.unitName;
            });
            this.contractPrice = response.data[2][0].contractPrice.toFixed(2);
            let previousCertificateValues = response.data[1].reduce(
              (prev, el) => {
                return (prev =
                  prev +
                  (parseFloat(el.price) *
                    parseFloat(el.lastCertificateIssuedAt)) /
                    100);
              },
              0
            );
            this.previousCertificateValues = previousCertificateValues.toFixed(
              2
            );
            let pmtDetails = this.certificates.filter(el => {
              return (
                el.invoiceNumber !== null &&
                (el.payStatus === null ||
                  el.payStatus === "AWAITING INVOICE" ||
                  el.payStatus === "DRAFT" ||
                  el.payStatus === "CAPTURED" ||
                  el.payStatus === "DELETED")
              );
            });
            if (pmtDetails.length) {
              this.pmtDetails = pmtDetails;

              this.getXeroCredentials();
              this.invoices();
            }
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async invoices() {
      let data = [];
      let fromDateArray = [];
      this.pmtDetails.forEach(el => {
        data.push(el.invoiceNumber);
        fromDateArray.push(el.createdAt);
      });
      fromDateArray.sort();

      let data2 = {
        fromDate: fromDateArray[0].substring(0, 10),
        contactID: this.contactID,
        data: data
      };
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/getInvoices`,
        data: data2
      })
        .then(
          response => {
            if (response.data.err) {
              this.getConnected();
            } else {
              if (response.data.Status) {
                this.getConnected();
              } else {
                response.data.forEach(el => {
                  if (el.status === "AUTHORISED") {
                    el.status = "CAPTURED";
                  }
                });

                response.data.forEach(el => {
                  if (el.status !== "PAID") {
                    let invNumber = el.invoiceNumber;
                    let status = el.status;
                    this.certificates.forEach(el2 => {
                      if (
                        (el2.payStatus !== status ||
                          el2.invoiceNumber !== el2.invNumber) &&
                        el2.invoiceNumber !== null
                      ) {
                        if (el2.invoiceNumber === invNumber) {
                          el2.invNumber = invNumber;
                          el2.payStatus = status;
                        }
                        let data = {
                          invoiceNumber: invNumber,
                          payStatus: status
                        };
                        this.invoicesUpdateStatusNotPaid(data);
                      }
                    });
                  } else {
                    let status = el.status;
                    let invNumber = el.invoiceNumber;
                    let amountPaid = el.amountPaid;
                    this.certificates.forEach(el3 => {
                      if (
                        el3.status !== "PAID" &&
                        el3.invoiceNumber === invNumber
                      ) {
                        el3.status = status;
                        el3.amtPaid = amountPaid;
                        let data = {
                          invoiceNumber: invNumber,
                          payStatus: status,
                          amountPaid: amountPaid
                        };

                        this.invoicesUpdateStatusPaid(data);
                      }
                    });
                  }
                });
              }
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

    async invoicesUpdateStatusPaid(data) {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/updateStatusPaid`,
        data: data
      })
        .then(
          response => {
            if (response.data.err) {
              this.getConnected();
            } else {
              if (response.data.statusCode) {
                this.getConnected();
              } else {
                this.getPaymentCerticicates();
              }
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

    async invoicesUpdateStatusNotPaid(data) {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/updateStatusNotYetPaid`,
        data: data
      })
        .then(
          response => {
            if (response.data.err) {
              this.getConnected();
            } else {
              if (response.data.statusCode) {
                this.getConnected();
              }
            }
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
.xeroBtn {
  text-decoration: none;
  color: blue;
  font-weight: bold;
}
.childList:nth-child(odd) {
  background: rgba(154, 161, 162, 0.1);
}
.childList:nth-child(even) {
  background: rgba(15, 113, 67, 0.1);
}

.tooltip-custom {
  background-color: red;
}

.vue-tooltip.tooltip-custom .tooltip-arrow {
  border-color: red;
}
</style>

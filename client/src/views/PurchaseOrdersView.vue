<template>
  <div class="about">
    <br /><br />
    <v-col class="mb-4" cols="10" offset="1">
      <v-alert
        v-for="(item, index) in alerts"
        :key="index"
        border="top"
        :color="item.color"
        dark
        dense
        dismissible
      >
        {{ item.message }}
      </v-alert>
    </v-col>
    <v-row class="text-center">
      <v-col cols="10" offset="1">
        <v-btn v-if="consentUrl"
          ><a class="xeroBtn" @click="redirect" :href="consentUrl"
            >Xero Login</a
          ></v-btn
        >
      </v-col>

      <v-col class="mb-4" cols="10" offset="1">
        <v-data-table
          :headers="headers2"
          :items="items2Filtered"
          sort-by="calories"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title style="color: red;"
                >PURCHASE ORDERS</v-toolbar-title
              >

              <v-divider class="mx-4" inset vertical></v-divider>
              Total: {{ totalFulfilled }}
              <v-spacer></v-spacer>
              <v-radio-group v-model="row" row>
                <v-radio label="All" value="all"></v-radio>
                <v-radio
                  label="Awaiting Invoice"
                  value="awaiting_Invoice"
                ></v-radio>
                <v-radio label="Captured" value="captured"></v-radio>
                <v-radio label="Paid" value="paid"></v-radio>
              </v-radio-group>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:item.invoice="{ item }">
            <v-icon
              :id="item.PONumber"
              class="mr-2"
              @click="invoiceNumberProcess($event)"
              color="blue"
            >
              mdi-file
            </v-icon>
          </template>
          <template v-slot:item.xeroStatus="{ item }">
            <v-chip :color="getColor(item.xeroStatus)" dark style="width: 100%">
              {{ item.xeroStatus }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              :id="item.PONumber"
              class="mr-2"
              @click="getPDF2($event)"
              color="red"
            >
              mdi-file-pdf-box
            </v-icon>
          </template>
          <template v-slot:item.DNImageFile="{ item }">
            <v-icon
              v-if="item.DNImage.length"
              :id="item.PONumber"
              class="mr-2"
              @click="getImage2"
              color="blue"
            >
              mdi-image-plus
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col class="mb-4" cols="10" offset="1">
        <v-data-table
          :headers="headers"
          :items="items"
          sort-by="calories"
          class="elevation-1"
          :search="search"
          :item-class="itemRowColor"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>REQUISTIONS</v-toolbar-title>

              <v-divider class="mx-4" inset vertical></v-divider>
              Total: {{ totalUnfulfilled }}
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:item.edit="{ item }">
            <v-icon
              v-if="!item.sentToSupplier"
              :id="item.PONumber"
              class="mr-2"
              color="orange"
              @click="editPurchaseOrder($event)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:item.fulfilled="{ item }">
            <v-icon
              :id="item.PONumber"
              class="mr-2"
              color="red"
              v-if="item.remainingTime < 1"
            >
              mdi-truck-delivery
            </v-icon>
          </template>
          <template v-slot:item.overBudget="{ item }">
            <v-icon
              :id="item.PONumber"
              class="mr-2"
              color="pink lighten-1"
              v-if="item.overBudget === 1"
            >
              mdi-alert
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              :id="item.PONumber"
              class="mr-2"
              @click="getPDF($event)"
              color="red"
            >
              mdi-file-pdf-box
            </v-icon>
          </template>
          <template v-slot:item.accept="{ item }">
            <v-icon
              v-if="item.quantityDelivered > 0"
              :id="item.PONumber"
              class="mr-2"
              @click="fulfilledDialog = true"
              color="blue"
            >
              mdi-archive-arrow-up
            </v-icon>
          </template>
          <template v-slot:item.trash="{ item }">
            <v-icon
              :id="item.PONumber"
              class="mr-2"
              @click="deletePO"
              color="red"
            >
              mdi-trash-can-outline
            </v-icon>
          </template>
          <template v-slot:item.email="{ item }">
            <v-icon
              v-if="item.sentToSupplier"
              :id="item.PONumber"
              class="mr-2"
              @click="sendStatement($event)"
              color="green"
            >
              mdi-email
            </v-icon>
            <v-icon
              v-else
              :id="item.PONumber"
              class="mr-2"
              @click="sendStatement($event)"
              color="brown"
            >
              mdi-email
            </v-icon>
          </template>
          <template v-slot:item.xeroStatus="{ item }">
            <v-chip :color="getColor(item.xeroStatus)" dark>
              {{ item.xeroStatus }}
            </v-chip>
          </template>
          <template v-slot:item.DNImageFile="{ item }">
            <v-icon
              v-if="item.DNImage !== null"
              :id="item.PONumber"
              class="mr-2"
              @click="getImage"
              color="blue"
            >
              mdi-image-plus
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="400">
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
              <v-btn color="#0F0F0F" text @click="dialog = false">
                No
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="#0F0F0F"
                text
                v-if="invoiceNumber"
                @click="updateInvoiceNumber"
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
    <v-dialog v-model="fulfilledDialog" max-width="800px">
      <v-card>
        <v-card-title class="headline"
          >Mark Entire Purchase order as fulfilled? Are you sure?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fulfilledDialog = false"
            >No</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="changeToFulfilled"
            >Yes</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDialog" :max-width="maxWidth" max-heigh="90vh">
      <v-card>
        <v-spacer></v-spacer>
        <v-card-title class="headline">
          <v-spacer></v-spacer>
          <v-btn
            color="black"
            text
            @click="viewDialog = false"
            style="font-size: 150%; font-weight: bold;"
            ><v-icon color="red">mdi-arrow-collapse-all</v-icon>
          </v-btn>
        </v-card-title>

        <cld-image
          :cloudName="cloudName"
          :publicId="publicId"
          class="white--text align-end"
          width="95%"
          height="95%"
          loading="lazy"
        >
          <cld-transformation radius="20" quality="auto" />
        </cld-image>
      </v-card>
    </v-dialog>
    <purchaseOrderEdit
      v-if="showEdit"
      :mainDialog="showEdit"
      :PONumber="PONumbertoEdit"
      @exitEdit="exitEdit"
    />
    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />
    <!-- <v-row justify="center"> -->
    <v-dialog v-model="thumbNailDialog" persistent scrollable max-width="900">
      <v-card>
        <v-card-title class="headline">
          Delivery Notes
        </v-card-title>
        <div style="display: flex; margin: 1px;">
          <div
            style="width: 150px; "
            v-for="(item, index) in public_id"
            :key="index"
            :id="index"
            @click="openImage"
          >
            <cld-image
              :id="index"
              :publicId="item"
              :cloudName="cloudName"
              secure="true"
              class="clickDiv"
              loading="lazy"
            >
              <cld-transformation
                width="150"
                height="150"
                gravity="face"
                crop="thumb"
              />
              <cld-transformation radius="20" />
              <cld-transformation effect="sepia" />
            </cld-image>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="thumbNailDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
import MaskedInput from "vue-masked-input";
let url = process.env.VUE_APP_BASEURL;
import { CldImage, CldTransformation } from "cloudinary-vue";
export default {
  name: "POView",
  components: {
    // PDFViewer,
    PDFViewer: () => import("../components/PDFViewer"),
    PurchaseOrderEdit: () => import("../components/PurchaseOrderEdit"),
    MaskedInput,
    CldImage,
    CldTransformation
  },
  metaInfo: {
    title: "Purchase Orders",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Retentions here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      row: "all",
      public_id: [],

      publicId: null,
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      viewDialog: false,
      maxWidth: "60%",
      invoiceDate: new Date().toISOString().substr(0, 10),
      snackbar: false,
      snackbarMessage: "",
      showEdit: false,
      PONumbertoEdit: "",
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      value: null,
      items: [],
      items2: [],
      show: true,
      totalFulfilled: "",
      totalUnfulfilled: "",

      consentUrl: "",
      dialog: false,
      thumbNailDialog: false,
      fulfilledDialog: false,
      invoiceNumber: "",
      poNumber: "",
      search: "",
      alerts: [],
      headers: [
        {
          text: "Number",
          align: "start",
          sortable: false,
          value: "PONumber"
        },
        {
          text: "late/Due",
          align: "start",
          sortable: false,
          value: "fulfilled"
        },
        { text: "Delivery", value: "deliveryDate" },
        { text: "Supplier", value: "supplierName" },
        { text: "Gross", value: "totalCost", align: "end" },
        { text: "VAT", value: "vat", align: "end" },
        { text: "Nett", value: "nettCost", align: "end" },
        { text: "Expected When", value: "timeLeft", align: "center" },
        { text: "Delivered", value: "quantityDelivered", align: "center" },
        { text: "Pay Date", value: "expectedPayDate", align: "center" },
        { text: "edit", value: "edit", sortable: false },
        { text: "Accept", value: "accept", sortable: false },
        { text: "View", value: "actions", sortable: false },
        { text: "Img", value: "DNImageFile", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Delete", value: "trash", sortable: false },
        { text: "Over", value: "overBudget", sortable: false }
      ],
      headers2: [
        {
          text: "Xero",
          align: "start",
          sortable: false,
          value: "xeroStatus",
          width: 150
        },
        {
          text: "Number",
          align: "start",
          sortable: false,
          value: "PONumber",
          width: 150
        },
        { text: "Delivery", value: "deliveryDate", width: 120 },
        { text: "Supplier", value: "supplierName", width: 150 },
        { text: "Gross", value: "totalCost", align: "end", width: 120 },
        { text: "VAT", value: "vat", align: "end", width: 120 },
        { text: "Nett", value: "nettCost", align: "end", width: 120 },
        { text: "Delivered", value: "quantityDelivered", align: "center" },
        { text: "Expected", value: "quantityExpected", align: "center" },
        {
          text: "Pay Date",
          value: "expectedPayDate",
          align: "center",
          width: 120
        },

        {
          text: "Invoice Number",
          value: "invoiceNumber",
          align: "center",
          width: 100
        },
        {
          text: "Invoice Amount",
          value: "invoiceAmount",
          align: "center",
          width: 100
        },

        { text: "invoice", value: "invoice", sortable: false },
        { text: "View", value: "actions", sortable: false },
        { text: "Img", value: "DNImageFile", sortable: false }
        // { text: "Email", value: "email", sortable: false }
      ],
      items2Filtered: []
    };
  },
  watch: {
    row: function() {
      let filtered = [];
      switch (this.row) {
        case "All":
          filtered = this.items2;
          break;
        case "awaiting_Invoice":
          filtered = this.items2.filter(el => {
            return el.xeroStatus === "Awaiting Invoice";
          });
          break;
        case "captured":
          filtered = this.items2.filter(el => {
            return el.xeroStatus === "Captured";
          });
          break;
        case "paid":
          filtered = this.items2.filter(el => {
            return el.xeroStatus === "Paid";
          });
          break;
        default:
          filtered = this.items2;
      }
      console.log(filtered);
      if (filtered.length) {
        this.totalFulfilled = this.convertToString(
          filtered.reduce((prev, curr) => {
            let nettCost = parseFloat(
              curr.nettCost
                .split("R")
                .join("")
                .split(" ")
                .join("")
            );
            return prev + nettCost;
          }, 0)
        );
      } else {
        this.totalFulfilled = "R0.00";
      }
      this.items2Filtered = filtered;
    }
  },

  async mounted() {
    this.checkToken();
    this.processNotifications();
    this.consentUrl = "";
    this.getXeroCredentials();
    await this.getPurchaseOrders();
    await this.getInvoices();
  },
  methods: {
    getImage(event) {
      let filteredData = this.items.filter(el => {
        return el.PONumber === event.currentTarget.id;
      });
      if (filteredData[0].DNImage.length === 1) {
        this.publicId = filteredData[0].DNImage[0];
        this.viewDialog = true;
      } else {
        this.public_id = filteredData[0].DNImage;
        this.thumbNailDialog = true;
      }
    },
    getImage2(event) {
      let filteredData = this.items2.filter(el => {
        return el.PONumber === event.currentTarget.id;
      });
      if (filteredData[0].DNImage.length === 1) {
        this.publicId = filteredData[0].DNImage[0];
        this.viewDialog = true;
      } else {
        this.public_id = filteredData[0].DNImage;
        this.thumbNailDialog = true;
      }
    },
    openImage(event) {
      this.publicId = this.public_id[event.currentTarget.id];
      this.viewDialog = true;
    },
    async changeToFulfilled() {
      let itemsDelivered = this.items.filter(el => {
        return (
          el.quantityDelivered !== 0 &&
          el.quantityDelivered < el.quantityExpected
        );
      });

      let data = {
        info: itemsDelivered
      };
      await axios({
        method: "post",
        url: `${url}/pofulfilled`,
        data: data
      })
        .then(
          () => {
            this.fulfilledDialog = false;
            this.getPurchaseOrders();
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async deletePO(event) {
      let data = {
        PO: event.currentTarget.id
      };
      await axios({
        method: "post",
        url: `${url}/deletePurchaseOrder`,
        data: data
      })
        .then(
          () => {
            this.getPurchaseOrders();
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    getColor(xeroStatus) {
      if (xeroStatus === "CAPTURED") return "red";
      else if (xeroStatus === "Awaiting Invoice") return "orange";
      else return "blue";
    },
    async sendStatement(event) {
      let targetId = event.currentTarget.id;

      let fileInfo = this.items.concat(this.items2).filter(el => {
        return el.PONumber === targetId;
      });

      let data = {
        supplier: fileInfo[0].contactID,
        PONumber: fileInfo[0].PONumber
      };
      await axios({
        method: "post",
        url: `${url}/sendpurchaseorder`,
        data: data
      })
        .then(
          response => {
            if (response.data.success) {
              this.snackbarMessage = `Mail sent successfully to ${response.data.fileName}`;
              this.snackbar = true;
              this.getPurchaseOrders();
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
    exitEdit(event) {
      this.showEdit = event;
      this.importEditComponent = false;
      this.getPurchaseOrders();
    },
    editPurchaseOrder(event) {
      this.showEdit = true;
      this.PONumbertoEdit = event.currentTarget.id;
    },
    async updateInvoiceNumber() {
      this.dialog = false;
      this.items2.forEach(el => {
        if (el.PONumber === this.PONumber) {
          el.invoiceNumber = this.invoiceNumber;
        }
      });
      let data = {
        id: this.$store.state.development.id,
        PONumber: this.PONumber,
        invoiceNumber: this.invoiceNumber,
        invoiceDate: this.invoiceDate
      };

      await axios({
        method: "post",
        url: `${url}/processInvoiceNumber`,
        data: data
      })
        .then(
          () => {
            this.getInvoices();
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async updatePurchaseOrders(invoiceNumber, invoiceAmount, status) {
      let data = {
        id: this.$store.state.development.id,
        invoiceNumber: invoiceNumber,
        invoiceAmount: invoiceAmount,
        status: status
      };
      await axios({
        method: "post",
        url: `${url}/processXeroUpdates`,
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
    async getInvoices() {
      await this.items2.forEach(el => {
        if (el.xeroStatus !== "PAID" && el.invoiceNumber) {
          let data2 = {
            fromDate: el.deliveryDate,
            contactID: el.contactID,
            data: [el.invoiceNumber]
          };
          axios.defaults.headers.common[
            "Authorization"
          ] = this.$store.state.token;
          axios({
            method: "post",
            url: `${url}/getInvoices`,
            data: data2
          })
            .then(
              response => {
                if (response.data.Status == 401) {
                  this.getConnected();
                }
                let status;
                if (response.data[0].status === "AUTHORISED") {
                  status = "CAPTURED";
                }
                this.items2.forEach(el => {
                  if (el.invoiceNumber === response.data[0].invoiceNumber) {
                    el.invoiceAmount = this.convertToString(
                      response.data[0].total
                    );
                    el.xeroStatus = status;
                  }
                });
                this.updatePurchaseOrders(
                  response.data[0].invoiceNumber,
                  response.data[0].total,
                  status
                );
              },
              error => {
                console.log("the Error", error);
              }
            )
            .catch(e => {
              console.log(e);
            });
        }
      });
    },
    invoiceNumberProcess(event) {
      this.PONumber = event.currentTarget.id;
      this.dialog = true;
    },
    getPDF2(event) {
      let targetId = event.currentTarget.id;
      let itemToFetch = this.items2.filter(el => {
        return el.PONumber === targetId;
      });
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].PONumber;
      this.getComponent = true;
    },
    getPDF(event) {
      let targetId = event.currentTarget.id;
      let itemToFetch = this.items.filter(el => {
        return el.PONumber === targetId;
      });
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].PONumber;
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    },
    async getPurchaseOrders() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/purchaseOrders`,
        data: data
      })
        .then(
          response => {
            this.items = response.data[0];
            let now = dayjs().format("YYYY-MM-DD");
            this.items.forEach(el => {
              el.hrefCert = `${process.env.VUE_APP_BASEURL}/purchaseorders/${el.PONumber}.pdf`;
              el.deliveryDate = el.deliveryDate.substr(0, 10);
              el.remainingTime = parseInt(
                dayjs(el.deliveryDate).diff(dayjs(now), "day")
              );
              el.timeLeft = `${dayjs(el.deliveryDate).diff(
                dayjs(now),
                "day"
              )} days`;
              el.totalCost = this.convertToString(el.totalCost);
              el.vat = this.convertToString(el.vat);
              el.nettCost = this.convertToString(el.nettCost);
              if (el.fulfilled === 0) {
                el.fulfilled = false;
              } else {
                el.fulfilled = true;
              }
              el.expectedPayDate = `${dayjs(el.deliveryDate)
                .endOf("month")
                .add(1, "month")
                .endOf("month")
                .format("YYYY-MM-DD")}`;

              if (el.DNImage === null) {
                el.DNImage = [];
              } else if (el.DNImage === "undefined") {
                el.DNImage = [];
              } else {
                el.DNImage = JSON.parse(el.DNImage);
              }
            });
            let alerts = response.data[1].filter(el => {
              return el.availableLimitRemaining <= 50;
            });

            if (alerts.length) {
              alerts.forEach(el => {
                switch (Math.ceil(el.availableLimitRemaining / 10)) {
                  case 0:
                    el.message = `${el.supplierName} has no more credit available.`;
                    el.color = "red";
                    break;
                  case 1:
                    el.message = `${
                      el.supplierName
                    } has less than 10% credit available: ${this.convertToString(
                      el.availableLimit
                    )} remaining.`;
                    el.color = "red";
                    break;
                  case 2:
                    el.message = `${
                      el.supplierName
                    } has less than 20% credit available: ${this.convertToString(
                      el.availableLimit
                    )} remaining.`;
                    el.color = "pink darken-1";
                    break;
                  case 3:
                    el.message = `${
                      el.supplierName
                    } has less than 30% credit available: ${this.convertToString(
                      el.availableLimit
                    )} remaining.`;
                    el.color = "orange";
                    break;
                  case 4:
                    el.message = `${
                      el.supplierName
                    } has less than 40% credit available: ${this.convertToString(
                      el.availableLimit
                    )} remaining.`;
                    el.color = "amber";
                    break;
                  default:
                    el.message = `${
                      el.supplierName
                    } has less than 50% credit available: ${this.convertToString(
                      el.availableLimit
                    )} remaining.`;
                    el.color = "indigo";
                }
              });

              this.alerts = alerts;
            } else {
              this.alerts = [];
            }
            // this.items[0].fulfilled = true;
            this.items2 = this.items.filter(el => {
              return el.fulfilled === true;
            });

            this.items = this.items.filter(el => {
              return el.fulfilled === false;
            });
            this.items2.forEach(el => {
              if (!el.xeroStatus) {
                el.xeroStatus = "Awaiting Invoice";
              }
            });
            this.items2Filtered = this.items2;

            let totalFulfilled = this.items2.reduce((prev, curr) => {
              return (
                prev +
                parseFloat(
                  curr.nettCost
                    .split("R")[1]
                    .split(" ")
                    .join("")
                )
              );
            }, 0);
            this.totalFulfilled = this.convertToString(totalFulfilled);

            let totalUnfulfilled = this.items.reduce((prev, curr) => {
              return (
                prev +
                parseFloat(
                  curr.nettCost
                    .split("R")[1]
                    .split(" ")
                    .join("")
                )
              );
            }, 0);

            this.totalUnfulfilled = this.convertToString(totalUnfulfilled);
          },
          error => {
            console.log(error);
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
    itemRowColor(item) {
      //CHANGES ROW COLOR WHEN TASK BEHIND SCGEDULE
      if (item.overBudget === 1) {
        return "yellow accent-2";
      }
    }
  }
};
</script>

<style scoped>
.clickDiv {
  cursor: pointer;
}
</style>

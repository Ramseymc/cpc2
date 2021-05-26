<template>
  <div class="about">
    <br /><br />
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
          :items="items2"
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
    <PurchaseOrderEdit
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
        <!-- <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text> -->
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
              <!-- <cld-transformation
                :overlay="cloudinary_icon_blue"
                gravity="south_east"
                x="5"
                y="5"
                width="50"
                opacity="60"
                effect="brightness:200"
              /> -->
              <!-- <cld-transformation angle="10" /> -->
            </cld-image>
          </div>
        </div>
        <v-card-actions>
          <!-- <v-btn color="green darken-1" text @click="thumbNailDialog = false">
              Disagree
            </v-btn> -->
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="thumbNailDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- </v-row> -->
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

      consentUrl: "",
      dialog: false,
      thumbNailDialog: false,
      fulfilledDialog: false,
      invoiceNumber: "",
      poNumber: "",
      search: "",
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
        // { text: "Fullfilled", value: "fulfilled", align: "center" },
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
        // {
        //   text: "Expected When",
        //   value: "timeLeft",
        //   align: "center",
        //   width: 100
        // },
        { text: "Delivered", value: "quantityDelivered", align: "center" },
        { text: "Expected", value: "quantityExpected", align: "center" },
        {
          text: "Pay Date",
          value: "expectedPayDate",
          align: "center",
          width: 120
        },
        // { text: "Fullfilled", value: "fulfilled", align: "center", width: 100 },
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
      ]
    };
  },

  async mounted() {
    this.checkToken();
    this.processNotifications();
    this.consentUrl = "";
    // this.getConnected()
    this.getXeroCredentials();
    await this.getPurchaseOrders();
    await this.getInvoices();
  },
  methods: {
    // getImage(event) {
    //   console.log(event.currentTarget.id)
    //   console.log(this.desserts)
    // },
    // getImage2(event) {
    //   console.log("2::",event.currentTarget.id)
    // },
    getImage(event) {
      // console.log("GetImage", event.currentTarget.id);
      let filteredData = this.items.filter(el => {
        return el.PONumber === event.currentTarget.id;
      });
      // console.log("Filtered", filteredData);
      if (filteredData[0].DNImage.length === 1) {
        this.publicId = filteredData[0].DNImage[0];
        this.viewDialog = true;
      } else {
        this.public_id = filteredData[0].DNImage;
        this.thumbNailDialog = true;
        // console.log(this.public_id)
      }
    },
    getImage2(event) {
      // console.log("GetImage2", event.currentTarget.id);
      // console.log(this.items2);
      let filteredData = this.items2.filter(el => {
        return el.PONumber === event.currentTarget.id;
      });
      // console.log("Filtered", filteredData);
      if (filteredData[0].DNImage.length === 1) {
        this.publicId = filteredData[0].DNImage[0];
        this.viewDialog = true;
      } else {
        this.public_id = filteredData[0].DNImage;
        this.thumbNailDialog = true;
        // console.log(this.public_id)
      }
    },
    openImage(event) {
      // console.log("Clicking",event.currentTarget.id)
      this.publicId = this.public_id[event.currentTarget.id];
      this.viewDialog = true;
    },
    async changeToFulfilled() {
      // console.log(this.items)
      let itemsDelivered = this.items.filter(el => {
        return (
          el.quantityDelivered !== 0 &&
          el.quantityDelivered < el.quantityExpected
        );
      });
      console.log(itemsDelivered);
      let data = {
        info: itemsDelivered
      };
      await axios({
        method: "post",
        url: `${url}/pofulfilled`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.fulfilledDialog = false;

            this.getPurchaseOrders();
            // this.getInvoices();
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
      console.log(event.currentTarget.id);
      let data = {
        PO: event.currentTarget.id
      };
      await axios({
        method: "post",
        url: `${url}/deletePurchaseOrder`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.getPurchaseOrders();
            // this.getInvoices();
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
      console.log(targetId);
      // let fileInfo = this.items.concat(this.items2)

      let fileInfo = this.items.concat(this.items2).filter(el => {
        return el.PONumber === targetId;
      });
      console.log(fileInfo);

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
            console.log(response.data);
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
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/processInvoiceNumber`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
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
            console.log(response.data);
            this.items = response.data;
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
              console.log(el.DNImage);
              if (el.DNImage === null) {
                el.DNImage = [];
                console.log("NULL");
              } else if (el.DNImage === "undefined") {
                console.log("UNDEFINED");
                el.DNImage = [];
              } else {
                el.DNImage = JSON.parse(el.DNImage);
              }
            });

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
            console.log(this.items2);
            console.log(this.items);
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

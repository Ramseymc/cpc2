<template>
  <div>
    <br /><br />
    <div
      v-if="!progressActive && !this.desserts.length && !this.notYetDue.length"
    >
      <h1>No Payments to Show</h1>
    </div>
    <!-- <v-btn text @click="dialog1 = !dialog1" v-if="!progressActive"
      >Signature Test</v-btn
    > -->
    <v-progress-circular
      v-if="progressActive"
      :size="70"
      :width="7"
      color="#0F0F0F"
      indeterminate
    ></v-progress-circular>

    <v-btn v-if="consentUrl"
      ><a class="xeroBtn" @click="redirect" :href="consentUrl"
        >Xero Login</a
      ></v-btn
    >
    <v-card class="mx-auto" max-width="80%">
      <div
        style="display: flex; justify-content: space-between;margin-top: 6px;"
      >
        <div
          v-if="desserts.length"
          style="display: flex; background-color: lightgrey; margin: 1px; border: 1px solid black; padding: 3px; border-radius: 7px;"
        >
          <span style="margin-top: 20px;">Legend:</span>
          <v-checkbox
            v-model="legend"
            color="primary"
            readonly
            :label="`Finance`"
          ></v-checkbox>
          <v-checkbox
            v-model="legend"
            readonly
            color="success"
            :label="`Management`"
          ></v-checkbox>
        </div>
        <div style="display: flex; margin-top: 6px;" v-if="desserts.length">
          <span style="margin-top: 20px;">Sign:</span>
          <v-checkbox
            v-model="financeSigned"
            color="primary"
            label="Finance"
            :readonly="finance"
            @change="changeSignatureFinance"
          ></v-checkbox>
          <v-checkbox
            v-model="managementSigned"
            color="success"
            label="Management"
            :readonly="management"
            @change="changeSignatureManagement"
          ></v-checkbox>
        </div>
        <v-btn
          text
          style="margin-top: 12px;"
          @click="createAPDF"
          v-if="desserts.length"
        >
          <v-icon color="#0F0F0F">mdi-file-pdf</v-icon
          ><small>Pmts</small></v-btn
        >
      </div>
      <v-toolbar color="#0F0F0F" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Payments Due - {{ totalDue }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <div style="display: flex; margin-top: 6px;" v-if="desserts.length">
          Approve All:
          <v-checkbox
            v-model="financeApproveAllTable"
            color="primary"
            label="Finance"
            :readonly="finance"
            @change="changeAllFinanceTable"
          ></v-checkbox>
          <v-checkbox
            v-model="managementApproveAllTable"
            color="success"
            label="Management"
            :readonly="management"
            @change="changeAllManagementTable"
          ></v-checkbox>
        </div>
      </v-toolbar>
      <v-data-table
        fixed
        :headers="headers"
        :items="desserts"
        class="elevation-1"
      >
        <template v-slot:item.xeroStr="{ item }">
          <v-icon class="engine" large></v-icon>
          {{ item.xeroStr }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            :id="item.docNo"
            class="mr-2"
            @click="getPDF($event)"
            color="red"
          >
            mdi-file-pdf-box
          </v-icon>
        </template>
        <template v-slot:item.approvedFinance="{ item }">
          <v-checkbox
            color="blue"
            :ripple="false"
            v-model="item.approvedFinance"
            @change="approveForPayment"
          ></v-checkbox>
        </template>
        <template v-slot:item.approvedManagement="{ item }">
          <v-checkbox
            color="green"
            v-model="item.approvedManagement"
            :ripple="false"
            @change="approveForPayment"
          ></v-checkbox>
        </template>
        <template v-slot:item.payLater="{ item }">
          <v-checkbox
            color="green"
            v-model="item.payLater"
            :ripple="false"
            @change="deferPayment"
          ></v-checkbox>
        </template>
      </v-data-table>
    </v-card>

    <br /><br />
    <v-card class="mx-auto" max-width="80%">
      <v-toolbar color="#0F0F0F" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Payments Deferred</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        :headers="headers2"
        :items="notYetDue"
        class="elevation-1"
        dense
        fixed
      >
        <template v-slot:item.xeroStr="{ item }">
          <v-icon class="engine" large></v-icon>
          {{ item.xeroStr }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            :id="item.docNo"
            class="mr-2"
            @click="getPDF2($event)"
            color="red"
          >
            mdi-file-pdf-box
          </v-icon>
        </template>
        <template v-slot:item.approvedFinance="{ item }">
          <v-checkbox
            color="blue"
            :ripple="false"
            v-model="item.approvedFinance"
            @change="approveForPayment"
          ></v-checkbox>
        </template>
        <template v-slot:item.approvedManagement="{ item }">
          <v-checkbox
            color="green"
            v-model="item.approvedManagement"
            :ripple="false"
            @change="approveForPayment"
          ></v-checkbox>
        </template>
        <template v-slot:item.payNow="{ item }">
          <v-checkbox
            color="red"
            v-model="item.payLater"
            :ripple="false"
            @change="payNow"
          ></v-checkbox>
        </template>
      </v-data-table>
    </v-card>

    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />

    <v-dialog v-model="dialog1" max-width="50%">
      <Signature
        @signatureFile="signatureFile($event)"
        @done="closeSignatureFile($event)"
        v-if="dialog1"
        :dialog="true"
      />
    </v-dialog>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as dayjs from "dayjs";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "paymentsdue",
  metaInfo: {
    title: "Make Payments",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `JMake Payments Here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  components: {
    PDFViewer: () => import("../components/PDFViewer"),
    Signature: () => import("../components/Signature")
  },

  data() {
    return {
      progressActive: false,
      dialog1: false,
      sign: false,
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      financeSignature: `${process.env.VUE_APP_BASEURL}/signatureBlank.png`,
      managementSignature: `${process.env.VUE_APP_BASEURL}/signatureBlank.png`,
      financeSigned: false,
      managementSigned: false,
      legend: true,
      management: false,
      finance: false,
      snackbarMessage: "This functionality still coming",
      snackbar: false,
      consentUrl: "",
      src: "",
      reports: [],
      header: [],
      rows: [],
      dialog: false,
      fromDate: "",
      paidToDate: [],
      totalOwedToSupplier: 0,
      totalXero: 0,
      differenceXero: 0,
      certificateNumberForApproval: "",
      financeApproveAllTable: false,
      managementApproveAllTable: false,
      totalDue: 0,
      headers: [
        {
          text: "Doc",
          align: "start",
          sortable: false,
          value: "docNo",
          width: 150
        },
        { text: "Date", value: "docDate", width: 110 },
        { text: "Type", value: "docType", width: 80 },
        { text: "Supplier", value: "supplierName", width: 150 },
        { text: "Invoice", value: "invoiceNumber", width: 100 },
        { text: "Due", value: "dueStr", align: "end", width: 100 },
        { text: "Xero", value: "xeroStr", align: "end", width: 100 },
        { text: "Diff", value: "variance", align: "end", width: 100 },
        { text: "Due Date", value: "paymentDue", align: "end", width: 110 },
        { text: "View", value: "actions", sortable: false },
        { text: "Fin", value: "approvedFinance", sortable: false },
        { text: "Mgt", value: "approvedManagement", sortable: false },
        { text: "Decline", value: "payLater", sortable: false }
      ],
      headers2: [
        {
          text: "Doc",
          align: "start",
          sortable: false,
          value: "docNo",
          width: 150
        },
        { text: "Date", value: "docDate", width: 110 },
        { text: "Type", value: "docType", width: 80 },
        { text: "Supplier", value: "supplierName", width: 150 },
        { text: "Invoice", value: "invoiceNumber", width: 100 },
        { text: "Due", value: "dueStr", align: "end", width: 100 },
        { text: "Xero", value: "xeroStr", align: "end", width: 100 },
        { text: "Diff", value: "variance", align: "end", width: 100 },
        { text: "Due Date", value: "paymentDue", align: "end", width: 110 },
        { text: "View", value: "actions", sortable: false },
        { text: "Fin", value: "approvedFinance", sortable: false },
        { text: "Mgt", value: "approvedManagement", sortable: false },
        { text: "Deferred", value: "payNow", sortable: false }
      ],
      desserts: [],
      notYetDue: []
    };
  },
  async mounted() {
    this.progressActive = true;
    this.checkToken();
    this.consentUrl = "";
    if (this.$store.state.userId === 12) {
      this.finance = true;
      this.management = false;
    } else if (this.$store.state.userId === 13) {
      this.finance = false;
      this.management = true;
    } else if (this.$store.state.userId === 10) {
      this.finance = false;
      this.management = false;
    } else {
      this.finance = true;
      this.management = true;
    }
    await this.getXeroCredentials();
  },
  methods: {
    payNow() {
      let filtered = this.notYetDue.filter(el => {
        return el.payLater === false;
      });
      filtered.forEach(el => {
        this.desserts.push(el);
      });
      this.notYetDue = this.notYetDue.filter(el => {
        return el.payLater === true;
      });
      this.totalDue = this.convertToString(
        this.desserts.reduce((acc, el) => {
          return acc + el.due;
        }, 0)
      );
    },
    deferPayment() {
      let filtered = this.desserts.filter(el => {
        return el.payLater === true;
      });
      filtered.forEach(el => {
        this.notYetDue.push(el);
      });

      this.desserts = this.desserts.filter(el => {
        return el.payLater === false;
      });
      this.totalDue = this.convertToString(
        this.desserts.reduce((acc, el) => {
          return acc + el.due;
        }, 0)
      );
    },
    async getData() {
      let data = {
        id: this.$store.state.development.id
      };

      await axios({
        method: "post",
        url: `${url}/paymentsdueNew`,
        data: data
      })
        .then(
          response => {
            if (response.data.length) {
              console.log(response.data);
              response.data.forEach(el => {
                el.xero = 0;
                el.variance = el.due - el.xero;
                if (el.docType === "PO") {
                  el.hrefCert = `${process.env.VUE_APP_BASEURL}/purchaseorders/${el.docNo}.pdf`;
                } else {
                  el.hrefCert = `${process.env.VUE_APP_BASEURL}/${el.docNo}.pdf`;
                }
                if (el.approvedFinance === 0) {
                  el.approvedFinance = false;
                } else {
                  el.approvedFinance = true;
                }
                if (el.approvedManagement === 0) {
                  el.approvedManagement = false;
                } else {
                  el.approvedManagement = true;
                }
                el.docDate = el.docDate.substr(0, 10);
                if (el.docType === "PO") {
                  if (el.terms === 1) {
                    el.paymentDue = dayjs(el.invoiceDate)
                      .endOf("month")
                      .add(1, "month")
                      .endOf("month")
                      .format("YYYY-MM-DD");
                  } else if (el.terms === 2) {
                    el.paymentDue = dayjs(el.invoiceDate)
                      .endOf("week")
                      .add(2, "week")
                      .subtract(1, "day")
                      .format("YYYY-MM-DD");
                  } else if (el.terms === 3) {
                    el.paymentDue = dayjs(el.invoiceDate)
                      .endOf("week")
                      .subtract(1, "day")
                      .format("YYYY-MM-DD");
                  } else if (el.terms === 4) {
                    el.paymentDue = dayjs(el.invoiceDate)
                      .endOf("week")
                      .add(1, "week")
                      .subtract(1, "day")
                      .format("YYYY-MM-DD");
                  }
                } else {
                  el.paymentDue = dayjs(el.invoiceDate)
                    .endOf("week")
                    .add(1, "week")
                    .endOf("week")
                    .subtract(1, "day")
                    .format("YYYY-MM-DD");
                }
              });
              this.desserts = response.data;
              // let now = new Date();
              // this.notYetDue = this.desserts.filter((el) => {
              //   return dayjs(el.paymentDue) > dayjs(now)
              // })
              // this.desserts = this.desserts.filter((el) => {
              //   return dayjs(el.paymentDue) <= dayjs(now)
              // })

              // this.totalDue = this.convertToString(
              //   this.desserts.reduce((acc, el) => {
              //     return acc + el.due;
              //   }, 0)
              // );
              // this.desserts = response.data;
              let invoiceNumbers = [];
              let contactIDs = [];
              let fromDate = [];
              this.desserts.forEach(el => {
                invoiceNumbers.push(el.invoiceNumber);
                contactIDs.push(el.contactID);
                fromDate.push(el.docDate);
                el.variance = el.due - el.xero;
                el.xeroStr = this.convertToString(el.xero);
                el.dueStr = this.convertToString(el.due);
                el.varianceStr = this.convertToString(el.variance);
                el.payLater = false;
              });

              // this.notYetDue = this.desserts

              contactIDs = Array.from(new Set(contactIDs));
              fromDate = Array.from(new Set(fromDate));
              fromDate.sort();
              if (
                contactIDs.length &&
                fromDate.length &&
                invoiceNumbers.length
              ) {
                let invoiceData = {
                  data: invoiceNumbers,
                  contactID: contactIDs,
                  fromDate: fromDate[0].substring(0, 10)
                };

                this.getInvoices(invoiceData).then(() => {
                  setTimeout(() => {
                    this.desserts.forEach(el => {
                      el.variance = el.due - el.xero;
                      el.xeroStr = this.convertToString(el.xero);
                      el.dueStr = this.convertToString(el.due);
                      el.varianceStr = this.convertToString(el.variance);
                    });
                    this.getSignatureInfo();
                    // setTimeout(() => {

                    // }, 100);
                  }, 200);
                });
              }
              this.$nextTick(() => {
                let now = new Date();
                this.notYetDue = this.desserts.filter(el => {
                  return dayjs(el.paymentDue) > dayjs(now);
                });
                this.desserts = this.desserts.filter(el => {
                  return dayjs(el.paymentDue) <= dayjs(now);
                });
                console.log(this.notYetDue);

                this.totalDue = this.convertToString(
                  this.desserts.reduce((acc, el) => {
                    return acc + el.due;
                  }, 0)
                );
                this.progressActive = false;
              });
            } else {
              this.progressActive = false;
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
    changeAllFinanceTable() {
      if (this.financeApproveAllTable) {
        this.desserts.forEach(el => {
          el.approvedFinance = true;
        });
        this.changeAllFinance();
      }
    },
    changeAllManagementTable() {
      if (this.managementApproveAllTable) {
        this.desserts.forEach(el => {
          el.approvedManagement = true;
        });
        this.changeAllManagement();
      }
    },
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "blue";
    },
    signatureFile(event) {
      console.log(event);
    },
    closeSignatureFile(event) {
      if (event) {
        this.dialog1 = false;
      }
      console.log(event);
    },
    getPDF(event) {
      let targetId = event.currentTarget.id;
      console.log("HELLO", targetId);
      let itemToFetch = this.desserts.filter(el => {
        return el.docNo === parseInt(targetId) || el.docNo === targetId;
      });
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].docNo;
      this.getComponent = true;
    },
    getPDF2(event) {
      let targetId = event.currentTarget.id;
      console.log("HELLO", targetId);
      let itemToFetch = this.notYetDue.filter(el => {
        return el.docNo === parseInt(targetId) || el.docNo === targetId;
      });
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].docNo;
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    },
    async getSignatureInfo() {
      await axios({
        method: "get",
        url: `${url}/getSignatures`
      })
        .then(
          response => {
            console.log(response.data);
            if (
              (response.data[0].financeSignature ||
                response.data[0].managementSignature) &&
              response.data[0].signatureDate ===
                new Date().toISOString().substring(0, 10)
            ) {
              let previousSigned = JSON.parse(response.data[0].fileDetails);

              let sumpreviousSigned = previousSigned.reduce((acc, pv) => {
                return acc + pv.due;
              }, 0);
              let previousSignedLength = previousSigned.length;

              // let signedOn = response.data[0].signatureDate;

              let sumData = this.desserts.reduce((acc, pv) => {
                return acc + pv.due;
              }, 0);

              let lengthData = this.desserts.length;

              if (
                sumpreviousSigned === sumData &&
                previousSignedLength === lengthData
              ) {
                this.financeSigned = response.data[0].financeSignature;
                this.managementSigned = response.data[0].managementSignature;
                if (this.financeSigned) {
                  this.financeSignature = `${process.env.VUE_APP_BASEURL}/signature13.png`;
                } else {
                  this.financeSignature = `${process.env.VUE_APP_BASEURL}/signatureBlank.png`;
                }
                if (this.managementSigned) {
                  this.managementSignature = `${process.env.VUE_APP_BASEURL}/signature12.png`;
                } else {
                  this.managementSignature = `${process.env.VUE_APP_BASEURL}/signatureBlank.png`;
                }
              } else {
                this.financeSigned = false;
                this.managementSigned = false;
                this.desserts.forEach(el => {
                  el.approvedFinance = false;
                  el.approvedManagement = false;
                });
              }
            } else {
              this.financeSigned = false;
              this.managementSigned = false;
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
    async changeSignatureFinance() {
      if (this.financeSigned) {
        this.financeSignature = `${process.env.VUE_APP_BASEURL}/signature13.png`;
      } else {
        this.financeSignature = `${process.env.VUE_APP_BASEURL}/signatureBlank.png`;
      }
      let data = {
        userName: this.$store.state.userName,
        userId: this.$store.state.userId,
        userTitle: this.$store.state.userTitle,
        financeSignature: this.financeSigned,
        managementSignature: this.managementSigned,
        signatureDate: new Date().toISOString().substring(0, 10),
        // fileDetails: JSON.stringify(this.items),
        fileDetails: JSON.stringify(this.desserts)
      };
      await axios({
        method: "post",
        url: `${url}/postSignatures`,
        data: data
      })
        .then(
          response => {
            console.log("Response", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async changeSignatureManagement() {
      if (this.managementSigned) {
        this.managementSignature = `${process.env.VUE_APP_BASEURL}/signature12.png`;
      } else {
        this.managementSignature = `${process.env.VUE_APP_BASEURL}/signatureBlank.png`;
      }
      let data = {
        userName: this.$store.state.userName,
        userId: this.$store.state.userId,
        userTitle: this.$store.state.userTitle,
        financeSignature: this.financeSigned,
        managementSignature: this.managementSigned,
        signatureDate: new Date().toISOString().substring(0, 10),
        // fileDetails: JSON.stringify(this.items),
        fileDetails: JSON.stringify(this.desserts)
      };
      await axios({
        method: "post",
        url: `${url}/postSignatures`,
        data: data
      })
        .then(
          response => {
            console.log("Response", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    createAPDF() {
      let now = new Date().toISOString().substring(0, 10);
      let dataInput = [];
      let subDataInput = [];
      let finSig = this.financeSignature;
      let manSig = this.managementSignature;
      this.desserts.forEach(el => {
        let insert1 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.docNo,
          fontSize: 10
        };
        let insert2 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.docDate,
          fontSize: 10
        };

        let insert3 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.docType,
          fontSize: 10
        };

        let insert4 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.supplierName,
          fontSize: 10
        };
        let insert5 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.invoiceNumber,
          fontSize: 10
        };

        let insert6 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.dueStr,
          fontSize: 10,
          alignment: "right"
        };
        let insert7 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.xeroStr,
          fontSize: 10,
          alignment: "right"
        };
        let insert8 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.varianceStr,
          fontSize: 10,
          alignment: "right"
        };
        if (el.approvedFinance === 1 || el.approvedFinance === true) {
          el.finance = "X";
        } else {
          el.finance = "";
        }
        let insert9 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.finance,
          fontSize: 10,
          alignment: "center",
          bold: true,
          color: "green"
        };
        if (el.approvedManagement === 1 || el.approvedManagement === true) {
          el.management = "X";
        } else {
          el.management = "";
        }
        let insert10 = {
          border: [false, true, false, false],
          fillColor: "#eeeeff",
          text: el.management,
          fontSize: 10,
          alignment: "center",
          bold: true,
          color: "green"
        };
        subDataInput.push(insert1);
        subDataInput.push(insert2);
        subDataInput.push(insert3);
        subDataInput.push(insert4);
        subDataInput.push(insert5);
        subDataInput.push(insert6);
        subDataInput.push(insert7);
        subDataInput.push(insert8);
        subDataInput.push(insert9);
        subDataInput.push(insert10);
        dataInput.push(subDataInput);
        subDataInput = [];
      });
      let totalPayable = this.desserts
        .reduce((acc, pv) => {
          return acc + pv.due;
        }, 0)
        .toFixed(2);
      totalPayable = this.convertToString(totalPayable);

      let totalfinance = this.desserts
        .reduce((acc, pv) => {
          if (pv.approvedFinance === 1 || pv.approvedFinance === true) {
            acc = acc + pv.due;
          } else {
            acc = acc + 0;
          }
          return acc;
        }, 0)
        .toFixed(2);
      totalfinance = this.convertToString(totalfinance);

      let totalmanagement = this.desserts
        .reduce((acc, pv) => {
          if (pv.approvedManagement === 1 || pv.approvedManagement === true) {
            acc = acc + pv.due;
          } else {
            acc = acc + 0;
          }
          return acc;
        }, 0)
        .toFixed(2);
      totalmanagement = this.convertToString(totalmanagement);

      let header = [
        { text: "Doc", style: "tableHeader", fontSize: 12 },
        { text: "Date", style: "tableHeader", fontSize: 12 },
        { text: "Type", style: "tableHeader", fontSize: 12 },
        {
          text: "Supplier",
          style: "tableHeader",
          fontSize: 12
        },
        { text: "Invoice", style: "tableHeader", fontSize: 12 },
        { text: "Due", style: "tableHeader", fontSize: 12 },
        { text: "Xero", style: "tableHeader", fontSize: 12 },
        { text: "Diff", style: "tableHeader", fontSize: 12 },
        {
          text: "Fin",
          style: "tableHeader",
          fontSize: 12
        },
        {
          text: "Mgmt",
          style: "tableHeader",
          fontSize: 12
        }
      ];
      dataInput.unshift(header);
      let dd = {
        pageOrientation: "landscape",

        content: [
          {
            text: `Payments for approval - ${now}`,
            style: "header"
          },
          {
            text: `Total = ${totalPayable}`,
            style: "header"
          },
          {
            table: {
              headerRows: 1,
              body: dataInput,
              widths: [100, 80, 40, 100, 70, 70, 70, 70, 40, 40]
            }
          },
          {
            text: `Total Finance = ${totalfinance}`,
            style: "subtotal"
          },
          {
            text: `Total Management = ${totalmanagement}`,
            style: "subtotal"
          },
          {
            text: ""
          },
          {
            text: ""
          },
          {
            text: ""
          },
          {
            style: "tableExample",
            table: {
              body: [
                [
                  { text: "Signature", border: [false, false, false, false] },
                  {
                    image: "finance",
                    border: [false, false, false, false],
                    width: 150
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  { text: "Signature", border: [false, false, false, false] },
                  {
                    image: "management",
                    border: [false, false, false, false],
                    width: 150
                  }
                ]
              ],
              widths: [140, 140, 40, 140, 140]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 10],
            alignment: "center"
          },
          subtotal: {
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 10],
            alignment: "right"
          },
          signature: {
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 10],
            alignment: "left"
          },
          tableHeader: { fillColor: "#0d989c", color: "white" },
          signatureHeader: { border: [false, false, false, false] }
        },
        images: {
          finance: finSig,
          management: manSig
        }
      };
      pdfMake.createPdf(dd).open();
    },
    async getInvoices(data) {
      await axios({
        method: "post",
        url: `${url}/getInvoicesforPmtApproval`,
        data: data
      })
        .then(
          response => {
            if (response.data.err) {
              this.getConnected();
            } else {
              if (response.data.Status) {
                this.getConnected();
              } else {
                console.log("HELLO", response.data);
                // if (response.data.length) {
                response.data.forEach(el => {
                  let invoiceNumber = el.invoiceNumber;
                  let xero = el.amountDue;
                  this.desserts.forEach(el2 => {
                    if (el2.invoiceNumber === invoiceNumber) {
                      el2.xero = xero;
                    }
                  });
                });
                // } else {
                this.progressActive = false;
                // }
              }
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
    async approveForPayment() {
      let data = [];
      this.desserts.forEach(el => {
        let insert = {
          approvedFinance: el.approvedFinance,
          approvedManagement: el.approvedManagement,
          invoiceNumber: el.invoiceNumber,
          docType: el.docType
        };
        data.push(insert);
      });

      await axios({
        method: "post",
        url: `${url}/ApprovePaymentsAll`,
        data: data
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
    },
    async changeAllFinance() {
      this.desserts.forEach(el => {
        el.approvedFinance = this.financeApproveAllTable;
      });
      let data = [];
      this.desserts.forEach(el => {
        let insert = {
          approvedFinance: el.approvedFinance,
          approvedManagement: el.approvedManagement,
          invoiceNumber: el.invoiceNumber,
          docType: el.docType
        };
        data.push(insert);
      });

      await axios({
        method: "post",
        url: `${url}/ApprovePaymentsAll`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            // this.financeApproveAllTable = false;
            this.financeApproveAllTable = false;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async changeAllManagement() {
      this.desserts.forEach(el => {
        el.approvedManagement = this.managementApproveAllTable;
      });
      let data = [];
      this.desserts.forEach(el => {
        let insert = {
          approvedFinance: el.approvedFinance,
          approvedManagement: el.approvedManagement,
          invoiceNumber: el.invoiceNumber,
          docType: el.docType
        };
        data.push(insert);
      });

      await axios({
        method: "post",
        url: `${url}/ApprovePaymentsAll`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            // this.financeApproveAllTable = false;
            this.managementApproveAllTable = false;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
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
              // this.getPaymentsDue();
              this.getData();
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
    async redirect() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      let data = {
        redirect: "PaymentsDue"
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
  height: 20px;
  width: 20px;
}
.engine {
  background-image: url("../assets/xero.png");
  background-size: contain;
  background-repeat: no-repeat;
}
#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
@media print {
  html,
  body {
    display: none; /* hide whole page */
  }
}
</style>

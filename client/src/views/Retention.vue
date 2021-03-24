<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col cols="10" offset="1">
        <h1>Retention History</h1>
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
              @change="getPaymentCertificates"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
        </v-card>
      </v-col>
      <v-col class="mb-4" cols="10" offset="1">
        <v-card class="mx-auto" max-width="80%" tile v-if="retentions.length">
          <div style="margin: 20 20; padding: 20px;">
            <div
              style="display: flex; justify-content: space-between; font-weight: bold;"
            >
              <span>Total Value</span>
              <span>{{ totalValuations }}</span>
            </div>
            <div
              style="display: flex; justify-content: space-between; font-weight: bold;"
            >
              <span>Total Retention</span>
              <span>{{ totalRetentions }}</span>
            </div>
            <div
              style="display: flex; justify-content: space-between; font-weight: bold;"
            >
              <span>Total Paid</span>
              <span>{{ totalPaid }}</span>
            </div>
            <div
              style="display: flex; justify-content: space-between; font-weight: bold;"
            >
              <span>Total Due</span>
              <span style="color: red;"
                ><u>{{ totalOwing }}</u></span
              >
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col class="mb-4" cols="10" offset="1">
        <v-card class="mx-auto" max-width="90%" tile v-if="retentions.length">
          <v-list>
            <br />
            <v-list-item-group color="primary">
              <div
                style="display: flex; justify-content: space-evenly; color: #0F0F0F; margin-left:25px;"
              >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Discipline</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Unit</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Cert Number</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Inv Number</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Date</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Valuation</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Retention</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Nett</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Paid</u></v-list-item-subtitle
                >
                <v-list-item-subtitle
                  style=" text-align: center; font-weight: bold;"
                  ><u>Cert</u></v-list-item-subtitle
                >
              </div>
              <v-list-item v-for="(item, i) in retentions" :key="i">
                <v-list-item-content>
                  <div
                    style="display: flex; justify-content: space-evenly; margin-right: 20px;"
                  >
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.taskName"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.unitName"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.certificateNumber"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.invoiceNumber"
                    ></v-list-item-title>

                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.createdAt"
                    ></v-list-item-title>

                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.valuationStr"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.retentionStr"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.nettStr"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="text-align: center;"
                      v-text="item.paidStr"
                    ></v-list-item-title>
                  </div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn :id="i" icon @click="getPDF($event)"
                    ><v-icon color="red">mdi-file-pdf-box</v-icon></v-btn
                  >
                  <!-- <v-btn :id="item.id" text>
                    <a
                      style="text-decoration: none;"
                      :href="item.hrefCert"
                      download
                      target="_blank"
                      ><v-icon color="red">mdi-file-pdf-box</v-icon></a
                    >
                  </v-btn> -->
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "Retention",
  components: {
    // PDFViewer,
    PDFViewer: () => import("../components/PDFViewer")
  },
  metaInfo: {
    title: "Retentions",
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
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",

      value: null,
      items: [],
      retentions: [],
      totalValuations: "",
      totalRetentions: "",
      totalPaid: "",
      totalOwing: ""
    };
  },
  mounted() {
    this.getSuppliers();
  },
  methods: {
    getPDF(event) {
      let targetId = event.currentTarget.id;
      // console.log(targetId)
      // console.log(this.retentions)
      let itemToFetch = this.retentions.filter((el, index) => {
        return index === parseInt(targetId);
      });
      // console.log(itemToFetch)
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].certificateNumber;

      // console.log(targetId);
      // console.log(itemToFetch)
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
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
    async getPaymentCertificates() {
      this.retentions = [];
      let newData = this.items.filter(el => {
        return el.supplierName === this.value;
      });

      let data = {
        supplier: newData[0].id,
        development: this.$store.state.development.id
      };

      await axios({
        method: "post",
        url: `${url}/supplierHistory`,
        data: data
      })
        .then(
          response => {
            this.retentions = response.data;
            this.retentions.forEach(el => {
              el.createdAt = el.createdAt.substring(0, 10);
              el.valuationStr = this.convertToString(el.valuation);
              el.retentionStr = this.convertToString(el.retention);
              el.nettStr = this.convertToString(el.nett);
              el.paidStr = this.convertToString(el.paid);
              el.hrefCert = `${process.env.VUE_APP_BASEURL}/${el.certificateNumber}.pdf`;
            });
            this.totalValuations = this.retentions.reduce((acc, pv) => {
              return acc + pv.nett;
            }, 0);
            this.totalRetentions = this.retentions.reduce((acc, pv) => {
              return acc + pv.retention;
            }, 0);
            this.totalPaid = this.retentions.reduce((acc, pv) => {
              return acc + pv.paid;
            }, 0);
            this.totalOwing = this.totalValuations - this.totalPaid;
            this.totalValuations = this.convertToString(this.totalValuations);
            this.totalRetentions = this.convertToString(this.totalRetentions);
            this.totalPaid = this.convertToString(this.totalPaid);
            this.totalOwing = this.convertToString(this.totalOwing);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

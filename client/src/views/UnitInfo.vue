<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col cols="12" sm="10" md="10" offset="1">
        <v-btn @click="back" text>Back</v-btn>
      </v-col>
      <v-col cols="12" sm="10" md="10" offset="1">
        <v-card
          flat
          v-for="investor in investorDetails"
          :key="investor.id"
          color="#FFEBA1"
        >
          <v-card-title>
            <span style="margin-right: 20px;" class="text-h6"
              ><small>Investor: {{ investor.investor }}</small></span
            >
            <v-divider vertical></v-divider>
            <v-btn text @click="back">Back</v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Investor Code"
                    v-model="investor.investor_code"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    :label="investor.formLabel"
                    v-model="investor.formAmount"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    :label="investor.formLabel"
                    v-model="investor.formDate"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
        <v-card v-for="unit in salesData" :key="unit.id" flat>
          <v-card-title>
            <span style="margin-right: 20px;" class="text-h6"
              ><small>Unit: {{ unit.unitName }}</small></span
            >
            <v-divider vertical></v-divider>
            <v-btn text @click="back">Back</v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Base Price"
                    v-model="unit.base_price"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Baths"
                    v-model="unit.bath"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Beds"
                    v-model="unit.beds"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Plans"
                    v-model="unit.unit_type"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Size"
                    v-model="unit.size"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Transfer Date"
                    v-model="unit.transfer_date"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
        <v-card v-for="sale in salesInfo" :key="sale.id" flat color="#F6A9A9">
          <v-card-title>
            <span style="margin-right: 20px;" class="text-h6"
              ><small>Sold: {{ sale.unit }}</small></span
            >
            <v-divider vertical></v-divider>
            <v-btn text @click="back">Back</v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Type"
                    v-model="sale.salePerson"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="First Name"
                    v-model="sale.firstname"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Last Name"
                    v-model="sale.lastname"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4" v-if="sale.saleBuyers > 1">
                  <v-text-field
                    label="First Name"
                    v-model="sale.personTwoFirstName"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4" v-if="sale.saleBuyers > 1">
                  <v-text-field
                    label="Last Name"
                    v-model="sale.personTwoLast"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Marital Status"
                    v-model="sale.marital"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Gas Stove"
                    v-model="sale.gasStoveCost"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Spare Room"
                    v-model="sale.spareRoom"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Mood"
                    v-model="sale.mood"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Floor Plan"
                    v-model="sale.floorplan"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Floor type"
                    v-model="sale.flooring"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Additional Extras"
                    v-model="sale.additionalExtras"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Additional Extras Cost"
                    v-model="sale.additionalExtrasCost"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Parking Bay"
                    v-model="sale.bayNo"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Deposit"
                    v-model="sale.deposit"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Deposit"
                    v-model="sale.depositDate"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Remaining Balance"
                    v-model="sale.balanceRem"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Sale Date"
                    v-model="sale.dateCreated"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <a :href="sale.link" v-if="sale.planType" target="_blank"
                    >View PlanType
                    <v-icon color="blue">mdi-attachment</v-icon>
                  </a>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- </v-dialog> -->
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
  name: "Unitinfo",
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
      investorDetails: [],
      salesData: [],
      salesInfo: [],
      investorDialog: true
    };
  },
  created() {
    // console.log(this.$route.params.id)
    this.getData();
  },
  mounted() {
    // this.processNotifications();
  },
  methods: {
    back() {
      this.$router.back();
    },
    async getData() {
      let data = {
        development: this.$store.state.development.id,
        unitId: parseInt(this.$route.params.id)
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/getUnitInfo`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.investorDetails = response.data[0];
            this.investorDetails.forEach(el => {
              if (el.quinteDate !== null) {
                el.formAmount = this.convertToString(el.amount);
                el.formLabel = "In Quinate";
                el.formDate = dayjs(el.quinteDate).format("YYYY-MM-DD");
              } else if (el.fica_inv_date !== null && el.quinteDate === null) {
                el.formAmount = this.convertToString(el.attorney_inv_amount);
                el.formLabel = "In Momentum";
                el.formDate = dayjs(el.fica_inv_date).format("YYYY-MM-DD");
              } else if (
                el.fica_inv_date === null &&
                el.quinteDate === null &&
                el.la_email_date !== null
              ) {
                el.formAmount = this.convertToString(el.pledged);
                el.formLabel = "Pledged";
                el.formDate = dayjs(el.la_email_date).format("YYYY-MM-DD");
              } else if (el.available_date !== null) {
                el.formAmount = this.convertToString(el.available);
                el.formLabel = "Available - No investor Yet";
                el.formDate = dayjs(el.available_date).format("YYYY-MM-DD");
              }
            });
            this.salesData = response.data[1];
            let unitInfo = response.data[3].filter(el => {
              return el.id == this.salesData[0].unit;
            });
            // console.log("unitInfo",unitInfo)

            this.salesData.forEach(el => {
              el.unitName = unitInfo[0].unitName;
              el.base_price = this.convertToString(el.base_price);
              el.transfer_date = dayjs(el.transfer_date).format("YYYY-MM-DD");
            });
            this.salesInfo = response.data[2];
            this.salesInfo.forEach(el => {
              el.additionalExtrasCost = this.convertToString(
                el.additionalExtrasCost
              );
              el.balanceRem = this.convertToString(el.balanceRem);
              el.deposit = this.convertToString(el.deposit);
              el.gasStoveCost = this.convertToString(el.gasStoveCost);
              el.dateCreated = dayjs(el.dateCreated).format("YYYY-MM-DD");
              el.depositDate = dayjs(el.depositDate).format("YYYY-MM-DD");
              el.link = `${process.env.VUE_APP_BASEURL}/uploads/${el.planType}`;
            });
            console.log(this.salesInfo);
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

<style scoped>
.corner {
  background-color: orange;
  cursor: pointer;
}
svg {
  height: 80vh;
}
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
a {
  font-size: 120%;
  text-decoration: none;
  /* color: red; */
  font-weight: bold;
}
</style>

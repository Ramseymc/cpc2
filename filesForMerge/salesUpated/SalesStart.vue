<template>
  <div>
    <v-row class="text-center">
      <v-col cols="10" offset="1" mb-4>
        <v-card class="mx-auto" max-width="100vw">
          <v-img height="350" :src="flatPic"></v-img>

          <v-card-title>Choose your options</v-card-title>

          <v-card-text>
            <div style="display: flex">
              <v-autocomplete
                style="margin-right: 8px"
                v-model="blockValue"
                :items="blocks"
                dense
                filled
                item-text="subsectionName"
                label="Choose Block"
                @change="chooseUnit"
              ></v-autocomplete>
              <!-- </div>
        <div> -->
              <v-autocomplete
                style="margin-left: 8px"
                v-model="unitValue"
                :items="items"
                dense
                filled
                item-text="unitName"
                label="Choose Unit"
                @change="unitChosen"
              ></v-autocomplete>
              <v-btn
                style="margin-left: 20px"
                v-if="blockValue && unitValue"
                text
                @click="getClientInfo"
                color="primary"
                elevation="3"
                large
                outlined
                rounded
                >Create Sale</v-btn
              >
            </div>
          </v-card-text>
          <!-- <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              v-if="blockValue && unitValue"
              text
              @click="getClientInfo"
              color="primary"
              elevation="3"
              large
              outlined
              rounded
              >Create Sale</v-btn
            >

            <v-spacer></v-spacer>
          </v-card-actions> -->
          <v-divider class="mx-4"></v-divider>
        </v-card>
      </v-col>
    </v-row>

    <ClientUpsert
      v-if="clientDialog"
      :upsertMode="upsertMode"
      :dialog="clientDialog"
      :unitValue="unitValue"
      :planType="planType"
      :editData="salesEditData"
      @closeForm="closeClientForm"
      :unitId="unitId"
    />

    <!-- <ClientInfo
      v-if="clientDialog"
      :blockValue="blockValue"
      :unitValue="unitValue"
      :dialog="clientDialog"
      :planType="planType"
      :unitId="unitId"
      @closeForm="closeClientForm"
    /> -->
  </div>
</template>

<script>
import axios from "axios";
//import ClientInfo from "../components/ClientInfo.vue";
import ClientUpsert from "../components/ClientUpsert.vue";
let url = process.env.VUE_APP_BASEURL;

export default {
  name: "salesstart",
  components: {
    // ClientInfo,
    ClientUpsert,
  },
  data() {
    return {
      blockValue: null,
      unitValue: null,
      unitId: null,
      flatPic: require("../assets/flat.jpg"),
      items: [],
      blocks: [],
      clientDialog: false,
      planType: "",
      upsertMode: "Add", // opening upsert in Add mode (ClientUpsert then empties the editData[] beforeMount)
      salesEditData: [
        {
          salePerson: "",
          saleBuyers: "",
          trustName: "",
          trustNumber: "",
          marital: "",
          firstname: "",
          lastname: "",
          iDNumber: "",
          email: "",
          mobile: "",
          landline: "",
          postalAddress: "",
          residentialAddress: "",
          personTwoMarital: "",
          personTwofirstName: "",
          personTwoLastName: "",
          personTwoIDNumber: "",
          personTwoEmail: "",
          personTwoMobile: "",
          personTwoLandline: "",
          personTwoPostalAddress: "",
          personTwoResidentialAddress: "",
          saleType: "",
          floorplan: "",
          url: "",
          planType: "",
          deposit: "",
          parkingNumber: "",
          gasStove: "",
          kitchenOption: "",
          additionalExtrasCost: "",
          notes: "",
          gardenNumber: "",
          gardenSize: "",
          originalBayNo: "",
          bayNo: "",
          beds: "",
          bath: "",
          enclosedBalcony: "",
          spareRoom: "",
          mood: "",
          flooring: "",
          actualSalesdate: "",

          fileOTP: "",
          fileId: "",

          fileFica: "",
          fileDepositPop: "",
          fileDepPop: "",
          fileBank: "",
          filePaySlip: "",
          personTwoFileID: "",
          personTwoFileFica: "",
          personTwoFileBank: "",
          personTwoFilePaySlip: "",
          salesAgent: "",

          salesAgentPhone: "",
        },
      ],
    };
  },
  async mounted() {
    let data = {
      id: this.$store.state.development.id,
      //id: 1,
    };
    await axios({
      method: "post",
      // method: "get",
      url: `${url}/getblocksforoptionsA`,
      // url: `${url}/ooo`,
      data: data,
    })
      .then(
        (response) => {
          console.log("RESPONSE DATA CONNOR:", response.data);
          this.blocks = response.data.filter((el) => {
            return el.subsectionName !== "Common Area";
          });

          console.log("THIS BLOCKS:",this.blocks);
        },
        (error) => {
          console.log("the Error", error);
        }
      )
      .catch((e) => {
        console.log("THERE IS AN ERROR", e);
      });
  },
  methods: {
    unitChosen() {
      let unitId = this.items.filter((el) => {
        return el.unitName === this.unitValue;
      })[0].id;
      // maybe getSalesData here if it doesnt work 
      console.log("Unit Chosen" , unitId); 

      this.getSalesDataForUnit(unitId);

      this.unitId = unitId;
    },
    async getSalesDataForUnit(unitId) {
      let data = {
        id: unitId,
      };
      await axios({
        method: "post",
        url: `${url}/getSalesDataForUnit`,
        data: data,
      }).then(
        (response) => {
          console.log("get getSalesDataForUnit", response.data[0]);
          // filter through and add each element to the editData 
          // response.data.forEach(salesdata => {
          //   this.salesEditData.push(salesdata);
            
          // });
          console.log("salesDAta",response.data[0].unit_type.length)
          let unitType = []
          if (response.data[0].unit_type.length >= 3) {
            let units = response.data[0].unit_type.split(",")
            units.forEach((el) => {
              unitType.push(el)
            })
          } else {
            unitType.push(response.data[0].unit_type)
          }
          this.planType = unitType
          this.salesEditData.forEach((el) => {
            el.base_price = response.data[0].base_price
            el.parking = response.data[0].parking
            el.extras = response.data[0].extras
            el.contract_price = response.data[0].contract_price
         
            
          })
          console.log("salesEditData after gettingSalesData for unit in SalesStart", this.salesEditData);
          // this.planType = response.data[0].unit_type;

          // this.clientDialog = !this.clientDialog;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    closeClientForm(event) {
      this.clientDialog = event;
    },
    async getClientInfo() {
      let data = {
        unitValue: this.unitValue,
      };
      await axios({
        method: "post",
        url: `${url}/getUnitPlanTypes`,
        data: data,
      }).then(
        (response) => {
          console.log("get client info CONNOOOORRRR ", response.data[0]);
          this.planType = response.data[0].unit_type;

          this.clientDialog = !this.clientDialog;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async chooseUnit() {
      let filteredData = this.blocks.filter((el) => {
        return el.subsectionName === this.blockValue;
      });
      let data = {
        id: this.$store.state.development.id,
        subsection: filteredData[0].id,
        subsectionName: filteredData[0].subsectionName,
        //subsectionName:
      };
      this.blockValue = data.subsectionName;
      console.log("blockValue = ", this.blockValue);
      console.log(data);
      console.log(process.env.VUE_APP_BASEURL);
      // console.log("filteredData for getting subsectionname:", filteredData),
      await axios({
        method: "post",
        url: `${url}/getAvailableUnits`,
        data: data,
      })
        .then(
          (response) => {
            let filteredData = response.data.filter((el) => {
              return el.unitName.substring(2, 1) !== ".";
            });
            this.items = filteredData;
            this.salesEditData[0].salePerson = "";
            this.salesEditData[0].blockValue = this.blockValue;
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.img {
  padding: 20px 20px 20px 0;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.centerimg {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
}
.auto {
  padding: 5px 5px 5px 5px;
}
</style>

<template>
  <v-card class="mx-auto" max-width="1800">
    <v-toolbar color="#0F0F0F" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>Sales</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field
        prepend-icon="mdi-magnify"
        placholder="Search"
        label="Search"
        v-model="search"
      ></v-text-field>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="salesFiltered"
      :items-per-page="15"
      class="elevation-1"
      dense
    >
      <template v-slot:item.edit="{ item }">
        <v-chip
          :id="item.id"
          small
          dark
          color="blue darken-3"
          @click="editItem"
        >
          <span style="font-size: 0.905em">Edit</span>
        </v-chip>
      </template>

      <template v-slot:item.files="{ item }">
        <v-chip
          :id="item.id"
          small
          dark
          color="green darken-3"
          @click="showFiles"
        >
          <span class="mdi mdi-file-multiple"></span>
        </v-chip>
      </template>

      <template v-slot:item.signOff="{ item }">
        <v-chip
          :id="item.id"
          small
          dark
          color="grey darken-3"
          @click="openSignOff"
        >
          <span class="mdi mdi-checkbox-marked"></span>
        </v-chip>
      </template>

      <template v-slot:item.email="{ item }">
        <v-chip
          :id="item.id"
          small
          dark
          color="purple darken-3"
          @click="emailItem"
        >
          <span style="font-size: 0.905em">Email</span>
        </v-chip>
      </template>

      <template v-slot:item.delete="{ item }">
        <v-chip
          :id="item.id"
          small
          dark
          color="red darken-3"
          @click="deleteItem"
        >
          <span style="font-size: 0.905em">X</span>
        </v-chip>
      </template>
    </v-data-table>

    <ClientUpsert
      v-if="salesEditData.length > 0"
      :upsertMode="upsertMode"
      :dialog="clientDialog"
      :editData="salesEditData"
      @closeForm="closeClientForm"
      :unitValue="unitValue"
      :planType="planType"
      :unitId="unitId"
    />
    <ClientFiles
      v-if="clientFilesData.length > 0"
      :dialogFiles="clientFileDialog"
      :fileData="clientFilesData"
      @closeForm="closeClientFiles"
    />
    <SignOff
      v-if="signOffData.length > 0"
      :dialogFiles="signOffDialog"
      :fileData="signOffData"
      @closeForm="closeSignOffForm"
    />
  </v-card>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import ClientFiles from "../components/ClientFiles.vue";
import ClientUpsert from "../components/ClientUpsert.vue";
import SignOff from "../components/signOffOTP.vue";

export default {
  name: "salesinfo",

  components: {
    ClientFiles,
    ClientUpsert,
    SignOff,
  },
  data() {
    return {
      upsertMode: "Edit",
      headers: [
        { text: "Edit", value: "edit", sortable: false },
        { text: "Files", value: "files", sortable: false }, // i want an icon that launches ClientFiles component
        { text: "Delete", value: "delete", sortable: false },
        { text: "Block", align: "start", sortable: true, value: "block" },
        { text: "Unit", value: "unit", sortable: true }, // i want to wrap a button around that launches ClientUpsert with upsertMode = "Update"
        { text: "First Name", value: "firstname", sortable: true },
        { text: "Last Name", value: "lastname", sortable: true },
        { text: "2nd Person FirstName", value: "personTwoFirstName", sortable: true,},
        { text: "2nd Person Last Name", value: "personTwoLastName", sortable: true,},
        { text: "Step", value: "step", sortable: true }, // i might need to build a component to display which step we are on - this is future work - will just show send email for now ? we need db flags, to add a step field to the salesinfo table and perhaps a steps table to hold information about the step (stepId, Name, description, etc )
        { text: "OTP", value: "signOff", sortable: false },
        { text: "Email", value: "email", sortable: false },
      ],
      desserts: [],

      filesicon: "",
      step: "",
      showActions: false,
      blockValue: null,
      unitValue: "",
      planType: null,
      flatPic: require("../assets/flat.jpg"),
      items: [],
      blocks: [],
      clientDialog: Boolean,
      dialog: null,
      el: "#v-for-object",
      sales: [],
      // url: "",
      salesEditData: [],
      search: "",
      unitId: 0,
      personTwo1: "Person",
      personTwo2: "Two",
      // client Files dialog
      clientFileDialog: false,
      clientFilesData: [],
      dialogFiles: null,
      signOffDialog: false,
      signOffData: [],
      
    };
  },
  computed: {
    salesFiltered() {
      if (this.search === "") {
        return this.desserts;
      } else {
        return this.desserts.filter((el) => {
          return (
            !this.search ||
            el.block.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.unit.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.firstname.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            el.lastname.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.personTwoFirstName
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) > -1 ||
            el.personTwoLastName
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) > -1
          );
        });
      }
    },
  },
  async mounted() {
    // this.url = this.$store.state.url;
    this.initialData();
  },
  methods: {
    redirectToUnitInfo(event) {
      let unitId = this.sales.filter((el) => {
        return el.id === parseInt(event.currentTarget.id);
      })[0].unitId;
      this.$router.push({ name: `UnitInfo`, params: { id: unitId } });
    },

    editItem(event) {
      let targetId = event.currentTarget.id; //Spot on

      this.salesEditData = this.sales.filter((el) => {
        return el.id === parseInt(targetId);

      });
      console.log("DEZ$ editItem & salesEditData= ", this.salesEditData);
      console.log("DEZ$ editItem & UnitValue= ", this.unitValue);
      this.clientDialog = true;
    },
    async emailItem(event) {
      let targetId = event.currentTarget.id;
      console.log("Target Id", targetId);
      console.log("Email Item SalesEditData = ", this.sales);
      let emailInfo = this.sales.filter((el) => {
        return el.id == parseInt(targetId);
      });

      let data = {
        info: emailInfo,
      };

      await axios({
        method: "post",
        url: `${url}/sendSalesInfoEmail`,
        data: data,
      })
        .then(
          (response) => {
            console.log("CLIENT-SIDE: RESPONSE DATA (sendSalesInfoEmail): ", response.data);
            if (response.data.success === true) {
              this.initialData();
            }
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log("Error sending email", e);
        });
    },
    async initialData() {
      let data = {
        id: 1,
      };
      await axios({
        method: "post",
        url: `${url}/getClientInfoForSalesInfo`,
        data: data,
      })
        .then(
          (response) => {
            console.log("CLIENT-SIDE: RESPONSE DATA: ", response.data);

            this.sales = response.data;
            this.desserts = response.data;
            this.unitId = response.data.unitId;
            this.unitValue = response.data.unit;
            this.sales.forEach((el) => {
              el.unitValue = response.data.unit;
              el.fileOTPurl = `${url}/uploads/${el.fileOTP}`;

              if (
                el.fileOTP === "" || el.fileOTP === "undefined" ||
                el.fileId === "" || el.fileId === "undefined" ||
                el.fileBank === "" || el.fileBank === "undefined" ||
                el.filePaySlip === "" || el.filePaySlip === "undefined" ||
                el.fileFica === "" ||  el.fileFica === "undefined"
              ) {
                el.iconColor = "red";
                el.step1colour = "lime lighten-2";
              } else {
                el.iconColor = "green";
                el.step1colour = "green accent-3";
              }
              if (el.salesEmailSent === "Y") {
                el.emailIconColor = "green darken-1";
              } else {
                el.emailIconColor = "orange lighten-2";
              }
            });
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log("Error getting sales info", e);
        });
    },
    async deleteItem(event) {
      // get the id of clicked item (its element has an 'id' which we binded to it during the data call)
      let targetValue = event.currentTarget.id;
      console.log("SALES CLIENT SIDE: ", this.sales);
      let data = {
        id: targetValue,
        unit: this.sales[0].unit,
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/deleteSalesRecord`,
        data: data,
      })
        .then(
          (response) => {
            console.log("CLIENT-SIDE: RESPONSE DATA: ", response.data);
            this.initialData();
          },
          (error) => {
            console.log("Error Deleting", error);
          }
        )
        .catch((e) => {
          console.log("THERE IS AN ERROR", e);
        });
    },
    async showFiles(event) {
      console.log(event);
      let targetVal = event.currentTarget.id;
      this.clientFilesData = this.sales.filter((el) => {
        return el.id === parseInt(targetVal);
      });
      console.log("DEZ$ Files Dialog&clientFilesData=",this.clientFilesData);
      this.clientFileDialog = true;
    },
    async openSignOff(event) {
      console.log(event);
      let targetVal = event.currentTarget.id;
      console.log(targetVal);
      this.signOffData = this.sales.filter((el) => {
        return el.id === parseInt(targetVal);
      });
      console.log("DEZ$ SignOff Dialog&signOffData=",this.signOffData);
      this.signOffDialog = true;
    },

    closeClientForm(event) {
      this.clientDialog = event;
      this.initialData();
    },
    getClientInfo() {
      this.clientDialog = !this.clientDialog;
    },
    getClientFiles() {
      this.clientFileDialog = !this.clientFileDialog;
    },
    getSignOff() {
      this.signOffDialog = !this.signOffDialog;
    },
    closeSignOffForm(event) {
      this.signOffDialog = event;
      this.initialData();
    },
    closeClientFiles(event) {
      this.clientFileDialog = event;
    },
  },
};
</script>

<style scoped></style>

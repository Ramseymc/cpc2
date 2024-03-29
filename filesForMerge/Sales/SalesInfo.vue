<template>
  <!-- 
          TYPE: View
          NAME: SalesInfo
       PURPOSE: a list of the sales with actions (update, delete, edit, view files)
          DATE: July 2021
          AUTH: Connor McLean, Wayne Bruton
 -->
  <v-container>
    <v-row justify="center">
      <div class="about">
        <br /><br /><br />
        <v-card class="mx-auto" max-width="1500" width="1000">
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
          >

          <template v-slot:item.edit="{ item }">
            <v-chip
              :id="item.id"
              small
              dark
              color="blue darken-2"
              @click="editItem"
            >
              Edit
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
              Files
            </v-chip>
          </template>
          </v-data-table>

        </v-card>
      </div>
    </v-row>
    <ClientUpsert
      v-if="salesEditData.length > 0"
      :upsertMode="upsertMode"
      :dialog="clientDialog"
      :editData="salesEditData"
      @closeForm="closeClientForm"
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
  </v-container>
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
    SignOff
  },
  data() {
    return {
      upsertMode: "Edit",
      headers: [
          { text: 'Edit', value: 'edit' , sortable: false,},
          { text: 'Files', value: 'files', sortable: false,  },  // i want an icon that launches ClientFiles component   
          { text: 'Block', align: 'start', sortable: true, value: 'block', },          
          { text: 'Unit', value: 'unit', sortable: true,}, // i want to wrap a button around that launches ClientUpsert with upsertMode = "Update"          
          { text: 'First Name', value: 'firstname', sortable: true,},
          { text: 'Last Name', value: 'lastname', sortable: true, },         
          { text: '2nd Person FirstName', value: 'personTwoFirstName', sortable: true,},
          { text: '2nd Person Last Name', value: 'personTwoLastName', sortable: true, },
          { text: 'Step', value: 'step', sortable: true, }, // i might need to build a component to display which step we are on - this is future work - will just show send email for now ? we need db flags, to add a step field to the salesinfo table and perhaps a steps table to hold information about the step (stepId, Name, description, etc )          
        ],
      desserts: [],

      filesicon: "",
      step: "",

      showActions: false,
      blockValue: null, //From Dropdown
      unitValue: null,
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
      signOffData: []
    };
  },
  computed: {
    salesFiltered() {
      if (this.search === "") {
        return this.desserts;
      } else {
        return this.desserts.filter(el => {
          return (
            !this.search ||
            
            el.block.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.unit.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.firstname.toLowerCase().indexOf(this.search.toLowerCase()) > -1 
            || el.lastname.toLowerCase().indexOf(this.search.toLowerCase()) > -1 
            || el.personTwoFirstName.toLowerCase().indexOf(this.search.toLowerCase()) > -1 
            || el.personTwoLastName.toLowerCase().indexOf(this.search.toLowerCase()) > -1 
          );
        });
      }
    }
  },
  async mounted() {
    // this.url = this.$store.state.url;
    this.initialData();
  },
  methods: {
    redirectToUnitInfo(event) {
      let unitId = this.sales.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      })[0].unitId;
      this.$router.push({ name: `UnitInfo`, params: { id: unitId } });
    },

    editItem(event) {
      let targetId = event.currentTarget.id; //Spot on
      // console.log("id",event.currentTarget.id;)
      this.salesEditData = this.sales.filter(el => {
        return el.id === parseInt(targetId);
      });
      console.log("ZZZZZ@@", this.salesEditData);
      this.clientDialog = true;
    },
    async emailItem(event) {
      let targetId = event.currentTarget.id;
      console.log("Target Id", targetId);
      console.log("Email Item SalesEditData = ", this.sales);
      let emailInfo = this.sales.filter(el => {
        return el.id == parseInt(targetId);
      });

      let data = {
        info: emailInfo
      };

      await axios({
        method: "post",
        url: `${url}/sendSalesInfoEmail`,
        data: data
      })
        .then(
          response => {
            console.log("CLIENT-SIDE: RESPONSE DATA: ", response.data);
            if (response.data.success === true) {
              this.initialData();
            }
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log("THERE IS AN ERROR", e);
        });
    },
    async initialData() {
      let data = {
        id: 1
      };
      await axios({
        method: "post",
        url: `${url}/getClientInfoForSalesInfo`,
        data: data
      })
        .then(
          response => {
            console.log("CLIENT-SIDE: RESPONSE DATA: ", response.data);

            this.sales = response.data;
            this.desserts = response.data;
            this.unitId = response.data.unitId;
            this.sales.forEach(el => {
              el.fileOTPurl = `${url}/uploads/${el.fileOTP}`;
              // console.log("FileId", el.fileId);
              if (
                el.fileOTP === "" ||
                el.fileOTP === "undefined" ||
                el.fileId === "" ||
                el.fileId === "undefined" ||
                el.fileBank === "" ||
                el.fileBank === "undefined" ||
                el.filePaySlip === "" ||
                el.filePaySlip === "undefined" ||
                el.fileFica === "" ||
                el.fileFica === "undefined"
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
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log("THERE IS AN ERROR", e);
        });
    },
    async deleteItem(event) {
      // get the id of clicked item (its element has an 'id' which we binded to it during the data call)
      let targetValue = event.currentTarget.id;
      console.log("SALES CLIENT SIDE: ", this.sales);
      let data = {
        id: targetValue,
        unit: this.sales[0].unit
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/deleteSalesRecord`,
        data: data
      })
        .then(
          response => {
            console.log("CLIENT-SIDE: RESPONSE DATA: ", response.data);
            this.initialData();
          },
          error => {
            console.log("Error Deleting", error);
          }
        )
        .catch(e => {
          console.log("THERE IS AN ERROR", e);
        });
    },
    async showFiles(event) {
      console.log(event);
      let targetVal = event.currentTarget.id;
      this.clientFilesData = this.sales.filter(el => {
        return el.id === parseInt(targetVal);
      });
      console.log("File Dialog");
      this.clientFileDialog = true;
    },
    async openSignOff(event) {
      console.log(event);
      let targetVal = event.currentTarget.id;
      console.log(targetVal);
      this.signOffData = this.sales.filter(el => {
        return el.id === parseInt(targetVal);
      });
      this.signOffDialog = true;
    },
    checkForAllFiles() {
      let files = [];
      let contains = [];
      if (this.fileOPT !== null) {
        contains.push("fileOTP");
        files.push(this.fileOPT); // append mimetype here?
      }
      if (this.fileId !== null) {
        contains.push("fileId");
        files.push(this.fileId);
      }
      if (this.fileBank !== null) {
        contains.push("fileBank");
        files.push(this.fileBank);
      }
      if (this.filePaySlip) {
        this.filePaySlip.forEach(el => {
          contains.push("filePaySlip");
          files.push(el);
        });
      } else {
        console.log("No File");
      }

      if (this.fileFica) {
        this.fileFica.forEach(el => {
          contains.push("fileFica");
          files.push(el);
        });
      } else {
        console.log("No File");
      }

      console.log("Check for all files, files = ", files);
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
      console.log("THE EVENT", event);
      this.clientFileDialog = event;
    }
  }
};
</script>

<style scoped></style>

<template>
  <div class="about">
    <!-- Header row with Create button and Search Bar -->
    <br />
    <v-row>
      <v-col cols="3">
        <h1>View Investors</h1>
      </v-col>
      <v-col cols="4">
        <!-- Search -->
        <v-text-field
          prepend-icon="mdi-magnify"
          placholder="Search"
          label="Search"
          v-model="searchInvestors"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <!-- </v-col>
        <v-col cols="3"> -->
        <v-btn-toggle v-model="icon" borderless>
          <v-btn value="home" color="cyan lighten-2" @click="home">
            <v-icon right> mdi-home </v-icon>
          </v-btn>

          <v-btn value="refresh" color="green lighten-1" @click="refresh">
            <span>Refresh</span>

            <v-icon right> mdi-refresh </v-icon>
          </v-btn>

          <v-btn value="create" color="primary" @click="create">
            <span class="hidden-sm-and-down">Create</span>

            <v-icon right> mdi-account-plus </v-icon>
          </v-btn>

          <!-- <v-btn value="right">
          <span class="hidden-sm-and-down">Right</span>

          <v-icon right>
            mdi-format-align-right
          </v-icon>
        </v-btn>

        <v-btn value="justify">
          <span class="hidden-sm-and-down">Justify</span>

          <v-icon right>
            mdi-format-align-justify
          </v-icon>
        </v-btn> -->
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="investorsFiltered"
      :items-per-page="15"
      class="elevation-1"
    >
      <!--       
        <template v-slot:item.viewInvestor="{ item }">
            <v-chip :id="item.investor_id" small color="orange" @click="viewInvestor"> 
              View
            </v-chip>
          </template>

          -->
      <template v-slot:item.viewInvestor="{ item }">
        <v-chip
          :id="item.investor_id"
          small
          dark
          color="blue"
          @click="viewInvestor"
        >
          Edit
        </v-chip>
      </template>

      <template v-slot:item.viewInvestments="{ item }">
        <v-chip
          :id="item.investor_id"
          small
          dark
          color="green"
          @click="viewInvestments"
        >
          Investments
        </v-chip>
      </template>
    </v-data-table>

    <!-- Table -->
    <!--    
    <v-simple-table v-resize="onResize" align="center" justify="center">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Investor Code   | Edit Investor </th>
            <th class="text-left"> | View Investments </th>
            <th class="text-left"> | Name </th>
            <th class="text-left"> | Email </th>
            <th class="text-left"> | ID </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="investor in investorsFiltered" :key="investor.investor_id">
            <td>
              {{ investor.investor_acc_number }}
              <v-btn :id="investor.investor_id" text @click="viewInvestor">
                
                <v-icon right> mdi-account-edit </v-icon>
                </v-btn>
                

             
            </td>
           
            <td> <v-btn :id="investor.investor_id"  @click="viewInvestments" color="blue">
                <v-icon right> mdi-magnify </v-icon>
                <v-icon right> mdi-format-list-bulleted </v-icon>
              </v-btn>
              </td>
            <td>
             
              {{ investor.investor_name }} {{ investor.investor_surname }}
      
            </td>
            <td>{{ investor.investor_email }}</td>
            <td>{{ investor.investor_id_number }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table> -->

    <!-- <InvestmentView
      v-if="openInvestmentViewForm"
      :dialog="openInvestmentViewForm"
      :investorId="investorId"
      @closeForm="closeForm"
    />
    <InvestorUpdate
      v-if="openInvestmentViewForm"
      :dialog="openInvestmentViewForm"
      :investorId="investorId"
      @closeForm="closeForm" -->
    />
  </div>
</template>

<script>
import axios from "axios";
// import InvestmentView from "./InvestmentView.vue";
// import InvestorUpdate from "../components/InvestmentUpdate.vue";
let url = process.env.VUE_APP_BASEURL;

export default {
  name: "investorviewmain",
  components: {
    // InvestmentView,
    // InvestorUpdate,
  },

  metaInfo: {
    title: "Investor View",
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
      // investor data

      // write a method to this get all investor
      InvestorList: [],
      searchInvestors: "",
      investorId: "",
      SelectedInvestorId: "",
      openInvestmentViewForm: false,
      text: "center",
      icon: "justify",

      windowSize: {
        x: 0,
        y: 0
      },

      //how do you wrap a button into a cell
      headers: [
        {
          text: "Code",
          value: "investor_acc_number",
          sortable: true,
          width: 100
        },

        { text: "Edit", value: "viewInvestor", width: "50" },
        { text: "View", value: "viewInvestments", width: "50" },
        { text: "Name", value: "investor_name" },
        { text: "Email", value: "investor_email" },
        { text: "Contact No", value: "investor_mobile" },
        { text: "IDNumber", value: "investor_id_number" }
      ],
      desserts: []
    };
  },

  async mounted() {
    this.getAllInvestors();
    this.onResize();
  },

  computed: {
    pageUrl() {
      return "page.html?id=" + this.investorId;
    },
    investorsFiltered() {
      if (this.searchInvestors === "") {
        console.log("InvestorList = ", this.desserts);
        return this.desserts;
      } else {
        return this.desserts.filter(el => {
          console.log("Search Investors  ", this.searchInvestors);
          return (
            !this.searchInvestors ||
            el.investor_name
              .toLowerCase()
              .indexOf(this.searchInvestors.toLowerCase()) > -1 ||
            el.investor_surname
              .toLowerCase()
              .indexOf(this.searchInvestors.toLowerCase()) > -1 ||
            el.investor_acc_number
              .toLowerCase()
              .indexOf(this.searchInvestors.toLowerCase()) > -1 ||
            el.investor_email
              .toLowerCase()
              .indexOf(this.searchInvestors.toLowerCase()) > -1 ||
            el.investor_id_number
              .toLowerCase()
              .indexOf(this.searchInvestors.toLowerCase()) > -1
          );
        });
      }
    }
  },

  watch: {},

  methods: {
    home() {
      this.$router.push({
        name: "Home"
      });
    },
    create() {
      this.$router.push({
        name: "investoradd"
      });
    },

    viewInvestor(event) {
      console.log(event.currentTarget.id);
      // this.$router.push({})
      this.$router.push({
        //name: "investmentview",
        name: "investorupdate",
        params: { id: event.currentTarget.id }
      });
    },
    viewInvestments(event) {
      console.log(event.currentTarget.id);
      // this.$router.push({})
      this.$router.push({
        name: "investmentviewmain",
        //name: "investorupdate",
        params: { id: event.currentTarget.id }
      });
    },
    refresh() {
      location.reload();
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    openInvestmentUpdate(theEvent) {
      this.SelectedInvestorId = theEvent.srcElement.id;
      this.openInvestmentViewForm = !this.openInvestmentViewForm;
    },
    closeForm(event) {
      this.openInvestmentUpdateForm = event;
    },

    async getAllInvestors() {
      this.desserts = [];
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getAllInvestors`, // use the store url
        data: data
      })
        .then(
          response => {
            console.log("store dev = ", this.$store.state.development.id);
            response.data.forEach(investor => {
              investor.investorUpdateHref = `<a href="${process.env.VUE_APP_BASEURL}/investorupdate/${investor.investor_id}> View </a>`;
              this.desserts.push(investor);
            });
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

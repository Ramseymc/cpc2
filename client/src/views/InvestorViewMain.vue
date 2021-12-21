<template>
  <div class="about">
     <v-toolbar color="#0F0F0F" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>Investors</v-toolbar-title>
      <v-spacer></v-spacer>
         <v-row>
  
     
      <v-col cols="4">
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
        </v-btn-toggle>
      </v-col>
    </v-row>

      <v-spacer></v-spacer>
    </v-toolbar>
   <v-row>
     <v-spacer></v-spacer>
      <v-text-field
        prepend-icon="mdi-magnify"
        placholder="Search"
        label="Search"
        v-model="searchInvestors"
      ></v-text-field>
    </v-row>
    <!-- Header row with Create button and Search Bar -->
    
    <v-data-table
      :headers="headers"
      :items="investorsFiltered"
      :items-per-page="15"
      class="elevation-1"
      dense
    >
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

    />
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;

export default {
  name: "investorviewmain",
  components: {},

  metaInfo: {
    title: "Investor View",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `About CPC here.`,
      },
    ],
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },

  data() {
    return {
      InvestorList: [],
      searchInvestors: "",
      investorId: "",
      SelectedInvestorId: "",
      openInvestmentViewForm: false,
      text: "center",
      icon: "justify",

      windowSize: {
        x: 0,
        y: 0,
      },

      headers: [
        {
          text: "Code",
          value: "investor_acc_number",
          sortable: true,
          width: 100,
        },

        { text: "Edit", value: "viewInvestor", width: "50" },
        { text: "View", value: "viewInvestments", width: "50" },
        { text: "Name", value: "investor_name" },
        { text: "Email", value: "investor_email" },
        { text: "Contact No", value: "investor_mobile" },
        { text: "IDNumber", value: "investor_id_number" },
      ],
      investors: [],
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
        console.log("InvestorList = ", this.investors);
        return this.investors;
      } else {
        return this.investors.filter((el) => {
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
    },
  },

  watch: {},

  methods: {
    home() {
      this.$router.push({
        name: "Home",
      });
    },
    create() {
      this.$router.push({
        name: "investoradd",
      });
    },

    viewInvestor(event) {
      console.log(event.currentTarget.id);
      this.$router.push({
        name: "investorupdate",
        params: { id: event.currentTarget.id },
      });
    },
    viewInvestments(event) {
      console.log(event.currentTarget.id);
      this.$router.push({
        name: "investmentviewmain",

        params: { id: event.currentTarget.id },
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
      this.investors = [];
      let data = {
        id: this.$store.state.development.id,
      };
      await axios({
        method: "post",
        url: `${url}/getAllInvestors`, // use the store url
        data: data,
      })
        .then(
          (response) => {
            console.log("store dev = ", this.$store.state.development.id);
            response.data.forEach((investor) => {
              investor.investorUpdateHref = `<a href="${process.env.VUE_APP_BASEURL}/investorupdate/${investor.investor_id}> View </a>`;
              this.investors.push(investor);
            });
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

<template>
  <div class="about">

    <v-row>
    <v-toolbar color="#0F0F0F" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>Investments</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-col cols="8">
        <h2>{{ this.InvestorCode }} - {{ this.InvestorName }}</h2>
      </v-col>
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
              <v-spacer></v-spacer>
      </v-col>
    </v-row>

   
    </v-toolbar>
    </v-row>
    <v-row>
     <v-spacer></v-spacer>
      <v-text-field
        prepend-icon="mdi-magnify"
        placholder="Search"
        label="Search"
        v-model="searchInvestments"
      ></v-text-field>
    </v-row>

    <span v-if="!investmentsExist">
      Does not have any investments yet, you may create one using the 'Create'
      button
    </span>

    <v-data-table
      :headers="headers"
      :items="investmentsFiltered"
      :items-per-page="10"
      class="elevation-1"
      v-if="investmentsExist"
      dense
    >
      <template v-slot:item.edit="{ item }">
        <v-chip
          :id="item.investment_id"
          small
          dark
          color="blue"
          @click="viewInvestment"
        >
          Edit
        </v-chip>
      </template>
    </v-data-table>

    <!-- <InvestmentUpdate
      v-if="openInvestmentUpdateForm"
      :dialog="openInvestmentUpdateForm"
      :investorId="investorId"
      @closeForm="closeUpdateForm"
    />
    <InvestmentAdd
      v-if="openInvestmentViewForm"
      :dialog="openInvestmentViewForm"
      :investorId="investorId"
      @closeForm="closeForm" />
      -->
   
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
// import InvestmentUpdate from "../components/InvestmentUpdate.vue";
// import InvestmentAdd from "../components/InvestmentAdd.vue";
//import * as dayjs from "dayjs";
//import * as imageConversion from "image-conversion";

export default {
  name: "investmentviewmain",
  components: {
    // InvestmentUpdate,
    // InvestmentAdd,
  },
  metaInfo: {
    title: "Investment View",
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
  props: {
    dialog: Boolean,
    investorId: String
  },
   data() {
    return {
      // investment data
      InvestmentList: [],
      searchInvestments: "",
      paramId: 0,
      openInvestmentUpdateForm: "",
      openInvestmentViewForm: false,
      text: "center",
      icon: "justify",
      InvestorCode: "",
      InvestorName: "",
      investmentsExist: false,
      //investorId: "",
      headers: [
        {
          text: "Investor Code",
          value: "investor_acc_number",
          sortable: true,
          width: 100
        },

        { text: "Date Created ", value: "datecreated", width: "120" },
        { text: "Edit", value: "edit", width: "50" },
        { text: "Date Funds Paid ", value: "dateCreated", width: "120" },
        { text: "Investment Amount", value: "investment_amount" }
        // { text: 'Email', value: 'investor_email' },
      ],
      investments: []
    };
   },


  async mounted() {
    // get the investor_id to filter on
    this.paramId = parseInt(this.$route.params.id);

    this.getAllInvestments();
  },

  computed: {
    investmentsFiltered() {
      if (this.searchInvestments === "") {
        console.log("InvestorList = ", this.investments);
        return this.investments;
      } else {
        return this.investments.filter(el => {
          console.log("Search Investors  ", this.searchInvestments);
          return (
            !this.searchInvestments ||
            el.investor_name
              .toLowerCase()
              .indexOf(this.searchInvestments.toLowerCase()) > -1 ||
            el.datecreated
              .toLowerCase()
              .indexOf(this.searchInvestments.toLowerCase()) > -1 ||
            el.investor_acc_number
              .toLowerCase()
              .indexOf(this.searchInvestments.toLowerCase()) > -1
            //el.investor_email.toLowerCase().indexOf(this.searchInvestments.toLowerCase()) > -1 ||
            //el.investor_id_number.toLowerCase().indexOf(this.searchInvestments.toLowerCase()) >
            //-1
          );
        });
      }
    }
  },

  watch: {},

  methods: {
    closeUpdateForm() {
      console.log("Closing update form investorId = ", this.investorId);
      this.refresh();
    },
    viewInvestment(event) {
      console.log(event.currentTarget.id);
      // this.$router.push({})
      this.$router.push({
        //name: "investmentview",
        name: "investmentupdate",
        params: { id: event.currentTarget.id }
      });
    },
    create() {
      this.$router.push({
        name: "investmentadd",
        params: { id: this.paramId }
        //params: { id: event.currentTarget.id },
      });
    },
    refresh() {
      this.searchInvestments = "";
      this.getAllInvestments();
    },
    back() {
      this.$router.push({
        name: "investorview"
        //params: { id: event.currentTarget.id },
      });
    },
    // viewInvestment(event) {
    //   console.log(event.currentTarget.id);
    //   // this.$router.push({})
    //   this.$router.push({
    //     name: "investmentupdate",
    //     params: { id: event.currentTarget.id },
    //   });
    //   console.log("view investment done");
    // },

    async getInvestorDetails() {
      this.investments = [];
      let data = {
        id: this.$store.state.development.id,
        paramId: this.paramId
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/getInvestorDetails`, // use store url
        data: data
      })
        .then(
          response => {
            response.data.forEach(investment => {
              this.investments.push(investment);

              this.InvestorCode = investment.investor_acc_number;
              this.InvestorName =
                investment.investor_name + " " + investment.investor_surname;
            });
            console.log("this.Investment List = ", this.investments);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async getAllInvestments() {
      this.investments = [];
      let data = {
        id: 1, // use the $store.developement.id
        paramId: this.paramId
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/getAllInvestments`, // use store url
        data: data
      })
        .then(
          response => {
            response.data.forEach(investment => {
              this.investments.push(investment);
              this.InvestorCode = investment.investor_acc_number;
              this.InvestorName =
                investment.investor_name + " " + investment.investor_surname;
            });
            if (this.investments.length === 0) {
              this.investmentsExist = false;
              this.getInvestorDetails();
            } else {
              this.investmentsExist = true;
            }
            console.log("this.Investment List = ", this.investments);
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

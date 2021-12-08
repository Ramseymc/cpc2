<template>
  <div>
    <!-- <input type="file" onchange="this.loadFile(this.files[0])"> -->

    <br />

    <!-- <pre id="output"></pre>  -->
    <v-container fluid>
      <div>
        <br />
        <v-row>
          <v-layout align-center justify-center style="padding: 8px">
            <v-container>
              <div>
                <v-row>
                  <h1>Dash Board Management</h1>

                  <!-- <v-btn-toggle v-model="icon" borderless> -->
                  <!-- <v-btn value="home" color="green" @click="home">
                    <v-icon right> mdi-home </v-icon>
                  </v-btn> -->
                </v-row>
              </div>
              <v-row>
                <h2>
                  Development:
                  {{ this.$store.state.development.developmentName }}
                </h2>
              </v-row>
              <v-row>
                <span> Select Development </span>
              </v-row>
              <v-row>
                <br />
                <v-col cols="2">
                  <v-btn @click="setDev(1, 'Endulini')" value="1">
                    ENDULINI
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn @click="setDev(2, 'Heron Fields')"> HF </v-btn>
                </v-col>
                <!-- <v-col cols="2"> <v-btn @click="setDev(3),''"> HV </v-btn> </v-col> -->
              </v-row>

              <!-- totals and calculations -->
              <v-row>
                <!-- <v-col cols="4">
             
                  <v-text-field
                    v-model="investmentTotals"
                    label="Investments Totals :"
                  ></v-text-field>
                </v-col> -->
              </v-row>

              <v-row>
                <v-col cols="4"> </v-col>

                <v-row> </v-row>
                <!--  this is the right hand side -->

                <v-col cols="12">
                  <v-row>
                    <v-btn color="primary" @click="createInvestor">
                      <span class="hidden-sm-and-down">Register Investor</span>

                      <v-icon right> mdi-account-plus </v-icon>
                    </v-btn>
                  </v-row>
                  <v-row>
                    <v-btn color="primary" @click="viewInvestors">
                      <span class="hidden-sm-and-down">Browse Investors</span>

                      <v-icon right> mdi-format-align-justify </v-icon>
                    </v-btn>
                  </v-row>

                  <!-- reset form row -->
                  <v-row>
                    <v-btn color="primary" disabled>
                      <span class="hidden-sm-and-down">Reporting</span>

                      <v-icon right> mdi-note-multiple-outline </v-icon>
                    </v-btn>
                  </v-row>
                  <v-row>
                    <v-btn color="primary" disabled>
                      <span class="hidden-sm-and-down">Calculations</span>

                      <v-icon right> mdi-chart-bar-stacked </v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4">
                  <v-btn color="secondary" disabled>
                    <span>Refresh</span>

                    <v-icon right> mdi-refresh </v-icon>
                  </v-btn>
                </v-col>

                <v-snackbar v-model="snackbar">
                  {{ snackbarMessage }}
                  <v-btn color="pink" text @click="snackbar = false">
                    Close
                  </v-btn>
                </v-snackbar>
              </v-row>
            </v-container>
          </v-layout>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
//let url = process.env.VUE_APP_BASEURL;

export default {
  name: "investorDashboard",
  components: {},
  metaInfo: {
    title: "Create Investor",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Join CPC here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data: () => ({
    name: "",
    investmentTotals: 0,
    snackbar: false,
    snackbarMessage: ""
  }),
  beforeMount() {
    let user = this.$store.state.userName;
    console.log(user);
    // if (
    //   user !== "Wayne Bruton" &&
    //   user !== "Connor McLean" &&
    //   user !== "Nick Morgan" &&
    //   user !== "Debbie Landsberg"
    // ) {
    //   this.$router.push({ name: "Home" });
    // }
  },

  methods: {
    setDev(dev, devName) {
      this.$store.state.development.id = dev;
      this.$store.state.development.developmentName = devName;
      console.log(this.$store.state.development.id);
    },
    viewInvestors() {
      // this.$router.push({})
      console.log("launch view");
      this.$router.push({
        //name: "investmentview",
        name: "investorview"
        //params: { id: event.currentTarget.id },
      });
    },
    createInvestor() {
      console.log("launch add");
      this.$router.push({
        name: "investoradd"
        //params: { id: this.paramId },
        //params: { id: event.currentTarget.id },
      });
    },
    async loadFile(file) {
      let text = await file.text();
      document.getElementById("output").textContent = text;
    }
  }
};
</script>

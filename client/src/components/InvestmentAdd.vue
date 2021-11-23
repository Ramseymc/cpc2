<template>
  <v-container fluid>
    <br />
    <v-row>
      <v-col cols="7"> </v-col>
      <v-col cols="4">
        <v-btn-toggle v-model="icon" borderless>
          <v-btn value="cancel" color="red lighten-1" @click="cancel">
            <span>Cancel</span>

            <v-icon right> mdi-cancel </v-icon>
          </v-btn>

          <v-btn value="reset" color="orange lighten-1" @click="reset">
            <span class="hidden-sm-and-down">Reset</span>

            <v-icon right> mdi-rotate-left </v-icon>
          </v-btn>

          <v-btn value="save" color="green" @click="save">
            <span class="hidden-sm-and-down">Create</span>

            <v-icon right> mdi-account-plus </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div>
      <br />
      <!-- <v-row> -->
      <!-- <v-col > -->

      <v-layout align-center justify-center style="padding: 8px">
        <v-form ref="form" v-model="valid" lazy-validation>
          <h2>
            Create Investment - {{ this.SelectedInvestor[0].investor_name }}
          </h2>

          <!-- Person / company and 2 People radio buttons -->
          <!-- <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-radio-group
                  v-model="person"
                  @change="personCompanySwitch"
                  row
                >
                  <v-radio
                    label="Individual"
                    color="blue"
                    value="person"
                  ></v-radio>
                  <v-radio
                    label="Company / Trust"
                    color="purple darken-2"
                    value="company"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" md="4">
                <v-radio-group v-model="buyers" v-if="person === 'person'" row>
                  <v-radio
                    label="1 Person"
                    color="blue darken-3"
                    value="1"
                  ></v-radio>
                  <v-radio
                    label="2 People"
                    color="green darken-3"
                    value="2"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container> -->

          <!-- Investor Code & Linked email - read-only fields -->
          <v-container>
            <v-row>
              <v-text-field
                v-model="investorCode"
                label="Investor Code:"
                required
                @blur="checkNames"
                readonly
              ></v-text-field>

              <v-text-field
                v-model="project"
                label="Project:"
                required
              ></v-text-field>

              <v-text-field
                v-model="linkedUnit"
                label="Linked Unit:"
                required
              ></v-text-field>

              <v-text-field
                v-model="investmentAmount"
                label="Investment Amount:"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- 1 investor details -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <!-- <h3>Investor One Details</h3> -->
              </v-col>
              <v-text-field
                v-model="loanAgreementSignDate"
                label="Loan Agreement Sign Date:"
                required
              ></v-text-field>
              <v-text-field
                v-model="investmentDate"
                label="Investment Date:"
                required
              ></v-text-field>
              <v-text-field
                v-model="investmentPerc"
                label="Investment %:"
                required
              ></v-text-field>
            </v-row>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <!-- <h3>Investor One Details</h3> -->
              </v-col>
              <v-text-field
                v-model="releaseDate"
                label="Release Date:"
                required
              ></v-text-field>
              <v-text-field
                v-model="releaseAmount"
                label="Release Amount:"
                required
              ></v-text-field>
              <v-text-field
                v-model="releasePerc"
                label="Release %:"
                required
              ></v-text-field>
            </v-row>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="repaymentDate"
                  label="Repayment Date:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="repaymentAmount"
                  label="Repayment Amount:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <!-- to be a checkbox -->
                <v-checkbox
                  v-model="investmentClosed"
                  label="Investment Closed?"
                  color="success"
                  value="success"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>

          <!-- File uploads - always -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <h3>File Uploads</h3>
              </v-col>
            </v-row>
          </v-container>

          <!-- investor1 file uploads -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12"> </v-col>
              <v-file-input
                v-model="singedLoanAgreementFile"
                label="Signed Loan Agreement"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload Disclaimer Letter"
                persistent-hint
              ></v-file-input>
              <!-- </v-col>
              <v-col cols="12" sm="12"> -->
              <v-file-input
                v-model="POPFile"
                label="POP File"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload ID"
                persistent-hint
              ></v-file-input>
              <!-- </v-col>
              
              <v-col cols="12" sm="12">
              <v-col cols="12" sm="12"> -->
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <v-file-input
                  v-model="attorneyConfirmLetterFile"
                  label="Attorney Confirmation Letter"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload POA"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>

          <!-- Action Buttons -->
          <!-- <v-container>
            <v-row>
              <v-checkbox
                v-model="checkbox"
                color="#111d5e"
                :rules="[
                  (v) =>
                    !!v ||
                    'You must ensure that all information entered here is correct As modifying it after it is created will require outside assistance!',
                ]"
                label="Confirm Information is Correct?"
                required
              ></v-checkbox>

              <v-btn
                text
                color="success"
                class="mr-4"
                v-if="checkbox"
                @click="saveInvestment"
              >
                Create Investment
              </v-btn>
              <v-btn text color="error" class="mr-4" @click="reset">
                Reset Form
              </v-btn>
              <v-snackbar v-model="snackbar">
                {{ snackbarMessage }}
                <v-btn color="pink" text @click="snackbar = false">
                  Close
                </v-btn>
              </v-snackbar>
            </v-row>
          </v-container> -->
        </v-form>
      </v-layout>
      <!-- </v-col> -->
      <!-- </v-row> -->
      <v-snackbar v-model="snackbar" top>
        {{ snackbarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
//import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
let url = process.env.VUE_APP_BASEURL;

export default {
  name: "investmentadd",
  components: {
    // VuePhoneNumberInput,
  },
  metaInfo: {
    title: "Create Investment",
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
    // input investorId param
    paramId: 0,

    // add data models here

    roleId: null,
    jobId: null,
    jobType: null,
    jobTypes: [],
    role: [],
    roles: [],
    valid: true, // crm
    value: true,

    // investment form data
    investorCode: "",
    project: "",
    linkedUnit: "",
    investmentAmount: "",
    loanAgreementSignDate: "",
    investmentDate: "",
    investmentPerc: "",
    releaseDate: "",
    releaseAmount: "",
    releasePerc: "",
    repaymentDate: "",
    repaymentAmount: "",
    investmentClosed: false,
    singedLoanAgreementFile: null,
    POPFile: null,
    attorneyConfirmLetterFile: null,
    SelectedInvestor: []
  }),

  async mounted() {
    this.paramId = parseInt(this.$route.params.id);
    console.log("Mounted add investment investorID = ", this.paramId);
    //this.getAllInvestments();
    this.testServer();
    this.getInvestorDetails();
  },
  watch: {},

  methods: {
    cancel() {
      this.$router.push({
        name: "investmentview",
        params: { id: this.paramId }
      });
    },
    save() {
      this.saveInvestment();
    },
    async getInvestorDetails() {
      this.SelectedInvestor = [];
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
            response.data.forEach(investor => {
              this.SelectedInvestor.push(investor);
              // this.InvestorCode = investment.investor_acc_number;
            });
            console.log("this.SelectedInvestor List = ", this.SelectedInvestor);
            // use a method here to set the local properties for v-models setFormValues()
            // this.setFormValues() // this.InvestorName = this.SelectedInvestor.investor_name etc
            this.setFormValues();
            // get this working, demo when ready, see if Wayne is coming
            // set and see the form values (this.investorId) here console.log is my friend
            // create a new control for the id, so i have two, use a different model for each of them
            // and try sending to the route as idNumberThis and idNumberSelected
            // 2 controls, bothgoing into  form append, both being unwrapped in updateinvestor investorroutes
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
      // get the details from the selected investorId
    },
    async testServer() {
      await axios({
        method: "get",
        url: `http://localhost:3000/test`
      }).then(
        response => {
          console.log(response.data);
        },
        error => {
          console.log(error);
        }
      );
    },

    test(event) {
      console.log(event);
    },

    personCompanySwitch() {
      this.buyers = "1";
    },

    getFiles() {
      let files = [];
      let contains = [];
      if (this.singedLoanAgreementFile !== null) {
        contains.push("singedLoanAgreementFile");
        files.push(this.singedLoanAgreementFile); // append mimetype here?
      }

      // investorOneDisclaimerFile: null,
      if (this.POPFile !== null) {
        contains.push("POPFile");
        files.push(this.POPFile); // append mimetype here?
      }
      // investorOneIDFile: null,
      if (this.attorneyConfirmLetterFile !== null) {
        contains.push("attorneyConfirmLetterFile");
        files.push(this.attorneyConfirmLetterFile); // append mimetype here?
      }
      return files;
    },

    async saveInvestment() {
      let files = [];
      let contains = [];
      if (this.singedLoanAgreementFile !== null) {
        contains.push("singedLoanAgreementFile");
        files.push(this.singedLoanAgreementFile); // append mimetype here?
      }

      // investorOneDisclaimerFile: null,
      if (this.POPFile !== null) {
        contains.push("POPFile");
        files.push(this.POPFile); // append mimetype here?
      }
      // investorOneIDFile: null,
      if (this.attorneyConfirmLetterFile !== null) {
        contains.push("attorneyConfirmLetterFile");
        files.push(this.attorneyConfirmLetterFile); // append mimetype here?
      }
      let formData = new FormData();
      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
      }
      formData.append("contains", contains);

      formData.append("investorId", this.paramId);
      formData.append("investorCode", this.investorCode);
      formData.append("project", this.project);
      formData.append("linkedUnit", this.linkedUnit);
      formData.append("investmentAmount", this.investmentAmount);
      formData.append("loanAgreementSignDate", this.loanAgreementSignDate);

      formData.append("investmentDate", this.investmentDate);
      formData.append("releaseDate", this.releaseDate);
      formData.append("releaseAmount", this.releaseAmount);
      formData.append("releasePerc", this.releasePerc);

      formData.append("repaymentDate", this.repaymentDate);
      formData.append("repaymentAmount", this.repaymentAmount);

      formData.append("companyRepInitials", this.companyRepInitials);
      formData.append("companyRepSurname", this.companyRepSurname);
      formData.append("companyRepIDNumber", this.companyRepIDNumber);

      formData.append("investmentClosed", this.investmentClosed);
      formData.append("ficaDate", this.ficaDate);
      formData.append("person", this.person);

      await axios({
        method: "post",
        url: `${url}/createInvestment`,
        data: formData
      }).then(
        response => {
          console.log(response.data);
          this.snackbarMessage = "Investment Successfully Created";
          this.snackbar = true;
          setTimeout(() => {
            this.$router.push({
              //name: "investmentview",
              name: "investmentview",
              params: { id: this.paramId }
            });
          }, 1500);
        },
        error => {
          console.log(error);
        }
      );
    },
    reset() {
      this.$refs.form.reset();
      this.checkbox = false;
    }
  }
};
</script>

<style scoped>
p {
  color: red;
  font-size: 80%;
  text-align: left;
}
</style>

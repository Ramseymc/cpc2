<template>
  <v-container fluid>
    <br />
    <v-row>
      <v-col cols="7"> </v-col>
      <v-col cols="4">
        <v-btn-toggle v-model="icon" borderless>
          <v-btn value="cancel" color="orange lighten-1" @click="cancel">
            <span>Cancel</span>

            <v-icon right> mdi-cancel </v-icon>
          </v-btn>

          <v-btn value="create" color="primary" @click="save">
            <span class="hidden-sm-and-down">Save Changes</span>

            <v-icon right> mdi-content-save </v-icon>
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
          <h2>Update Investment</h2>

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
              <v-col cols="5">
                <v-text-field
                  v-model="investorCode"
                  label="Investor Code:"
                  required
                  @blur="checkNames"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="project"
                  label="Project:"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-text-field
                  v-model="linkedUnit"
                  label="Linked Unit:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="investmentAmount"
                  label="Investment Amount:"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <!-- 1 investor details -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <!-- <h3>Investor One Details</h3> -->
              </v-col>
              <v-col cols="10" sm="10">
                <v-text-field
                  v-model="loanAgreementSignDate"
                  label="Loan Agreement Sign Date:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="8" sm="8">
                <v-text-field
                  v-model="investmentDate"
                  label="Investment Date:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3" sm="3">
                <v-text-field
                  v-model="investmentPerc"
                  label="Investment %:"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <!-- <h3>Investor One Details</h3> -->
              </v-col>
              <v-col cols="10" sm="10">
                <v-text-field
                  v-model="releaseDate"
                  label="Release Date:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="8" sm="8">
                <v-text-field
                  v-model="releaseAmount"
                  label="Release Amount:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3" sm="3">
                <v-text-field
                  v-model="releasePerc"
                  label="Release %:"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="10" sm="10">
                <v-text-field
                  v-model="repaymentDate"
                  label="Repayment Date:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="8" sm="8">
                <v-text-field
                  v-model="repaymentAmount"
                  label="Repayment Amount:"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" sm="3">
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
            <v-col cols="12" sm="12"> </v-col>
            <v-row>
              View
              <a
                :href="`http://localhost:3000/uploads/${singedLoanAgreementFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              <v-file-input
                v-model="singedLoanAgreementFileNew"
                label="Signed Loan Agreement"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload Disclaimer Letter"
                persistent-hint
              ></v-file-input>
            </v-row>
            <!-- </v-col>
              <v-col cols="12" sm="12"> -->
            <v-row>
              View
              <a
                :href="`http://localhost:3000/uploads/${POPFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              <v-file-input
                v-model="POPFileNew"
                label="POP File"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload ID"
                persistent-hint
              ></v-file-input>
            </v-row>
            <!-- </v-col>
              
              <v-col cols="12" sm="12">
              <v-col cols="12" sm="12"> -->

            <v-row>
              View
              <a
                :href="`http://localhost:3000/uploads/${attorneyConfirmLetterFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>  
              <v-subheader v-if="this.attorneyConfirmLetterFile" color="red"> 
               <v-icon color="orange">mdi-alert-plus-outline</v-icon>
              Uploading will overwrite existing file
            </v-subheader>
              <v-file-input
                v-model="attorneyConfirmLetterFileNew"
                label="Attorney Confirmation Letter"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload POA"
                persistent-hint
              ></v-file-input>
            </v-row>
          </v-container>

        
        </v-form>
      </v-layout>
     
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
  name: "investmentupdate",
  components: {
    // VuePhoneNumberInput,
  },
  props: {
    dialog: Boolean,
    investmentId: String,
  },
  metaInfo: {
    title: "Update Investment",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Join CPC here.`,
      },
    ],
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "Required.",
        iDLength: (value) => value.length <= 13 || "Max 13 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    roleId: null,
    jobId: null,
    jobType: null,
    jobTypes: [],
    role: [],
    roles: [],
    valid: true, // crm
    value: true,

    // investment form data
    SelectedInvestment: [],
    investorCode: "",

    investorId: "",
    //investmentId: "",

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
    endDate: "",
    investmentClosed: false,

    singedLoanAgreementFile: null,
    POPFile: null,
    attorneyConfirmLetterFile: null,

    singedLoanAgreementFileNew: null,
    POPFileNew: null,
    attorneyConfirmLetterFileNew: null,

    snackbar: false,
    snackbarMessage: "",
    checkbox: false,
    icon: "",
  }
  },

  async mounted() {
    this.paramId = parseInt(this.$route.params.id);
    this.testServer();
    this.getInvestmentDetails();
  },
  watch: {},

  methods: {
    cancel() {
      this.$router.push({
        name: "investmentviewmain",
        params: { id: this.investorId },
        //params: { id: event.currentTarget.id },
      });
    },
    save() {
      this.updateInvestment();
    },
    setFormValues() {
      this.investorCode = this.SelectedInvestment[0].investor_acc_number;
      this.investorId = this.SelectedInvestment[0].investor_id;
      this.investmentId = this.SelectedInvestment[0].investment_id
      this.project = this.SelectedInvestment[0].project;
      this.linkedUnit = this.SelectedInvestment[0].linked_unit;
      this.investmentAmount = this.SelectedInvestment[0].investment_amount;
      this.loanAgreementSignDate = this.SelectedInvestment[0].datecreated;
      this.investmentDate = this.SelectedInvestment[0].datecreated;
      this.investmentPerc = this.SelectedInvestment[0].investment_interest_rate;
      this.releaseDate = this.SelectedInvestment[0].release_date;
      this.releaseAmount = this.SelectedInvestment[0].release_amount;
      this.releasePerc = this.SelectedInvestment[0].release_percentage;
      this.repaymentDate = this.SelectedInvestment[0].end_date;
      this.endDate = this.SelectedInvestment[0].end_date;
      this.repaymentAmount = this.SelectedInvestment[0].repayment_amount;
      this.investmentClosed = this.SelectedInvestment[0].investment_closed;
      this.singedLoanAgreementFile = this.SelectedInvestment[0].singedLoanAgreementFile;
      this.POPFile = this.SelectedInvestment[0].POPFile;
      this.attorneyConfirmLetterFile =  this.SelectedInvestment[0].attorneyConfirmLetterFile;
    },
    async getInvestmentDetails() {
      let data = {
        id: this.$store.state.development.id,
        paramId: this.paramId,
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/getInvestmentDetails`, // use store url
        data: data,
      })
        .then(
          (response) => {
            response.data.forEach((investment) => {
              this.SelectedInvestment.push(investment);      
            });        
            this.setFormValues();
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });

    },
    async testServer() {
      await axios({
        method: "get",
        url: `${url}/test`,
      }).then(
        (response) => {
          console.log(response.data);
        },
        (error) => {
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
        files.push(this.singedLoanAgreementFile);
      }

      // investorOneDisclaimerFile: null,
      if (this.POPFile !== null) {
        contains.push("POPFile");
        files.push(this.POPFile); 
      }
      // investorOneIDFile: null,
      if (this.attorneyConfirmLetterFile !== null) {
        contains.push("attorneyConfirmLetterFile");
        files.push(this.attorneyConfirmLetterFile); 
      }
      return files;
    },

    async updateInvestment() {
      let files = [];
      let contains = [];
  
      if (this.singedLoanAgreementFileNew !== null) {
        contains.push("singedLoanAgreementFile");
        files.push(this.singedLoanAgreementFileNew); 
      }

      // investorOneDisclaimerFile: null,
      if (this.POPFileNew !== null) {
        contains.push("POPFile");
        files.push(this.POPFileNew); 
      }
      // investorOneIDFile: null,
      if (this.attorneyConfirmLetterFileNew !== null) {
        contains.push("attorneyConfirmLetterFile");
        files.push(this.attorneyConfirmLetterFileNew); 
      }

      let formData = new FormData();
      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
      } 
      formData.append("contains", contains);

      formData.append("investorId", this.investorId);
      formData.append("investmentId", this.investmentId);

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
        url: `${url}/updateInvestment`,
        data: formData,
      }).then(
        (response) => {

          this.snackbarMessage = "Investment Successfully Updated"
          this.snackbar = true;
          setTimeout(() => {         
          this.$router.push({name: "investmentviewmain",params: {id: this.investorId},})},1500)
          console.log(response)
        },
        (error) => {
          console.log(error);
        }
      );
    },

    reset() {
      this.$refs.form.reset();
      this.checkbox = false;
    },
  },
};
</script>

<style scoped>
p {
  color: red;
  font-size: 80%;
  text-align: left;
}
</style>

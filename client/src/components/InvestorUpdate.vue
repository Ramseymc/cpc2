<template>
  <v-container fluid>
    <br />
    <v-row>
      <v-col cols="8"> </v-col>
      <v-col cols="4">
        <v-btn-toggle borderless>
          <v-btn value="cancel" color="orange lighten-1" @click="cancel">
            <span>Cancel</span>

            <v-icon right> mdi-cancel </v-icon>
          </v-btn>

          <v-btn value="save" color="primary" @click="save">
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
          <h2>Update Investor</h2>

          <!-- Person / company and 2 People radio buttons -->
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-radio-group
                  v-model="person_mode"
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
                <v-radio-group
                  v-model="buyers"
                  v-if="person_mode === 'person'"
                  row
                >
                  <v-radio
                    label="1 Person"
                    color="blue darken-3"
                    :value="1"
                  ></v-radio>
                  <v-radio
                    label="2 People"
                    color="green darken-3"
                    :value="2"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>

          <!-- Investor Code & Linked email - read-only fields -->
          <v-container>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="investorCode"
                  label="Investor Code"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="1"> </v-col>
              <v-col cols="6">
                <v-text-field
                  ref="linkedEmailInput"
                  v-model="linkedEmail"
                  label="Linked User Email (Portal):"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <!-- 1 investor details -->
          <v-container v-if="this.person_mode === 'person'">
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Investor One Details</h3>
              </v-col>
              <v-text-field
                ref="nameInput"
                v-model="investorName"
                label="Investor Initials"
                required
              ></v-text-field>
              <v-text-field
                ref="surnameInput"
                v-model="investorSurname"
                :counter="20"
                maxValue="20"
                :rules="nameRules"
                label="Investor Surname"
                required
              ></v-text-field>
              <v-text-field
                v-model="investorIDNumber"
                label="ID Number (selectedInvestor)*"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- 2nd investor details -->
          <v-container v-if="person_mode === 'person' && buyers === '2'">
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Investor Two Details</h3>
              </v-col>
              <v-text-field
                v-model="investorTwoName"
                label="Investor Two Initials"
              ></v-text-field>
              <v-text-field
                v-model="investorTwoSurname"
                label="Investor Two Surname"
              ></v-text-field>
              <v-text-field v-model="investorTwoIDNumber"></v-text-field>
            </v-row>
          </v-container>

          <!-- company details -->
          <v-container v-if="person_mode === 'company'">
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Company Details</h3>
              </v-col>
              <v-text-field
                ref="companyNameInput"
                v-model="CompanyName"
                :counter="20"
                maxValue="20"
                :rules="nameRules"
                label="Company Name"
                required
              ></v-text-field>
              <v-text-field
                ref="companyRegInput"
                v-model="refNumber"
                :counter="20"
                maxValue="20"
                :rules="nameRules"
                label="Registration/Trust No"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- company representative details -->
          <v-container v-if="person_mode === 'company'">
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Company Representative Details</h3>
              </v-col>
              <v-text-field
                ref="nameInput"
                v-model="companyRepInitals"
                :counter="20"
                maxValue="20"
                :rules="nameRules"
                label="companyRep Initials"
                required
              ></v-text-field>
              <v-text-field
                ref="surnameInput"
                v-model="companyRepSurname"
                :counter="20"
                maxValue="20"
                :rules="nameRules"
                label="companyRep Surname"
                required
              ></v-text-field>
              <v-text-field
                v-model="companyRepIDNumber"
                label="companyRep ID Number*"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- contact 1 details - person -->
          <v-container v-if="person_mode === 'person'">
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Contact One Details</h3>
              </v-col>
              <v-text-field
                v-model="contactEmail"
                label="Contact One Email*"
                required
              ></v-text-field>
              <v-col cols="6" style="background-color: lightgrey">
                <span>Contact One - Mobile - Required</span>
                <VuePhoneNumberInput
                  id="phoneNumber1"
                  v-model="mobile.phoneNumber"
                  ref="mobile"
                  clearable
                  default-country-code="ZA"
                  show-code-on-list
                  :only-countries="['ZA']"
                />
              </v-col>
              <v-col cols="6" style="background-color: lightgrey">
                <span>Contact One - Landline</span>
                <VuePhoneNumberInput
                  id="phoneNumber2"
                  v-model="landline.phoneNumber"
                  ref="landline"
                  clearable
                  default-country-code="ZA"
                  show-code-on-list
                  :only-countries="['ZA']"
                />
              </v-col>
            </v-row>
          </v-container>

          <!-- contact 2 details - show if 2 people or trust/company mode-->
          <v-container v-if="person_mode === 'person' && buyers === '2'">
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Contact Two Details</h3>
              </v-col>
              <v-text-field
                v-model="contactTwoEmail"
                label="Contact Two Email"
                required
              ></v-text-field>
              <v-col cols="6" style="background-color: lightgrey">
                <v-col cols="12" sm="12">
                  <span>Contact Two Mobile - Required</span>
                </v-col>
                <VuePhoneNumberInput
                  id="phoneNumber3"
                  v-model="mobile.phoneNumberTwo"
                  ref="mobile"
                  clearable
                  default-country-code="ZA"
                  show-code-on-list
                  :only-countries="['ZA']"
                />
              </v-col>
              <v-col cols="6" style="background-color: lightgrey">
                <v-col cols="12" sm="12">
                  <span>Contact Two Landline</span>
                </v-col>
                <VuePhoneNumberInput
                  id="phoneNumber4"
                  v-model="landline.phoneNumberTwo"
                  ref="landline"
                  clearable
                  default-country-code="ZA"
                  show-code-on-list
                  :only-countries="['ZA']"
                />
              </v-col>
            </v-row>
          </v-container>

          <!-- Address details - always -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Address Details</h3>
              </v-col>
              <v-text-field
                v-model="streetNo"
                label="Street No"
                required
              ></v-text-field>
              <v-text-field
                v-model="streetName"
                label="Street Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="addressSuburb"
                label="Suburb"
                required
              ></v-text-field>
              <v-text-field
                v-model="province"
                label="Province"
                required
              ></v-text-field>
              <v-text-field
                v-model="addressPostalCode"
                label="Postal Code"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- Postal Address - always -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Postal Address</h3>
              </v-col>
              <v-text-field
                v-model="boxNo"
                label="Box No"
                required
              ></v-text-field>
              <v-text-field
                v-model="postalSuburb"
                label="Suburb"
                required
              ></v-text-field>
              <v-text-field
                v-model="postalCode"
                label="Postal Code"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- Banking details - always -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <h3>Banking Details</h3>
              </v-col>
              <v-text-field
                v-model="bankName"
                label="Bank Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="accountName"
                label="Account Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="branchCode"
                label="Branch Code"
                required
              ></v-text-field>
              <v-text-field
                v-model="accountNumber"
                label="Account No"
                required
              ></v-text-field>
            </v-row>
          </v-container>

          <!-- FICA Details - always ? -->
          <v-container>
            <v-row>
              <v-col cols="8" sm="8">
                <h3>FICA Details</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8" sm="8">
                <v-text-field
                  v-model="ficaDate"
                  label="FICA Date"
                  required
                ></v-text-field>
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
          <v-container v-if="person_mode === 'person'">
            <v-col cols="12" sm="12">
              <h3>Investor One File Uploads</h3>
            </v-col>
            <v-row>
              <a
                :href="
                  `http://localhost:3000/uploads/${investorOneDisclaimerFile}`
                "
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-file-input
                v-model="investorOneDisclaimerFileNew"
                label="Upload Disclaimer Letter"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload Disclaimer Letter"
                persistent-hint
              ></v-file-input>
            </v-row>
            <v-row>
              <!-- </v-col>
              <v-col cols="12" sm="12"> -->

              <a
                :href="`http://localhost:3000/uploads/${investorOneIDFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-file-input
                v-model="investorOneIDFileNew"
                label="Upload ID"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload ID"
                persistent-hint
              ></v-file-input>
            </v-row>
            <!-- </v-col>
              <v-col cols="12" sm="12"> -->
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${investorOnePOAFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-file-input
                v-model="investorOnePOAFileNew"
                label="Upload POA"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload POA"
                persistent-hint
              ></v-file-input>
            </v-row>
          </v-container>

          <!-- investor2 file uploads - show if company mode-->
          <v-container v-if="person_mode === 'person' && buyers === '2'">
            <v-col cols="12" sm="12">
              <h3>Investor Two File Uploads</h3>
            </v-col>

            <v-row>
              <a
                :href="
                  `http://localhost:3000/uploads/${investorTwoDisclaimerFile}`
                "
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-file-input
                v-model="investorTwoDisclaimerFileNew"
                label="Upload Disclaimer Letter"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload Disclaimer Letter"
                persistent-hint
              ></v-file-input>
            </v-row>
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${investorTwoIDFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-file-input
                v-model="investorTwoIDFileNew"
                label="Upload ID"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload ID"
                persistent-hint
              ></v-file-input>
            </v-row>
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${investorTwoPOAFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-file-input
                v-model="investorTwoPOAFileNew"
                label="Upload POA"
                accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                filled
                hint="Upload POA"
                persistent-hint
              ></v-file-input>
            </v-row>
          </v-container>

          <!-- company/trust file uploads -->
          <v-container v-if="person_mode === 'company'">
            <v-col cols="12" sm="12">
              <h3>Company & Representative File Uploads</h3>
            </v-col>
            <v-row>
              <a
                :href="
                  `http://localhost:3000/uploads/${representativeDisclaimerFile}`
                "
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-col cols="4" sm="4">
                <v-file-input
                  v-model="representativeDisclaimerFileNew"
                  label="Upload Representation Disclaimer Letter"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload Disclaimer Letter"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${representativeIDFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-col cols="4" sm="4">
                <v-file-input
                  v-model="representativeIDFileNew"
                  label="Upload Representation ID"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload ID"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${representativePOAFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-col cols="4" sm="4">
                <v-file-input
                  v-model="representativePOAFileNew"
                  label="Representative POA"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload POA"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>

            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${companyResolutionFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-col cols="4" sm="4">
                <v-file-input
                  v-model="companyResolutionFileNew"
                  label="Company / Trust Resolution"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload Company / Trust Resolution"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${companyRefDocsFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-col cols="4" sm="4">
                <v-file-input
                  v-model="companyRefDocsFileNew"
                  label="Company / Trust Reg Docs"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload Company / Trust Reg Docs"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <a
                :href="`http://localhost:3000/uploads/${companyPOAFile}`"
                download
                target="_blank"
                style="text-decoration: none"
              >
                <v-icon color="green">mdi-eye-outline</v-icon>
              </a>
              - View
            </v-row>
            <v-row>
              <v-col cols="4" sm="4">
                <v-file-input
                  v-model="companyPOAFileNew"
                  label="Company / Trust POA"
                  accept="image/jpeg, image/jpg, image/png, image/bmp, application/pdf"
                  filled
                  hint="Upload Company / Trust POA"
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
                label="Confirm Information is Correct?"
                required
              ></v-checkbox>

              <v-btn
                text
                color="success"
                class="mr-4"
                v-if="checkbox"
                @click="updateInvestor"
              >
                Update Investor
              </v-btn>
              <v-btn text color="error" class="mr-4" @click="reset">
                Reset Form
              </v-btn>
            
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
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
let url = process.env.VUE_APP_BASEURL;
//let  baseUrl = "http://localhost:3000"

export default {
  name: "investorupdate",
  components: {
    VuePhoneNumberInput
  },
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
    roleId: null,
    jobId: null,
    jobType: null,
    jobTypes: [],
    role: [],
    roles: [],
    valid: true, // crm
    value: true,

    // investor form data
    SelectedInvestor: [],
    paramId: 0,
    investorCode: "",
    linkedEmail: "",

    person: "",
    person_mode: "person",
    buyers: "",
    buyersSwicth: 1,

    investorName: "",
    investorInitials: "",
    investorSurname: "",
    investorIDNumber: "",

    investorTwoCode: "",
    investorTwoInitials: "",
    investorTwoSurname: "",
    investorTwoIDNumber: "",

    companyName: "",
    regNumber: "",

    companyRepInitials: "",
    companyRepSurname: "",
    companyRepIDNumber: "",

    contact: "",
    contactEmail: "",
    contactTwoEmail: "",

    streetNo: "",
    streetName: "",
    addressSuburb: "",
    province: "",
    addressPostalCode: "",

    boxNo: "",
    postalSuburb: "",
    postalCode: "",

    bankName: "",
    accountName: "",
    branchCode: "",
    accountNumber: "",

    ficaDate: "",

    investorOneDisclaimerFile: null,
    investorOneIDFile: null,
    investorOnePOAFile: null,

    investorTwoDisclaimerFile: null,
    investorTwoIDFile: null,
    investorTwoPOAFile: null,

    representativeDisclaimerFile: null,
    representativeIDFile: null,
    representativePOAFile: null,
    companyResolutionFile: null,
    companyRefDocsFile: null,
    companyPOAFile: null,

    investorOneDisclaimerFileNew: null,
    investorOneIDFileNew: null,
    investorOnePOAFileNew: null,

    investorTwoDisclaimerFileNew: null,
    investorTwoIDFileNew: null,
    investorTwoPOAFileNew: null,

    representativeDisclaimerFileNew: null,
    representativeIDFileNew: null,
    representativePOAFileNew: null,
    companyResolutionFileNew: null,
    companyRefDocsFileNew: null,
    companyPOAFileNew: null,

    mobile: {
      countryCode: "ZA",
      isValid: false,
      phoneNumber: "",
      phoneNumberTwo: ""
    },
    landline: {
      countryCode: "ZA",
      isValid: false,
      phoneNumber: "",
      phoneNumberTwo: ""
    },

    snackbar: false,
    snackbarMessage: "",
    checkbox: false,
    // ^^ wip

    mobileResults: {},
    // good rules examples
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 20) || "Name must be less than 15 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ]
  }),

  async mounted() {
    this.paramId = parseInt(this.$route.params.id);
    //console.log("Mounted update investorID = ", this.paramId);

    // this.testServer();
    this.getInvestorDetails();
  },
  watch: {},

  methods: {
    cancel() {
      this.$router.push({
        name: "investorview"
        //params: { id: event.currentTarget.id },
      });
    },
    save() {
      this.updateInvestor();
    },
    async setFormValues() {
      this.person_mode = this.SelectedInvestor[0].person_mode;
      this.buyers = this.SelectedInvestor[0].buyers;
      this.investorName = this.SelectedInvestor[0].investor_name;
      this.investorSurname = this.SelectedInvestor[0].investor_surname;
      this.investorInitials = this.SelectedInvestor[0].investor_name;
      this.investorCode = this.SelectedInvestor[0].investor_acc_number;
      this.linkedEmail = this.SelectedInvestor[0].linked_email;
      this.mobile.phoneNumber = this.SelectedInvestor[0].investor_mobile;
      this.investorIDNumber = this.SelectedInvestor[0].investor_id_number;

      this.investorTwoInitials = this.SelectedInvestor[0].investor_two_name;
      this.investorTwoSurname = this.SelectedInvestor[0].investor_two_surname;
      this.investorTwoIDNumber = this.SelectedInvestor[0].investor_two_id_number;

      this.companyName = this.SelectedInvestor[0].company_name;
      this.regNumber = this.SelectedInvestor[0].reg_number;

      this.companyRepInitials = this.SelectedInvestor[0].company_rep_initals;
      this.companyRepSurname = this.SelectedInvestor[0].company_rep_surname;
      this.companyRepIDNumber = this.SelectedInvestor[0].company_rep_id_number;

      this.contact = this.SelectedInvestor[0].contact;
      this.contactEmail = this.SelectedInvestor[0].contact_email;
      this.contactTwoEmail = this.SelectedInvestor[0].contact_two_email;

      this.streetNo = this.SelectedInvestor[0].street_no;
      this.streetName = this.SelectedInvestor[0].investor_physical_street;
      this.addressSuburb = this.SelectedInvestor[0].investor_physical_suburb;
      this.province = this.SelectedInvestor[0].investor_physical_province;
      this.addressPostalCode = this.SelectedInvestor[0].investor_physical_postal_code;

      this.boxNo = this.SelectedInvestor[0].investor_postal_street_box;
      this.postalSuburb = this.SelectedInvestor[0].investor_postal_suburb;
      this.postalCode = this.SelectedInvestor[0].investor_postal_postal_code;

      this.bankName = this.SelectedInvestor[0].bank_name;
      this.accountName = this.SelectedInvestor[0].account_name;
      this.branchCode = this.SelectedInvestor[0].branch_code;
      this.accountNumber = this.SelectedInvestor[0].account_number;

      this.ficaDate = this.SelectedInvestor[0].fica_date;
      this.investorOneDisclaimerFile = this.SelectedInvestor[0].investorOneDisclaimerFile;

      this.investorOneIDFile = this.SelectedInvestor[0].investorOneIDFile;
      (this.investorOnePOAFile = this.SelectedInvestor[0].investorOnePOAFile),
        (this.investorTwoDisclaimerFile = this.SelectedInvestor[0].investorTwoDisclaimerFile);
      this.investorTwoIDFile = this.SelectedInvestor[0].investorTwoIDFile;
      this.investorTwoPOAFile = this.SelectedInvestor[0].investorTwoPOAFile;

      this.representativeDisclaimerFile = this.SelectedInvestor[0].representativeDisclaimerFile;
      this.representativeIDFile = this.SelectedInvestor[0].representativeIDFile;
      this.representativePOAFile = this.SelectedInvestor[0].representativePOAFile;
      this.companyResolutionFile = this.SelectedInvestor[0].companyResolutionFile;
      this.companyRefDocsFile = this.SelectedInvestor[0].companyRefDocsFile;
      this.companyPOAFile = this.SelectedInvestor[0].companyPOAFile;
    },
    async getInvestorDetails() {
      let data = {
        id: this.$store.state.development.id,
        paramId: this.paramId
      };
      await axios({
        method: "post",
        url: `${url}/getInvestorDetails`, // use store url
        data: data
      })
        .then(
          response => {
            response.data.forEach(investor => {
              this.SelectedInvestor.push(investor);
            });
            this.setFormValues();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    // async testServer() {
    //   await axios({
    //     method: "get",
    //     url: `${url}/test`,
    //   }).then(
    //     (response) => {
    //       console.log(response.data);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // },

    // test(event) {
    //   console.log(event);
    // },

    personCompanySwitch() {
      this.buyers = this.SelectedInvestor[0].buyers;
    },

    async updateInvestor() {
      //this.setFormValues()
      let files = [];
      let contains = [];
      if (this.investorOneDisclaimerFileNew !== null) {
        contains.push("investorOneDisclaimerFile");
        files.push(this.investorOneDisclaimerFileNew); // append mimetype here?
      }

      // investorOneDisclaimerFile: null,
      if (this.investorOneIDFileNew !== null) {
        contains.push("investorOneIDFile");
        files.push(this.investorOneIDFileNew); // append mimetype here?
      }
      // investorOneIDFile: null,
      if (this.investorOnePOAFileNew !== null) {
        contains.push("investorOnePOAFile");
        files.push(this.investorOnePOAFileNew); // append mimetype here?
      }
      // investorOnePOAFile: null,

      if (this.investorTwoDisclaimerFileNew !== null) {
        contains.push("investorTwoDisclaimerFile");
        files.push(this.investorTwoDisclaimerFileNew); // append mimetype here?
      }
      // investorTwoDisclaimerFile: null,
      if (this.investorTwoIDFileNew !== null) {
        contains.push("investorTwoIDFile");
        files.push(this.investorTwoIDFileNew); // append mimetype here?
      }
      // investorTwoIDFile: null,
      if (this.investorTwoPOAFileNew !== null) {
        contains.push("investorTwoPOAFile");
        files.push(this.investorTwoPOAFileNew); // append mimetype here?
      }
      // investorTwoPOAFile: null,

      if (this.representativeDisclaimerFileNew !== null) {
        contains.push("representativeDisclaimerFile");
        files.push(this.representativeDisclaimerFileNew); // append mimetype here?
      }
      // representativeDisclaimerFile: null,
      if (this.representativeIDFileNew !== null) {
        contains.push("representativeIDFile");
        files.push(this.representativeIDFileNew); // append mimetype here?
      }
      // representativeIDFile: null,
      if (this.representativePOAFileNew !== null) {
        contains.push("representativePOAFile");
        files.push(this.representativePOAFileNew); // append mimetype here?
      }
      // representativePOAFile: null,
      if (this.companyResolutionFileNew !== null) {
        contains.push("companyResolutionFile");
        files.push(this.companyResolutionFileNew); // append mimetype here?
      }
      // companyResolutionFile: null,
      if (this.companyRefDocsFileNew !== null) {
        contains.push("companyRefDocsFile");
        files.push(this.companyRefDocsFileNew); // append mimetype here?
      }
      // companyRefDocsFile: null,
      if (this.companyPOAFileNew !== null) {
        contains.push("companyPOAFile");
        files.push(this.companyPOAFileNew); // append mimetype here?
      }
      // companyPOAFile: null

      let formData = new FormData();
      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
      }

      formData.append("contains", contains);
      formData.append("investorName", this.investorName);
      formData.append("investorCode", this.investorCode);
      formData.append("linkedEmail", this.linkedEmail);
      formData.append("investorInitials", this.investorInitials);
      formData.append("investorSurname", this.investorSurname);
      formData.append("investorIDNumber", this.investorIDNumber);

      formData.append("investorTwoCode", this.investorTwoCode);
      formData.append("investorTwoInitials", this.investorTwoInitials);
      formData.append("investorTwoSurname", this.investorTwoSurname);
      formData.append("investorTwoIDNumber", this.investorTwoIDNumber);

      formData.append("companyName", this.companyName);
      formData.append("regNumber", this.regNumber);

      formData.append("companyRepInitials", this.companyRepInitials);
      formData.append("companyRepSurname", this.companyRepSurname);
      formData.append("companyRepIDNumber", this.companyRepIDNumber);

      formData.append("contactEmail", this.SelectedInvestor[0].investor_email);
      formData.append("contactTwoEmail", this.contactTwoEmail);

      formData.append("mobile", this.mobile.phoneNumber);
      formData.append("landline", this.landline.phoneNumber);
      formData.append("mobileTwo", this.mobile.phoneNumberTwo);
      formData.append("landlineTwo", this.landline.phoneNumberTwo);

      formData.append("streetNo", this.streetNo);
      formData.append("streetName", this.streetName);
      formData.append("addressSuburb", this.addressSuburb);
      formData.append("province", this.province);
      formData.append("addressPostalCode", this.addressPostalCode);

      formData.append("boxNo", this.boxNo);
      formData.append("postalSuburb", this.postalSuburb);
      formData.append("postalCode", this.postalCode);

      formData.append("bankName", this.bankName);
      formData.append("accountName", this.accountName);
      formData.append("branchCode", this.branchCode);
      formData.append("accountNumber", this.accountNumber);

      formData.append("ficaDate", this.ficaDate);

      formData.append("person_mode", this.person_mode);
      formData.append("buyers", this.buyers);
      formData.append("id", this.SelectedInvestor[0].investor_id);

      await axios({
        method: "post",
        url: `${url}/updateInvestor`,
        data: formData
      }).then(
        response => {
          this.snackbarMessage = "Investor Successfully Updated";
          this.snackbar = true;
          console.log(response);
          setTimeout(() => {
            this.$router.push("investorview");
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

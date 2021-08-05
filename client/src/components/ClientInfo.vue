<template>
  <v-container>
    <div class="about">
      <br /><br /><br />
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="900px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Client Info</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="firstName"
                      label="First name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="lastName"
                      label="Last name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="iDNumber"
                      label="ID Number*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="email"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <span>Mobile</span>
                    <VuePhoneNumberInput
                      id="phoneNumber1"
                      v-model="mobile.phoneNumber"
                      ref="mobile"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col cols="6">
                    <span>Landline</span>
                    <VuePhoneNumberInput
                      id="phoneNumber2"
                      v-model="landline.phoneNumber"
                      ref="landline"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-textarea
                      v-model="postaladdress"
                      label="Postal Address"
                      required
                      placeholder="Postal Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="6">
                    <v-textarea
                      v-model="residentialAddress"
                      label="Residential Address"
                      required
                      placeholder="Residential Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <strong><b>Mood</b></strong>
                    <v-radio-group v-model="mood">
                      <v-radio
                        label="Mood 1"
                        color="black"
                        value="Mood1"
                      ></v-radio>
                      <v-radio
                        label="Mood 2"
                        color="red darken-3"
                        value="Mood2"
                      ></v-radio>
                    </v-radio-group>
                    <small>*indicates required field</small>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <strong><b>Flooring</b></strong>
                    <v-radio-group v-model="flooring">
                      <v-radio
                        label="Tiles"
                        color="black"
                        value="Tiles"
                      ></v-radio>
                      <v-radio
                        label="Laminate"
                        color="red darken-3"
                        value="Laminate"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <strong><b>Floorplan</b></strong>
                    <v-radio-group v-model="floorplan" row>
                      <v-radio
                        label="Plan A"
                        color="black"
                        value="Plan A"
                      ></v-radio>
                      <v-radio
                        label="Plan B"
                        color="brown"
                        value="Plan B"
                      ></v-radio>
                      <v-radio
                        label="Plan C"
                        color="brown"
                        value="Plan C"
                      ></v-radio>
                      <v-radio
                        label="Plan D"
                        color="brown"
                        value="Plan D"
                      ></v-radio>
                      <v-radio
                        label="Plan E"
                        color="brown"
                        value="Plan E"
                      ></v-radio>
                      <v-radio
                        label="Plan F"
                        color="brown"
                        value="Plan F"
                      ></v-radio>
                      <v-radio
                        label="Plan G"
                        color="brown"
                        value="Plan G"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <label> File Uploads </label>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-model="fileOTP"
                      label="OTP"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      hint="OTP"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-model="fileId"
                      label="Upload ID/Passport Photo"
                      filled
                      hint="Upload ID/Passport Photo"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-model="fileFica"
                      label="Proof of address documentation"
                      filled
                      multiple
                      hint="Proof of address documentation"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-model="fileBank"
                      label="Upload Bank Statements"
                      filled
                      hint="Upload Bank Statements"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-model="filePaySlip"
                      label="Upload latest 3 months payslips"
                      filled
                      multiple
                      hint="Upload latest 3 months payslips"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
              <p>
                These documents pertain to persons applying in their personal
                capacity.
              </p>
              <p>
                Purchases being made in the name of a company / trust or any
                other legal person may require additional information and
                uploads. The Bond Originator will decide thereon.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                @click="closeClientInfo"
                color="primary"
                elevation="3"
                outlined
                rounded
              >
                Close
              </v-btn>
              <v-btn
                text
                @click="insertClientData"
                color="primary"
                elevation="3"
                outlined
                rounded
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-snackbar top v-model="snackbar">
        {{ snackBarmessage }}
        <v-btn color="red" text @click="snackbar = false"> Close </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "salesstart",
  components: {
    VuePhoneNumberInput
  },

  props: {
    dialog: Boolean,
    blockValue: String,
    unitValue: String,
    saleId: String
  },

  data() {
    return {
      snackbar: false,
      snackBarmessage: "Successfully Posted!!",
      firstName: "",
      lastName: "",
      iDNumber: "",
      email: "",
      bankName: "",
      accountNumber: "",
      accountType: "",
      postaladdress: "",
      residentialAddress: "",
      mood: "Mood1",
      flooring: "Laminate",
      floorplan: "Plan A",
      fileOTP: null,
      fileId: null,
      fileBank: null,
      filePaySlip: null,
      fileFica: null,
      url: "",
      mobile: {
        countryCode: "ZA",
        isValid: false,
        phoneNumber: ""
      },
      landline: {
        countryCode: "ZA",
        isValid: false,
        phoneNumber: ""
      }
    };
  },
  mounted() {
    // this.url = this.$store.state.url;
  },

  methods: {
    mobileStuff(event) {
      // this.mobileResults = event;
      console.log("landline", event);
      console.log("mobile", event);
    },

    closeClientInfo() {
      this.$emit("closeForm", false);
    },
    async insertClientData() {
      // console.log(this.firstName);
      let files = [];
      let contains = [];
      if (this.fileOTP !== null) {
        contains.push("fileOTP");
        files.push(this.fileOTP); // append mimetype here?
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

      let formData = new FormData();
      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
      }
      console.log("formData = ", formData);
      // formData.append("documents", files)
      formData.append("firstName", this.firstName);
      formData.append("lastName", this.lastName);
      formData.append("iDNumber", this.iDNumber);
      formData.append("email", this.email);
      formData.append("bankName", this.bankName);
      formData.append("accountNumber", this.accountNumber);
      formData.append("accountType", this.accountType);
      formData.append("block", this.blockValue);
      formData.append("unit", this.unitValue);
      formData.append("mood", this.mood);
      formData.append("flooring", this.flooring);
      formData.append("floorplan", this.floorplan);
      formData.append("mobile", this.mobile.phoneNumber);
      formData.append("landline", this.landline.phoneNumber);
      formData.append("postalAddress", this.postaladdress);
      formData.append("residentialAddress", this.residentialAddress);
      formData.append("contains", contains);
      console.log("files:", files);
      console.log("contains:", contains);

      await axios({
        method: "post",
        url: `${url}/createClient`,
        data: formData
      }).then(
        response => {
          console.log(response.data);
          // little box saying 'Posted Successfully
          this.snackbar = true;
          // close the form after completing
          this.closeClientInfo();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
};
</script>

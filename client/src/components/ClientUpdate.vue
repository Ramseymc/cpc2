<template>
  <v-container>
    <div class="about">
      <br />
      <br />
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
                      v-model="editData[0].firstname"
                      label="First name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editData[0].lastname"
                      label="Last name*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editData[0].iDNumber"
                      label="ID Number*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editData[0].email"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <span>Mobile</span>
                    <VuePhoneNumberInput
                      ref="mobile"
                      clearable
                      v-model="mobile.phoneNumber"
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                    />
                  </v-col>
                  <v-col cols="6">
                    <span>Landline</span>
                    <VuePhoneNumberInput
                      ref="landline"
                      clearable
                      v-model="landline.phoneNumber"
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                    />
                  </v-col>
                  <v-col cols="6">
                    <!-- v-model="postaladdress" -->
                    <v-textarea
                      v-model="editData[0].postalAddress"
                      label="Postal Address"
                      required
                      placeholder="Postal Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="6">
                    <v-textarea
                      v-model="editData[0].residentialAddress"
                      label="Residential Address"
                      required
                      placeholder="Residential Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <strong><b>Mood</b></strong>
                    <v-radio-group v-model="editData[0].mood">
                      <v-radio
                        label="Mood 1"
                        color="black"
                        value="Mood 1"
                      ></v-radio>
                      <v-radio
                        label="Mood 2"
                        color="red darken-3"
                        value="Mood 2"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <!-- Flooring -->
                  <v-col cols="4" sm="4">
                    <strong><b>Flooring</b></strong>
                    <v-radio-group v-model="editData[0].flooring">
                      <v-radio
                        label="Tiles"
                        color="black"
                        value="Tiles"
                      ></v-radio>
                      <v-radio
                        label="Laminate"
                        color="brown"
                        value="Laminate"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <strong><b>Floorplan</b></strong>

                    <v-radio-group v-model="editData[0].floorplan" row>
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

                  <!-- File Uploads  -->

                  <!-- All files received -->
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-if="
                        editData[0].fileOTP === null ||
                          editData[0].fileOTP === '' ||
                          editData[0].fileOTP === 'undefined'
                      "
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
                      v-if="
                        editData[0].fileId === null ||
                          editData[0].fileId === '' ||
                          editData[0].fileId === 'undefined'
                      "
                      v-model="fileId"
                      label="ID/Passport"
                      filled
                      hint="ID/Passport Photo"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-if="
                        editData[0].fileFica === null ||
                          editData[0].fileFica === '' ||
                          editData[0].fileFica === 'undefined'
                      "
                      v-model="fileFica"
                      label="Proof of Address"
                      filled
                      multiple
                      hint="Proof of Address"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-if="
                        editData[0].fileBank === null ||
                          editData[0].fileBank === '' ||
                          editData[0].fileBank === 'undefined'
                      "
                      v-model="fileBank"
                      label="Bank Statement"
                      filled
                      hint="Bank Statement"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col cols="12" sm="12">
                    <v-file-input
                      v-if="
                        editData[0].filePaySlip === null ||
                          editData[0].filePaySlip === '' ||
                          editData[0].filePaySlip === 'undefined'
                      "
                      v-model="filePaySlip"
                      label="Payslip"
                      filled
                      multiple
                      hint="Up to 3 payslip pref"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
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
                @click="updateClientData"
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
let url = process.env.VUE_APP_BASEURL;
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
export default {
  name: "salesstart",
  components: {
    VuePhoneNumberInput
  },

  props: {
    dialog: Boolean,
    editData: Array
  },

  data() {
    return {
      snackbar: false,
      snackBarmessage: "Successfully Posted!!",
      url: "",
      fileOTP: null,
      fileId: null,
      fileBank: null,
      filePaySlip: null,
      fileFica: null,
      floorplan: "Plan A",
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
      // tiles: "Tiles",
      // mood: "Mood 1"
      // finalEditData: {}
    };
  },
  beforeMount() {
    //console.log("BEFORE MOUNTED");
    //  this.finalEditData = this.editData[0]
    this.editData.forEach(el => {
      el.id = el.id.toString();
      if (el.flooring === "") {
        el.flooring = "Tiles";
      }
      if (el.mood === "") {
        el.mood = "Mood 1";
      }
    });
    //console.log(this.editData)
  },

  mounted() {
    this.mobile.phoneNumber = this.editData[0].mobile;
    this.landline.phoneNumber = this.editData[0].landline;
    // this.url = this.$store.state.url;
    //console.log("ClientUpdate Mounted EditData= ", this.editData);
  },

  methods: {
    closeClientInfo() {
      this.$emit("closeForm", false);
    },

    async updateClientData() {
      // get the form fields data to pass to salesRoutes /updateClient
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

      // the file should be here, check files[0]
      // console.log("contains", contains);
      // console.log("files", files);
      let formData = new FormData();

      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
        //console.log("FileInfo::: ", files[x]);
      }
      formData.append("firstName", this.editData[0].firstname);
      formData.append("lastName", this.editData[0].lastname);
      formData.append("iDNumber", this.editData[0].iDNumber);
      formData.append("email", this.editData[0].email);
      formData.append("bankName", this.editData[0].bankName);
      formData.append("accountNumber", this.editData[0].accountNumber);
      formData.append("accountType", this.editData[0].accountType);
      formData.append("block", this.editData[0].block);
      formData.append("unit", this.editData[0].unit);
      formData.append("mood", this.editData[0].mood);
      formData.append("flooring", this.editData[0].flooring);
      formData.append("floorplan", this.editData[0].floorplan);
      formData.append("mobile", this.mobile.phoneNumber);
      formData.append("landline", this.landline.phoneNumber);
      formData.append("postalAddress", this.editData[0].postalAddress);
      formData.append(
        "residentialAddress",
        this.editData[0].residentialAddress
      );

      formData.append("id", this.editData[0].id);
      formData.append("contains", contains);

      await axios({
        method: "post",
        url: `${url}/updateClient`,
        data: formData
      }).then(
        response => {
          console.log(response.data);

          this.snackbar = true;
          //console.log("ClientUpdate.vue - closing form");
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

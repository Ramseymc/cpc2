<template>
  <v-container>
    <div class="about">
      <br /><br /><br />
      <v-row justify="center">
        <v-dialog v-model="dialogFiles" max-width="800px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Sign Off OTP</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="3"
                    sm="3"
                    md="3"
                    v-if="
                      fileData[0].fileOTP !== null &&
                        fileData[0].fileOTP !== '' &&
                        fileData[0].fileOTP !== 'undefined'
                    "
                  >
                    <span>Signed OTP</span>
                  </v-col>

                  <!-- this will be a new file upload for fileOTP -->
                  <v-col
                    cols="8"
                    sm="7"
                    md="7"
                    lg="9"
                    v-if="
                      fileData[0].fileOTP !== null &&
                        fileData[0].fileOTP !== '' &&
                        fileData[0].fileOTP !== 'undefined'
                    "
                  >
                    <v-spacer></v-spacer>

                    <v-file-input
                      v-model="fileOTP"
                      label="Upload OTP"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      hint="OTP"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeSignOffForm">
                Close
              </v-btn>
              <v-btn
                text
                @click="updateClientOTP"
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
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "signoffotp",

  props: {
    dialogFiles: Boolean,
    fileData: Array
  },
  data() {
    return {
      snackbar: false,
      snackBarmessage: "Successfully Signed Off!",
      // url: "",
      arrFicaFiles: [],
      arrPaySlipFiles: [],
      fileOTP: null
    };
  },

  methods: {
    async updateClientOTP() {
      let formData = new FormData();

      if (this.fileOTP !== null) {
        formData.append("fileOTP", this.fileOTP);
        formData.append("id", this.fileData[0].id);
      }
      await axios({
        method: "post",
        url: `${url}/updateClientOTP`,
        data: formData
      }).then(
        response => {
          console.log(response.data);

          this.snackbar = true;
          console.log("SignOff.vue - closing form");
          // close the form after completing
          this.closeSignOffForm();
        },

        error => {
          console.log(error);
        }
      );
    },
    closeSignOffForm() {
      this.$emit("closeForm", false);
    }
  },
  mounted() {
    this.url = `${this.$store.state.url}`;
    console.log("signOffOTP Mounted EditData= ", this.fileData[0]);

    setTimeout(() => {
      console.log("ClientFiles: ", this.fileData);
    }, 4000);
  }
};
</script>

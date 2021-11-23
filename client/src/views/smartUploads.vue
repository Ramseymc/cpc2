<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      class="elevation-1 myClass"
      multiSort
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Uploads</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="black" dark class="mb-2" outlined @click="sendEmail">
            Email
            <v-icon right dark>
              mdi-cloud-upload
            </v-icon>
          </v-btn>
          <!-- <v-btn color="black" dark class="mb-2" outlined @click="signDocument">
            sign Doc
            <v-icon right dark>
              mdi-account-edit
            </v-icon>
          </v-btn> -->
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="black"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                v-if="userName !== 'Michael van Rooyen'"
              >
                Unsigned Uploads
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      v-if="formTitle === 'New Item'"
                    >
                      <span style="color: red;"
                        ><strong
                          >The JBCC Document must be the last uploaded
                          document.(Herbert, please note this carefully)</strong
                        ></span
                      >
                    </v-col>

                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle === 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc1"
                        v-model="uploadUnsignedDoc1"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle === 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc2"
                        v-model="uploadUnsignedDoc2"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle === 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc3"
                        v-model="uploadUnsignedDoc3"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle === 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc4"
                        v-model="uploadUnsignedDoc4"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle === 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc5"
                        v-model="uploadUnsignedDoc5"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle !== 'New Item'"
                    >
                      <v-file-input
                        accept="image/png"
                        label="Upload Signature"
                        v-model="uploadSignature"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      v-if="formTitle !== 'New Item'"
                    >
                      <span style="color: red;"
                        ><strong
                          >Your signature is never saved by the system and
                          deleted immedietly.</strong
                        ></span
                      ><br />
                      <span
                        >I {{ userName }} agree that I have read the
                        documentation that I am about to sign and acknowledge it
                        as true and correct</span
                      >
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle !== 'New Item'"
                    >
                      <v-checkbox
                        v-model="ex4"
                        label="Agreed"
                        color="success"
                        value="success"
                        hide-details
                      ></v-checkbox>
                    </v-col>

                    <!-- <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle !== 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc2"
                        v-model="uploadSignedDoc2"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle !== 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc3"
                        v-model="uploadSignedDoc3"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle !== 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc4"
                        v-model="uploadSignedDoc4"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="formTitle !== 'New Item'"
                    >
                      <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                        label="Doc5"
                        v-model="uploadSignedDoc5"
                        clearable
                        @change="showFile"
                      ></v-file-input>
                    </v-col> -->
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer v-if="formTitle === 'New Item'"></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                  v-if="formTitle === 'New Item'"
                >
                  Save
                </v-btn>
                <v-spacer v-if="formTitle !== 'New Item'"></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                  v-if="
                    formTitle !== 'New Item' && ex4 && uploadSignature !== null
                  "
                >
                  Sign
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          color="green"
          @click="editItem(item)"
          v-if="
            (userName === 'Michael van Rooyen' ||
              userName === 'Wayne Bruton') &&
              (item.uploadSignedDoc1 === null || item.uploadSignedDoc1 === '')
          "
        >
          mdi-feather
        </v-icon>
        <v-icon
          color="red"
          @click="deleteItem(item)"
          v-if="userName !== 'Michael van Rooyen'"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #item.uploadUnsignedDoc1="{ item }">
        <a target="_blank" :href="item.uploadUnsignedDoc1" style="color: red;">
          <v-icon>
            mdi-file-pdf
          </v-icon>
          {{ item.unsigned1 }}
        </a>
      </template>
      <!-- <template #item.uploadUnsignedDoc2="{ item }">
        <a target="_blank" :href="item.uploadUnsignedDoc2" style="color: red;">
          {{ item.unsigned2 }}
        </a>
      </template>
      <template #item.uploadUnsignedDoc3="{ item }">
        <a target="_blank" :href="item.uploadUnsignedDoc3" style="color: red;">
          {{ item.unsigned3 }}
        </a>
      </template>
      <template #item.uploadUnsignedDoc4="{ item }">
        <a target="_blank" :href="item.uploadUnsignedDoc4" style="color: red;">
          {{ item.unsigned4 }}
        </a>
      </template>
      <template #item.uploadUnsignedDoc5="{ item }">
        <a target="_blank" :href="item.uploadUnsignedDoc5" style="color: red;">
          {{ item.unsigned5 }}
        </a>
      </template> -->
      <template #item.uploadSignedDoc1="{ item }">
        <a target="_blank" :href="item.uploadSignedDoc1" style="color: green;">
          {{ item.Signed1 }}
        </a>
      </template>
      <!-- <template #item.uploadSignedDoc2="{ item }">
        <a target="_blank" :href="item.uploadSignedDoc2" style="color: green;">
          {{ item.Signed2 }}
        </a>
      </template>
      <template #item.uploadSignedDoc3="{ item }">
        <a target="_blank" :href="item.uploadSignedDoc3" style="color: green;">
          {{ item.Signed3 }}
        </a>
      </template>
      <template #item.uploadSignedDoc4="{ item }">
        <a target="_blank" :href="item.uploadSignedDoc4" style="color: green;">
          {{ item.Signed4 }}
        </a>
      </template>
      <template #item.uploadSignedDoc5="{ item }">
        <a target="_blank" :href="item.uploadSignedDoc5" style="color: green;">
          {{ item.Signed5 }}
        </a>
      </template> -->
      <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template> -->
    </v-data-table>
    <v-dialog
      v-model="dialogAuth"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="black">
          <v-toolbar-title>No Authorization</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list three-line subheader>
          <!-- <v-subheader>Redirecting</v-subheader> -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                ><h1>
                  Redirecting in {{ timeleft }} seconds
                </h1></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="dialogEmail" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Choose Recipients</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="8" sm="8">
                  <v-autocomplete
                    :items="users"
                    v-model="emailAddresses"
                    item-text="userName"
                    label="Recipients"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogEmail = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="sendFinalEmail">
              Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
// import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
let url = process.env.VUE_APP_BASEURL;
export default {
  data: () => ({
    ex4: false,
    snackbar: false,
    snackBarMessage: "",
    emailAddresses: null,
    dialogEmail: false,
    dialogAuth: false,
    userName: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      {
        text: "Submitted",
        align: "start",
        sortable: true,
        value: "uploadUnsignedDoc1",
        width: 180
      },
      // {
      //   text: "Unsigned2",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadUnsignedDoc2",
      //   width: 100
      // },
      // {
      //   text: "Unsigned3",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadUnsignedDoc3",
      //   width: 100
      // },
      // {
      //   text: "Unsigned4",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadUnsignedDoc4",
      //   width: 100
      // },
      // {
      //   text: "Unsigned5",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadUnsignedDoc5",
      //   width: 100
      // },
      {
        text: "User",
        align: "start",
        sortable: true,
        value: "uploadUnsignedDocUser",
        width: 100
      },
      {
        text: "Submission Date",
        align: "start",
        sortable: true,
        value: "uploadUnsignedDocDate",
        width: 150
      },
      {
        text: "Approved",
        align: "center",
        sortable: true,
        value: "uploadSignedDoc1",
        width: 200
      },
      // {
      //   text: "signed2",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadSignedDoc2",
      //   width: 100
      // },
      // {
      //   text: "signed3",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadSignedDoc3",
      //   width: 100
      // },
      // {
      //   text: "signed4",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadSignedDoc4",
      //   width: 100
      // },
      // {
      //   text: "signed5",
      //   align: "center",
      //   sortable: true,
      //   value: "uploadSignedDoc5",
      //   width: 100
      // },
      {
        text: "User",
        align: "start",
        sortable: true,
        value: "uploadSignedDocUser",
        width: 100
      },
      {
        text: "Approval Date",
        align: "start",
        sortable: true,
        value: "uploadSignedDocDate",
        width: 150
      },
      {
        text: "submission",
        align: "center",
        sortable: true,
        value: "submissionNumber",
        width: 100
      },

      { text: "Actions", value: "actions", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    uploadUnsignedDoc1: null,
    uploadUnsignedDoc2: null,
    uploadUnsignedDoc3: null,
    uploadUnsignedDoc4: null,
    uploadUnsignedDoc5: null,
    uploadUnsignedDocUser: "",
    uploadUnsignedDocDate: "",
    // uploadSignedDoc1: null,
    // uploadSignedDoc2: null,
    // uploadSignedDoc3: null,
    // uploadSignedDoc4: null,
    // uploadSignedDoc5: null,
    uploadSignedDocUser: "",
    uploadSignedDocDate: "",
    uploadSignature: null,
    idToEdit: 0,
    fileNameToSign: null,
    // uploadSignedDate: null,

    editedItem: {
      id: 0,
      uploadUnsignedDoc1: null,
      uploadUnsignedDoc2: null,
      uploadUnsignedDoc3: null,
      uploadUnsignedDoc4: null,
      uploadUnsignedDoc5: null,
      uploadUnsignedDocUser: "",
      uploadUnsignedDocDate: "",
      // uploadSignedDoc1: null,
      // uploadSignedDoc2: null,
      // uploadSignedDoc3: null,
      // uploadSignedDoc4: null,
      // uploadSignedDoc5: null,
      uploadSignedDocUser: "",
      uploadSignedDocDate: "",
      submissionNumber: null
    },
    defaultItem: {
      id: 0,
      uploadUnsignedDoc1: null,
      uploadUnsignedDoc2: null,
      uploadUnsignedDoc3: null,
      uploadUnsignedDoc4: null,
      uploadUnsignedDoc5: null,
      uploadUnsignedDocUser: "",
      uploadUnsignedDocDate: "",
      // uploadSignedDoc1: null,
      // uploadSignedDoc2: null,
      // uploadSignedDoc3: null,
      // uploadSignedDoc4: null,
      // uploadSignedDoc5: null,
      uploadSignedDocUser: "",
      uploadSignedDocDate: "",
      submissionNumber: null
    },
    timeleft: 0,
    submissionNumber: 0,
    users: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  beforeCreate() {},
  created() {
    this.userName = this.$store.state.userName;
    if (
      this.$store.state.userName !== "Wayne Bruton" &&
      this.$store.state.userName !== "Herbert du Plessis" &&
      this.$store.state.userName !== "Dirk Coetzee" &&
      this.$store.state.userName !== "Wynand Haywood" &&
      this.$store.state.userName !== "Michael van Rooyen"
    ) {
      this.dialogAuth = true;
      this.timeleft = 3;
      let downloadTimer = setInterval(() => {
        if (this.timeleft <= 1) {
          clearInterval(downloadTimer);
          this.$router.push("/");
        }
        this.timeleft -= 1;
      }, 1000);
    } else {
      this.getInitialData();
    }
  },

  methods: {
    async signDocument() {
      let formData = new FormData();
      formData.append("file", this.uploadSignature);
      formData.append("user", this.uploadSignedDocUser);
      formData.append("signDate", this.uploadSignedDocDate);
      formData.append("idToEdit", this.idToEdit);
      formData.append("fileName", this.fileNameToSign);
      // let data = {
      //   doc: this.desserts[0].uploadUnsignedDoc1
      // };

      await axios({
        method: "post",
        url: `${url}/SignPDFWB`,
        data: formData
      })
        .then(
          response => {
            console.log("The Response", response.data);
            if (response.data.affectedRows === 1) {
              this.uploadSignature = null;
              this.uploadSignedDocUser = "";
              this.uploadSignedDocDate = "";
              this.idToEdit = 0;
              this.fileNameToSign = "";
              this.snackBarMessage = "Document successfully signed";
              this.snackbar = true;
              this.ex4 = false;
              this.close();
              this.getInitialData();
            } else {
              this.snackBarMessage = "There was an issue, please try later";
              this.uploadSignature = null;
              this.uploadSignedDocUser = "";
              this.uploadSignedDocDate = "";
              this.idToEdit = 0;
              this.fileNameToSign = "";
              this.ex4 = false;
              this.snackbar = true;
            }
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async sendFinalEmail() {
      // console.log("emailAddresses",this.emailAddresses)
      let addresses = [];
      this.emailAddresses.forEach(el => {
        let filtered = this.users.filter(el2 => {
          return el === el2.userName;
        })[0].userEmail;
        addresses.push(filtered);
      });
      // console.log(addresses)
      let data = {
        id: this.$store.state.development.id,
        name: this.$store.state.development.developmentName,
        user: this.$store.state.userName,
        // path: `http://localhost:8080${this.$route.fullPath}`,
        path: `https://www.cape-projects.co.za${this.$route.fullPath}`,
        addresses: addresses
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/postSmartUpladEmailsWB`,
        data: data
      })
        .then(
          response => {
            console.log("The Response", response.data);
            this.dialogEmail = false;
            this.emailAddresses = [];
            if (response.data.success) {
              this.snackBarMessage = "Email sent";
              this.snackbar = true;
            }
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async sendEmail() {
      console.log(`${url}${this.$route.fullPath}`);
      let data = {
        currentUser: this.$store.state.userName
      };
      await axios({
        method: "post",
        url: `${url}/getUsersForEmailWB`,
        data: data
      })
        .then(
          response => {
            console.log("The Response", response.data);
            this.users = response.data;

            this.dialogEmail = true;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    showFile() {
      console.log("uploadSignature", this.uploadSignature);
    },
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getuploadDataWB`,
        data: data
      })
        .then(
          response => {
            console.log("The Response", response.data);
            this.desserts = response.data;
            if (!this.desserts.length) {
              this.submissionNumber = 8;
            } else {
              this.submissionNumber = this.desserts[0].submissionNumber + 1;
            }
            this.defaultItem.submissionNumber = this.submissionNumber;
            console.log(this.submissionNumber);
            this.desserts.forEach(el => {
              if (
                el.uploadUnsignedDoc1 !== "" &&
                el.uploadUnsignedDoc1 !== null
              ) {
                el.unsigned1 = `${el.uploadUnsignedDoc1}`;
                el.uploadUnsignedDoc1 = `${url}/${el.uploadUnsignedDoc1}`;
                // console.log("uploadUnsignedDoc1", el.uploadUnsignedDoc1);
              }
              // if (
              //   el.uploadUnsignedDoc2 !== "" &&
              //   el.uploadUnsignedDoc2 !== null
              // ) {
              //   el.unsigned2 = `${el.uploadUnsignedDoc2.substring(0, 10)}...`;
              //   el.uploadUnsignedDoc2 = `${url}/${el.uploadUnsignedDoc2}`;
              // }
              // if (
              //   el.uploadUnsignedDoc3 !== "" &&
              //   el.uploadUnsignedDoc3 !== null
              // ) {
              //   el.unsigned3 = `${el.uploadUnsignedDoc3.substring(0, 10)}...`;
              //   el.uploadUnsignedDoc3 = `${url}/${el.uploadUnsignedDoc3}`;
              // }
              // if (
              //   el.uploadUnsignedDoc4 !== "" &&
              //   el.uploadUnsignedDoc4 !== null
              // ) {
              //   el.unsigned4 = `${el.uploadUnsignedDoc4.substring(0, 10)}...`;
              //   el.uploadUnsignedDoc4 = `${url}/${el.uploadUnsignedDoc4}`;
              // }
              // if (
              //   el.uploadUnsignedDoc5 !== "" &&
              //   el.uploadUnsignedDoc5 !== null
              // ) {
              //   el.unsigned5 = `${el.uploadUnsignedDoc5.substring(0, 10)}...`;
              //   el.uploadUnsignedDoc5 = `${url}/${el.uploadUnsignedDoc5}`;
              // }
              if (el.uploadSignedDoc1 !== "" && el.uploadSignedDoc1 !== null) {
                el.Signed1 = `${el.uploadSignedDoc1.substring(0, 10)}...`;
                el.uploadSignedDoc1 = `${url}/${el.uploadSignedDoc1}`;
              }
              // if (el.uploadSignedDoc2 !== "" && el.uploadSignedDoc2 !== null) {
              //   el.Signed2 = `${el.uploadSignedDoc2.substring(0, 10)}...`;
              //   el.uploadSignedDoc2 = `${url}/${el.uploadSignedDoc2}`;
              // }
              // if (el.uploadSignedDoc3 !== "" && el.uploadSignedDoc3 !== null) {
              //   el.Signed3 = `${el.uploadSignedDoc3.substring(0, 10)}...`;
              //   el.uploadSignedDoc3 = `${url}/${el.uploadSignedDoc3}`;
              //   console.log(el.uploadSignedDoc3);
              // }
              // if (el.uploadSignedDoc4 !== "" && el.uploadSignedDoc4 !== null) {
              //   el.Signed4 = `${el.uploadSignedDoc4.substring(0, 10)}...`;
              //   el.uploadSignedDoc4 = `${url}/${el.uploadSignedDoc4}`;
              // }
              // if (el.uploadSignedDoc5 !== "" && el.uploadSignedDoc5 !== null) {
              //   el.Signed5 = `${el.uploadSignedDoc5.substring(0, 10)}...`;
              //   el.uploadSignedDoc5 = `${url}/${el.uploadSignedDoc5}`;
              // }
            });
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      // console.log(this.editedIndex);
      this.desserts.splice(this.editedIndex, 1);
      // console.log(this.editedItem);
      let data = this.editedItem;

      await axios({
        method: "post",
        url: `${url}/deleteuploadSDocumentWB`,
        data: data
      })
        .then(
          response => {
            console.log("The Response", response.data);

            this.closeDelete();
            this.getInitialData();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      let uploadArray = [];
      if (this.editedIndex > -1) {
        // Object.assign(this.desserts[this.editedIndex], this.editedItem);
        // if (this.uploadSignedDoc1) {
        //   uploadArray.push(this.uploadSignedDoc1);
        // }
        // if (this.uploadSignedDoc2) {
        //   uploadArray.push(this.uploadSignedDoc2);
        // }
        // if (this.uploadSignedDoc3) {
        //   uploadArray.push(this.uploadSignedDoc3);
        // }
        // if (this.uploadSignedDoc4) {
        //   uploadArray.push(this.uploadSignedDoc4);
        // }
        // if (this.uploadSignedDoc5) {
        //   uploadArray.push(this.uploadSignedDoc5);
        // }
        // this.editedItem.uploadSignedDocUser = this.$store.state.userName;
        // this.editedItem.uploadSignedDocDate = dayjs(new Date()).format(
        //   "YYYY-MM-DD"
        // );
        // console.log("uploadArray", uploadArray);
        // console.log("editedItem", this.editedItem);
        // let formData = new FormData();
        // uploadArray.forEach(el => {
        //   formData.append("files", el);
        // });
        // formData.append("user", this.$store.state.userName);
        // formData.append("id", this.editedItem.id);
        // formData.append("subNumber", this.editedItem.submissionNumber);
        // formData.append(
        //   "date",
        //   dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        // );
        // await axios({
        //   method: "post",
        //   url: `${url}/uploadSignedDocumentsWB`,
        //   data: formData
        // })
        //   .then(
        //     response => {
        //       console.log("The Response", response.data);

        //       this.uploadSignedDoc1 = null;
        //       this.uploadSignedDoc2 = null;
        //       this.uploadSignedDoc3 = null;
        //       this.uploadSignedDoc4 = null;
        //       this.uploadSignedDoc5 = null;
        //       this.getInitialData();
        //     },
        //     error => {
        //       console.log(error);
        //     }
        //   )
        //   .catch(e => {
        //     console.log(e);
        //   });

        this.uploadSignedDocUser = this.$store.state.userName;
        this.uploadSignedDocDate = dayjs(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        // uploadSignature: null,
        this.idToEdit = this.editedItem.id;
        this.fileNameToSign = this.editedItem.unsigned1;
        // this.uploadSignedDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")

        // console.log(this.uploadSignedDocUser);
        // console.log(this.uploadSignedDocDate);
        // console.log(this.fileNameToSign);
        // console.log(this.idToEdit);

        // console.log("editedItem", this.editedItem);
        this.signDocument();
      } else {
        if (this.uploadUnsignedDoc1) {
          uploadArray.push(this.uploadUnsignedDoc1);
        }
        if (this.uploadUnsignedDoc2) {
          uploadArray.push(this.uploadUnsignedDoc2);
        }
        if (this.uploadUnsignedDoc3) {
          uploadArray.push(this.uploadUnsignedDoc3);
        }
        if (this.uploadUnsignedDoc4) {
          uploadArray.push(this.uploadUnsignedDoc4);
        }
        if (this.uploadUnsignedDoc5) {
          uploadArray.push(this.uploadUnsignedDoc5);
        }
        this.editedItem.uploadUnsignedDocUser = this.$store.state.userName;
        this.editedItem.uploadUnsignedDocDate = dayjs(new Date()).format(
          "YYYY-MM-DD"
        );
        // console.log("uploadArray", uploadArray);
        let formData = new FormData();
        uploadArray.forEach(el => {
          formData.append("files", el);
        });
        // formData.append("documents", uploadArray)
        formData.append("user", this.$store.state.userName);
        formData.append("subNumber", this.submissionNumber);
        formData.append(
          "date",
          dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        );
        await axios({
          method: "post",
          url: `${url}/uploadUnsignedDocumentsWB`,
          data: formData
        })
          .then(
            response => {
              console.log("The Response", response.data);
              this.uploadUnsignedDoc1 = null;
              this.uploadUnsignedDoc2 = null;
              this.uploadUnsignedDoc3 = null;
              this.uploadUnsignedDoc4 = null;
              this.uploadUnsignedDoc5 = null;
              this.getInitialData();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
      this.close();
    }
  }
};
</script>

<style>
.myClass td {
  font-size: small !important;
  height: 0 !important;
  padding: 1px !important;
}
.myClass {
  margin-left: 30px;
  margin-right: 30px;
}
.a-class {
  width: 100%;
  height: 100%;
}
</style>

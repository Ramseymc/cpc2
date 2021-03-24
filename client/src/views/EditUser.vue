<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1>Edit User</h1>
        <v-row dense>
          <v-col cols="10" offset="1">
            <v-card class="mx-auto" max-width="1050" tile>
              <v-col cols="10" offset="1">
                <v-autocomplete
                  v-model="userValue"
                  :items="users"
                  item-text="userName"
                  dense
                  filled
                  label="User"
                  @change="chooseUser"
                  color="#0F0F0F"
                ></v-autocomplete>
              </v-col>
            </v-card>
          </v-col>
          <v-col v-if="show">
            <v-layout align-center justify-center style="padding: 8px;">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  ref="nameInput"
                  v-model="name"
                  :counter="20"
                  maxValue="20"
                  :rules="nameRules"
                  label="Name"
                  required
                  @change="checkNames"
                  color="#0F0F0F"
                ></v-text-field>
                <v-text-field
                  ref="emailInput"
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  @change="checkEmails"
                  color="#0F0F0F"
                ></v-text-field>
                <small>South African Mobiles</small>
                <VuePhoneNumberInput
                  ref="mobile"
                  clearable
                  v-model="mobile"
                  default-country-code="ZA"
                  show-code-on-list
                  :only-countries="['ZA']"
                  @update="mobileStuff"
                  color="#0F0F0F"
                />
                <br />
                <v-autocomplete
                  v-model="jobType"
                  :items="jobTypes"
                  item-text="jobTitle"
                  label="Choose Job Description"
                  chips
                  prepend-icon="mdi-tag-heart"
                  color="#0F0F0F"
                  item-color="#111d5e"
                ></v-autocomplete>
                <v-autocomplete
                  v-model="role"
                  :items="roles"
                  item-text="roleName"
                  label="Choose Role"
                  chips
                  prepend-icon="mdi-tag-heart"
                  color="#0F0F0F"
                  item-color="#111d5e"
                ></v-autocomplete>
                <v-checkbox
                  v-model="checkboxActive"
                  color="#0F0F0F"
                  label="User Active"
                  required
                ></v-checkbox>
                <v-checkbox
                  v-model="checkboxfirstTime"
                  color="#0F0F0F"
                  label="Force user to change password"
                  required
                ></v-checkbox>
                <br />
                <v-btn text color="success" class="mr-4" @click="editUser">
                  Edit User
                </v-btn>

                <v-btn text color="error" class="mr-4" @click="chooseUser">
                  Reset Form
                </v-btn>
                <v-snackbar v-model="snackbar" top color="amber">
                  {{ snackbarMessage }}
                  <v-btn color="pink" text @click="snackbar = false">
                    Close
                  </v-btn>
                </v-snackbar>
                <br /><br />
              </v-form>
            </v-layout>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "EditUser",
  metaInfo: {
    title: "Edit User",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `JEdit User here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      checkboxActive: false,
      checkboxfirstTime: false,
      users: [],
      userValue: null,
      role: null,
      roles: [],
      jobType: null,
      jobTypes: [],
      valid: false,
      show: false,
      id: 0,
      name: "",
      mobile: "",
      mobileResults: {},
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 20) || "Name must be less than 15 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  mounted() {
    this.checkToken();
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      await axios({
        method: "get",
        url: `${url}/getUsers`
        // data: data
      })
        .then(
          response => {
            this.users = response.data.result[0];
            this.roles = response.data.result[1];
            this.jobTypes = response.data.result[2];
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    chooseUser() {
      let filter = this.users.filter(el => {
        return el.userName === this.userValue;
      });
      this.id = filter[0].id;
      this.name = filter[0].userName;
      this.email = filter[0].userEmail;
      this.mobile = filter[0].userMobile;
      let roles = this.roles.filter(el => {
        return el.id === filter[0].userRole;
      });
      let jobTitle = this.jobTypes.filter(el => {
        return el.id === filter[0].jobTitle;
      });
      if (jobTitle.length) {
        this.jobType = jobTitle[0].jobTitle;
      }
      this.role = roles[0].roleName;
      this.checkboxActive = filter[0].isActive;
      this.checkboxfirstTime = filter[0].isNew;
      this.show = true;
    },
    async checkNames() {
      await axios({
        method: "get",
        url: `${url}/checkName/${this.name}`
      }).then(
        response => {
          if (response.data.result.length) {
            this.$nextTick(() => {
              this.name = "";
              this.$refs.nameInput.focus();
            });
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    async checkEmails() {
      await axios({
        method: "get",
        url: `${url}/checkEmail/${this.email}`
      }).then(
        response => {
          if (response.data.result.length) {
            this.$nextTick(() => {
              this.email = "";
              this.$refs.emailInput.focus();
            });
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    mobileStuff(event) {
      this.mobileResults = event;
    },
    formIsValid() {
      if (
        this.name === "" ||
        this.email === "" ||
        this.mobile === "" ||
        this.role === null ||
        this.jobType === null ||
        this.role === "" ||
        this.jobType === ""
      ) {
        this.valid = false;
        this.snackbarMessage = "All fields must be completed";
        this.snackbar = true;
      } else {
        this.valid = true;
      }
    },
    async editUser() {
      this.formIsValid();
      if (this.valid) {
        let role = this.roles.filter(el => {
          return el.roleName === this.role;
        });
        let jobTypes = this.jobTypes.filter(el => {
          return el.jobTitle === this.jobType;
        });

        let data = {
          id: this.id,
          userName: this.name,
          userEmail: this.email,
          userMobile: this.mobile,

          userRole: role[0].id,

          userJobType: jobTypes[0].id,
          isActive: this.checkboxActive,
          isNew: this.checkboxfirstTime
        };

        await axios({
          method: "post",
          url: `${url}/editUser`,
          data: data
        })
          .then(result => {
            if (result.data.result.affectedRows == 1) {
              this.snackbarMessage = "User Successfully Edited!";
              this.snackbar = true;
              this.chooseUser();
            }
          })
          .catch(() => {
            this.snackbarMessage =
              "There was an error, please try again later!";
            this.snackbar = true;
          });
      }
    }
  }
};
</script>

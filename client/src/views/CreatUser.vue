<template>
  <div>
    <br />
    <v-row dense>
      <v-col>
        <h1>Create User</h1>
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
              @blur="checkNames"
            ></v-text-field>
            <v-text-field
              ref="emailInput"
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              @blur="checkEmails"
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
            />
            <br />
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              color="#111d5e"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              required
            ></v-text-field>
            <v-text-field
              v-model="repeatPassword"
              label="Repeat Password"
              type="password"
              required
            ></v-text-field>
            <p v-if="repeatPasswordError">{{ repeatPasswordErrorMessage }}</p>
            <v-autocomplete
              v-model="jobType"
              :items="jobTypes"
              item-text="jobTitle"
              label="Choose Title"
              chips
              prepend-icon="mdi-tag-heart"
              color="#111d5e"
              item-color="#111d5e"
              @change="processJobType"
            ></v-autocomplete>
            <v-autocomplete
              v-model="role"
              :items="roles"
              item-text="roleName"
              label="Choose Role"
              chips
              prepend-icon="mdi-tag-heart"
              color="#111d5e"
              item-color="#111d5e"
              @change="processRoles"
            ></v-autocomplete>
            <v-checkbox
              v-model="checkbox"
              color="#111d5e"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree to behave as per our terms & conditions?"
              required
            ></v-checkbox>
            <br />
            <v-btn
              :disabled="!valid"
              text
              color="success"
              class="mr-4"
              v-if="checkbox"
              @click="createUser"
            >
              Create User
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
            <br /><br />
          </v-form>
        </v-layout>
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
  name: "CreateUser",
  metaInfo: {
    title: "Create User",
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
    valid: true,
    value: true,
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
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) ||
        "Min. 8 characters with at least one capital letter, a number and a special character."
    ],
    repeatPassword: "",
    repeatPasswordError: false,
    repeatPasswordErrorMessage: "Passwords do not match",
    checkbox: false,
    emailExists: false,
    snackbar: false,
    snackbarMessage: ""
  }),
  components: {
    VuePhoneNumberInput
  },
  //USER ROLES
  async mounted() {
    this.checkToken();
    axios.defaults.headers.common["Authorization"] = this.$store.state.token;
    await axios({
      method: "get",
      url: `${url}/getRoles`
    }).then(
      response => {
        this.roles = response.data.result[0];
        this.jobTypes = response.data.result[1];
      },
      error => {
        console.log(error);
      }
    );
  },
  watch: {
    //CHECK IF REPEAT PASWORD MATCHES
    repeatPassword: function() {
      if (this.repeatPassword !== this.password) {
        this.repeatPasswordError = true;
      } else {
        this.repeatPasswordError = false;
      }
    }
  },
  methods: {
    //PROCESS CHOSEN ROLE
    processRoles() {
      let roleId = this.roles.filter(el => {
        return el.roleName === this.role;
      });
      this.roleId = roleId[0].id;
    },
    processJobType() {
      let jobTypeID = this.jobTypes.filter(el => {
        return el.jobTitle === this.jobType;
      });
      this.jobId = jobTypeID[0].id;
    },
    //PROCESS MOBILE NUMBER FOR USE LATER
    mobileStuff(event) {
      this.mobileResults = event;
    },
    //CHECK NAME IS UNIQUE
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
    //CHECK EMAIL IS UNIQUE
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
    // CREATE THE USER
    async createUser() {
      if (
        this.roleId !== null &&
        this.name !== "" &&
        this.email !== "" &&
        this.mobile !== "" &&
        this.password !== "" &&
        this.jobId !== null
      ) {
        // let jobTypes = this.jobTypes.filter((el) => {
        //   return el.jobTitle === this.jobType
        // })

        let data = {
          userName: this.name,
          userEmail: this.email,
          userPassword: this.password,
          userMobile: this.mobile,
          userRole: this.roleId,

          userJobType: this.jobId,
          isActive: true,
          isNew: true
        };

        await axios({
          method: "post",
          url: `${url}/createUser`,
          data: data
        })
          .then(result => {
            if (result.data.affectedRows === 1) {
              this.snackbarMessage = "User Successfully added!";
              this.snackbar = true;
              this.reset();
            }
          })
          .catch(() => {
            this.snackbarMessage =
              "There was an error, please try again later!";
            this.snackbar = true;
          });
      } else {
        this.snackbarMessage = "All Fields must be filled in.";
        this.snackbar = true;
      }
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

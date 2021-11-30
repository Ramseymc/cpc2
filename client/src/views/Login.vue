<template>
  <div>
    <br />
    <v-row dense>
      <v-col :cols="flex" :offset="offset">
        <h1>Login</h1>
        <v-layout align-center justify-center>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              ref="emailInput"
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              @blur="checkEmail"
              required
            ></v-text-field>
            <div v-if="passwordResetToken === null">
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                required
              ></v-text-field>
              <br />
            </div>
            <div v-else>
              <span
                v-if="
                  passwordResetInput !== null &&
                    passwordResetInput !== passwordResetToken &&
                    passwordResetInput.length === 6
                "
                style="font-weight: bold; color: red;"
                ><small>token is incorrect</small></span
              >
              <v-text-field
                v-model="passwordResetInput"
                label="Enter Token"
                filled
                @change="dialog = true"
              ></v-text-field>
            </div>
            <div
              v-if="
                passwordResetInput === passwordResetToken &&
                  passwordResetToken !== null
              "
            >
              <v-text-field
                v-model="passwordNew"
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
            </div>

            <v-btn
              text
              color="success"
              class="mr-4"
              v-if="emailExists && password && passwordResetToken === null"
              @click="login"
            >
              Login
            </v-btn>
            <v-btn
              text
              color="success"
              class="mr-4"
              v-if="emailExists && passwordResetToken === null"
              @click="resetPassword"
            >
              Reset Password
            </v-btn>
            <v-btn
              text
              color="success"
              class="mr-4"
              v-if="
                emailExists &&
                  passwordResetToken !== null &&
                  passwordNew === repeatPassword
              "
              @click="resetUser"
            >
              Proceed
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
  </div>
</template>

<script>
// import DirectoryServices from "@/services/DirectoryServices";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "Login",
  metaInfo: {
    title: "Login",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Log in to CPC here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data: () => ({
    valid: true,
    value: true,
    passwordIncorrect: false,
    email: "connorm11111@gmail.com",
    //email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "Alasco12!",
    //password: "",
    emailExists: true,
    snackbar: false,
    snackbarMessage: "",
    passwordResetToken: null,
    passwordResetInput: null,
    enteredToken: null,
    flex: 12,
    offset: 0,

    passwordNew: "",
    passwordRules: [
      v => !!v || "Password is required",
      v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) ||
        "Min. 8 characters with at least one capital letter, a number and a special character."
    ],
    repeatPassword: "",
    repeatPasswordError: false,
    repeatPasswordErrorMessage: "Passwords do not match"
  }),
  mounted() {
    if (this.windowWidth < 768) {
      this.flex = 12;
      this.offset = 0;
    } else {
      this.flex = 6;
      this.offset = 3;
    }
    this.login();
  },
  methods: {
    async login() {
      let user = {
        email: "connorm11111@gmail.com",
        password: "Alasco12!"
      };
      if (this.email && this.password) {
        await axios({
          method: "post",
          url: `${url}/login`,
          data: user
        }).then(
          response => {
            let user = response.data.user;
            user.token = response.data.token;

            this.$store.dispatch("setUser", user);

            if (this.$route.name !== "Home") {
              this.$router.push({ name: "Home" });
            }
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.snackbarMessage = "All fields must be completed";
        this.snackbar = true;
      }
    },
    async resetPasswordToken() {},
    cancelResetPassword() {},
    async resetUser() {
      let data = {
        email: this.email,
        password: this.passwordNew
      };
      await axios({
        method: "post",
        url: `${url}/resetPassword`,
        data: data
      }).then(
        response => {
          if (response.data.success) {
            this.password = "";
            this.passwordNew = "";
            this.passwordResetToken = null;
            this.passwordResetInput = null;
            this.snackbarMessage =
              "You have successfully changed your password. Please login.";
            this.snackbar = true;
          } else {
            this.snackbarMessage = "Error, please try again later.";
            this.snackbar = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    clearOTP() {
      let test = setInterval(() => {
        this.passwordResetToken = null;
        if (this.passwordResetToken === null) {
          clearInterval(test);
        }
      }, 1800000);
    },
    async resetPassword() {
      let data = {
        email: this.email
      };
      await axios({
        method: "post",
        url: `${url}/resetOTP`,
        data: data
      }).then(
        response => {
          this.passwordResetToken = response.data.OTP;
          this.clearOTP();
        },
        error => {
          console.log(error);
        }
      );
    },
    async checkEmail() {
      await axios({
        method: "get",
        url: `${url}/checkEmail/${this.email}`
      }).then(
        response => {
          if (!response.data.result.length) {
            this.$nextTick(() => {
              this.email = "";
              this.snackbarMessage =
                "No such user, ask admin to create a profile for you.";
              this.snackbar = true;
              this.emailExists = false;
            });
          } else {
            this.emailExists = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  watch: {}
};
</script>

<style scoped>
p {
  color: red;
  font-size: 80%;
  text-align: left;
}
</style>

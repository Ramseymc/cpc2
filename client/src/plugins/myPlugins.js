// mport DirectoryService from "../services/DirectoryServices";
// import moment from "moment";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {};
      },
      methods: {
        async checkToken() {
          axios.defaults.headers.common[
            "Authorization"
          ] = this.$store.state.token;
          await axios({
            method: "get",
            url: `${url}/start`
            // data: data
          })
            .then(
              response => {
                if (response.data.success === false) {
                  return this.$router.push({ name: "Login" });
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
        convertToString(factor) {
          //CONVERTS NUMBERS TO STRING WTH "R"
          if (typeof factor === "string" || factor instanceof String) {
            factor = parseFloat(factor);
          }
          let str = factor
            .toFixed(2)
            .toString()
            .split("")
            .reverse();
          if (str.length > 9) {
            str.splice(9, 0, " ");
          }
          if (str.length > 6) {
            str.splice(6, 0, " ");
          }
          str.reverse().unshift("R");
          str = str.join("");
          return str;
        }
      }
    });
  }
};

export default MyPlugin;

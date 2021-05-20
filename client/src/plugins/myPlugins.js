// mport DirectoryService from "../services/DirectoryServices";
// import moment from "moment";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          idToDelete: 0
        };
      },
      methods: {
        async processNotifications() {
          let data = {
            id: this.$store.state.userId
          };
          await axios({
            method: "post",
            url: `${url}/getNotifications`,
            data: data
          })
            .then(
              response => {
                console.log(response.data);
                if (response.data.length) {
                  response.data.forEach(el => {
                    this.$notify.warning({
                      position: "top center",
                      id: el.id,
                      user: el.user,
                      title: el.title,
                      msg: el.msg,
                      timeout: 0,
                      buttons: [
                        {
                          text: "Read",
                          click(notify) {
                            notify.close(true);
                            this.idToDelete = this.id;
                            this.removeNotification();
                          } // close(true) forces close function to finish even when prevented on event
                        }
                      ]
                    });
                  });
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
        async removeNotification() {
          console.log(this.idToDelete);
          let data = {
            id: this.idToDelete
          };
          await axios({
            method: "post",
            url: `${url}/deletetNotification`,
            data: data
          })
            .then(
              response => {
                console.log(response.data);
              },
              error => {
                console.log(error);
              }
            )
            .catch(e => {
              console.log(e);
            });
        },
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

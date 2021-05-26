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
                if (response.data[1].length) {
                  response.data[1].forEach(el => {
                    if (el.type === "warning") {
                      this.$notify.warning({
                        position: "top center",
                        id: el.id,
                        user: el.user,
                        title: el.title,
                        msg: el.msg,
                        timeout: 2500,
                        buttons: [
                          {
                            text: "Read",
                            click(notify) {
                              notify.close(true);
                              this.idToDelete = this.id;
                              this.removeNotification();
                            }
                          }
                        ]
                      });
                    } else if (el.type === "info") {
                      this.$notify.info({
                        position: "top center",
                        id: el.id,
                        user: el.user,
                        title: el.title,
                        msg: el.msg,
                        timeout: 2500,
                        buttons: [
                          {
                            text: "Read",
                            click(notify) {
                              notify.close(true);
                              this.idToDelete = this.id;
                              this.removeNotification();
                            }
                          }
                        ]
                      });
                    } else if (el.type === "error") {
                      this.$notify.error({
                        position: "top center",
                        id: el.id,
                        user: el.user,
                        title: el.title,
                        msg: el.msg,
                        timeout: 2500,
                        buttons: [
                          {
                            text: "Read",
                            click(notify) {
                              notify.close(true);
                              this.idToDelete = this.id;
                              this.removeNotification();
                            }
                          }
                        ]
                      });
                    } else if (el.type === "success") {
                      this.$notify.success({
                        position: "top center",
                        id: el.id,
                        user: el.user,
                        title: el.title,
                        msg: el.msg,
                        timeout: 2500,
                        buttons: [
                          {
                            text: "Read",
                            click(notify) {
                              notify.close(true);
                              this.idToDelete = this.id;
                              this.removeNotification();
                            }
                          }
                        ]
                      });
                    } else {
                      this.$notify.default({
                        position: "top center",
                        id: el.id,
                        user: el.user,
                        title: el.title,
                        msg: el.msg,
                        timeout: 2500,
                        buttons: [
                          {
                            text: "Read",
                            click(notify) {
                              notify.close(true);
                              this.idToDelete = this.id;
                              this.removeNotification();
                            }
                          }
                        ]
                      });
                    }
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

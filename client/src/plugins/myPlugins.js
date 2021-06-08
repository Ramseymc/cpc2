// mport DirectoryService from "../services/DirectoryServices";
// import moment from "moment";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          idToDelete: 0,
          notifications: []
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
                this.notifications = [];
                // this.notifications = response.data
                if (response.data[1].length) {
                  response.data[1].forEach(el => {
                    this.notifications.push(el.id);
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
                    setTimeout(() => {
                      this.removeNotification();
                    }, 5000);
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
          let data = {
            id: this.notifications
          };
          await axios({
            method: "post",
            url: `${url}/deletetNotification`,
            data: data
          })
            .then(
              () => {},
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
        },
        sumField() {
          //TOTAL ROW CALC FOR TOP OF TABLE - THIS ROW STILL NEEDS TO BE OPTIMISED FOR MOBILE
          let budget = 0,
            actual = 0,
            pcIssued = 0,
            remaining = 0,
            pcpaid = 0,
            due = 0,
            budgetLessPaid = 0,
            Retained = 0;
          this.filteredTable.forEach(el => {
            budget = budget + parseFloat(el.totalBudget);
            actual = actual + parseFloat(el.totalUsed);
            pcIssued = pcIssued + parseFloat(el.PCIssued);
            remaining = remaining + parseFloat(el.Remaining);
            pcpaid = pcpaid + parseFloat(el.PCPaid);
            due = due + parseFloat(el.due);
            budgetLessPaid = budgetLessPaid + parseFloat(el.budgetLessPaid);
            Retained = Retained + parseFloat(el.Retained);
          });
          this.totals.budget = budget.toFixed(2);
          this.totals.actual = actual.toFixed(2);
          this.totals.actual = actual.toFixed(2);
          this.totals.pcIssued = pcIssued.toFixed(2);
          this.totals.remaining = remaining.toFixed(2);
          this.totals.pcpaid = pcpaid.toFixed(2);
          this.totals.due = due.toFixed(2);
          this.totals.budgetLessPaid = budgetLessPaid.toFixed(2);
          this.totals.retained = Retained.toFixed(2);
          this.totals.usedPercent = `${((actual / budget) * 100).toFixed()}%`;

          this.totals.retained = this.convertToString(this.totals.retained);
          this.totals.budgetLessPaid = this.convertToString(
            this.totals.budgetLessPaid
          );
          this.totals.due = this.convertToString(this.totals.due);
          this.totals.pcpaid = this.convertToString(this.totals.pcpaid);
          this.totals.budget = this.convertToString(this.totals.budget);
          this.totals.pcIssued = this.convertToString(this.totals.pcIssued);
          this.totals.actual = this.convertToString(this.totals.actual);
          this.totals.remaining = this.convertToString(this.totals.remaining);
        }
      }
    });
  }
};

export default MyPlugin;

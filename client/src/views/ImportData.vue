<template>
  <div>
    <v-container>
      <v-row class="text-center" max-width="110%">
        <v-col cols="10" offset="1">
          <h3>Import Data</h3>
        </v-col>
        <v-col
          cols="10"
          offset="1"
          v-if="this.$store.state.userName === 'Wayne Bruton'"
        >
          <v-btn text @click="deleteTestData"
            >Delete Test Data - Wayne Only</v-btn
          >
        </v-col>
        <v-col cols="10" offset="1">
          <v-btn
            color="red"
            text
            v-if="file && selectedSheet"
            @click="clearData"
            >Clear Data</v-btn
          >
        </v-col>

        <v-col cols="4" offset="2">
          <v-file-input
            v-model="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            label="File input"
            @change="sheetInput"
          ></v-file-input>
        </v-col>
        <v-col cols="4" offset="0">
          <xlsx-read :file="file">
            <xlsx-sheets>
              <template #default="{sheets}">
                <v-autocomplete
                  v-if="file"
                  v-model="selectedSheet"
                  readonly
                  disabled
                  :items="sheets"
                  item-text="name"
                  outlined
                  prepend-icon="mdi-tag-heart"
                ></v-autocomplete>
              </template>
            </xlsx-sheets>
          </xlsx-read>
        </v-col>
        <v-col cols="10" offset="1">
          <xlsx-read :file="file">
            <xlsx-json
              :sheet="selectedSheet"
              @parsed="showCollection($event)"
            />
          </xlsx-read>
        </v-col>
        <br />
        <v-col cols="12" offset="0" v-if="desserts.length">
          <v-card color="#0F0F0F" dark>
            <v-col cols="10" offset="1">
              <v-btn
                color="white"
                v-show="!verificationFailed"
                text
                rounded
                outlined
                @click="postData"
                ><strong>Post Data</strong></v-btn
              >
            </v-col>
            <v-col cols="10" offset="1">
              <span
                style="color: red; font-weight: bold;"
                v-if="errorMessage.length"
                >{{ errorMessage }}</span
              ><br />
              <span>Other stuff will go here</span><br />
              <span>Edit stuff before final input etc</span>
            </v-col>
          </v-card>
        </v-col>
        <v-col cols="12" offset="0">
          <v-data-table
            v-if="desserts.length"
            dense
            :headers="headers"
            :items="desserts"
            item-key="name"
            :item-class="itemRowColor"
            class="elevation-1"
          ></v-data-table>
        </v-col>
      </v-row>
      <DownloadTemplate />
    </v-container>

    <v-snackbar v-model="snackbar" bottom top>
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import DownloadTemplate from "../components/DownloadTemplate";
let url = process.env.VUE_APP_BASEURL;
import {
  XlsxRead,
  XlsxSheets,
  XlsxJson
} from "../../node_modules/vue-xlsx/dist/vue-xlsx.es";
export default {
  components: {
    XlsxRead,
    XlsxSheets,
    XlsxJson,
    DownloadTemplate
  },
  name: "importdata",
  metaInfo: {
    title: "Import",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Import Data here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      consentUrl: "",
      src: "",
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: [{ name: "SheetOne", data: [{ c: 2 }] }],
      collection: [{ a: 1, b: 2 }],
      tableData: [],
      desserts: [],
      dessertsDuplicated: [],
      filterArrayForUpdates: [],
      snackbarMessage: "",
      snackbar: false,
      insertId: 0,
      verificationFailed: false,
      errorMessage: "",
      unitsAllowed: [],
      tasksAllowed: [],
      headers: [
        {
          text: "ID",
          align: "start",
          value: "ID"
        },
        {
          text: "taskId",
          align: "start",
          value: "taskId"
        },
        {
          text: "UnitId",
          align: "start",
          value: "UnitId"
        },
        {
          text: "Unit",
          align: "start",
          value: "Unit"
        },
        {
          text: "Desc",
          align: "start",
          value: "Description"
        },
        {
          text: "Cost",
          align: "start",
          value: "Cost"
        },
        {
          text: "Qty",
          align: "start",
          value: "Quantity"
        },
        {
          text: "Price",
          align: "start",
          value: "Price"
        },
        {
          text: "Stage",
          align: "start",
          value: "Fix"
        },
        {
          text: "Len (d)",
          align: "start",
          value: "Duration"
        },
        {
          text: "Start",
          align: "start",
          value: "StartDate"
        },
        {
          text: "End",
          align: "start",
          value: "EndDate"
        },
        {
          text: "Supplier",
          align: "start",
          value: "supplier"
        }
      ]
    };
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    onLoad() {
      this.src = this.consentUrl;
    },
    // TEMPORARY - ALLOWS ME TO DELETE INPUTS
    async deleteTestData() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/deleteTestData`
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
    //CHECKS IMPORTED DATA IS CORRECT
    async verificationCheck() {
      let developmentId = this.$store.state.development.id;
      let checkDevelopment = this.desserts.filter(el => {
        return el.ID !== developmentId;
      });
      if (checkDevelopment.length) {
        this.verificationFailed = true;
        this.errorMessage = `Incorrect Development, please ensure Development ID = ${developmentId}`;
        this.snackbarMessage = `Incorrect Development, please ensure Development ID = ${developmentId}`;
        this.snackbar = true;
      } else if (!checkDevelopment.length) {
        axios.defaults.headers.common[
          "Authorization"
        ] = this.$store.state.token;
        await axios({
          method: "get",
          url: `${url}/getUnits/${this.$store.state.development.id}`
        })
          .then(
            response => {
              if (response.data.success === false) {
                return this.$router.push({ name: "Login" });
              }
              let unitsAllowed = [];
              response.data[0].forEach(el => {
                unitsAllowed.push(el.id);
              });
              let tasksAllowed = [];
              response.data[1].forEach(el => {
                tasksAllowed.push(el.id);
              });

              this.desserts.forEach(el => {
                if (unitsAllowed.includes(el.UnitId) === false) {
                  this.errorMessage = `There are incorrect untis in the import`;
                  this.snackbarMessage = `There are incorrect untis in the import`;
                  this.verificationFailed = true;
                  this.unitsAllowed = unitsAllowed;
                  el.UnitId = undefined;
                  el.Unit = undefined;
                  this.snackbar = true;
                }
              });
              this.desserts.forEach(el => {
                if (tasksAllowed.includes(el.taskId) === false) {
                  this.errorMessage = `There wrong tasks`;
                  this.snackbarMessage = `There wrong tasks`;
                  this.verificationFailed = true;
                  this.tasksAllowed = tasksAllowed;
                  el.taskId = undefined;
                  this.snackbar = true;
                }
              });
            },
            error => {
              console.log("Here is an:", error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
    },
    //ONLY ALLOW SPECIFIC SHEET TO BE IMPORTED
    sheetInput() {
      this.$nextTick(() => {
        this.selectedSheet = "Task";
      });
    },
    removeDuplicatesForUpdates() {
      let result = this.filterArrayForUpdates.filter(
        (v, i, a) =>
          a.findIndex(
            t =>
              t.taskId === v.taskId && t.unitId === v.unitId && t.fix && v.fix
          ) === i
      );
      this.filterArrayForUpdates = result;
    },
    //INSERT INPUT INTO DATABASE
    //STILL TODO := BREAK INTO SEVERAL ARRAYS IF LONGER THAN X
    async postData() {
      console.time("Post");

      let data = [];
      await this.desserts.forEach(el => {
        let insert = [];
        insert.push(el.ID);
        insert.push(el.taskId);
        insert.push(el.UnitId);
        insert.push(el.Description);
        insert.push(el.Cost);
        insert.push(el.Quantity);
        insert.push(el.Fix);
        insert.push(el.Duration);
        insert.push(el.StartDate);
        insert.push(el.EndDate);
        insert.push(el.supplier);
        data.push(insert);
      });

      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/importTasks`,
        data: data
      })
        .then(
          response => {
            this.snackbarMessage = `Success!! - ${response.data.affectedRows} tasks posted!!`;
            this.snackbar = true;
            this.clearData();
            console.timeEnd("Post");
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    //CLEARS TABLE
    clearData() {
      (this.file = null), (this.desserts = []);
      this.dessertsDuplicated = [];
      this.selectedSheet = null;
      this.tableData = [];
      this.verificationFailed = false;
      this.errorMessage = "";
      this.unitsAllowed = [];
    },
    //POPULATES THE TABLE
    showCollection(event) {
      this.tableData = event;
      this.desserts = [];
      this.dessertsDuplicated = [];
      this.tableData.forEach(el => {
        let insert = {
          ID: el.ID,
          taskId: el.taskId,
          UnitId: el.UnitId,
          Unit: el.Unit,
          Description: el.Description,
          Cost: el.Cost,
          Quantity: el.Quantity,
          Price: el.Price,
          Fix: el.Fix,
          Duration: el.Duration,
          StartDate: moment(
            new Date((el.StartDate - (25567 + 1)) * 86400 * 1000)
          )
            .utcOffset(0)
            .format("YYYY-MM-DD HH:mm:ss")
            .toString(),
          EndDate: moment(new Date((el.EndDate - (25567 + 1)) * 86400 * 1000))
            .utcOffset(0)
            .format("YYYY-MM-DD HH:mm:ss")
            .toString(),
          supplier: el.Supplier
        };
        this.desserts.push(insert);
      });
      this.dessertsDuplicated = this.desserts;
      this.tableData = [];
      this.filterArrayForUpdates = [];
      this.dessertsDuplicated.forEach(el => {
        let insert = {
          taskId: el.taskId,
          unitId: el.UnitId,
          fix: el.Fix
        };
        this.filterArrayForUpdates.push(insert);
      });
      setTimeout(() => {
        this.$nextTick(() => {
          this.verificationCheck();
        });
      }, 500);
      this.removeDuplicatesForUpdates();
    },
    //ROW COLOR IF ERROR
    itemRowColor(item) {
      if (
        item.UnitId === undefined ||
        item.taskId === undefined ||
        item.ID === undefined ||
        item.ID !== this.$store.state.development.id ||
        item.Description === undefined ||
        item.Cost === undefined ||
        item.Quantity === undefined ||
        item.Price === undefined ||
        item.Fix === undefined ||
        item.Duration === undefined ||
        item.StartDate === undefined ||
        item.EndDate === undefined
      ) {
        return "orange lighten-3";
      }
    }
  }
};
</script>

<style scoped>
.xeroBtn {
  text-decoration: none;
  color: blue;
  font-weight: bold;
}
</style>

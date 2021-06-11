<template>
  <div class="about">
    <br />
    <v-col cols="10" offset="1" mb-4>
      <!-- <downloadTemplate :startData="downloadData" v-if="downloadData.length" /> -->

      <a :href="src" download v-if="!loading && show">
        <v-icon color="green">mdi-microsoft-excel</v-icon>Download</a
      >
      <br />
      <label>Filter</label>
      <div style="display: flex; justify-content: space-evenly;">
        <v-radio-group
          v-model="row"
          row
          style="background-color: lightgrey; border: 1px solid lightgrey; border-radius: 7px; padding: 15px 0px 0px 15px;"
        >
          <v-radio label="Show All" value="both" color="black"></v-radio>
          <v-radio label="PO's Only" value="PO" color="red"></v-radio>
          <v-radio label="PC's Only" value="PC" color="indigo"></v-radio>
          <v-radio label="ITC Only" value="ITC" color="green"></v-radio>
          <v-radio label="Excl ITC" value="NOITC" color="orange"></v-radio>
          <v-radio label="Excl PC's" value="NOPC" color="blue"></v-radio>
          <v-radio
            label="Excl PC's $ ITC"
            value="NOPCITC"
            color="amber"
          ></v-radio>
        </v-radio-group>
      </div>
    </v-col>

    <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="#0F0F0F"
      indeterminate
    ></v-progress-circular>
    <v-row class="text-center">
      <v-col cols="10" offset="1" mb-4>
        <v-card class="mx-auto" elevation="0">
          <v-list-item three-line max-width="1500">
            <v-list-item-content>
              <div class="overline mb-4">
                Cashflow Pivot
              </div>
              <!-- <vue-pivottable-ui
                class="pivotOverflow"
                style="width: 1000px;"
                v-if="!show"
                :data="pivotData"
                :aggregator-name="aggregatorName"
                :renderer-name="rendererName"
                :rows="rows"
                :cols="cols"
                :vals="vals"
                :row-total="true"
                :col-total="true"
              >
              </vue-pivottable-ui> -->
              <v-col class="pivotOverflow">
                <vue-pivottable
                  style="width: 100%;"
                  v-if="show"
                  :data="filteredPivot"
                  :aggregator-name="aggregatorName"
                  :renderer-name="rendererName"
                  :rows="rows"
                  :cols="cols"
                  :vals="vals"
                  :row-total="true"
                  :col-total="true"
                >
                </vue-pivottable>
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { VuePivottable, VuePivottableUi } from "vue-pivottable";
import { VuePivottable } from "vue-pivottable";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import "vue-pivottable/dist/vue-pivottable.css";
// import DownloadTemplate from "../components/DownloadCashflow";
export default {
  name: "Cashflow",
  metaInfo: {
    title: "Cashflow",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Cashflow here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      src: "",
      row: "both",
      model: null,
      pivotData: [],
      mainData: [],
      aggregatorName: "Sum",
      rendererName: "Table",
      rows: ["documentType", "supplierName"], //Left
      cols: ["dueDate", "month", "dayOfMonth"], //Top
      vals: ["documentValue"], //Adds
      disabledFromDragDrop: ["documentValue"],
      hiddenFromDragDrop: ["documentValue"],
      show: false,
      loading: true,
      download: false,
      downloadData: []
    };
  },
  components: {
    VuePivottable
    // VuePivottableUi,
    // DownloadTemplate
  },

  computed: {
    filteredPivot: function() {
      if (this.row === "both") {
        return this.pivotData;
      } else {
        return this.reFilter(this.row);
      }
    }
  },
  mounted() {
    this.checkToken();
    setTimeout(() => {
      this.getData();
      this.src = `${process.env.VUE_APP_BASEURL}/cashflow.xlsx`;
    });
  },
  methods: {
    async getData() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getCashflowInfo`,
        data: data
      })
        .then(
          response => {
            // this.downloadData = response.data;
            // console.log(response.data);

            var myObject = response.data[0];
            var keyNames = Object.keys(myObject);
            this.pivotData = [];
            this.pivotData.push(keyNames);
            response.data.forEach(el => {
              let insert = [];
              insert.push(el.dueDate.substr(0, 7));
              insert.push(el.dayOfMonth);
              insert.push(el.documentValue);
              insert.push(el.documentType);
              insert.push(el.supplierName);
              insert.push(el.year);
              insert.push(el.month);
              this.pivotData.push(insert);
            });
            this.mainData = response.data;
            setTimeout(() => {
              this.show = true;
            }, 1750);

            this.loading = false;
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    reFilter(filter) {
      let data = [];
      let filtered = [];
      if (filter === "PO") {
        filtered = this.mainData.filter(el => {
          return el.documentType === "Purchase Order";
        });
      } else if (filter === "PC") {
        filtered = this.mainData.filter(el => {
          return el.documentType === "Payment Certificate";
        });
      } else if (filter === "ITC") {
        filtered = this.mainData.filter(el => {
          return el.documentType === "Instruction to Commence";
        });
      } else if (filter === "NOITC") {
        filtered = this.mainData.filter(el => {
          return el.documentType !== "Instruction to Commence";
        });
      } else if (filter === "NOPC") {
        filtered = this.mainData.filter(el => {
          return el.documentType !== "Payment Certificate";
        });
      } else if (filter === "NOPCITC") {
        filtered = this.mainData.filter(el => {
          return (
            el.documentType !== "Payment Certificate" &&
            el.documentType !== "Instruction to Commence"
          );
        });
      }

      var myObject = filtered[0];
      var keyNames = Object.keys(myObject);
      data.push(keyNames);
      filtered.forEach(el => {
        let insert = [];
        insert.push(el.dueDate.substr(0, 7));
        insert.push(el.dayOfMonth);
        insert.push(el.documentValue);
        insert.push(el.documentType);
        insert.push(el.supplierName);
        insert.push(el.year);
        insert.push(el.month);
        data.push(insert);
      });
      return data;
    },
    toggle: function(todo) {
      todo.done = !todo.done;
    }
  }
};
</script>

<style scoped>
.pivotOverflow {
  display: flex;
  overflow-x: auto;
}

.horizontal-scroll {
  display: flex;
  width: 100%;
  height: 150px;
  border: solid 2px #2c3e50;
}
.outer {
  display: flex;
  flex: 1;
  width: auto;
  height: 100%;
  padding: 0 20px;
  flex-flow: row nowrap;
  align-items: center;
}
.inner-content {
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: calc(100% - 40px);
  border: solid 1px #2c3e50;
  border-radius: 5px;
}
.inner-content:not(:first-of-type) {
  margin-left: 30px;
}
a {
  text-decoration: none;
  color: black;
  margin-bottom: 10px;
}
</style>

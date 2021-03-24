<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="#0F0F0F"
      indeterminate
    ></v-progress-circular>
    <v-row class="text-center">
      <v-col cols="10" offset="1" mb-4>
        <v-card class="mx-auto" outlined>
          <v-list-item three-line max-width="1500">
            <v-list-item-content>
              <div class="overline mb-4">
                Cashflow Pivot
              </div>
              <div class="overline mb-4">
                <v-btn text color="#0F0F0F" @click="show = !show">{{
                  show ? "Edit" : "Accept"
                }}</v-btn>
              </div>
              <v-list-item-title class="headline mb-1">
                Cashflow
              </v-list-item-title>
              <vue-pivottable-ui
                class="pivotOverflow"
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
              </vue-pivottable-ui>
              <v-col class="pivotOverflow">
                <vue-pivottable
                  v-if="show"
                  :data="pivotData"
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
import { VuePivottable, VuePivottableUi } from "vue-pivottable";
import * as moment from "moment/moment";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import "vue-pivottable/dist/vue-pivottable.css";
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
      model: null,
      pivotData: [],
      aggregatorName: "Sum",
      rendererName: "Table",
      rows: ["supplierName"], //Left
      cols: ["endDate"], //Top
      vals: ["price"], //Adds
      disabledFromDragDrop: ["Total Bill"],
      hiddenFromDragDrop: ["price"],
      show: false,
      loading: true
    };
  },
  components: {
    VuePivottable,
    VuePivottableUi
  },

  mounted() {
    this.checkToken();
    setTimeout(() => {
      this.getData();
    });
    // this.getData();
  },
  methods: {
    //THIS GETS THE DATA FOR THE PIVOT
    async getData() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/cashflow`,
        data: data
      })
        .then(
          response => {
            var myObject = response.data[0];
            var keyNames = Object.keys(myObject);
            this.pivotData.push(keyNames);
            response.data.forEach(el => {
              let insert = [];
              if (moment(el.endDate).weekday() < 5)
                el.endDate = moment(el.endDate)
                  .add(0, "week")
                  .day(5)
                  .format("YY-MM-DD");
              else
                el.endDate = moment(el.endDate)
                  .add(1, "week")
                  .day(5)
                  .format("YY-MM-DD");

              insert.push(el.supplierName);
              insert.push(el.taskName);
              insert.push(el.unitName);
              insert.push(el.fix);
              insert.push(el.endDate);
              insert.push(el.price);
              this.pivotData.push(insert);
            });
            this.show = true;
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
</style>

<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col
        class="mb-4"
        offset="1"
        cols="10"
        sm="10"
        md="10"
        style="margin-bottom: 20px;"
      >
        <a :href="src" download v-if="show">
          <v-icon color="green">mdi-microsoft-excel</v-icon>Download</a
        >
        <span v-else>Loading...</span>
      </v-col>
      <v-col class="mb-4" cols="4" sm="4" md="4">
        <v-card class="mx-auto" color="green" dark max-width="400">
          <v-card-text>
            <v-sheet color="rgba(0, 0, 0, .12)">
              <v-sparkline
                :value="value"
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="24"
                stroke-linecap="round"
                smooth
              >
                <template v-slot:label="item"> R{{ item.value }}000 </template>
              </v-sparkline>
            </v-sheet>
          </v-card-text>

          <v-card-text>
            <div class="text-h4 font-weight-thin">
              Block F - last 30 days
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center">
            <v-btn block text>
              Go to Report
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="mb-4" cols="4" sm="4" md="4">
        <v-card class="mx-auto" max-width="400">
          <v-sheet
            class="v-sheet--offset mx-auto"
            color="cyan"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <v-sparkline
              :labels="labels"
              :value="value2"
              color="white"
              line-width="2"
              padding="16"
            ></v-sparkline>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="text-h6 font-weight-light mb-2">
              Purchase Orders
            </div>
            <div class="subheading font-weight-light grey--text">
              Block F purchases
            </div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>
              mdi-clock
            </v-icon>
            <span class="text-caption grey--text font-weight-light"
              >last Purchase Order 26 minutes ago</span
            >
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="mb-4" cols="4" sm="4" md="4">
        <v-card class="mx-auto" color="grey lighten-4" max-width="400">
          <v-card-title>
            <v-icon
              :color="checking ? 'red lighten-2' : 'indigo'"
              class="mr-12"
              size="64"
              @click="takePulse"
            >
              mdi-cash
            </v-icon>
            <v-row align="start">
              <div class="text-caption grey--text text-uppercase">
                Cash Out
              </div>
              <div>
                <span
                  class="text-h5 font-weight-black"
                  v-text="avg * 1000 || '—'"
                ></span>
                <strong v-if="avg">Rand</strong>
              </div>
            </v-row>

            <v-spacer></v-spacer>

            <v-btn icon class="align-self-start" size="28">
              <v-icon>mdi-arrow-right-thick</v-icon>
            </v-btn>
          </v-card-title>

          <v-sheet color="transparent">
            <v-sparkline
              :key="String(avg)"
              :smooth="16"
              :gradient="['#f72047', '#ffd200', '#1feaea']"
              :line-width="3"
              :value="heartbeats"
              auto-draw
              stroke-linecap="round"
            ></v-sparkline>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" bottom top shaped color="blue">
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
const exhale = ms => new Promise(resolve => setTimeout(resolve, ms));

// import PlanType1 from "../components/plans/PlanType1";
// import PlanType1 from '../../public/PlanType1.svg';
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "DashboardSummary",
  components: {
    // PlanType1
  },
  metaInfo: {
    title: "About us",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `About CPC here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      show: false,
      src: "",
      value: [423, 446, 675, 510, 590, 610, 760],
      labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
      value2: [200, 675, 410, 390, 310, 460, 250, 240],
      checking: false,
      heartbeats: []
    };
  },
  computed: {
    avg() {
      const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0);
      const length = this.heartbeats.length;

      if (!sum && !length) return 0;

      return Math.ceil(sum / length);
    }
  },

  created() {
    this.takePulse(false);
  },
  mounted() {
    // this.processNotifications();
    this.getInitialData();
    this.src = `${process.env.VUE_APP_BASEURL}/dashboard.xlsx`;
  },
  methods: {
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getunitSalesProjection`,
        data: data
      })
        .then(
          response => {
            console.log(response.data.fileWritten);
            if (response.data.fileWritten) {
              this.show = true;
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
    heartbeat() {
      return Math.ceil(Math.random() * (120 - 80) + 80);
    },
    async takePulse(inhale = true) {
      this.checking = true;

      inhale && (await exhale(1000));

      this.heartbeats = Array.from({ length: 20 }, this.heartbeat);

      this.checking = false;
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  margin-bottom: 20px;
}
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>

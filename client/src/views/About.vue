<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <!-- <h1>This is an about page</h1> -->
        <!-- <img src="../../public/PlanTypeA-1.svg" /> -->
        <!-- <img src="require('../../public/PlanTypeA-1.svg')"> -->

        <!-- <PlanType class="logo" />      -->
        <!-- <div class="svgImage"> -->

        <!-- </div> -->
        <!-- <PlanType1 /> -->
        <!-- <img src="require('../../public/PlanType1.svg')" /> -->
        <PlanType1 />
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
import PlanType1 from "../components/plans/PlanType1";
// import PlanType1 from '../../public/PlanType1.svg';

export default {
  name: "About",
  components: {
    PlanType1
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
      done1: false,
      done2: false,
      done3: false,
      snackbar: false,
      snackbarMessage: "",
      paths: [
        {
          id: "pathG",
          d: "m106.06 265.76c-62.974-239.23-63.261-238.04-63.261-238.04",
          stroke: "#f50000",
          strokedasharray: "25.1717, 12.5858",
          strokewidth: "6.2929"
        },
        {
          // m128.88 261.24 278.65-233.37
          id: "pathF",
          d: "m128.88 261.24 278.65-233.37",
          stroke: "#fb0000",
          strokedasharray: "25.1717, 6.29291",
          strokewidth: "6.2929"
        },
        {
          id: "PathD",
          d: "m86.208 485.9c215.96-208.12 215.96-206.38 215.96-206.38",
          stroke: "#fa0000",
          strokedasharray: "25.17165375,12.58582687",
          strokewidth: "6.2929"
        },
        {
          id: "pathA",
          d: "m118.43 588.65c185.48-91.433 185.48-91.433 185.48-91.433",
          stroke: "#fb0000",
          strokedasharray: "18.8787, 6.29291",
          strokewidth: "6.2929"
        },
        {
          id: "PathC",
          d: "m269.07 487.64c150.65-115.81 154.13-115.81 154.13-115.81",
          stroke: "#fb0000",
          strokedasharray: "18.87874016, 6.29291338999999983",
          strokewidth: "6.2929"
        },
        {
          id: "PathB",
          d: "m433.65 486.77c154.13-208.99 154.13-208.99 154.13-208.99",
          stroke: "#f70000",
          strokedasharray: "18.87874016, 6.29291338999999983",
          strokewidth: "6.2929"
        },
        {
          id: "pathE",
          d: "m128.88 261.24c458.03-231.63 458.9-230.76 458.9-230.76",
          fill: "none",
          stroke: "#f90606",
          strokedasharray: "25.17165354,12.58582677",
          strokeopacity: ".98381",
          strokewidth: "6.2929"
        }
      ],
      rects: [
        {
          id: "rectA",
          x: "127.13",
          y: "27.865",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectB",
          x: "421.46",
          y: "26.994",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectD",
          x: "37.444",
          y: "235.98",
          width: "32.219",
          height: "27.865",

          fill: "#f00"
        },
        {
          id: "rectE",
          x: "126.88",
          y: "237.37",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectF",
          x: "78.371",
          y: "274.3",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectG",
          x: "563.4",
          y: "270.81",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectO",
          x: "116.43",
          y: "562.79",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectM",
          x: "114.94",
          y: "498.09",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectP",
          x: "271.94",
          y: "562.79",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectJ",
          x: "393.85",
          y: "369.83",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectI",
          x: "269.07",
          y: "459.78",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectK",
          x: "389.24",
          y: "456.29",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectN",
          x: "274.56",
          y: "493.22",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectL",
          x: "557.3",
          y: "460.65",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectC",
          x: "558.43",
          y: "26.478",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        },
        {
          id: "rectH",
          x: "84.208",
          y: "462.03",
          width: "31.348",
          height: "27.865",
          fill: "#f00"
        }
      ]
    };
  },
  mounted() {
    this.processNotifications();
    //   this.$notify.info({
    //     position: "top center",
    //     id: 10,
    //     user: 3,
    //     title: "Good job!",
    //     msg: "Very nicely done",
    //     timeout: 0,
    //     buttons: [
    //   {
    //     // Use for icons or what ever
    //     color: "red",
    //     text: 'Read',
    //     click(notify){ notify.close(true)
    //     console.log("AWESOME")
    //      console.log(this.id) }, // close(true) forces close function to finish even when prevented on event
    //     // Array, object or string
    //   }
    // ],
    //   });
  },
  methods: {
    diagonalD(event) {
      console.log(event.currentTarget.id);
      this.paths.forEach(el => {
        if (el.id === event.currentTarget.id) {
          el.stroke = "green";
        }
      });
      this.snackbarMessage = `${event.currentTarget.id} Correct Dimensions`;
      this.snackbar = true;
    },
    cornersAdj(event) {
      console.log(event.currentTarget.id);
      this.rects.forEach(el => {
        if (el.id === event.currentTarget.id) {
          el.fill = "green";
        }
      });
      this.snackbarMessage = `${event.currentTarget.id} Straight, Square & Plum`;
      this.snackbar = true;
    }
    // CheckOut1(event) {
    //   this.snackbarMessage = `${event.currentTarget.id} True and Square`;
    //   this.snackbar = true;
    //   this.done1 = !this.done1;
    // },
    // CheckOut2(event) {
    //   this.snackbarMessage = `${event.currentTarget.id} True and Square`;
    //   this.snackbar = true;
    //   this.done2 = !this.done2;
    // },
    // CheckOut3(event) {
    //   this.snackbarMessage = `${event.currentTarget.id} True and Square`;
    //   this.snackbar = true;
    //   this.done3 = !this.done3;
    // },
  }
};
</script>

<style scoped>
.corner {
  background-color: orange;
  cursor: pointer;
}
svg {
  height: 80vh;
}
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
</style>

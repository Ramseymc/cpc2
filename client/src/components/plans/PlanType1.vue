<template>
  <div class="about">
    <!-- <br /><br /><br /><br /> -->
    <v-row class="text-center">
      <v-col class="mb-4">
        <inlineSvg
          src="../../../../PlanType1a.svg"
          :transformSource="transform"
        >
        </inlineSvg>
      </v-col>
    </v-row>

    <!-- <template>
      <div :id="svgId" class="svg-container"></div>
    </template> -->

    <svg src="../../../public/PlanType2.svg"></svg>

    <v-snackbar v-model="snackbar" bottom top shaped color="blue">
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import InlineSvg from "vue-inline-svg";
// import * as d3 from "d3";
export default {
  name: "About",
  components: {
    // PlanType
    InlineSvg
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
      routeQuery: [],
      snackbar: false,
      snackbarMessage: ""
    };
  },
  mounted() {
    console.log(this.$route.query);
    if (this.$route.query.id) {
      this.routeQuery.push(this.$route.query);
      this.routeQuery.forEach(el => {
        if (this.$route.query === el) {
          el.color = "lime";
        }
      });
    }
  },
  methods: {
    test() {
      console.log("TEST");
    },
    test2() {
      console.log("TEST2");
    },
    transform(svg) {
      let pointA = document.createElementNS("http://www.w3.org/2000/svg", "a");
      pointA.setAttributeNS(null, "href", "http://localhost:8080/about?id=7");
      let point = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse"
      );
      let filter = this.routeQuery.filter(el => {
        return el.id == this.$route.query.id;
      });
      console.log(filter);
      console.log(this.routeQuery);
      point.setAttributeNS(null, "cx", "50.294");
      point.setAttributeNS(null, "cy", "249.35");
      point.setAttributeNS(null, "rx", "9");
      point.setAttributeNS(null, "ry", "9");
      if (filter.length) {
        point.setAttributeNS(null, "fill", `${filter[0].color}`);
      } else {
        point.setAttributeNS(null, "fill", "red");
      }
      pointA.appendChild(point);
      svg.appendChild(pointA);
      return svg;
    }
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
.ellipse:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
</style>

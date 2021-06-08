<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4"> </v-col>
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
// import PlanType1 from "../components/plans/PlanType1";
// import PlanType1 from '../../public/PlanType1.svg';

export default {
  name: "About",
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
      done1: false,
      done2: false,
      done3: false,
      snackbar: false,
      snackbarMessage: "",
      paths: []
    };
  },
  mounted() {
    this.processNotifications();
  },
  methods: {
    diagonalD(event) {
      this.paths.forEach(el => {
        if (el.id === event.currentTarget.id) {
          el.stroke = "green";
        }
      });
      this.snackbarMessage = `${event.currentTarget.id} Correct Dimensions`;
      this.snackbar = true;
    },
    cornersAdj(event) {
      this.rects.forEach(el => {
        if (el.id === event.currentTarget.id) {
          el.fill = "green";
        }
      });
      this.snackbarMessage = `${event.currentTarget.id} Straight, Square & Plum`;
      this.snackbar = true;
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
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
</style>

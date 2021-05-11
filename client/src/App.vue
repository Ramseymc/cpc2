<template>
  <v-app class="colorBack">
    <Header />
    <br /><br />
    <!-- <br><br><br><br>
    <h3>{{ this.$store.state.development.developmentName }}</h3>  -->
    <v-main>
      <!-- <br /> -->

      <!-- <h5 class="display-2 font-weight-bold mb-3 mt-10" style="color: #BC9654;"> -->
      <!-- <h5 class="display-1 font-weight-bold mb-1 mt-2" style="color: #BC9654;">
        {{ this.$store.state.development.developmentName }}
      </h5> -->
      <!-- <div class="d-flex align-center" style="background-color: red; display: flex; justify-content: center;">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        :src="require('./assets/logo-3.png')"
        transition="scale-transition"
        width="100"
      />
    </div> -->
      <router-view />
      <!-- <Home /> -->
    </v-main>
  </v-app>
</template>

<script>
// import HomePage from "./components/HomePage";
import Header from "./components/Header";
// import Development from "./components/Development"

export default {
  name: "App",
  components: {
    Header
    // Development
    // Home
  },
  data: () => ({
    //
  }),
  mounted() {
    // this.$router.push({name:'Home'})
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
/* @import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap"); */
/* $body-font-family: "Raleway"; */
#app {
  /* font-family: "Raleway", sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background-color: #3f3f44; */
  /* color: green; */
}

/* .colorBlack {
  background-color: black;
} */

body {
  /* font-family: "Raleway"; */
  background-color: black;
}
h1,
h2,
h3 {
  /* font-family: Raleway; */
  font-weight: bold;
  color: whitesmoke;
}
html {
  background-color: black;
}
span {
  font-family: sans-serif;
  /* color: #bc9654 */
}
</style>

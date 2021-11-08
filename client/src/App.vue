<template>
  <v-app class="colorBack">
    <Header />
    <br /><br />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
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
  async mounted() {
    let data = {
      id: this.$store.state.development.id
    };
    await axios({
      method: "post",
      url: `${url}/updateTasksWithPayDateWB`,
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
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color: black;
}
h1,
h2,
h3 {
  font-weight: bold;
  color: whitesmoke;
}
html {
  background-color: black;
}
span {
  font-family: sans-serif;
}
</style>

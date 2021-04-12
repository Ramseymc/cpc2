<template>
  <v-container>
    <v-row class="text-center">
      <!-- <br /><br /> -->
      <v-col cols="12">
        <!-- :src="require('../assets/CPCLogo.png')" -->
        <v-img
          :src="require('../assets/CPCNewLogo.png')"
          class="my-3"
          contain
          height="500"
        />
      </v-col>

      <v-col class="mb-4">
        <!-- <br /><br /> -->
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Cape Projects -
          {{ this.$store.state.development.developmentName }}
        </h1>
      </v-col>

      <v-col class="mb-5" cols="12"> </v-col>

      <v-col class="mb-5" cols="12"> </v-col>

      <v-col class="mb-5" cols="12"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomePage"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");

h1,
h2,
h3 {
  font-family: Raleway;
  color: #bc9654;
  /* font-weight: bold; */
}
html {
  /* background-color: whitesmoke; */
  /* background-color: black; */
  font-family: Raleway;
  /* font-weight: bold; */
}
span {
  font-family: Raleway;
  /* color: #f5c16c; */
}
</style>

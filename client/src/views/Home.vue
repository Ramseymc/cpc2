<template>
  <div class="home">
    <div
      v-if="
        this.$store.state.development.developmentName === null &&
          this.$store.state.isLoggedIn
      "
    >
      <Development />
    </div>
    <HomePage />
  </div>
</template>

<script>
import HomePage from "@/components/HomePage.vue";
export default {
  name: "Home",
  metaInfo: {
    title: "Home",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `CPC HOME.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  components: {
    HomePage,
    Development: () => import("../components/Development")
  }
};
</script>

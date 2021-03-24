<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1>This is an about page</h1>
        <!-- <v-btn :id="10" icon @click="getPDF($event)"
          ><v-icon color="red">mdi-file-pdf-box</v-icon></v-btn
        >
        <PDFViewer
          :fileName="showFileName"
          :dialog="showPDF"
          :documentName="showSrc"
          v-if="getComponent"
          @update-opened="updateOpened"
        /> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import PDFViewer from "../components/PDFViewer"
export default {
  name: "About",
  components: {
    // PDFViewer,
    // PDFViewer: () => import("../components/PDFViewer")
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
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      showPDF: true
    };
  },
  methods: {
    getPDF(event) {
      let targetId = event.currentTarget.id;
      console.log(targetId);
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    }
  }
};
</script>

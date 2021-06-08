<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="red">mdi-file-pdf-box</v-icon>
        </v-btn>
      </template> -->
      <v-app-bar
        app
        color="#0F0F0F"
        dark
        max-width="30%"
        rounded
        style="margin-left: 35%;"
      >
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-toolbar-title>{{ fileName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="rotate += 90">
            <v-icon>mdi-rotate-right</v-icon></v-btn
          >
          <v-btn dark icon @click="rotate -= 90"
            ><v-icon>mdi-rotate-left</v-icon></v-btn
          >
          <!-- <v-btn dark icon @click="$refs.myPdfComponent[0].print()">
              <v-icon>mdi-cloud-print</v-icon>
            </v-btn> -->
          <!-- <v-btn dark icon>
              <a
                style="text-decoration: none; color: white;"
                :href="src"
                download
              >
                <v-icon>mdi-cloud-download</v-icon></a
              >
            </v-btn> -->
          <v-btn dark icon @click="onClick()">
            <v-icon>mdi-cloud-download</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <v-card>
        <!-- <v-toolbar dark color="#0F0F0F" floating>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-toolbar-title>{{ fileName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark icon @click="rotate += 90">
              <v-icon>mdi-rotate-right</v-icon></v-btn
            >
            <v-btn dark icon @click="rotate -= 90"
              ><v-icon>mdi-rotate-left</v-icon></v-btn
            > -->
        <!-- <v-btn dark icon @click="$refs.myPdfComponent[0].print()">
              <v-icon>mdi-cloud-print</v-icon>
            </v-btn> -->
        <!-- <v-btn dark icon>
              <a
                style="text-decoration: none; color: white;"
                :href="src"
                download
              >
                <v-icon>mdi-cloud-download</v-icon></a
              >
            </v-btn> -->
        <!-- <v-btn dark icon @click="onClick()">
              <v-icon>mdi-cloud-download</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar> -->
        <div>
          <pdf
            :rotate="rotate"
            ref="myPdfComponent"
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            @num-pages="pageCount = $event"
            @page-loaded="currentPage = $event"
          ></pdf>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import pdf from "vue-pdf";
import axios from "axios";
// var loadingTask = pdf.createLoadingTask(
//   "http://localhost:3000/Elec-Elec-002.pdf"
// );
export default {
  name: "PDFViewer",
  components: {
    pdf
  },
  props: {
    fileName: String,
    documentName: String,
    dialog: Boolean
  },
  data() {
    return {
      //   dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      src: "",
      //   src: "http://localhost:3000/Elec-Elec-002.pdf",
      currentPage: 0,
      pageCount: 0,
      numPages: undefined,
      //   fileName: "Elec-Elec-001.pdf",
      rotate: 0
    };
  },
  mounted() {
    // var loadingTask = pdf.createLoadingTask(
    //   "http://localhost:3000/Elec-Elec-001.pdf"
    // );

    // this.src = loadingTask;
    // this.dialog = this.showPDF

    this.src = pdf.createLoadingTask(
      //   "http://localhost:3000/Elec-Elec-001.pdf"
      this.documentName
    );
    this.src.promise.then(pdf => {
      this.numPages = pdf.numPages;
    });
  },
  methods: {
    onClick() {
      axios({
        // url: "http://localhost:3000/Elec-Elec-001.pdf",
        url: this.documentName,
        method: "GET",
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", `${this.fileName}.pdf`);
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
    close() {
      // this.$emit('update-opened', this.dialog = false)
      this.$emit("update-opened", false);
    }
  }
};
</script>

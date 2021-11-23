<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <h1>Quality Reports</h1>
        <v-card class="mx-auto" max-width="1000" tile>
          <v-list>
            <!-- <v-subheader>REPORTS</v-subheader> -->
            <v-toolbar color="black" dark>
              <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

              <v-toolbar-title>Reports</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-text-field
                label="Search"
                v-model="search"
                clearable
              ></v-text-field>

              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-toolbar>
            <!-- <v-list-item-group
        v-model="selectedItem"
        color="primary"
      > -->
            <v-list-item
              v-for="(item, i) in itemsFiltered"
              :key="i"
              class="listItem"
            >
              <!-- <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon> -->
              <v-list-item-content>
                <v-list-item-title v-text="item.shortName"></v-list-item-title>
              </v-list-item-content>
              <!-- <v-list-item-content>
                <v-list-item-title v-text="item.section"></v-list-item-title>
              </v-list-item-content> -->
              <v-list-item-content>
                <v-list-item-title v-text="item.section"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title v-text="item.unit"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title v-text="item.finalised"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <hr />
            <!-- </v-list-item-group> -->
          </v-list>
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
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "QualityReports",
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
      items: [],
      search: ""
    };
  },
  computed: {
    itemsFiltered() {
      if (this.search === "") {
        return this.items;
      } else {
        return this.items.filter(el => {
          return (
            !this.search ||
            el.shortName.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            el.section.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.unit.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      }
    }
  },

  async mounted() {
    let data = {
      id: this.$store.state.development.id
    };
    await axios({
      method: "post",
      url: `${url}/qualityReports`,
      data: data
      // data: formData
    }).then(
      response => {
        console.log(response.data);
        this.items = response.data;
        this.items.forEach(el => {
          if (el.finalised === 1) {
            // el.finalised = 'z'
            el.finalised = "✓";
          } else {
            el.finalised = "";
          }
        });
      },
      error => {
        console.log(error);
      }
    );
  },
  methods: {}
};
</script>

<style scoped>
.listItem:nth-child(odd) {
  background-color: #90a4ae;
  /* margin: 0px 25px; */
}
</style>

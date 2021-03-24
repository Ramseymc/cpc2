<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <!-- <h1>This is a Change Supplier Page</h1> -->
        <v-row class="text-center" max-width="110%">
          <v-col cols="10" offset="1">
            <h3>Edit Suppliers Used</h3>
          </v-col>
          <br />
          <v-col cols="8" offset="2">
            <v-card color="#0F0F0F">
              <v-toolbar color="#0F0F0F" height="85" dark>
                <v-spacer></v-spacer>
                <span style="color: white"
                  >{{ suppliersInAppFiltered.length }} Displayed</span
                >
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchApp"
                  color="white"
                  label="Search"
                  prepend-icon="mdi-magnify"
                  clearable
                ></v-text-field>
              </v-toolbar>

              <v-list>
                <template>
                  <div
                    v-for="(item, index) in suppliersInAppFiltered"
                    :key="index"
                  >
                    <v-list-group v-if="item.items" no-action :group="'items'">
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title
                            :close-on-content-click="false"
                            style="text-align: left;margin-left: 5%;"
                          >
                            {{ item.supplierName }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon
                            :open-on-content-click="false"
                            :id="item.supplier"
                            color="black"
                            @click="changeDetailsWhole"
                            >mdi-pencil</v-icon
                          >
                        </v-list-item-action>
                      </template>
                      <v-list-item
                        v-for="(subItem, index) in item.items"
                        :key="index"
                      >
                        <v-list-item-content class="hover">
                          <div style="display: flex;">
                            <v-list-item-subtitle
                              style="text-align: left;margin-left: 5%;"
                              >{{ subItem.taskName }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle
                              style="text-align: left;margin-left: 5%;"
                              >{{ subItem.subsectionName }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle
                              style="text-align: left;margin-left: 5%;"
                              >{{ subItem.unitName }}
                            </v-list-item-subtitle>
                          </div>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon
                            :id="
                              `${subItem.supplier}-${subItem.taskType}-${subItem.unitNumber}`
                            "
                            color="black"
                            @click="changeDetails"
                            >mdi-pencil</v-icon
                          >
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-group>
                  </div>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "SupplierChange",
  components: {
    // PDFViewer,
    // PDFViewer: () => import("../components/PDFViewer")
  },
  metaInfo: {
    title: "Change Supplier Details",
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
      suppliersInApp: [],
      searchApp: "",
      supplierToEdit: [],
      supplierToEditMax: []
    };
  },
  computed: {
    suppliersInAppFiltered() {
      if (this.searchApp === "") {
        return this.suppliersInApp;
      } else {
        return this.suppliersInApp.filter(supplier => {
          return (
            !this.searchApp ||
            supplier.supplierName
              .toLowerCase()
              .indexOf(this.searchApp.toLowerCase()) > -1
            //  ||
            // supplier.items.taskName
            //   .toLowerCase()
            //   .indexOf(this.searchApp.toLowerCase()) > -1 ||
            // supplier.items.subsectionName
            //   .toLowerCase()
            //   .indexOf(this.searchApp.toLowerCase()) > -1 ||
            // supplier.items.unitName
            //   .toLowerCase()
            //   .indexOf(this.searchApp.toLowerCase()) > -1
          );
        });
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getSuppliersUsed`,
        data: data
      })
        .then(
          response => {
            let newData = [];
            response.data.forEach(el => {
              newData.push(el.supplier);
            });

            newData = Array.from(new Set(newData));
            let suppliersInApp = [];
            newData.forEach(el => {
              let filtered = response.data.filter(el2 => {
                return el === el2.supplier;
              });
              if (filtered.length) {
                let insert = {
                  supplier: filtered[0].supplier,
                  supplierName: filtered[0].supplierName
                };
                suppliersInApp.push(insert);
              }
            });
            suppliersInApp.forEach(el => {
              let filtered = response.data.filter(el2 => {
                return el.supplier === el2.supplier;
              });
              el.items = filtered;
            });
            this.suppliersInApp = suppliersInApp;
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    changeDetails(event) {
      console.log(event.currentTarget.id);
      console.log("AWESOME!!!!");
      let info = event.currentTarget.id.split("-");
      console.log(info);
      let supplier = parseInt(info[0]);
      let taskType = parseInt(info[1]);
      let unitNumber = parseInt(info[2]);
      console.log(supplier);
      console.log(taskType);
      console.log(unitNumber);
      let supplierToEdit = this.suppliersInApp.filter(el => {
        return el.supplier === supplier;
      });
      console.log(supplierToEdit);
      //  supplierToEdit: [],
    },
    changeDetailsWhole(event) {
      console.log(event.currentTarget.id);
      console.log("AWESOME STUFF@@");
      this.supplierToEditMax = this.suppliersInApp.filter(el => {
        return el.supplier === parseInt(event.currentTarget.id);
      });
      console.log(this.supplierToEditMax);

      // supplierToEditMax: []
    }
  }
};
</script>

<style scoped>
/* .inApp:nth-child(even) {
  background-color: antiquewhite;
}
.inApp:nth-child(odd) {
  background-color: azure;
} */
.hover:hover {
  background-color: rgb(199, 183, 183);
}
</style>

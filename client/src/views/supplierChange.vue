<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <!-- <h1>This is a Change Supplier Page</h1> -->
        <v-row class="text-center" max-width="110%">
          <v-col cols="10" offset="1">
            <h3>Edit Subcontractors Used - WIP</h3>
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
                            @click.native.stop="changeSupplierForAllTasks"
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
                            color="orange"
                            class="editPencil"
                            @click.native.stop="changeSupplierForUnit"
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
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Change Supplier / Subcontractor</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="tasktypeId" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Change Type"
                  :value="changeType"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="allSuppliers"
                  v-model="supplierChosen"
                  label="Choose Supplier"
                  item-text="supplierName"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="save" v-if="supplierChosen">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      dialog: false,
      suppliersInApp: [],
      searchApp: "",
      supplierToEdit: [],
      supplierToEditMax: [],
      allSuppliers: [],
      changeType: "",
      tasktypeId: "",
      supplierChosen: ""
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
            response.data[0].forEach(el => {
              newData.push(el.supplier);
            });

            newData = Array.from(new Set(newData));
            let suppliersInApp = [];
            newData.forEach(el => {
              let filtered = response.data[0].filter(el2 => {
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
              let filtered = response.data[0].filter(el2 => {
                return el.supplier === el2.supplier;
              });
              el.items = filtered;
            });
            this.suppliersInApp = suppliersInApp;
            this.allSuppliers = response.data[1];
            console.log(this.allSuppliers);
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    changeSupplierForUnit(event) {
      this.changeType = "Change One";
      this.tasktypeId = event.currentTarget.id;
      this.dialog = true;
    },
    changeSupplierForAllTasks() {
      this.tasktypeId = event.currentTarget.id;
      this.changeType = "Change All";
      this.dialog = true;
    },
    async save() {
      console.log(this.supplierChosen);
      console.log(this.tasktypeId);
      console.log(this.changeType);
      let filtered = this.allSuppliers.filter(el => {
        return el.supplierName === this.supplierChosen;
      });
      let oldSupplier = null;
      let taskType = null;
      let unitNumber = null;
      if (this.changeType === "Change One") {
        let test = this.tasktypeId.split("-");
        console.log(test);
        oldSupplier = parseInt(test[0]);
        taskType = parseInt(test[1]);
        unitNumber = parseInt(test[2]);
      } else if (this.changeType === "Change All") {
        let test = this.tasktypeId.split("-");
        console.log(test);
        oldSupplier = parseInt(test[0]);
      }
      let data = {
        development: this.$store.state.development.id,
        newSupplier: filtered[0].id,
        oldSupplier: oldSupplier,
        taskType,
        unitNumber
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/editSuppliersUsed`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.getData();
            this.dialog = false;
            this.supplierChosen = "";
            this.tasktypeId = "";
            this.changeType = "";
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
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
.editPencil:hover {
  cursor: pointer;
}
.hover:hover {
  background-color: rgb(199, 183, 183);
}
</style>

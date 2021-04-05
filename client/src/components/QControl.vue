<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
          <v-spacer></v-spacer>
          <span class="headline">{{ today }}</span>
          <v-spacer></v-spacer>
          <v-btn icon v-if="pdfExists"
            ><a :href="href" target="_blank"
              ><v-icon color="red">mdi-file-pdf-box</v-icon></a
            ></v-btn
          >
        </v-card-title>
        <v-card-text>
          <div style="display:flex; flex-direction: column;">
            <div style="display: flex;">
              <v-text-field
                style="margin: 5px;"
                label="Subsection"
                outlined
                dense
                v-model="section"
                disabled
              >
              </v-text-field>
              <v-text-field
                label="Unit"
                outlined
                dense
                v-model="unit"
                disabled
                style="margin: 5px;"
              >
              </v-text-field>
            </div>
            <div>
              <v-btn text @click="closeAll()">Close All</v-btn>
              <v-btn text @click="openAll()">Open All</v-btn>
            </div>
          </div>

          <v-container v-if="visible">
            <transition name="fade">
              <v-data-table
                dense
                :headers="headers"
                :items="desserts"
                item-key="name"
                sort-by="id"
                group-by="category"
                class="elevation-1"
                :itemsPerPage="itemsPerPage"
              >
                <template
                  v-slot:group.header="{ group, headers, toggle, isOpen }"
                >
                  <td :colspan="headers.length">
                    <v-btn
                      @click="toggle"
                      large
                      icon
                      :ref="group"
                      :data-open="isOpen"
                    >
                      <v-icon v-if="isOpen" color="green"
                        >mdi-chevron-up</v-icon
                      >
                      <v-icon v-else color="red">mdi-chevron-down</v-icon>
                    </v-btn>
                    <span class="mx-5 font-weight-bold">{{ group }}</span>
                  </td>
                </template>
                <template v-slot:item.subcontactor="{ item }">
                  <v-checkbox
                    style="margin-left: 25px;"
                    color="red darken-3"
                    :ripple="false"
                    v-model="item.subcontractor"
                  ></v-checkbox>
                </template>
                <template v-slot:item.siteForeman="{ item }">
                  <v-checkbox
                    style="margin-left: 25px;"
                    color="amber"
                    :ripple="false"
                    v-model="item.siteforeman"
                  ></v-checkbox>
                </template>
                <template v-slot:item.constructionManager="{ item }">
                  <v-checkbox
                    style="margin-left: 25px;"
                    color="black"
                    :ripple="false"
                    v-model="item.constructionManager"
                  ></v-checkbox>
                </template>
                <template v-slot:item.comments="{ item }">
                  <v-text-field
                    style="margin-left: 25px;"
                    v-model="item.comments"
                  ></v-text-field>
                </template>
              </v-data-table>
            </transition>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="blue darken-1" @click="subcontractorSignature"
            ><v-icon color="red darken-3">mdi-feather</v-icon
            >Subcontractor</v-btn
          >
          <v-btn text color="blue darken-1" @click="siteforemanSignature"
            ><v-icon color="amber">mdi-feather</v-icon>Site Foreman</v-btn
          >
          <v-btn
            text
            color="blue darken-1"
            @click="constructionManagerSignature"
            ><v-icon color="black">mdi-feather</v-icon>Construction
            Manager</v-btn
          >
          <v-spacer></v-spacer>
          <!-- <v-btn v-if="!pdfExists" color="blue darken-1" text @click="createPDF">
            Create Doc
          </v-btn> -->
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveData">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" max-width="50%">
      <Signature
        :title="title"
        @signatureFile="signatureFile($event)"
        @done="closeSignatureFile($event)"
        v-if="dialog1"
        :dialog="true"
      />
    </v-dialog>
  </v-row>
</template>

<script>
// import * as dayjs from "dayjs";
import axios from "axios";
import dayjs from "dayjs";
let url = process.env.VUE_APP_BASEURL;
export default {
  props: {
    close: Boolean,
    QualityType: String,
    section: String,
    unit: String
  },
  components: {
    // Signature: () => import("../components/Signature"),
    Signature: () => import("./Signature")
  },
  data: () => ({
    visible: true,
    dialog: false,
    dialog1: false,
    itemsPerPage: 100,
    title: "",
    headers: [
      {
        text: "Task",
        align: "start",
        value: "name",
        groupable: false,
        sortable: false,
        width: 300
      },
      { text: "Category", value: "category", align: "right", width: 200 },
      {
        text: "Subcontractor",
        value: "subcontactor",
        align: "left",
        width: 50
      },
      { text: "Site Foreman", value: "siteForeman", align: "left", width: 50 },
      {
        text: "Construction Manager",
        value: "constructionManager",
        align: "left",
        width: 50
      },
      { text: "Comments", value: "comments", align: "left", width: 200 }
    ],
    desserts: [],
    subsection: [],
    subsectionChosen: "",
    developmentParam: null,
    units: [],
    unitChosen: "",
    timestamp: "",
    today: "",
    duplicate: "",
    signedConstructionManager: false,
    signedSubcontractor: false,
    signedSiteforeman: false,
    cmSignature: "",
    scSignature: "",
    sfSignature: "",
    pdfExists: false,
    href: ""
  }),
  beforeMount() {
    this.closeAll();
  },
  mounted() {
    if (this.close) {
      this.dialog = this.close;
    }
    this.getData();
    if (this.QualityType === "electrical") {
      this.title = "Electrical";
    } else if (this.QualityType === "balustrades") {
      this.title = "Handrails & Balustrades";
    } else if (this.QualityType === "timberIron") {
      this.title = "Timber & Ironmongery";
    } else if (this.QualityType === "glazing") {
      this.title = "Glazing";
    } else if (this.QualityType === "structuralSteel") {
      this.title = "Structural Steel Documentation";
    } else {
      this.title = this.QualityType;
    }
    this.timestamp = new Date().getTime().toString();
    console.log(this.timestamp);
    this.today = dayjs().format("YYYY-MM-DD");
    // setTimeout(() => {
    //   this.$nextTick(() => {
    //     this.visible = true;
    //   });
    // },200);
    // this.checkChanges()
  },

  methods: {
    createPDF() {
      console.log("OK");
    },
    async saveData() {
      if (
        JSON.stringify(this.desserts) !== this.duplicate &&
        this.duplicate === ""
      ) {
        // this.desserts.forEach((el) => {
        //   el.controlTimestamp = this.timestamp
        // })
        console.log("UNEQUAL");
        let data = {
          development: this.$store.state.development.id,
          unit: this.unit,
          section: this.section,
          controlDate: this.today,
          controlTimestamp: this.timestamp,
          info: this.desserts,
          signedConstructionManager: this.signedConstructionManager,
          signedSubcontractor: this.signedSubcontractor,
          signedSiteforeman: this.signedSiteforeman,
          cmSignature: this.cmSignature,
          scSignature: this.scSignature,
          sfSignature: this.sfSignature
        };

        await axios({
          method: "post",
          url: `${url}/postQC`,
          data: data
        }).then(
          response => {
            console.log(response.data);
          },
          error => {
            console.log(error);
          }
        );
      } else if (
        (JSON.stringify(this.desserts) !== this.duplicate &&
          this.duplicate !== "") ||
        this.signedConstructionManager ||
        this.signedSubcontractor ||
        this.signedSiteforeman
      ) {
        let data = {
          development: this.$store.state.development.id,
          unit: this.unit,
          section: this.section,
          controlDate: this.today,
          controlTimestamp: this.timestamp,
          info: this.desserts,
          signedConstructionManager: this.signedConstructionManager,
          signedSubcontractor: this.signedSubcontractor,
          signedSiteforeman: this.signedSiteforeman,
          cmSignature: this.cmSignature,
          scSignature: this.scSignature,
          sfSignature: this.sfSignature,
          signaturesOnly: false
        };
        console.log("DATA CHANGED");

        // console.log(data)
        await axios({
          method: "post",
          url: `${url}/editQC`,
          data: data
        }).then(
          response => {
            console.log(response.data);
          },
          error => {
            console.log(error);
          }
        );
      } else {
        console.log("NOTHING CHANGED");
      }
      this.dialog = false;
      this.$emit("closed", this.dialog);
    },
    checkChanges(a, b) {
      console.log("desserts", a);
      console.log("Duplicate", b);
      // let a = [
      //   { value: "4a55eff3-1e0d-4a81-9105-3ddd7521d642", display: "Jamsheer" },
      //   { value: "644838b3-604d-4899-8b78-09e4799f586f", display: "Muhammed" },
      //   { value: "b6ee537a-375c-45bd-b9d4-4dd84a75041d", display: "Ravi" },
      //   { value: "e97339e1-939d-47ab-974c-1b68c9cfb536", display: "Ajmal" },
      //   { value: "a63a6f77-c637-454e-abf2-dfb9b543af6c", display: "Ryan" },
      // ];
      // let b = [
      //   {
      //     value: "4a55eff3-1e0d-4a81-9105-3ddd7521d642",
      //     display: "Jamsheer",
      //     $$hashKey: "008",
      //   },
      //   {
      //     value: "644838b3-604d-4899-8b78-09e4799f586f",
      //     display: "Muhammed",
      //     $$hashKey: "009",
      //   },
      //   {
      //     value: "b6ee537a-375c-45bd-b9d4-4dd84a75041d",
      //     display: "Ravi",
      //     $$hashKey: "00A",
      //   },
      //   {
      //     value: "e97339e1-939d-47ab-974c-1b68c9cfb536",
      //     display: "Ajmal",
      //     $$hashKey: "00B",
      //   },
      // ];

      function comparer(otherArray) {
        return function(current) {
          return (
            otherArray.filter(function(other) {
              return (
                other.id == current.id &&
                other.constructionManager == current.constructionManager &&
                other.siteforeman == current.siteforeman &&
                other.subcontractor == current.subcontractor
              );
            }).length == 0
          );
        };
      }

      var onlyInA = a.filter(comparer(b));
      var onlyInB = b.filter(comparer(a));

      let result = onlyInA.concat(onlyInB);

      console.log("THE RSLT", result);
      console.log(result.length / 2);
      let newArray = [];
      let originalArray = [];
      for (let i = 0; i < result.length / 2; i++) {
        newArray.push(result[i]);
      }
      console.log(newArray);
      for (let i = result.length / 2; i < result.length; i++) {
        originalArray.push(result[i]);
      }
      console.log(originalArray);
    },
    async getData() {
      let data = {
        shortName: this.QualityType,
        unit: this.unit,
        section: this.section,
        development: this.$store.state.development.id
      };
      this.duplicate = "";
      await axios({
        method: "post",
        url: `${url}/getqctemplate`,
        data: data
      }).then(
        response => {
          console.log(response.data);
          if (response.data[1].length) {
            this.desserts = response.data[1];
            // this.duplicate = JSON.stringify(response.data[1]);
          } else {
            // this.duplicate = "";
            this.desserts = response.data[0];
          }
          this.desserts.forEach(el => {
            if (el.comments === null) {
              el.comments = "";
            }
          });
          if (!response.data[1].length) {
            let array = [];
            this.desserts.forEach(el => {
              if (el.comments === null) {
                el.comments = "";
              }
              console.log(el);
              array.push(el.category);
            });

            array = Array.from(new Set(array));
            console.log(array);
            array.forEach((el, index) => {
              this.desserts.forEach(el2 => {
                if (el === el2.category) {
                  el2.category = `${index + 1}: ${el}`;
                }
              });

              setTimeout(() => {
                this.$nextTick(() => {
                  this.closeAll();

                  if (response.data[1].length) {
                    this.duplicate = JSON.stringify(this.desserts);
                  } else {
                    this.duplicate = "";
                  }
                });
              });
            });
          } else {
            setTimeout(() => {
              this.$nextTick(() => {
                this.closeAll();
                this.duplicate = JSON.stringify(this.desserts);
                data = {
                  cert: this.desserts[0].controlTimestamp
                };
                axios({
                  method: "post",
                  url: `${url}/getqcPDF`,
                  data: data
                }).then(
                  response => {
                    console.log(response.data);
                    if (response.data.exists) {
                      this.pdfExists = response.data.exists;
                      this.href = `${process.env.VUE_APP_BASEURL}/${this.desserts[0].controlTimestamp}QCReport.pdf`;
                    }
                  },
                  error => {
                    console.log(error);
                  }
                );
              });
            });
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    subcontractorSignature() {
      this.title = "Subcontractor Signature";
      this.dialog1 = !this.dialog1;
    },
    siteforemanSignature() {
      this.title = "Site Foreman Signature";
      this.dialog1 = !this.dialog1;
    },
    constructionManagerSignature() {
      this.title = `${this.$store.state.userName} Signature for ${this.$store.state.development.developmentName}`;
      this.dialog1 = !this.dialog1;
    },
    closeDialog() {
      this.dialog = false;
      this.$emit("closed", this.dialog);
      // if (JSON.stringify(this.desserts) != this.duplicate) {
      //   this.checkChanges(this.desserts, JSON.parse(this.duplicate));
      // }
    },
    closeAll() {
      Object.keys(this.$refs).forEach(k => {
        // console.log(this.$refs[k])
        if (this.$refs[k] && this.$refs[k].$attrs["data-open"]) {
          this.$refs[k].$el.click();
        }
      });
    },
    openAll() {
      Object.keys(this.$refs).forEach(k => {
        if (this.$refs[k] && !this.$refs[k].$attrs["data-open"]) {
          this.$refs[k].$el.click();
        }
      });
    },

    signatureFile(event) {
      console.log(event);
      if (event.title === "Subcontractor Signature") {
        this.signedSubcontractor = true;
        this.scSignature = event.data;
        this.desserts.forEach(el => {
          el.signedSubcontractor = this.signedSubcontractor;
        });
      }
      if (event.title === "Site Foreman Signature") {
        this.signedSiteforeman = true;
        this.sfSignature = event.data;
        this.desserts.forEach(el => {
          el.signedSiteforeman = this.signedSiteforeman;
        });
      }
      if (
        event.title ===
        `${this.$store.state.userName} Signature for ${this.$store.state.development.developmentName}`
      ) {
        this.signedConstructionManager = true;
        this.cmSignature = event.data;
        this.desserts.forEach(el => {
          el.signedConstructionManager = this.signedConstructionManager;
        });
        console.log("AWESOME");
      }
    },
    closeSignatureFile(event) {
      if (event) {
        this.dialog1 = false;
      }
      console.log(event);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-header {
  thead {
    background-color: black;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
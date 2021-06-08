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
                    :disabled="item.scDisabled"
                  ></v-checkbox>
                </template>
                <template v-slot:item.siteForeman="{ item }">
                  <v-checkbox
                    style="margin-left: 25px;"
                    color="amber"
                    :ripple="false"
                    v-model="item.siteforeman"
                    :disabled="item.sfDisabled"
                  ></v-checkbox>
                </template>
                <template v-slot:item.constructionManager="{ item }">
                  <v-checkbox
                    style="margin-left: 25px;"
                    color="black"
                    :ripple="false"
                    v-model="item.constructionManager"
                    :disabled="item.cmDisabled"
                  ></v-checkbox>
                </template>
                <template v-slot:item.uploadImage="{ item }">
                  <v-btn
                    :id="item.id"
                    icon
                    @click="uploadImage"
                    v-if="!item.image || item.image === 'null'"
                    ><v-icon color="blue">mdi-image-plus</v-icon></v-btn
                  >
                </template>
                <template v-slot:item.viewImage="{ item }">
                  <v-btn
                    :id="item.id"
                    icon
                    @click="viewImage"
                    v-if="item.image !== null && item.image !== 'null'"
                    ><v-icon color="green">mdi-camera-image</v-icon></v-btn
                  >
                </template>
                <template v-slot:item.deleteImage="{ item }">
                  <v-btn
                    :id="item.id"
                    icon
                    @click="deleteImage"
                    v-if="item.image && item.image !== 'null'"
                    ><v-icon color="red">mdi-trash-can</v-icon></v-btn
                  >
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
    <v-dialog v-model="uploadDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          Upload Image
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="imageFile"
            accept="image/*"
            label="File input"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            @click="uploadedImageFile"
            v-if="this.imageFile"
          >
            Save
          </v-btn>
          <v-btn color="black darken-1" text @click="uploadDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDialog" :max-width="maxWidth" max-heigh="90vh">
      <v-card>
        <v-spacer></v-spacer>
        <v-card-title class="headline">
          <v-spacer></v-spacer>
          <v-btn
            color="black"
            text
            @click="viewDialog = false"
            style="font-size: 150%; font-weight: bold;"
            ><v-icon color="red">mdi-arrow-collapse-all</v-icon>
          </v-btn>
        </v-card-title>

        <cld-image
          :cloudName="cloudName"
          :publicId="publicId"
          class="white--text align-end"
          width="95%"
          height="95%"
          loading="lazy"
        >
          <cld-transformation radius="20" quality="auto" />
        </cld-image>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import * as dayjs from "dayjs";
import axios from "axios";
import { CldImage, CldTransformation } from "cloudinary-vue";
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
    Signature: () => import("./Signature"),
    CldImage,
    CldTransformation
  },
  data: () => ({
    viewDialog: false,
    maxWidth: "60%",
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    publicId: "",
    visible: true,
    dialog: false,
    dialog1: false,
    uploadDialog: false,
    imageFile: null,
    currentIdForUploadImage: null,
    public_id: [],
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
      { text: "", value: "uploadImage", align: "left", width: 50 },
      { text: "", value: "viewImage", align: "left", width: 50 },
      { text: "", value: "deleteImage", align: "left", width: 50 },
      { text: "Comments", value: "comments", align: "left", width: 250 }
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

    this.today = dayjs().format("YYYY-MM-DD");
  },

  methods: {
    async uploadedImageFile() {
      let formData = new FormData();
      formData.append("image", this.imageFile);
      formData.append("id", this.currentIdForUploadImage);

      await axios({
        method: "post",
        url: `${url}/uploadImage`,
        data: formData
      }).then(
        response => {
          this.uploadDialog = false;
          this.imageFile = null;
          this.desserts.forEach(el => {
            if (el.id === parseInt(response.data.id)) {
              el.image = response.data.public_id;
            }
          });
        },
        error => {
          console.log(error);
        }
      );
    },
    async deleteImage(event) {
      let filteredData = this.desserts.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      let data = {
        id: parseInt(event.currentTarget.id),
        url_id: filteredData[0].image
      };

      await axios({
        method: "post",
        url: `${url}/removeQCImage`,
        data: data
      }).then(
        response => {
          this.imageFile = null;

          this.desserts.forEach(el => {
            if (el.id === parseInt(response.data.id)) {
              el.image = null;
            }
          });
        },
        error => {
          console.log(error);
        }
      );
    },
    uploadImage(event) {
      this.currentIdForUploadImage = event.currentTarget.id;
      this.uploadDialog = true;
    },
    viewImage(event) {
      let filteredData = this.desserts.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      this.publicId = filteredData[0].image;
      this.viewDialog = true;
    },

    async saveData() {
      let now = dayjs(new Date()).format("YYYY-MM-DD HH:mm");
      if (
        JSON.stringify(this.desserts) !== this.duplicate &&
        this.duplicate === ""
      ) {
        let data = {
          saveDate: now,
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
          public_id: this.public_id
        };

        axios.defaults.headers.common[
          "Authorization"
        ] = this.$store.state.token;
        await axios({
          method: "post",
          url: `${url}/postQC`,
          data: data
        }).then(
          () => {},
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
          saveDate: now,
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

        axios.defaults.headers.common[
          "Authorization"
        ] = this.$store.state.token;
        await axios({
          method: "post",
          url: `${url}/editQC`,
          data: data
        }).then(
          () => {},
          error => {
            console.log(error);
          }
        );
      }

      this.dialog = false;
      this.$emit("closed", this.dialog);
    },
    checkChanges(a, b) {
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

      let newArray = [];
      let originalArray = [];
      for (let i = 0; i < result.length / 2; i++) {
        newArray.push(result[i]);
      }

      for (let i = result.length / 2; i < result.length; i++) {
        originalArray.push(result[i]);
      }
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
          if (response.data[1].length) {
            this.desserts = response.data[1];
            this.desserts.forEach(el => {
              if (el.signedConstructionManager === 1) {
                el.cmDisabled = true;
              } else {
                el.cmDisabled = false;
              }
              if (el.signedSiteforeman === 1) {
                el.sfDisabled = true;
              } else {
                el.sfDisabled = false;
              }
              if (el.signedSubcontractor === 1) {
                el.scDisabled = true;
              } else {
                el.scDisabled = false;
              }
            });
          } else {
            this.desserts = response.data[0];
            this.desserts.forEach(el => {
              el.signedConstructionManager = false;
              el.signedConstructionManagerImage = null;
              el.signedSubcontractor = false;
              el.signedSubcontractorImage = null;
              el.signedSiteforeman = false;
              el.signedSiteforemanImage = null;
            });
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

              array.push(el.category);
            });

            array = Array.from(new Set(array));

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
      // this.saveData();
      this.dialog = false;
      this.$emit("closed", this.dialog);
    },
    closeAll() {
      Object.keys(this.$refs).forEach(k => {
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
      if (event.title === "Subcontractor Signature") {
        this.signedSubcontractor = true;
        this.scSignature = event.data;
      }
      if (event.title === "Site Foreman Signature") {
        this.signedSiteforeman = true;
        this.sfSignature = event.data;
      }
      if (
        event.title ===
        `${this.$store.state.userName} Signature for ${this.$store.state.development.developmentName}`
      ) {
        this.signedConstructionManager = true;
        this.cmSignature = event.data;
      }
    },
    closeSignatureFile(event) {
      if (event) {
        this.dialog1 = false;
      }
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

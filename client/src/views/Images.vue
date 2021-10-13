<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <v-card class="mx-auto" max-width="1200">
          <v-toolbar color="#0F0F0F" dark height="85" class="ml-4 mr-4">
            <v-btn @click="openUploadDialog" class="mobile">
              <v-icon dark mr="5">
                mdi-cloud-upload
              </v-icon>
              Upload Image</v-btn
            >
            <v-spacer></v-spacer>

            <v-text-field
              class="mobile"
              prepend-icon="mdi-magnify"
              label="Seach for image"
              v-model="searchImages"
            >
            </v-text-field>
          </v-toolbar>

          <v-container fluid>
            <v-row dense>
              <v-col
                v-for="card in imagesFiltered"
                :key="card.id"
                :cols="card.flex"
              >
                <v-card
                  :id="card.id"
                  min-height="450px"
                  max-height="450px"
                  class="ml-4 mr-4"
                >
                  <div
                    :id="card.id"
                    @click="expandImage($event)"
                    class="clickDiv"
                  >
                    <cld-image
                      :id="card.id"
                      :cloudName="cloudName"
                      :publicId="card.publicId"
                      class="white--text align-end"
                      width="250px"
                      height="250px"
                      loading="lazy"
                    >
                      <cld-transformation quality="auto" crop="fit" />
                      <cld-transformation radius="50" />
                      <cld-transformation
                        :overlay="`text:arial_60:${card.unitName}`"
                        gravity="north"
                        y="20"
                      />
                      <!-- <cld-transformation angle="3" /> -->
                    </cld-image>
                  </div>
                  <v-spacer></v-spacer>
                  <div style="display: flex; font-weight: bold;">
                    <v-card-subtitle>{{ card.blockName }}</v-card-subtitle>
                    <v-card-subtitle>{{ card.unitName }}</v-card-subtitle>
                    <v-card-subtitle>{{ card.createdAt }}</v-card-subtitle>
                    <v-card-subtitle>{{ card.uploadedBy }}</v-card-subtitle>
                  </div>
                  <v-card-text>{{ card.comments }}</v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <!-- <v-btn icon>
                      <v-icon
                        :id="card.id"
                        color="red"
                        @click="expandImage($event)"
                        >mdi-arrow-expand-all</v-icon
                      >
                    </v-btn> -->
                    <!-- <v-spacer></v-spacer> -->

                    <v-btn icon>
                      <v-icon :id="card.id" color="green" @click="sendWhatsApp"
                        >mdi-whatsapp</v-icon
                      >
                    </v-btn>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon :id="card.id" @click="changeFacebook">
                      <ShareNetwork
                        v-if="card.connectToFacebook"
                        network="facebook"
                        :url="url"
                        :title="title"
                        :description="description"
                        quote=""
                        :hashtags="hashtag"
                      >
                        <v-icon class="whatsappBtn">mdi-facebook</v-icon>
                      </ShareNetwork>
                    </v-btn>
                    <v-spacer v-if="card.connectToFacebook"></v-spacer> -->
                    <v-btn icon :id="card.id" @click="sendEmail">
                      <v-icon :id="card.id" color="orange">mdi-email</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      :id="card.id"
                      icon
                      @click="deleteImage"
                      v-if="userRole < 2"
                    >
                      <v-icon color="red" v-if="card.uploadedBy == userName"
                        >mdi-trash-can</v-icon
                      >
                    </v-btn>
                    <v-spacer v-if="userRole < 2"></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <small style="color: red;"
              >For Best Results: Use landscape (16:9). Limit image size (72px). </small
            ><br />
          </v-card-title>
          <v-card-title>
            <span class="headline">Upload</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    ref="files"
                    accept="image/png, image/jpeg, image/bmp, image/jpg,"
                    prepend-icon="mdi-camera"
                    label="Upload Image"
                    v-model="files"
                    multiple
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-list>
                    <div
                      v-for="(file, index) in files"
                      :key="index"
                      style="display:flex;"
                    >
                      <v-list-item>
                        {{ file.name }}
                      </v-list-item>
                      <v-list-item-action>
                        <v-icon @click="removeFromList" :id="index" color="red">
                          mdi-trash-can
                        </v-icon>
                      </v-list-item-action>
                    </div>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-progress-circular
                    v-if="progressActive"
                    :size="120"
                    :width="10"
                    color="black"
                    indeterminate
                  ></v-progress-circular>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="block"
                    v-model="blockChosen"
                    label="Block"
                    item-text="subsectionName"
                    @change="selectUnit"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="unitChosen"
                    :items="units"
                    item-text="unitName"
                    label="Unit"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Comment"
                    v-model="comment"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpload">
              Cancel
            </v-btn>
            <v-btn
              text
              @click="checkImage"
              v-if="
                !progressActive &&
                  unitChosen !== '' &&
                  blockChosen !== '' &&
                  files.length > 0
              "
              >Upload</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog1" :max-width="maxWidth" max-heigh="90vh">
        <v-card>
          <v-spacer></v-spacer>
          <v-card-title class="headline">
            <v-spacer></v-spacer>
            <v-btn
              color="black"
              text
              @click="dialog1 = false"
              style="font-size: 150%; font-weight: bold;"
              ><v-icon color="red">mdi-arrow-collapse-all</v-icon>
            </v-btn>
          </v-card-title>

          <v-col v-for="card in card" :key="card.id">
            <cld-image
              :id="card.id"
              :cloudName="cloudName"
              :publicId="card.publicId"
              class="white--text align-end"
              width="95%"
              height="95%"
              loading="lazy"
            >
              <cld-transformation radius="20" quality="auto" />
            </cld-image>
          </v-col>
        </v-card>
      </v-dialog>
    </v-row>

    <div class="text-center">
      <v-dialog v-model="whatsAppDialog" width="500">
        <v-card>
          <v-card-title class="whatsappHeadline">
            Send WhatsApp
          </v-card-title>

          <v-card-text>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                label="Title"
                v-model="title"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                v-model="description"
                label="Description"
                clearable
                clear-icon="mdi-close-circle"
                counter
                :rules="rules"
                rows="3"
                row-height="25"
              ></v-textarea>
            </v-col>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon color="red" x-large @click="whatsAppDialog = false"
                >mdi-close-box</v-icon
              >
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
              <ShareNetwork
                class="whatsappBtn"
                network="whatsapp"
                :url="url"
                :title="title"
                :description="description"
              >
                <v-icon color="#4FCE5D" large>mdi-whatsapp</v-icon>
              </ShareNetwork>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-col cols="auto">
      <v-dialog
        v-model="emailDialog"
        transition="dialog-top-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>Opening from the top</v-toolbar>
          <v-card-text>
            <v-col cols="12">
              <v-autocomplete
                v-model="suppliersChosen"
                :items="suppliers"
                item-text="supplierName"
                outlined
                dense
                label="Suppliers"
                multiple
                @change="transferEmailAddress"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="emailAddress"
                outlined
                dense
                label="emailAddress (others)"
                @blur="transferEmailAddress"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="additionalEmailChosen"
                auto-grow
                outlined
                rows="1"
                row-height="15"
                dense
                label="Receipients"
                disabled
                nowrap
              ></v-textarea>
            </v-col>
            <hr />
            <v-col cols="12">
              <v-text-field
                type="text"
                v-model="emailSubject"
                outlined
                dense
                label="Subject"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="emailMessage"
                auto-grow
                outlined
                rows="5"
                row-height="15"
                dense
                clearable
                label="email Text"
              ></v-textarea>
            </v-col>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="cancelEmail">Close</v-btn>
            <v-btn text @click="sendWithAttachment">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-snackbar v-model="snackbar" :multi-line="multiLine" color="success" top>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="black" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import { CldImage, CldTransformation } from "cloudinary-vue";
import * as dayjs from "dayjs";
import * as imageConversion from "image-conversion";
export default {
  name: "Images",
  components: {
    CldImage,
    CldTransformation
  },
  metaInfo: {
    title: "Images",
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
      userName: this.$store.state.userName,
      userRole: this.$store.state.userRole,
      multiLine: true,
      snackbar: false,
      text: `Email successfully sent!!.`,
      windowSize: 0,
      maxWidth: "60%",
      whatsAppDialog: false,
      url: "",
      title: "",
      description: "",
      hashtag: "",
      rules: [v => v.length <= 140 || "Max 140 characters"],
      email: "waynebruton@icloud.com",
      progressActive: false,
      files: [],
      searchImages: "",
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      preset: `${process.env.VUE_APP_PRESET}`,
      value: "",
      dialog: false,
      dialog1: false,
      cards: [],
      card: [],
      secure_url: "",
      publicId: "",
      blockChosen: "",
      unitChosen: "",
      comment: "",
      block: [],
      units: [],
      emailDialog: false,
      suppliers: [],
      suppliersChosen: [],
      emailAddress: "",
      emailAddressArray: [],
      additionalEmailChosen: "",
      emailMessage: "",
      emailSubject: ""
    };
  },
  computed: {
    imagesFiltered() {
      if (this.searchImages === "") {
        return this.cards;
      } else {
        return this.cards.filter(el => {
          return (
            !this.searchImages ||
            el.blockName
              .toLowerCase()
              .indexOf(this.searchImages.toLowerCase()) > -1 ||
            el.unitName.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
              -1 ||
            el.comments.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
              -1 ||
            el.createdAt
              .toLowerCase()
              .indexOf(this.searchImages.toLowerCase()) > -1 ||
            el.uploadedBy
              .toLowerCase()
              .indexOf(this.searchImages.toLowerCase()) > -1
          );
        });
      }
    }
  },
  created() {
    this.windowSize = window.innerWidth;
    if (this.windowSize < 968) {
      this.maxWidth = "100%";
    } else {
      this.maxWidth = "60%";
    }
  },
  mounted() {
    this.getImagesFromDataBase();

    this.processNotifications();
  },
  methods: {
    async sendEmail(event) {
      let id = parseInt(event.currentTarget.id);
      await axios({
        method: "get",
        url: `${url}/suppliers`
      })
        .then(
          response => {
            this.suppliers = response.data;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });

      let whatsAppData = this.cards.filter(el => {
        return el.id === id;
      });

      this.url = whatsAppData[0].secure_url;
      this.unitChosen = whatsAppData[0].unitName;
      this.emailDialog = true;
    },
    async sendWithAttachment() {
      let data = {
        image: this.url,
        recipients: this.additionalEmailChosen,
        subject: this.emailSubject,
        message: this.emailMessage,
        sentBy: this.$store.state.userEmail,
        unit: this.unitChosen,
        development: this.$store.state.development.developmentName
      };

      await axios({
        method: "post",
        url: `${url}/sendEmailImage`,
        data: data
      })
        .then(
          () => {
            this.emailDialog = false;
            (this.url = ""), (this.additionalEmailChosen = "");
            this.suppliersChosen = [];
            this.emailAddress = "";
            this.emailAddressArray = [];

            this.emailMessage = "";
            this.emailSubject = "";
            this.snackbar = true;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    cancelEmail() {
      this.emailDialog = false;
      this.suppliersChosen = [];
      this.emailAddress = "";
      this.emailAddressArray = [];

      this.emailMessage = "";
      this.emailSubject = "";
    },
    transferEmailAddress() {
      let sampleEmails = [];
      if (this.emailAddress.length) {
        sampleEmails.push(this.emailAddress);
      }
      this.suppliersChosen.forEach(el => {
        let supplierName = el;
        this.suppliers.forEach(el2 => {
          if (el2.supplierName === supplierName) {
            sampleEmails.push(el2.emailAddress);
          }
        });
      });

      this.additionalEmailChosen = sampleEmails.join(";");
    },
    async deleteImage(event) {
      let filteredData = this.cards.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });

      let data = {
        id: filteredData[0].id,
        url_id: filteredData[0].publicId
      };
      await axios({
        method: "post",
        url: `${url}/removeImage`,
        data: data
      })
        .then(
          () => {
            this.getImagesFromDataBase();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    sendWhatsApp(event) {
      let whatsAppData = this.cards.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      this.url = whatsAppData[0].secure_url;
      this.title = this.$store.state.development.developmentName;

      this.whatsAppDialog = true;
    },
    cancelUpload() {
      this.dialog = false;
      this.files = [];
      this.blockChosen = "";
      this.comment = "";
      this.unitChosen = "";
    },
    removeFromList(event) {
      this.files.splice(parseInt(event.currentTarget.id), 1);
    },
    openUploadDialog() {
      this.getSubsections();
      this.dialog = true;
    },
    async blobToFile(theBlob, fileName, lastModifiedDate, lastModified) {
      theBlob.lastModifiedDate = lastModifiedDate;
      theBlob.lastModified = lastModified;
      theBlob.name = fileName;
      return theBlob;
    },
    convertImage() {
      return new Promise((resolve, reject) => {
        let newFile = [];
        let file;

        this.files.forEach(el => {
          if (el.size > 2000000) {
            console.log("Size", el.size);
            imageConversion.compressAccurately(el, 1700).then(res => {
              console.log(res);
              file = this.blobToFile(
                res,
                el.name,
                el.lastModifiedDate,
                el.lastModified
              );

              newFile.push(file);
            });
          } else {
            newFile.push(el);
          }
        });
        resolve(() => {
          this.files = newFile;
          console.log(newFile);
          console.log("After Conversion", this.files);
        });
        reject(err => {
          console.log(err);
        });
      });
    },
    async checkImage() {
      await this.convertImage();

      console.log("Second", this.files.length);
      if (this.files.length) {
        console.log("Start This");
        this.progressActive = true;
        var formData = new FormData();
        this.files.forEach(el => {
          formData.append("files", el);
        });
        formData.append("development", this.$store.state.development.id);
        formData.append("block", this.blockChosen);
        formData.append("unit", this.unitChosen);
        formData.append("comments", this.comment);
        formData.append("uploadedBy", this.$store.state.userName);
        axios({
          method: "post",
          url: `${url}/uploadCoverImage`,
          data: formData
        })
          .then(
            response => {
              if (response.data.done) {
                this.progressActive = false;
                this.getImagesFromDataBase();
              }
            },
            error => {
              console.log(error);
            }
          )
          .then(() => {
            this.dialog = false;
            this.files = [];
            this.blockChosen = "";
            this.comment = "";
            this.unitChosen = "";
            this.cards = [];
          })
          .then(() => {
            setTimeout(() => {
              this.getImagesFromDataBase();
            }, 500);
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        console.log("No Length!!!");
      }
    },
    selectUnit() {
      this.getUnits();
    },
    getSubsections() {
      this.units = [];
      this.unitChosen = "";
      let parameter = this.$store.state.development.id;
      this.developmentParam = parameter;
      axios({
        method: "get",
        url: `${url}/subsection/${parameter}`
      }).then(
        response => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          this.block = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    getUnits() {
      let filtered = this.block.filter(el => {
        return el.subsectionName === this.blockChosen;
      });

      let parameter = "";
      parameter = filtered[0].id;
      this.subsectionParam = parameter;
      axios({
        method: "get",
        url: `${url}/getUnits/${this.developmentParam}/${parameter}`
      }).then(
        response => {
          this.units = response.data;
          this.units.forEach(el => {
            if (el.unitName.substring(1, 2) === ".") {
              this.units.push(this.units.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
            }
          });
        },
        error => {
          console.log(error);
        }
      );
    },
    async getImagesFromDataBase() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getImagesFromDatabase`,
        data: data
      })
        .then(
          response => {
            this.cards = [];
            this.cards = response.data;

            this.cards.forEach(el => {
              if (this.windowSize < 767) {
                el.flex = 12;
              } else if (this.windowSize < 968) {
                el.flex = 6;
              } else {
                el.flex = 4;
              }
              el.connectToFacebook = false;
              el.createdAt = dayjs(el.createdAt).format("YYYY-MM-DD");
              if (el.uploadedBy === null) {
                el.uploadedBy = "Testing This";
              }
            });
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    expandImage(event) {
      this.card = this.cards.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      this.dialog1 = true;
    }
  }
};
</script>

<style scoped>
.clickDiv {
  cursor: pointer;
}
.whatsappBtn {
  text-decoration: none;
}
.whatsappHeadline {
  background-color: #4fce5d;
}

@media only screen and (max-width: 969px) {
  body {
    background-color: lightblue;
  }
  .mobile {
    font-size: 80%;
  }
}
</style>

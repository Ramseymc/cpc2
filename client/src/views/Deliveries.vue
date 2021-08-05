<template>
  <div class="about">
    <br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <v-row justify="center">
          <v-card>
            <v-card-title>
              <span class="headline">Deliveries</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-autocomplete
                      v-model="supplier"
                      :items="suppliers"
                      dense
                      filled
                      item-text="supplierName"
                      label="Choose Supplier*"
                      @change="getPurchaseOrders"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-autocomplete
                      v-model="purchaseOrder"
                      :items="purchaseOrders"
                      dense
                      filled
                      item-text="PONumber"
                      label="Choose PO*"
                      @change="getspecificPurchaseOrder"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-data-table
                      :headers="headers"
                      :items="desserts"
                      sort-by="calories"
                      class="elevation-1"
                    >
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-toolbar-title>PO DETAIL</v-toolbar-title>
                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                          <v-dialog v-model="dialog" max-width="500px">
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        placeholder="insert reason here"
                                        v-model="editedItem.comments"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editedItem.itemDescription"
                                        label="Description"
                                        disabled
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        v-model="editedItem.quantity"
                                        label="Quantity"
                                        disabled
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        v-model="editedItem.unitDescription"
                                        label="Measure"
                                        disabled
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        type="number"
                                        v-model="editedItem.delivered"
                                        label="Delivered*"
                                        @change="calculateDifference"
                                        @blur="ifDifferent"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        v-model="editedItem.difference"
                                        label="Difference"
                                        disabled
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="close"
                                >
                                  Cancel
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="save">
                                  Save
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.actions="{ item }">
                        <v-icon
                          small
                          class="mr-2"
                          @click="editItem(item)"
                          color="green"
                        >
                          mdi-pencil
                        </v-icon>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="uploadDialog = true"
                v-if="
                  this.desserts.length && this.supplier && this.purchaseOrder
                "
                ><v-icon color="blue">mdi-image-plus</v-icon></v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="receiptAll"
                v-if="
                  this.desserts.length && this.supplier && this.purchaseOrder
                "
              >
                Receipt All
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="checkIfEmailNecessary"
                v-if="
                  this.desserts.length && this.supplier && this.purchaseOrder
                "
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogEmail" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >There are variances, do you wish to email the supplier?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEmailDialog">No</v-btn>
          <v-btn color="blue darken-1" text @click="emailBeforeProcessDialog"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="uploadDialog" persistent max-width="800px">
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
                  <v-progress-circular
                    v-if="progressActive"
                    :size="120"
                    :width="10"
                    color="black"
                    indeterminate
                  ></v-progress-circular>
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
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="uploadDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="black darken-1"
              text
              @click="uploadedImageFile"
              v-if="this.files.length"
            >
              Upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" shaped top color="primary">
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import * as imageConversion from "image-conversion";
export default {
  name: "Deliveries",
  components: {
    // PDFViewer,
    PDFViewer: () => import("../components/PDFViewer")
  },
  metaInfo: {
    title: "Deliveries",
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
      uploadDialog: false,
      getComponent: false,
      files: [],
      progressActive: false,
      imageFile: null,
      currentIdForUploadImage: null,

      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      showPDF: true,
      supplier: "",
      suppliers: [],
      purchaseOrder: "",
      purchaseOrders: [],
      difference: 0,
      snackbar: false,
      snackbarMessage: "",
      dialog: false,
      dialogEmail: false,
      headers: [
        {
          text: "Block",
          align: "start",
          sortable: false,
          value: "subsection"
        },
        {
          text: "Unit",
          align: "start",
          sortable: false,
          value: "unit"
        },
        {
          text: "Delivery Date",
          align: "start",
          sortable: false,
          value: "deliveryDate"
        },
        { text: "Item", value: "itemDescription" },
        { text: "Quantity Ordered", value: "quantity", align: "center" },
        { text: "Unit Measure", value: "unitDescription", align: "center" },
        { text: "Quantity Delivered", value: "delivered", align: "center" },
        { text: "Variance", value: "difference", align: "center" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        subsection: "",
        unitNumber: "",
        deliveryDate: "",
        itemDescription: "",
        quantity: 0,
        unitDescription: "",
        delivered: 0,
        difference: 0,
        comments: ""
      },
      defaultItem: {
        subsection: "",
        unitNumber: "",
        deliveryDate: "",
        itemDescription: "",
        quantity: 0,
        unitDescription: "",
        delivered: 0,
        difference: 0,
        comments: ""
      }
    };
  },
  async mounted() {
    let data = {
      id: this.$store.state.development.id
    };
    await axios({
      method: "post",
      url: `${url}/POreceived`,
      data: data
    }).then(
      response => {
        this.suppliers = response.data;
      },
      error => {
        console.log(error);
      }
    );
    this.processNotifications();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  methods: {
    removeFromList(event) {
      this.files.splice(parseInt(event.currentTarget.id), 1);
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
    async uploadedImageFile() {
      if (this.files.length) {
        await this.convertImage();
        this.progressActive = true;
        let formData = new FormData();
        this.files.forEach(el => {
          formData.append("files", el);
        });
        await axios({
          method: "post",
          url: `${url}/uploadDeliveryImage`,
          data: formData
        }).then(
          response => {
            this.uploadDialog = false;

            this.desserts.forEach(el => {
              el.image = JSON.stringify(response.data);
            });
          },
          error => {
            console.log(error);
          }
        );
      }
    },
    closeClientInfo() {
      this.$emit("closeForm", false);
    },

    receiptAll() {
      this.desserts.forEach(el => {
        el.delivered = el.quantity;
        el.quantityDelivered = el.quantity;
        el.quantityExpected = el.quantity;
        el.difference = 0;
      });
    },
    checkIfEmailNecessary() {
      let variance = this.desserts.reduce((prev, el) => {
        return prev + el.difference;
      }, 0);
      if (variance > 0) {
        this.dialogEmail = true;
      } else {
        this.process();
      }
    },
    async emailBeforeProcessDialog() {
      let supplierToEmail = this.suppliers.filter(el => {
        return el.supplierName === this.supplier;
      });
      let deliveryData = this.desserts.filter(el => {
        return el.difference !== 0;
      });
      let toPost = {
        supplierToEmail,
        data: deliveryData
      };
      await axios({
        method: "post",
        url: `${url}/deliveryVariance`,
        data: toPost
      }).then(
        response => {
          if (response.data.success) {
            this.snackbarMessage = "Email successfully sent!";
          } else {
            this.snackbarMessage =
              "There was a connection problem, please try again later!";
          }
          this.snackbar = true;
          this.process();
          this.dialogEmail = false;
        },
        error => {
          console.log(error);
        }
      );
    },
    closeEmailDialog() {
      this.dialogEmail = false;
      this.process();
    },
    async process() {
      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.supplier;
      })[0].id;
      let toPost = this.desserts.filter(el => {
        return (
          el.delivered !== 0 &&
          parseInt(el.deliveredPreviously) !== parseInt(el.delivered)
        );
      });
      if (toPost.length) {
        toPost.forEach(el => {
          el.delivered = parseInt(el.delivered);
          el.enteredBy = this.$store.state.userName;
          (el.development = this.$store.state.development.id),
            (el.supplier = supplier);
          if (parseInt(el.delivered) === parseInt(el.quantity)) {
            el.fulfilled = true;
          } else {
            el.fulfilled = false;
          }
        });
        await axios({
          method: "post",
          url: `${url}/postdeliveries`,
          data: toPost
        }).then(
          () => {
            this.desserts = [];
            this.purchaseOrder = "";
          },
          error => {
            console.log(error);
          }
        );
      }
    },
    ifDifferent() {
      if (this.editedItem.difference !== 0) {
        alert(`Are you sure?
        The amount you have entered does not agree to the amount expected.`);
      }
    },
    calculateDifference() {
      this.editedItem.difference =
        this.editedItem.quantity - this.editedItem.delivered;
    },
    getPDF() {
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    },
    async getPurchaseOrders() {
      let supplierChosen = this.suppliers.filter(el => {
        return el.supplierName === this.supplier;
      });
      let data = {
        id: this.$store.state.development.id,
        supplier: supplierChosen[0].id
      };
      await axios({
        method: "post",
        url: `${url}/PONumbers`,
        data: data
      }).then(
        response => {
          this.purchaseOrders = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    async getspecificPurchaseOrder() {
      let data = {
        poNumber: this.purchaseOrder,
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getPO`,
        data: data
      }).then(
        response => {
          response.data.forEach(el => {
            el.deliveryDate = dayjs(el.deliveryDate).format("YYYY-MM-DD");
            el.difference = parseInt(el.quantity) - parseInt(el.delivered);
            el.deliveredPreviously = el.delivered;
          });
          this.desserts = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

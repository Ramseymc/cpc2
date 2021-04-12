<template>
  <div class="about">
    <br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <!-- <h1>Delivery</h1> -->
        <v-row justify="center">
          <v-card>
            <v-card-title>
              <span class="headline">Deliveries</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <!-- <v-col cols="12" sm="6" md="6">
                    <v-text-field label="Supplier" required></v-text-field>
                  </v-col> -->
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
                    <!-- PurchaseOrder -->
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
                                    <!-- <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        v-model="editedItem.subsection"
                                        label="Block"
                                        disabled
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        v-model="editedItem.unitNumber"
                                        label="Unit"
                                        disabled
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        v-model="editedItem.deliveryDate"
                                        label="Delivery Date"
                                        disabled
                                      ></v-text-field>
                                    </v-col> -->

                                    <v-col cols="12" sm="12" md="12">
                                       <v-text-field placeholder="insert reason here" v-model="editedItem.comments"></v-text-field>
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
                                      <!-- <label>Delivered *</label>
                                      <vue-numeric-input
                                        style="background-color: white;"
                                        v-model="editedItem.delivered"
                                        label="Testing"
                                        :min="0"
                                        :max="100"
                                        :step="1"
                                        @change="calculateDifference"
                                      ></vue-numeric-input> -->
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
                        <!-- <v-icon small @click="deleteItem(item)">
                          mdi-delete
                        </v-icon> -->
                      </template>
                    </v-data-table>
                  </v-col>
                  <!-- FFFFFFFFFFFFFFFFFFFFFF -->
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn> -->
              <v-btn
                color="blue darken-1"
                text
                @click="process"
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
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      showPDF: true,
      supplier: "",
      suppliers: [],
      purchaseOrder: "",
      purchaseOrders: [],
      difference: 0,


      // KKKKKKKKKKKKK

      dialog: false,
      dialogDelete: false,
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
          value: "unitNumber"
        },
        {
          text: "Delivery Date",
          align: "start",
          sortable: false,
          value: "deliveryDate"
        },
        { text: "Item", value: "itemDescription" },
        // { text: "Reference", value: "reference" },
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
    async process() {
      // console.log(this.desserts)
      //     create table deliveries (
      // id int auto_increment primary key,
      // PONumber    varchar(15) not null,
      // purchaseNumber Int not null,
      // development int not null,
      // supplier int not null,
      // expectedDeliveryDate TIMESTAMP DEFAult now(),
      // quantityExpected decimal(18,2) default 0.00,
      // quantityDelivered decimal(18,2) default 0.00,
      //  actualDeliveryDate TIMESTAMP DEFAult now(),
      //  enteredBy varchar(160),
      //  FOREIGN KEY (supplier) REFERENCES suppliers(id),
      //  FOREIGN KEY (purchaseNumber) REFERENCES purchaseOrders(id),
      // FOREIGN KEY (development) REFERENCES developments(id)

      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.supplier;
      })[0].id;
      console.log(supplier);
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
          response => {
            console.log("DATA", response.data);
            this.desserts = [];
            this.purchaseOrder = "";

            // this.purchaseOrders = response.data;
          },
          error => {
            console.log(error);
          }
        );
      }

      // console.log(toPost);
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
    getPDF(event) {
      let targetId = event.currentTarget.id;
      console.log(targetId);
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
          // console.log("DATA",response.data);
          this.purchaseOrders = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    async getspecificPurchaseOrder() {
      console.log(this.purchaseOrder);
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
          console.log("DATA", response.data);
          response.data.forEach(el => {
            el.deliveryDate = dayjs(el.deliveryDate).format("YYYY-MM-DD");
            // el.delivered = 0;
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

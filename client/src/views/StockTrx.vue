<template>
  <div class="about">
    <br />
    <h2>Stock Management</h2>
    <v-btn id="createButton" outlined text @click="opencompleteTransfer"
      >Complete Transfer</v-btn
    >
    <v-col cols="8" offset="2">
      <v-list
        three-line
        outlined
        shaped
        class="overflow-y-auto"
        max-height="30vh"
      >
        <v-subheader>
          <h3><b> Selected Sub Contractor XXX</b></h3>
        </v-subheader>
        <!-- <draggable
            v-model="currentSubContractor"
            :group="group3"
            style="min-height: 10px"
            @change="currentContractorChanged"
          > -->
        <!-- <template > -->
        <v-list-item v-for="item in currentSubContractor" :key="item.id" ripple>
          <v-list-item-icon>
            <v-icon large color="blue">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="item.supplierName"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon :id="item.id" @click="deleteCurrentSubContractor">
              <v-icon color="red">mdi-account-off</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <!-- </template>
          </draggable> -->
      </v-list>
      <!-- </v-row> -->
     
    </v-col>
    <v-col cols="8" offset="2">
      <v-list
        three-line
        outlined
        shaped
        class="overflow-y-auto fullList"
        max-height="35vh"
      >
        <v-subheader>
          <h3><b> Selected Stock Transfer List XXX</b></h3>
          <v-btn icon @click="clearCurrentStockList" label="Clear Stock List ">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-subheader>
        <!-- <draggable
            v-model="currentStockList"
            :group="group2"
            style="min-height: 10px"
            @change="currentStockListChanged"
            :disabled="disabled"
          > -->
        <!-- <template > -->
        <v-list-item v-for="stock in currentStockList" :key="stock.id" ripple>
          <v-list-item-icon>
            <v-icon large color="green">{{ stock.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="stock.itemCode"></v-list-item-title>
            <v-list-item-subtitle
              v-html="stock.mainCategory"
            ></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title v-html="stock.qtyToTrxLbl"></v-list-item-title>
            <v-text-field
              v-model="stock.qtyToTransfer"
              type="number"
              min="0"
              class="shrink"
              label=""
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title v-html="stock.qtyOnHandLbl"></v-list-item-title>
            <v-list-item-subtitle
              v-html="stock.qtyOnHand"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <!-- </template>
          </draggable> -->
      </v-list>
      <!-- </v-row> -->
    </v-col>

    <v-col cols="8" offset="2">

     <v-radio-group v-model="radioGroup" row>
      <v-radio
        label="Show Subcontractor"
        value="Subcontractor"
      ></v-radio>
      <v-radio  
        label="Show Stock"
        value="Stock"
      ></v-radio>
      <v-radio
        label="Hide both"
        value="None"
      ></v-radio>
    </v-radio-group>
    </v-col>
  

    <!-- Row wrapping the entire app -->
    <!-- <v-row style="margins: 10px 10px;"> -->
    <!-- <v-row class="text-center"> -->
      <!-- Entire List of Stock On Hand -->
      <v-col :cols="cols" offset="0">
        <v-list
        v-if="radioGroup === 'Stock'"
          three-line
          outlined
          shaped
          class="overflow-y-auto"
          style="margin-left: 20px; max-height: 70vh"
          color="grey lighten-5"
        >
          <v-subheader>
            <h4 justify="center"><b> Stock List </b></h4>
            <v-text-field
              prepend-icon="mdi-magnify"
              placholder="Search"
              label="Search"
              v-model="searchStock"
              style="min-height: 10px"
              clearable
            ></v-text-field>
          </v-subheader>
          <!-- <draggable
            v-model="StockList"
            :group="group2"
            @change="items1Changed"
            :disabled="disabled"
          > -->
          <!-- <template > -->
          <v-list-item
            v-for="(stock, index) in stockListFiltered"
            :id="index"
            :key="index"
            ripple
            class="listItem"
            @click="clickStockItem"
          >
            <v-list-item-icon>
              <v-icon large color="green">{{ stock.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-html="stock.itemDescription"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-html="`${stock.itemCode}`"
              ></v-list-item-subtitle>
              <v-list-item-subtitle
                v-html="stock.mainCategory"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title
                v-html="stock.qtyOnHandLbl"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-html="stock.qtyOnHand"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <!-- <v-divider></v-divider> -->
          </v-list-item>
          <!-- </template> -->
          <!-- </draggable> -->
        </v-list>
      </v-col>
      <!-- Current SubContractor & StockList in centre-->

      <!-- Sub Contractors List -->
      <v-col :cols="cols" offset="0">
        <v-list
        v-if="radioGroup === 'Subcontractor'"
          three-line
          outlined
          shaped
          class="overflow-y-auto"
          max-height="70vh"
          style="margin-right: 20px;"
          color="grey lighten-5"
        >
          <v-subheader>
            <h4><b> Sub Contractors </b></h4>
            <v-text-field
              prepend-icon="mdi-magnify"
              placholder="Search"
              label="Search"
              v-model="searchSubContractor"
              clearable
            ></v-text-field>
          </v-subheader>
          <!-- <draggable
            v-model="SubContractors"
            :group="group3"
            style="min-height: 10px"
            @change="currentContractorChanged"
          > -->
          <!-- <template> -->
          <v-list-item
            v-for="item in subContractorsFiltered"
            :key="item.id"
            ripple
            class="listItem"
          >
            <v-list-item-icon>
              <v-icon large color="blue">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-html="item.supplierName"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- </template>
          </draggable> -->
        </v-list>
      </v-col>
    <!-- </v-row> -->

    <!-- Stock Transfer Dialog -->
    <!-- <v-row justify="center"> -->
      <v-dialog v-model="transferDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Stock Transfer</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Sub Contractor"
                    required
                    v-model="selectedSubContractorName"
                    readonly
                    placeholder="Enter title of your request"
                  ></v-text-field>
                </v-col>
                <!-- the block and units, allow for multi select,  -->
                <v-col cols="12">
                  <v-autocomplete
                    style="margin-right: 8px"
                    v-model="block"
                    :items="blocks"
                    dense
                    filled
                    multiple
                    item-text="subsectionName"
                    label="Choose Block"
                    @change="chooseUnit"
                  ></v-autocomplete>
                  <!-- <v-text-field
                      v-model="block"
                      type="text"                      
                      class="shrink"
                      label="Block"                      
                  ></v-text-field> -->
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    style="margin-left: 8px"
                    v-model="unit"
                    :items="units"
                    dense
                    filled
                    multiple
                    item-text="unitName"
                    label="Choose Unit"
                    @change="unitChosen"
                  ></v-autocomplete>

                  <!-- <v-text-field
                    v-model="unit"
                    type="text"                    
                    class="shrink"
                    label="Unit"                    
                  ></v-text-field>                   -->
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="stockImage"
                    label="Upload Image"
                    accept="image/png, image/jpeg, image/bmp, image/jpg"
                    filled
                    hint="Upload Image"
                    persistent-hint
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeView"
              v-if="openTransferDialog"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="completeTransfer"
              v-if="openTransferDialog"
            >
              Save
              <v-icon>
                mdi-steam
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- </v-row> -->

    <!-- Task Details-->
    <!-- <v-row justify="center"> -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Task Details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="!viewOnly"
                    label="User*"
                    v-model="userName"
                    required
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Title*"
                    required
                    v-model="title"
                    placeholder="Enter title of your request"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Text*"
                    type="password"
                    required
                    v-model="text"
                    placeholder="Place description / explanation here"
                    :readonly="viewOnly"
                    auto-grow
                    outlined
                    rows="1"
                    row-height="15"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Time Estimate"
                    required
                    v-model="estimate"
                    placeholder="Estimate of Time"
                    v-if="(userName = 'Wayne Bruton' || viewOnly)"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeView">
              Close``
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveTask"
              v-if="!viewOnly"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- </v-row> -->

    <!-- Edit Task -->
    <!-- <v-row justify="center"> -->
      <v-dialog v-model="dialog1" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Task</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="!viewOnly"
                    label="User*"
                    v-model="userName"
                    required
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Title*"
                    required
                    v-model="title"
                    placeholder="Enter title of your request"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Text*"
                    type="password"
                    required
                    v-model="text"
                    placeholder="Place description / explanation here"
                    :readonly="viewOnly"
                    auto-grow
                    outlined
                    rows="1"
                    row-height="15"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Time Estimate"
                    required
                    v-model="estimate"
                    placeholder="Estimate of Time"
                    v-if="(userName = 'Wayne Bruton' || viewOnly)"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog1 = false">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveEditTask"
              v-if="!viewOnly"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- </v-row> -->
    <v-dialog v-model="confirmStockTransferDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h6">
          Add to stock transfer list
        </v-card-title>
        <!-- <v-card-text>Add to stock transfer list?</v-card-text> -->
        <v-card-actions>
          <v-btn
            color="green darken-1"
            text
            @click="confirmStockTransferDialog = false"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="confirmStockTransferDialog = false"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
// import draggable from "vuedraggable";
export default {
  name: "StockTrx",
  components: {
    // draggable
  },
  metaInfo: {
    title: "About us",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `About CPC here.`,
      },
    ],
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },
  data() {
    return {
      radioGroup: "Subcontractor",
      confirmStockTransferDialog: false,
      cols: 4,
      screenWidth: 0,
      dialog: false,
      dialog1: false,

      userName: this.$store.state.userName,
      editId: 0,
      title: "",
      estimate: "TBA",
      text: "",
      viewOnly: false,
      group1: "group",
      group2: "group",
      group3: "group",
      group4: "group",
      disabled: true,
      group: {
        group: "people",
      },
      items: [],

      // left hand side Properties
      StockList: [],
      StockMainCateg: [],
      StockSubCateg: [],
      // right hand side Properties
      SubContractors: [],

      // Centre Column Properties
      currentSubContractor: [],
      currentStockList: [],

      selectedSubContractorName: "",

      // Transfer Dialog Properties
      openTransferDialog: false, // used like viewOnly
      transferDialog: false,
      itemCode: "",
      unit: "",
      block: "",
      units: [],
      blocks: [],
      qtyToTransfer: 0,
      stockTransferImage: null,
      stockImage: null,
      imageFile: null,

      searchStock: "",
      searchSubContractor: "",
    };
  },
  created() {
    console.log(screen.width);
    this.screenWidth = screen.width;
    if (this.screenWidth < 600) {
      this.cols = 12;
    } else {
      this.cols = 12;
      // this.cols = 4;
    }
  },
  beforeDestroy() {
    this.updateTasks();
  },
  computed: {
    stockListFiltered() {
      if (this.searchStock === "") {
        console.log("salesFiltered = ", this.StockList);
        return this.StockList;
      } else {
        return this.StockList.filter((el) => {
          return (
            !this.searchStock ||
            el.itemCode.toLowerCase().indexOf(this.searchStock.toLowerCase()) >
              -1 ||
            el.itemDescription
              .toLowerCase()
              .indexOf(this.searchStock.toLowerCase()) > -1 ||
            el.mainCategory
              .toLowerCase()
              .indexOf(this.searchStock.toLowerCase()) > -1
          );
        });
      }
    },
    subContractorsFiltered() {
      if (this.searchSubContractor === "") {
        console.log("subContractorsFiltered = ", this.SubContractors);
        return this.SubContractors;
      } else {
        return this.SubContractors.filter((el) => {
          return (
            !this.searchSubContractor ||
            el.supplierName
              .toLowerCase()
              .indexOf(this.searchSubContractor.toLowerCase()) > -1
          );
        });
      }
    },
  },
  async mounted() {
    this.getTasks();
    // crm
    this.getStockList();

    this.getSubContractors();

    // if (
    //   this.$store.state.userName === "Wayne Bruton" ||
    //   this.$store.state.userName === "Wynand Haywood" ||
    //   this.$store.state.userName === "Dirk Coetzee" ||
    //   this.$store.state.userName === "Connor McLean"
    // ) {
    //   this.disabled = false;
    // }
    // if (
    //   this.$store.state.userName === "Wayne Bruton" ||
    //   this.$store.state.userName === "Connor McLean"
    // ) {
    //   this.group1 = "group";
    //   this.group2 = "group";
    //   this.group3 = "group";
    //   this.group4 = "group";
    // } else {
    //   this.group1 = "group1";
    //   this.group2 = "group2";
    //   this.group3 = "group3";
    //   this.group4 = "group4";
    // }

    let data = {
      id: this.$store.state.development.id,
    };
    await axios({
      method: "post",
      // method: "get",
      url: `${url}/getblocksforstock`,
      // url: `${url}/ooo`,
      data: data,
    })
      .then(
        (response) => {
          console.log("RESPONSE DATA CONNOR:", response.data);
          this.blocks = response.data.filter((el) => {
            return el.subsectionName !== "Common Area";
          });

          console.log(this.blocks);
        },
        (error) => {
          console.log("the Error", error);
        }
      )
      .catch((e) => {
        console.log("THERE IS AN ERROR", e);
      });
  },

  methods: {
    clickStockItem(event) {
      console.log(event.currentTarget.id);
      console.log("awesome!!!@@");
      // this.confirmStockTransferDialog = true
      let thisItem = this.stockListFiltered[event.currentTarget.id];
      console.log(thisItem);
      this.currentStockList.push(thisItem);
      this.stockListFiltered.splice(event.currentTarget.id, 1);
    },
    // crm
    async getStockList() {
      this.StockList = [];
      let data = {
        id: this.$store.state.development.id,
      };
      await axios({
        method: "post",
        url: `${url}/getStockList`,
        data: data,
      })
        .then(
          (response) => {
            response.data.forEach((el) => {
              el.qtyOnHandLbl = "Qty On Hand";
              el.qtyToTrxLbl = "Qty To Transfer";
              el.qtyToTransfer = 0;
              this.StockList.push(el);
            });
            //console.log("this.StockList = ", this.StockList)
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    // crm
    async getSubContractors() {
      this.SubContractors = [];
      let data = {
        id: this.$store.state.development,
      };
      await axios({
        method: "post",
        url: `${url}/getSubContractors`,
        data: data,
      })
        .then(
          (response) => {
            response.data.forEach((el) => {
              this.SubContractors.push(el);
            });
            //console.log("this.SubContractors = ", this.SubContractors);
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    opencompleteTransfer() {
      this.openTransferDialog = true;
      this.transferDialog = true;
    },
    completeTransfer() {
      console.log("CompleteTransfers get StockList and SupplierID");
      this.completeTransfers();
      this.uploadImage();
    },
    async uploadImage() {
      // upload the image

      let supplierName = "";
      //let contactID = ""

      this.currentSubContractor.forEach((s) => {
        supplierName = s.supplierName;
        // contactID = s.contactID
      });
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
      var dateTime = date + "_" + time;
      let image =
        dateTime +
        "_" +
        supplierName +
        "." +
        this.stockImage.name.split(".")[1];

      let formData = new FormData();
      formData.append("stockImage", this.stockImage);
      formData.append("newImageName", image);

      console.log("this.stockImage = ", this.stockImage);
      //console.log("this.stockImage = ", insert);
      await axios({
        method: "post",
        url: `${url}/uploadImage`,
        data: formData,
      })
        .then(
          () => {
            this.refreshData();
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async completeTransfers() {
      // take all the stock in the currentStockList and update the status in StockTranfers table from busy to complete, or mismatch, ?
      console.log("stockimage=", this.stockImage);
      //let image = this.stockImage[0];
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + "_" + time;

      let supplierName = "";
      let contactID = "";

      this.currentSubContractor.forEach((s) => {
        supplierName = s.supplierName;
        contactID = s.contactID;
      });

      let selectedUnits = this.unit.join(",");
      let selectedBlocks = this.block.join(",");
      console.log("selected Units=", selectedUnits);
      console.log("selected Blocks=", selectedBlocks);
      let insert = {
        development: this.$store.state.development.id,
        subContractor: this.currentSubContractor,
        supplierName: supplierName,
        contactID: contactID,

        // selectedUnits: selectedUnits,
        // selectedBlocks: selectedBlocks,

        stockList: this.currentStockList,
        unit: selectedUnits,
        block: selectedBlocks,
        qtyToTransfer: this.qtyToTransfer,
        currentUser: this.$store.state.userName,
        currentUserId: this.$store.state.userId,

        imageName:
          dateTime +
          "_" +
          supplierName +
          "." +
          this.stockImage.name.split(".")[1],
        transferDate: dateTime,
      };
      // const  keys = Object.keys(insert);
      // const values = Object.values(insert);

      //  console.log("insert=", keys);
      //  console.log("insert=", values);
      //  insert.forEach(el => { console.log(el) })
      //  let formData = new FormData();
      //  for (var i = 0; i < keys.length; i++) {
      //     formData.append(keys[i], values[i])
      //  }
      //  console.log("suppleir=", this.currentSubContractor.supplierName);
      // let formData = new FormData();
      // formData.append("insert",insert);

      // formData.append("stockImage", this.stockImage);
      // formData.append("development",this.$store.state.development.id);
      // formData.append("subContractor", this.currentSubContractor.supplierName);
      // formData.append("contactId", this.currentSubContractor.contactId);
      // formData.append("stockList", this.currentStockList);
      // formData.append("unit", this.unit);
      // formData.append("block", this.block);
      // formData.append("qtyToTransfer", this.qtyToTransfer);
      // formData.append("currentUser", this.$store.state.userName);
      // formData.append("currentUserId",this.$store.state.userId);

      // formData.append("stockImage", this.stockImage);
      // formData.append("stockImage", this.stockImage);

      // try this without the append, get the stockImage in the insert, put it in a variable first and then use the variable in the insert block

      // formData.append('files',)

      console.log("this.stockImage = ", this.stockImage);
      //console.log("this.stockImage = ", insert);
      await axios({
        method: "post",
        url: `${url}/completeTransfers`,
        data: insert,
      })
        .then(
          () => {
            this.refreshData();
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },

    currentContractorChanged(theEvent) {
      if (theEvent.added) {
        if (this.currentSubContractor.length === 2) {
          this.clearCurrentSubContractor();
          alert("You may only have 1 Sub Contractor selected at a time");
        }
        console.log("SubContractor: ", this.currentSubContractor);
        this.currentSubContractor.forEach((subContractor) => {
          console.log("SubContractor: ", subContractor);
          this.selectedSubContractorName = subContractor.supplierName;
          console.log(
            "this.selectedSubContractorName = ",
            this.selectedSubContractorName
          );
        });
      }
    },
    currentStockListChanged(theEvent) {
      if (theEvent.added) {
        this.StockList.forEach((el) => {
          if (el.stockId === theEvent.added.element.stockId) {
            el.qtyToTransfer = this.qtyToTransfer;
          }
        });
      }
    },

    async deleteCurrentSubContractor() {
      this.clearCurrentSubContractor();
    },
    //clear the array of currentSubContractor for the new one
    clearCurrentSubContractor() {
      this.currentSubContractor.splice(0, this.currentSubContractor.length);
    },
    clearCurrentStockList() {
      this.currentStockList.splice(0, this.currentStockList.length);
    },
    closeView() {
      this.dialog = false;
      this.transferDialog = false;
      this.openTransferDialog = false;
      this.viewOnly = false;
    },
    refreshData() {
      this.clearCurrentSubContractor();
      this.clearCurrentStockList();
      this.closeView();
      alert("Successfully completed Stock Transfer");
    },

    // From the TaskList.vue
    async getTasks() {
      this.items = [];
      this.items1 = [];
      this.items2 = [];
      this.items3 = [];
      let data = {
        id: this.$store.state.development.id,
      };
      await axios({
        method: "post",
        url: `${url}/getTaskList`,
        data: data,
      })
        .then(
          (response) => {
            response.data.forEach((el) => {
              if (el.typeTask === "WIP") {
                this.items.push(el);
              } else if (el.typeTask === "Suggested") {
                this.items1.push(el);
              } else if (el.typeTask === "Completed") {
                this.items2.push(el);
              } else if (el.typeTask === "Finalised") {
                this.items3.push(el);
              }
            });
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async updateTasks() {
      let dataToUpdate = [];
      this.items.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });
      this.items1.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });
      this.items2.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });
      this.items3.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });

      let data = {
        info: dataToUpdate,
      };
      await axios({
        method: "post",
        url: `${url}/updateTaskList`,
        data: data,
      })
        .then(
          () => {},
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    createTask() {
      this.text = "";
      (this.title = ""), (this.estimate = "TBA");
      this.dialog = true;
    },
    async saveTask() {
      let insert = {
        development: this.$store.state.development.id,
        taskText: this.text,
        taskTitle: this.title,
        userName: this.userName,
        icon: "mdi-thought-bubble",
        typeTask: "Suggested",
        sortIndex: this.items1.length,
        estimate: this.estimate,
      };
      await axios({
        method: "post",
        url: `${url}/createTaskListItem`,
        data: insert,
      })
        .then(
          () => {
            this.items1.push(insert);
            this.title = "";
            this.text = "";
            this.dialog = false;
            this.getTasks();
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    items1Changed(evt) {
      if (evt.added) {
        this.items1.forEach((el) => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-thought-bubble";
            el.typeTask = "Suggested";
          }
        });
      }
      if (evt.moved) {
        this.items1.forEach((el) => {
          if (el.id === evt.moved.element.id) {
            el.sortIndex = evt.moved.newIndex;
          }
        });
      }
    },
    itemsChanged(evt) {
      if (evt.added) {
        this.items.forEach((el) => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-progress-wrench";
            el.typeTask = "WIP";
          }
        });
      }
    },
    items2Changed(evt) {
      if (evt.added) {
        this.items2.forEach((el) => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-checkbox-marked-circle";
            el.typeTask = "Completed";
          }
        });
      }
    },
    items3Changed(evt) {
      if (evt.added) {
        this.items3.forEach((el) => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-emoticon-happy";
            el.typeTask = "Finalised";
          }
        });
      }
    },
    viewTask(event) {
      console.log("the viewTask event", event);
      let filteredData = this.items1.filter((el) => {
        return el.id === parseInt(event.currentTarget.id);
      });

      this.viewOnly = true;
      this.title = filteredData[0].taskTitle;
      this.text = filteredData[0].taskText;
      this.estimate = filteredData[0].estimate;
      this.dialog = true;
    },
    editTask(event) {
      let filteredData = this.items1.filter((el) => {
        return el.id === parseInt(event.currentTarget.id);
      });

      this.title = filteredData[0].taskTitle;
      this.text = filteredData[0].taskText;
      this.estimate = filteredData[0].estimate;
      this.editId = parseInt(event.currentTarget.id);
      this.dialog1 = true;
    },
    saveEditTask() {
      this.items1.forEach((el) => {
        if (el.id === this.editId) {
          el.taskText = this.text;
          el.estimate = this.estimate;
          el.taskTitle = this.title;
        }
      });
      this.dialog1 = false;
    },

    async deleteTask(event) {
      console.log("the event", event);
      let data = {
        id: event.currentTarget.id,
      };
      await axios({
        method: "post",
        url: `${url}/deleteTaskListItem`,
        data: data,
      })
        .then(
          () => {
            this.getTasks();
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async chooseUnit() {
      console.log("block", this.block);
      // let blocks = this.block.join(',')
      // console.log("blocks",blocks)
      let blocksId = [];
      this.block.forEach((el) => {
        let filtered = this.blocks.filter((el2) => {
          return el2.subsectionName === el;
        });
        blocksId.push(filtered[0].id);
      });

      console.log("blocksId", blocksId);
      // let filteredData = this.blocks.filter(el => {
      //   return el.subsectionName === this.block;
      // });
      let data = {
        id: this.$store.state.development.id,
        // subsection: filteredData[0].id,
        // subsectionName: filteredData[0].subsectionName,
        blocksId: blocksId,
        //subsectionName:
      };
      console.log(data);
      console.log(process.env.VUE_APP_BASEURL);
      // console.log("filteredData for getting subsectionname:", filteredData),
      await axios({
        method: "post",
        url: `${url}/getAllUnitsforStockPage`,
        data: data,
      })
        .then(
          (response) => {
            console.log(response.data);
            let filteredData = response.data.filter((el) => {
              return el.unitName.substring(2, 1) !== ".";
            });
            this.units = filteredData;
            console.log("XXXX", this.units);
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    unitChosen() {
      let unitId = this.units.filter((el) => {
        return el.unitName === this.unitValue;
      })[0].id;
      console.log(unitId);
      this.unitId = unitId;
    },
  },
};
</script>

<style scoped>
.listItem:nth-child(odd) {
  background-color: #90a4ae;
  /* margin: 0px 25px; */
}
.listItem {
  margin: 0px 25px;
}
.fullList {
  padding-left: 15px;
  margin: 0px 25px;
}
.headerList {
  margin: 55px 55px;
}
@media only screen and (max-width: 600px) {
  .headerList {
    display: flex;
    flex-direction: column;
  }
}
</style>

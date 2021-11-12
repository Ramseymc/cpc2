<template>
  <div class="about">
    <br />
    <h2>Stock Management</h2>
    <v-btn id="createButton" outlined text @click="opencompleteTransfer"
      >Complete Transfer</v-btn
    >
    <v-col cols="8" offset="2">
      <v-list one-line outlined shaped class="overflow-y-auto">
        <v-subheader>
          <h4><b> Selected Sub Contractor</b></h4>
        </v-subheader>
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
      </v-list>
    </v-col>
    <v-col cols="8" offset="2">
      <v-list three-line outlined shaped class="overflow-y-auto">
        <v-subheader>
          <h4><b> Selected Stock Transfer List XXX</b></h4>
          <v-btn icon @click="clearCurrentStockList" label="Clear Stock List ">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-subheader>

        <v-list-item v-for="stock in currentStockList" :key="stock.id" ripple>
          <v-list-item-icon>
            <v-icon large color="green">{{ stock.icon }}</v-icon>
          </v-list-item-icon>
          <div style="display: flex; justify-content: space-evenly;">
            <v-list-item-content>
              <v-list-item style="margin-right: 10px;"
                ><small>{{ stock.itemDescription }}</small></v-list-item
              >
              <!-- <v-list-item-title v-html="stock.itemCode"></v-list-item-title> -->
              <!-- <v-list-item-subtitle
              v-html="stock.itemDescription"
            ></v-list-item-subtitle> -->
            </v-list-item-content>
            <v-list-item-content>
              <!-- <v-list-item-title v-html="stock.qtyToTrxLbl"></v-list-item-title> -->
              <v-text-field
                v-model="stock.qtyToTransfer"
                label="Qty to Tfr"
                type="number"
                min="0"
                :max="stock.qtyOnHand"
              ></v-text-field>
            </v-list-item-content>
            <v-list-item-content>
              <!-- <v-list-item-title v-html="stock.qtyToTrxLbl"></v-list-item-title> -->
              <v-text-field
                style="margin-left: 5px;"
                v-model="stock.qtyOnHand"
                label="Qty on Hand"
                type="number"
                min="0"
                readonly
                color="green"
              ></v-text-field>
            </v-list-item-content>
          </div>
          <!-- <v-list-item-content>
            <v-list-item-title v-html="stock.qtyOnHandLbl"></v-list-item-title>
            <v-list-item-subtitle
              v-html="stock.qtyOnHand"
            ></v-list-item-subtitle>
          </v-list-item-content> -->
        </v-list-item>
      </v-list>
    </v-col>

    <v-col cols="8" offset="2">
      <v-radio-group v-model="radioGroup" row>
        <v-radio label="Show Subcontractor" value="Subcontractor"></v-radio>
        <v-radio label="Show Stock" value="Stock"></v-radio>
        <v-radio label="Hide both" value="None"></v-radio>
      </v-radio-group>
    </v-col>
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
            <v-list-item-title v-html="stock.qtyOnHandLbl"></v-list-item-title>
            <v-list-item-subtitle
              v-html="stock.qtyOnHand"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
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
        <v-list-item
          v-for="item in subContractorsFiltered"
          :key="item.id"
          :id="item.id"
          ripple
          class="listItem"
          @click="clickSubcontractorItem"
        >
          <v-list-item-icon>
            <v-icon large color="blue">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="item.supplierName"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-dialog
      v-model="transferDialog"
      persistent
      max-width="600px"
      v-if="currentSubContractor.length"
    >
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
                  v-model="currentSubContractor[0].supplierName"
                  readonly
                  placeholder="Enter title of your request"
                ></v-text-field>
              </v-col>
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
          <v-btn color="blue darken-1" text @click="transferDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="completeTransfer">
            Save
            <!-- <v-icon>
              mdi-steam
            </v-icon> -->
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmStockTransferDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h6">
          Add to stock transfer list
        </v-card-title>
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
import * as dayjs from "dayjs";
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
      radioGroup: "Subcontractor",
      confirmStockTransferDialog: false,
      cols: 4,
      screenWidth: 0,
      userName: this.$store.state.userName,
      editId: 0,
      items: [],
      StockList: [],
      StockMainCateg: [],
      StockSubCateg: [],
      SubContractors: [],
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
      stockImageName: ""
    };
  },
  created() {
    this.screenWidth = screen.width;
    if (this.screenWidth < 600) {
      this.cols = 12;
    } else {
      this.cols = 12;
      // this.cols = 4;
    }
  },
  // beforeDestroy() {
  //   this.updateTasks();
  // },
  computed: {
    stockListFiltered() {
      if (this.searchStock === "") {
        return this.StockList;
      } else {
        return this.StockList.filter(el => {
          return (
            !this.searchStock ||
            el.itemCode.toLowerCase().indexOf(this.searchStock.toLowerCase()) >
              -1 ||
            el.itemDescription
              .toLowerCase()
              .indexOf(this.searchStock.toLowerCase()) > -1
            //   ||
            // el.mainCategory
            //   .toLowerCase()
            //   .indexOf(this.searchStock.toLowerCase()) > -1
          );
        });
      }
    },
    subContractorsFiltered() {
      if (this.searchSubContractor === "") {
        return this.SubContractors;
      } else {
        return this.SubContractors.filter(el => {
          return (
            !this.searchSubContractor ||
            el.supplierName
              .toLowerCase()
              .indexOf(this.searchSubContractor.toLowerCase()) > -1
          );
        });
      }
    }
  },
  async mounted() {
    this.getStockList();

    this.getSubContractors();

    let data = {
      id: this.$store.state.development.id
    };
    await axios({
      method: "post",
      url: `${url}/getblocksforstock`,
      data: data
    })
      .then(
        response => {
          this.blocks = response.data.filter(el => {
            return el.subsectionName !== "Common Area";
          });
        },
        error => {
          console.log("the Error", error);
        }
      )
      .catch(e => {
        console.log("THERE IS AN ERROR", e);
      });
  },

  methods: {
    clickSubcontractorItem(event) {
      // this.confirmStockTransferDialog = true

      let thisItem = this.subContractorsFiltered.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      })[0];
      if (!this.currentSubContractor.length) {
        this.currentSubContractor.push(thisItem);
      } else {
        this.currentSubContractor = [];
        this.currentSubContractor.push(thisItem);
      }
      // this.subcontractorsFiltered.splice(event.currentTarget.id, 1);
    },
    clickStockItem(event) {
      let thisItem = this.stockListFiltered[event.currentTarget.id];

      this.currentStockList.push(thisItem);
      this.stockListFiltered.splice(event.currentTarget.id, 1);
    },
    // crm
    async getStockList() {
      this.StockList = [];
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getStockList`,
        data: data
      })
        .then(
          response => {
            response.data.forEach(el => {
              el.qtyToTransfer = 0;
            });
            this.StockList = response.data.filter(el => {
              return el.qtyOnHand > 0;
            });
            console.log(this.StockList);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    // crm
    async getSubContractors() {
      this.SubContractors = [];
      let data = {
        id: this.$store.state.development
      };
      await axios({
        method: "post",
        url: `${url}/getSubContractors`,
        data: data
      })
        .then(
          response => {
            response.data.forEach(el => {
              this.SubContractors.push(el);
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
    opencompleteTransfer() {
      this.openTransferDialog = true;
      this.transferDialog = true;
    },
    async completeTransfer() {
      this.uploadImage();
      this.completeTransfers();
    },
    async uploadImage() {
      if (this.stockImage !== null) {
        // upload the image

        let supplierName = "";
        //let contactID = ""

        this.currentSubContractor.forEach(s => {
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
          today.getHours() +
          "-" +
          today.getMinutes() +
          "-" +
          today.getSeconds();
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
        await axios({
          method: "post",
          url: `${url}/uploadImage`,
          data: formData
        })
          .then(
            () => {
              this.stockImageName = image;
              this.stockImage = null;
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
    },
    async completeTransfers() {
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

      console.log(dateTime);
      console.log(dayjs(new Date()).format("YYYY-MM-DD_HH:mm:ss"));

      let supplierName = "";
      let contactID = "";

      this.currentSubContractor.forEach(s => {
        supplierName = s.supplierName;
        contactID = s.contactID;
      });

      // console.log("currentSubContractor",this.currentSubContractor)
      console.log("supplierName", supplierName);
      console.log("contactID", contactID);

      let selectedUnits = this.unitId;
      let selectedBlocks = this.block.join(",");
      console.log("selectedUnits", selectedUnits);
      console.log("selectedBlocks", selectedBlocks);
      console.log("stockImage", this.stockImage);
      console.log("currentStockList", this.currentStockList);
      // let imageName = null
      // if (this.stockImage !== null) {
      //   console.log("awesome", imageName)
      // }

      let transferDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let insert = {
        development: this.$store.state.development.id,
        subContractor: this.currentSubContractor,
        supplierName: supplierName,
        contactID: contactID,

        stockList: this.currentStockList,
        unit: selectedUnits,
        block: selectedBlocks,
        qtyToTransfer: this.qtyToTransfer,
        currentUser: this.$store.state.userName,
        currentUserId: this.$store.state.userId,

        imageName: this.stockImageName,
        transferDate: transferDate
      };
      console.log("insert", insert);

      await axios({
        method: "post",
        url: `${url}/completeTransfers`,
        data: insert
      })
        .then(
          response => {
            console.log(response.data);
            this.transferDialog = false;
            this.stockImageName = "";
            this.stockImage = null;
            this.unitId = "";
            this.unitChosen = "";
            this.refreshData();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    currentContractorChanged(theEvent) {
      if (theEvent.added) {
        if (this.currentSubContractor.length === 2) {
          this.clearCurrentSubContractor();
          alert("You may only have 1 Sub Contractor selected at a time");
        }

        this.currentSubContractor.forEach(subContractor => {
          this.selectedSubContractorName = subContractor.supplierName;
        });
      }
    },
    currentStockListChanged(theEvent) {
      if (theEvent.added) {
        this.StockList.forEach(el => {
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
      console.log(this.currentStockList);
      this.currentStockList.reverse();
      this.currentStockList.forEach(el => {
        el.qtyToTransfer = 0;
        this.StockList.unshift(el);
      });

      this.currentStockList = [];
    },
    closeView() {
      this.dialog = false;
      this.transferDialog = false;
      this.openTransferDialog = false;
      // this.viewOnly = false;
    },
    refreshData() {
      this.clearCurrentSubContractor();
      this.clearCurrentStockList();
      this.closeView();
      alert("Successfully completed Stock Transfer");
      this.getStockList();
    },

    async chooseUnit() {
      let blocksId = [];
      this.block.forEach(el => {
        let filtered = this.blocks.filter(el2 => {
          return el2.subsectionName === el;
        });
        blocksId.push(filtered[0].id);
      });

      let data = {
        id: this.$store.state.development.id,
        blocksId: blocksId
      };

      await axios({
        method: "post",
        url: `${url}/getAllUnitsforStockPage`,
        data: data
      })
        .then(
          response => {
            let filteredData = response.data.filter(el => {
              return el.unitName.substring(2, 1) !== ".";
            });
            this.units = filteredData;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    unitChosen() {
      console.log(this.unitValue);
      console.log(this.unit);
      console.log(this.units);
      let unitId = this.unit.filter(el => {
        return el.unitName === this.unitValue;
      });
      console.log("unitId", unitId);
      // let newUnitID = ""
      // unitId.forEach((el,index, arr) => {
      //   if (index < arr[arr.length - 1]) {
      //     newUnitID = `${newUnitID}${el},`
      //   } else {
      //     newUnitID = `${newUnitID}${el}`
      //   }
      // })
      let newUnitID = unitId.join(",");
      console.log("newUnitID", newUnitID);

      this.unitId = newUnitID;
    }
  }
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
  padding-left: 0px;
  margin: 0px 0px;
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

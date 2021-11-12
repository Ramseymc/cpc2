<template>
  <div class="about">
    <br />
    <h2>Stock Take</h2>
    <v-btn id="createButton" outlined text @click="openSubmitStockTake"
      >Submit Stock Take</v-btn
    >
    <br />
    <br />
    <!-- Row wrapping the entire app -->
    <v-row>
      <!-- Entire List of Stock On Hand -->
      <v-col cols="12">
        <v-list
          three-line
          outlined
          shaped
          class="overflow-y-auto"
          max-height="90vh"
        >
          <v-subheader>
            <h3 justify="center"><b> Stock List </b></h3>
            <v-col cols="3">
              <v-text-field
                prepend-icon="mdi-magnify"
                placholder="Search"
                label="Search"
                v-model="search"
              ></v-text-field>
            </v-col>
          </v-subheader>
          <!-- <draggable v-model="StockList" style="min-height: 10px"> -->
          <!-- <template > -->
          <v-list-item
            v-for="stockItem in stockListFiltered"
            :key="stockItem.id"
            ripple
          >
            <v-list-item-icon>
              <v-icon large color="green">{{ stockItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-html="stockItem.itemDescription"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-html="`${stockItem.itemCode}`"
              ></v-list-item-subtitle>
              <v-list-item-subtitle
                v-html="stockItem.mainCategory"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title
                v-html="stockItem.qtyOnHandLbl"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="bigFont"
                v-html="stockItem.qtyOnHand"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title
                v-html="stockItem.CountCorrectLbl"
              ></v-list-item-title>
              <v-switch
                v-model="stockItem.CountCorrect"
                :label="stockItem.CountCorrect ? 'Yes' : 'No'"
                @change="changeSwitch"
              ></v-switch>
            </v-list-item-content>

            <v-list-item-content v-if="!stockItem.CountCorrect">
              <v-list-item-title
                v-html="stockItem.qtyCountedLbl"
              ></v-list-item-title>
              <v-text-field
                v-model="stockItem.qtyCounted"
                type="number"
                min="0"
                class="shrink"
                label=""
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <!-- </template> -->
          <!-- </draggable> -->
        </v-list>
      </v-col>
    </v-row>
    <!-- Stock Transfer Dialog -->
    <v-row justify="center">
      <v-dialog
        v-model="openSubmitStockTakeDialog"
        persistent
        max-width="450px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Submit Stock Take?</span>
          </v-card-title>
          <!-- <v-card-text>
           
            <Medium>Submit Stock Take?</Medium>
          </v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeView">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="submitStockTake">
              Yes
              <v-icon>
                mdi-steam
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
// import draggable from "vuedraggable";

export default {
  name: "StockTake",
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
      qtyCounted: 0,
      StockList: [],
      switch1: true,
      search: "",
      openSubmitStockTakeDialog: false
    };
  },
  computed: {
    stockListFiltered() {
      if (this.search === "") {
        console.log("salesFiltered = ", this.StockList);
        return this.StockList;
      } else {
        return this.StockList.filter(el => {
          return (
            !this.search ||
            el.itemCode.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            el.itemDescription
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) > -1 ||
            el.mainCategory.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1
          );
        });
      }
    }
  },
  mounted() {
    this.getStockList();
  },
  beforeDestroy() {},

  methods: {
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
            response.data.forEach(stockItem => {
              stockItem.qtyOnHandLbl = "Qty On Hand";
              stockItem.qtyCountedLbl = "Qty Counted";
              stockItem.CountCorrect = true;
              stockItem.CountCorrectLbl = "Correct Stock Qty?";
              stockItem.qtyCounted = 0;
              this.StockList.push(stockItem);
            });
            //console.log("this.StockList = ", this.StockList)
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    changeSwitch(evt) {
      console.log("evt", evt);
      this.StockList.forEach(stockItem => {
        //if()
        console.log("StockItem=", stockItem);
      });
    },
    openSubmitStockTake() {
      this.openSubmitStockTakeDialog = true;
    },
    closeView() {
      this.openSubmitStockTakeDialog = false;
    },
    async sendEmail() {
      let invalidStockCounts = [];
      this.StockList.forEach(stockItem => {
        if (!stockItem.CountCorrect) {
          invalidStockCounts.push(stockItem);
        }
      });
      console.log("invalidStockCounts=", invalidStockCounts);
      if (invalidStockCounts.length > 0) {
        await axios({
          method: "post",
          url: `${url}/sendStockTakeEmail`,
          data: invalidStockCounts
        })
          .then(
            response => {
              console.log("CLIENT-SIDE: RESPONSE DATA: ", response.data);
              if (response.data.success === true) {
                this.initialData();
              }
            },
            error => {
              console.log("the Error", error);
            }
          )
          .catch(e => {
            console.log("THERE IS AN ERROR", e);
          });
      }

      //  let data = {
      //    info: invalidStockCounts
      //  };
    },
    async submitStockTake() {
      //this.StockList = [];
      console.log("Submit Stock Take");
      let data = {
        id: this.$store.state.development.id,
        StockList: this.StockList,
        countCorrect: this.switch1,
        currentUser: this.$store.state.userName,
        currentUserId: this.$store.state.userId
      };
      await axios({
        method: "post",
        url: `${url}/submitStockTake`,
        data: data
      })
        .then(
          () => {
            this.sendEmail();
            this.closeView();
          },
          error => {
            console.log(error);
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
.bigFont {
  font-size: 18px;
}
</style>

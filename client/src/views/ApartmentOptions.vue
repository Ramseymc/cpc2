<template>
  <div>
    <v-card :loading="loading" class="mx-auto my-12" max-width="874">
      <template slot="progress">
        <v-progress-linear
          color="#bc9654"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img height="350" src="../assets/internal4a.jpg"></v-img>

      <v-card-title>Choose your options</v-card-title>

      <v-card-text>
        <div>
          <v-autocomplete
            v-model="blockValue"
            :items="blocks"
            dense
            filled
            item-text="subsectionName"
            label="Choose Block"
            @change="chooseUnit"
          ></v-autocomplete>
        </div>
        <div>
          <v-autocomplete
            v-model="value"
            :items="items"
            dense
            filled
            item-text="unitName"
            label="Choose Unit"
          ></v-autocomplete>
        </div>

        <v-stepper alt-labels non-linear v-if="value">
          <v-stepper-header>
            <v-stepper-step step="1" complete color="red">
              OTP
            </v-stepper-step>

            <v-divider></v-divider>
            <!-- editable -->
            <v-stepper-step
              step="2"
              color="amber"
              editable
              :complete="bondApproved"
              @click="bondApproval"
            >
              Bond Approved
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              step="3"
              color="green"
              editable
              :complete="documentsSigned"
              @click="docsSigned"
            >
              Final Docs Signed
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title v-if="value">Clients Choices - {{ value }}</v-card-title>

      <v-card-text v-if="value">
        <div style="display: flex;">
          <v-chip-group max="1" v-for="item in rooms" :key="item.id" column>
            <v-chip
              :id="item.id"
              :color="item.color"
              @click="roomChosen($event)"
              >{{ item.room }}</v-chip
            >
          </v-chip-group>
        </div>
      </v-card-text>
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="450" persistent>
        <v-card>
          <v-card-title class="headline">
            {{ chosenRoom }} Floor - {{ value }}</v-card-title
          >

          <v-card-text>
            Tiles or Laminate? <small>Click image to choose</small>
            <div style="display: flex;">
              <div style="display: flex; flex-direction: column;">
                <v-img
                  id="1"
                  class="floorImage"
                  width="200"
                  src="../assets/Tiles2.jpg"
                  :style="{ border: '5px solid ' + img1Color }"
                  @click="chooseImage($event)"
                ></v-img>
                <label>Concreta Grey</label>
              </div>
              <v-spacer></v-spacer>
              <div style="display: flex; flex-direction: column;">
                <v-img
                  id="2"
                  class="floorImage"
                  width="200"
                  src="../assets/Lam1.jpg"
                  :style="{ border: '5px solid ' + img2Color }"
                  @click="chooseImage($event)"
                ></v-img>
                <label>Grey Oak</label>
              </div>
            </div>
            <div style="display: flex; margin-top: 20px;">
              <div style="display: flex; flex-direction: column;">
                <v-img
                  id="3"
                  class="floorImage"
                  width="200"
                  src="../assets/Tiles_slate_03.jpg"
                  :style="{ border: '5px solid ' + img3Color }"
                  @click="chooseImage($event)"
                ></v-img>
                <label>Concreta White</label>
              </div>
              <v-spacer></v-spacer>
              <div style="display: flex; flex-direction: column;">
                <v-img
                  id="4"
                  class="floorImage"
                  width="200"
                  src="../assets/Lam2.jpg"
                  :style="{ border: '5px solid ' + img4Color }"
                  @click="chooseImage($event)"
                ></v-img>
                <label>Beige Oak</label>
              </div>
            </div>
            <v-btn icon @click="refreshChoices"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
            <!-- <v-container fluid>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group column v-model="choice" @change="chooseFloor">
                    <v-radio
                      label="Tile Option 1"
                      color="red"
                      value="1"
                    ></v-radio>
                    <v-radio
                      label="Laminate Option 1"
                      color="blue"
                      value="2"
                    ></v-radio>
                    <v-radio
                      label="Tile Option 2"
                      color="green"
                      value="3"
                    ></v-radio>
                    <v-radio
                      label="Laminate Option 2"
                      color="purple"
                      value="4"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container> -->
          </v-card-text>

          <v-card-actions>
            <v-btn color="black" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>

            <v-btn color="black" text @click="dialog = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialog1" max-width="450" persistent>
        <v-card>
          <v-card-title class="headline">
            {{ chosenRoom }} Cupboard - {{ value }}</v-card-title
          >

          <v-card-text>
            Kitchen Cupboards <small>Click image to choose</small>
            <div style="display: flex;">
              <div style="display: flex; flex-direction: column;">
                <v-img
                  id="5"
                  class="floorImage"
                  width="200"
                  src="../assets/Storm_Grey_752-02.jpg"
                  :style="{ border: '5px solid ' + img5Color }"
                  @click="chooseImage($event)"
                ></v-img>
                <label>Storm Grey</label>
              </div>
              <v-spacer></v-spacer>
              <div style="display: flex; flex-direction: column;">
                <v-img
                  id="6"
                  class="floorImage"
                  width="200"
                  src="../assets/Folkstone-Grey.jpg"
                  :style="{ border: '5px solid ' + img6Color }"
                  @click="chooseImage($event)"
                ></v-img>
                <label>Folkstone Grey</label>
              </div>
            </div>
            <v-btn icon @click="refreshChoices"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
            <!-- <v-container fluid>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group column v-model="choice" @change="chooseFloor">
                    <v-radio label="Storm Grey" color="red" value="5"></v-radio>
                    <v-radio
                      label="Folkstone Grey"
                      color="blue"
                      value="6"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container> -->
          </v-card-text>

          <v-card-actions>
            <v-btn color="black" text @click="dialog1 = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>

            <v-btn color="black" text @click="dialog1 = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
// import { Fc2ProVueTimeline } from "fc2pro-vue-timeline";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "apartment",
  components: {
    // Fc2ProVueTimeline,
  },
  data() {
    return {
      value: null,
      blockValue: null,
      items: [],
      blocks: [],
      chosenRoom: "",
      bondApproved: false,
      documentsSigned: false,
      rooms: [
        { id: 1, room: "Kitchen", color: "lightgrey" },
        { id: 3, room: "Bedroom 1", color: "lightgrey" },
        { id: 4, room: "Bedroom 2", color: "lightgrey" }
      ],
      img1Color: "#bc9654",
      img2Color: "#bc9654",
      img3Color: "#bc9654",
      img4Color: "#bc9654",
      img5Color: "#bc9654",
      img6Color: "#bc9654",
      choice: 0,
      dialog: false,
      dialog1: false,
      loading: false,
      selection: 0
    };
  },
  async mounted() {
    let data = {
      id: this.$store.state.development.id
    };
    await axios({
      method: "post",
      url: `${url}/getblocksForOptions`,
      data: data
    })
      .then(
        response => {
          this.blocks = response.data;
        },
        error => {
          console.log("the Error", error);
        }
      )
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    bondApproval() {
      this.bondApproved = !this.bondApproved;
    },
    docsSigned() {
      this.documentsSigned = !this.documentsSigned;
    },
    async chooseUnit() {
      let filteredData = this.blocks.filter(el => {
        return el.subsectionName === this.blockValue;
      });
      console.log(filteredData);
      let data = {
        id: this.$store.state.development.id,
        subsection: filteredData[0].id
      };
      await axios({
        method: "post",
        url: `${url}/getUnitsForOptions`,
        data: data
      })
        .then(
          response => {
            let filteredData = response.data.filter(el => {
              return el.unitName.substring(2, 1) !== ".";
            });
            this.items = filteredData;
          },
          error => {
            console.log("the Error", error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    reserve() {
      this.loading = true;
      console.log(this.chosenRoom);
      setTimeout(() => {
        this.loading = false;
        if (this.chosenRoom === "Kitchen") {
          this.dialog1 = true;
        } else {
          this.dialog = true;
        }
      }, 800);
    },
    chooseFloor() {
      if (this.choice == 1) {
        this.img1Color = "red";
      } else {
        this.img1Color = "#bc9654";
      }
      if (this.choice == 2) {
        this.img2Color = "blue";
      } else {
        this.img2Color = "#bc9654";
      }
      if (this.choice == 3) {
        this.img3Color = "green";
      } else {
        this.img3Color = "#bc9654";
      }
      if (this.choice == 4) {
        this.img4Color = "purple";
      } else {
        this.img4Color = "#bc9654";
      }
      if (this.choice == 5) {
        this.img5Color = "red";
      } else {
        this.img5Color = "#bc9654";
      }
      if (this.choice == 6) {
        this.img6Color = "blue";
      } else {
        this.img6Color = "#bc9654";
      }
    },
    chooseImage(event) {
      this.choice = event.currentTarget.id;
      if (event.currentTarget.id == 1) {
        this.img1Color = "red";
      } else {
        this.img1Color = "#bc9654";
      }
      if (event.currentTarget.id == 2) {
        this.img2Color = "blue";
      } else {
        this.img2Color = "#bc9654";
      }
      if (event.currentTarget.id == 3) {
        this.img3Color = "green";
      } else {
        this.img3Color = "#bc9654";
      }
      if (event.currentTarget.id == 4) {
        this.img4Color = "purple";
      } else {
        this.img4Color = "#bc9654";
      }
      if (event.currentTarget.id == 5) {
        this.img5Color = "red";
      } else {
        this.img5Color = "#bc9654";
      }
      if (event.currentTarget.id == 6) {
        this.img6Color = "blue";
      } else {
        this.img6Color = "#bc9654";
      }
    },
    refreshChoices() {
      this.choice = 0;
      this.img1Color = "#bc9654";
      this.img2Color = "#bc9654";
      this.img3Color = "#bc9654";
      this.img4Color = "#bc9654";
      this.img5Color = "#bc9654";
      this.img6Color = "#bc9654";
    },
    roomChosen(event) {
      console.log(event.currentTarget.id);
      this.rooms.forEach(el => {
        if (el.id !== parseInt(event.currentTarget.id)) {
          el.color = "lightgrey";
        } else {
          el.color = "amber accent-2 black--text";
          this.chosenRoom = el.room;
          this.reserve();
        }
      });
      console.log(this.chosenRoom);
    }
  }
};
</script>

<style scoped>
.floorImage {
  cursor: pointer;
}
@media only screen and (max-width: 1400px) {
  .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
    display: flex !important;
  }
}
/* @media only screen and (max-width: 1024px) {
  .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
    display: flex !important;
  }
} */
</style>

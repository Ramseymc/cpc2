<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <p>
          New Progress Section
        </p>
        <v-btn
          v-if="!token.length || expired"
          text
          color="red"
          @click="connectToSmartsheet"
          >You require a new Smartsheet token</v-btn
        >
        <v-btn text color="green" v-else @click="updatefromSmartSheet"
          >Update data from Smartsheet</v-btn
        >
      </v-col>
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-btn text @click="reselect" v-if="token.length || expired"
          >reselect</v-btn
        >
      </v-col>

      <v-col
        class="mb-4"
        offset="1"
        cols="10"
        sm="10"
        md="10"
        v-if="showControls"
      >
        <v-card
          class="mx-auto"
          max-width="1050"
          tile
          v-if="token.length || expired"
        >
          <br />
          <v-col v-if="subsection.length" :cols="flex" :offset="offset">
            <v-autocomplete
              v-model="subsectionChosen"
              :items="subsection"
              item-text="subsectionName"
              label="Choose Block"
              chips
              shaped
              filled
              outlined
              prepend-icon="mdi-tag-heart"
              color="#0F0F0F"
              item-color="#0F0F0F"
              @change="getUnits"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="units.length" :cols="flex" :offset="offset">
            <v-autocomplete
              v-model="unitChosen"
              :items="units"
              item-text="unitName"
              label="Choose Unit"
              chips
              shaped
              filled
              outlined
              prepend-icon="mdi-tag-heart"
              color="#0F0F0F"
              item-color="#0F0F0F"
              @change="getTaskTypes"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="taskTypes.length" :cols="flex" :offset="offset">
            <v-autocomplete
              v-model="taskTypeChosen"
              :items="taskTypes"
              item-text="taskName"
              label="Task Category"
              chips
              shaped
              filled
              outlined
              prepend-icon="mdi-tag-heart"
              color="#0F0F0F"
              item-color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
        </v-card>
      </v-col>

      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-card
          class="mx-auto"
          max-width="1050"
          v-if="tasks.length && taskTypeChosen !== ''"
        >
          <v-toolbar color="black" dark>
            <v-toolbar-title
              >Progress - {{ unitChosen }} - TaskType:
              {{ taskTypeChosen }}</v-toolbar-title
            >

            <v-spacer></v-spacer>
            <div>
              {{ (totalPercentCompleted * 100).toFixed(0) }}% - R
              {{ totalCostCompleted }} of R{{ totalCosts }}
            </div>
            <v-spacer></v-spacer>

            <v-btn icon @click="postProgress">
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list two-line>
            <v-list-item-group
              v-model="selected"
              active-class="black--text"
              multiple
            >
              <template v-for="(item, index) in filteredTasks">
                <v-list-item :key="item.id">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.taskName"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      >{{ item.percentComplete }} % - R
                      {{
                        (
                          ((item.subcontractor1 +
                            item.subcontractor2 +
                            item.labourCost) *
                            item.percentComplete) /
                          100
                        ).toFixed(2)
                      }}
                      of R
                      {{
                        (
                          item.subcontractor1 +
                          item.subcontractor2 +
                          item.labourCost
                        ).toFixed(2)
                      }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle>
                      <div style="display: flex; height: 50px;">
                        <span
                          ><small>{{ item.startDate }}</small></span
                        >

                        <v-slider
                          v-model="item.percentComplete"
                          track-fill-color="red"
                          track-color="black"
                          thumb-color="black"
                          @change="calcTotals"
                        ></v-slider>
                        <span
                          ><small>{{ item.endDate }}</small></span
                        >
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider
                  v-if="index < units.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-progress-circular
          v-if="progress"
          :size="150"
          :width="12"
          color="gold"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" top shaped color="black">
      {{ snackbarMessage }}
      <v-btn color="amber" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "SmartProgress",
  components: {
    // PlanType1
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
      snackbar: false,
      snackbarMessage: "",
      href: "",
      token: [],
      expired: false,
      progress: false,
      flex: 12,
      offset: 0,
      subsection: [],
      subsectionChosen: "",
      units: [],
      unitChosen: "",
      tasks: [],
      taskTypes: [],
      taskTypeChosen: "",
      selected: [-1],
      smartsheetControl: [],
      showControls: true,
      totalCosts: 0,
      totalCostCompleted: 0,
      totalPercentCompleted: 0
    };
  },
  computed: {
    filteredTasks() {
      if (this.taskTypeChosen !== "") {
        return this.tasks.filter(el => {
          return el.taskType === this.taskTypeChosen;
        });
      } else {
        return this.tasks;
      }
    }
  },
  async beforeMount() {
    this.href = `${url}/authSmartsheetsProgress/${this.$store.state.development.id}`;
    console.log(Date.now());
    this.getToken();
    this.getSubsections();

    //Use this regular expression to match square brackets or single quotes:
    // /[\[\]']+/g
    //Replace with the empty string.
  },
  methods: {
    calcTotals() {
      this.totalCosts = this.filteredTasks
        .reduce((prev, el) => {
          return prev + el.subcontractor1 + el.subcontractor2 + el.labourCost;
        }, 0)
        .toFixed(2);
      this.totalCostCompleted = this.filteredTasks
        .reduce((prev, el) => {
          return (
            prev +
            ((el.subcontractor1 + el.subcontractor2 + el.labourCost) *
              el.percentComplete) /
              100
          );
        }, 0)
        .toFixed(2);
      this.totalPercentCompleted = this.totalCostCompleted / this.totalCosts;
    },
    reselect() {
      this.showControls = !this.showControls;
    },
    async getToken() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/smartProgressWB`,
        data: data
      })
        .then(
          response => {
            console.log("the response", response.data);
            this.token = response.data;
            if (new Date() > new Date(this.token[0].expires_in)) {
              this.snackbarMessage =
                "Token has expred. Please click link above for a new token.";
              this.expired = true;
            } else {
              console.log(
                "TESTING",
                dayjs(this.token[0].expires_in)
                  .diff(dayjs(new Date()), "d", true)
                  .toFixed(2)
              );
              console.log(
                dayjs(this.token[0].expires_in).diff(
                  dayjs(new Date()),
                  "d",
                  true
                ) % 1
              );
              console.log(
                Math.floor(
                  dayjs(this.token[0].expires_in).diff(
                    dayjs(new Date()),
                    "d",
                    true
                  )
                )
              );
              this.snackbarMessage = `Your Smartsheet token is valid for another: ${Math.floor(
                dayjs(this.token[0].expires_in).diff(
                  dayjs(new Date()),
                  "d",
                  true
                )
              )} days and ${(
                (dayjs(this.token[0].expires_in).diff(
                  dayjs(new Date()),
                  "d",
                  true
                ) %
                  1) *
                24
              ).toFixed(1)} hours.`;
              this.expired = false;
            }
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
    async updatefromSmartSheet() {
      this.progress = true;
      this.showControls = false;
      this.subsectionChosen = "";
      this.units = [];

      this.unitChosen = "";
      this.tasks = [];
      this.taskTypes = [];
      this.taskTypeChosen = "";
      this.smartsheetControl = [];

      let data = this.token[0];
      await axios({
        method: "post",
        url: `${url}/updateFromSmartSheets`,
        data: data
      })
        .then(
          response => {
            console.log("the response!@#", response.data);
            if (response.data.now) {
              console.log("awesome");

              this.progress = false;

              this.snackbarMessage =
                "Data successfully updated from Smartsheet";
              this.snackbar = true;
              setTimeout(() => {
                this.showControls = true;
              }, 200);
            }
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async connectToSmartsheet() {
      window.location.href = this.href;
    },
    async getSubsections() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getSubsectionForProgress`,
        data: data
      })
        .then(
          response => {
            console.log("the response", response.data);
            this.subsection = response.data;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async getUnits() {
      // console.log(this.subsectionChosen)
      let subsectionId = this.subsection.filter(el => {
        return el.subsectionName === this.subsectionChosen;
      });
      // console.log(subsectionId)
      let data = {
        id: this.$store.state.development.id,
        subsection: subsectionId[0].id
      };
      // console.log(data)
      await axios({
        method: "post",
        url: `${url}/getsmartUnitsForProgress`,
        data: data
      })
        .then(
          response => {
            console.log("the response", response.data);
            this.units = response.data;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async getTaskTypes() {
      console.log(this.unitChosen);
      let subsectionId = this.subsection.filter(el => {
        return el.subsectionName === this.subsectionChosen;
      });
      let data = {
        id: this.$store.state.development.id,
        subsection: subsectionId[0].id,
        unitName: this.unitChosen
      };
      this.taskTypes = [];
      // console.log(data)
      await axios({
        method: "post",
        url: `${url}/getsmartTasksForProgress`,
        data: data
      })
        .then(
          response => {
            console.log("the response", response.data);
            response.data[0].forEach(el => {
              this.taskTypes.push(el.taskType);
            });
            this.taskTypes.sort();
            this.taskTypes = Array.from(new Set(this.taskTypes));
            console.log(this.taskTypes);
            this.tasks = response.data[0];
            this.smartsheetControl = response.data[1];
            this.tasks.forEach(el => {
              el.startDate = dayjs(el.startDate).format("YYYY-MM-DD");
              el.endDate = dayjs(el.endDate).format("YYYY-MM-DD");
              let filtered = this.smartsheetControl.filter(el2 => {
                return el2.smartsheetId === el.sheetId;
              });
              el.PercentCompleteId = filtered[0].PercentComplete;
            });
            console.log(this.smartsheetControl);
            this.calcTotals();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async postProgress() {
      let finalTasks = [];
      this.filteredTasks.forEach(el => {
        let insert = {
          percentComplete: el.percentComplete,
          PercentCompleteId: el.PercentCompleteId,
          rowId: el.rowId,
          sheetId: el.sheetId,
          id: el.id
        };
        finalTasks.push(insert);
      });
      let data = {
        token: this.token,
        finalTasks: finalTasks
      };
      await axios({
        method: "post",
        url: `${url}/postSmartProgressItems`,
        data: data
      })
        .then(
          response => {
            console.log("the response", response.data);
            if (response.data.success) {
              this.snackbarMessage =
                "Smartsheet & database succesfully updated";
              this.snackbar = true;
            } else {
              this.snackbarMessage = "There was a problem, please try later";
              this.snackbar = true;
            }
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
.corner {
  background-color: orange;
  cursor: pointer;
}
svg {
  height: 80vh;
}
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
</style>

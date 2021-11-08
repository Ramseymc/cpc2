<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <p>
          Amend Subcontractors
        </p>
        <v-btn
          v-if="!token.length || expired"
          text
          color="red"
          @click="connectToSmartsheet"
          >You require a new Smartsheet token</v-btn
        >
        <!-- <v-btn text color="green" v-else @click="updatefromSmartSheet"
          >Update data from Smartsheet</v-btn
        > -->
      </v-col>
      <!-- <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-btn text @click="reselect">reselect</v-btn>
      </v-col> -->

      <v-col
        class="mb-4"
        offset="1"
        cols="10"
        sm="10"
        md="10"
        v-if="showControls"
      >
        <v-card class="mx-auto" max-width="1050" tile>
          <br />
          <v-col v-if="taskList.length" :cols="flex" :offset="offset">
            <v-autocomplete
              v-model="taskChosen"
              :items="taskList"
              item-text="taskName"
              label="Choose Task"
              chips
              shaped
              filled
              outlined
              prepend-icon="mdi-tag-heart"
              color="#0F0F0F"
              item-color="#0F0F0F"
              @change="getTasksForSubbies"
            ></v-autocomplete>
          </v-col>
          <!-- <v-col v-if="units.length" :cols="flex" :offset="offset">
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
          </v-col> -->
          <!-- <v-col v-if="taskTypes.length" :cols="flex" :offset="offset">
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
          </v-col> -->
        </v-card>
      </v-col>

      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-card class="mx-auto" max-width="1050" v-if="tasks.length">
          <v-toolbar color="black" dark height="110">
            <v-toolbar-title style="font-size: 100%;">{{
              taskChosen
            }}</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-autocomplete
              dark
              v-model="suppliersChosen"
              :items="suppliers"
              item-text="supplierName"
              label="Choose Subcontractor/s"
              chips
              multiple
              filled
              outlined
              prepend-icon="mdi-tag-heart"
              color="#0F0F0F"
              item-color="#0F0F0F"
              @change="test"
            ></v-autocomplete>
            <v-spacer></v-spacer>

            <v-checkbox
              v-if="suppliersChosen"
              v-model="checkAll"
              label="check / uncheck All"
              @click="selectAll"
            ></v-checkbox>

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
              <template v-for="(item, index) in tasks">
                <v-list-item :key="item.id">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.subsectionName"
                    ></v-list-item-title>
                    <v-list-item-subtitle></v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <div
                        style="display: flex; height: 50px; justify-content: space-evenly;"
                      >
                        <span>{{ item.unitName }}</span>
                        <span>{{ item.taskType }}</span>
                        <span>{{ item.assignedTo }}</span>
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-checkbox :input-value="item.process"></v-checkbox>
                  </v-list-item-action>
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

      <!-- <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-progress-circular
          v-if="progress"
          :size="150"
          :width="12"
          color="gold"
          indeterminate
        ></v-progress-circular>
      </v-col> -->
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
  name: "SmartSubcontractors",
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
      taskList: [],
      taskChosen: "",
      units: [],
      unitChosen: "",
      tasks: [],
      suppliers: [],
      suppliersChosen: "",
      checkAll: false,
      selected: [-1],
      smartsheetControl: [],
      showControls: true
    };
  },
  // computed: {
  //   filteredTasks() {
  //     if (this.taskTypeChosen !== "") {
  //       return this.tasks.filter((el) => {
  //         return el.taskType === this.taskTypeChosen
  //       })
  //     } else {
  //       return this.tasks
  //     }
  //   }
  // },
  async beforeMount() {
    this.href = `${url}/authSmartsheetsProgress/${this.$store.state.development.id}`;
    console.log(Date.now());
    this.getToken();
    this.getTaskList();
    // this.getSubsections();

    //Use this regular expression to match square brackets or single quotes:
    // /[\[\]']+/g
    //Replace with the empty string.
  },
  methods: {
    test() {
      console.log(this.suppliersChosen);
    },
    selectAll() {
      console.log(this.checkAll);
      if (this.checkAll) {
        this.tasks.forEach(el => {
          el.process = true;
        });
      } else {
        this.tasks.forEach(el => {
          el.process = false;
        });
      }
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
    // // async updatefromSmartSheet() {
    // //   this.progress = true;
    // //   this.showControls = false
    // //   this.subsectionChosen = ""
    // //   this.units = []

    // //   this.unitChosen = ""
    // //   this.tasks = []
    // //   this.taskTypes = []
    // //   this.taskTypeChosen = ""
    // //   this.smartsheetControl = []

    // //   let data = this.token[0];
    // //   await axios({
    // //     method: "post",
    // //     url: `${url}/updateFromSmartSheets`,
    // //     data: data,
    // //   })
    // //     .then(
    // //       (response) => {
    // //         console.log("the response", response.data);
    // //         if (response.data.now) {
    // //           console.log("awesome");
    // //           this.progress = false;

    // //           this.snackbarMessage =
    // //             "Data successfully updated from Smartsheet";
    // //           this.snackbar = true;
    // //           setTimeout(() => {
    // //             this.showControls = true
    // //           }, 200)
    // //         }
    // //       },
    // //       (error) => {
    // //         console.log(error);
    // //       }
    // //     )
    // //     .catch((e) => {
    // //       console.log(e);
    // //     });
    // },
    async connectToSmartsheet() {
      window.location.href = this.href;
    },
    async getTaskList() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getTasksToAllocateSubcontractors`,
        data: data
      })
        .then(
          response => {
            console.log("the responseXXX", response.data);
            this.taskList = response.data[0];

            this.suppliers = response.data[1];
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async getTasksForSubbies() {
      console.log(this.taskChosen);
      // let subsectionId = this.subsection.filter((el) => {
      //   return el.subsectionName === this.subsectionChosen;
      // });
      // console.log(subsectionId)
      let data = {
        id: this.$store.state.development.id,
        taskChosen: this.taskChosen
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/getTasksForAllocationOfSubcontractor`,
        data: data
      })
        .then(
          response => {
            console.log("the responseYYYY", response.data);
            this.tasks = response.data;
            this.tasks.forEach(el => {
              el.process = false;
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
    async getTaskTypes() {
      // console.log(this.unitChosen);
      // let subsectionId = this.subsection.filter((el) => {
      //   return el.subsectionName === this.subsectionChosen;
      // });
      // let data = {
      //   id: this.$store.state.development.id,
      //   subsection: subsectionId[0].id,
      //   unitName: this.unitChosen,
      // };
      // this.taskTypes = [];
      // // console.log(data)
      // await axios({
      //   method: "post",
      //   url: `${url}/getsmartTasksForProgress`,
      //   data: data,
      // })
      //   .then(
      //     (response) => {
      //       console.log("the response", response.data);
      //       response.data[0].forEach((el) => {
      //         this.taskTypes.push(el.taskType);
      //       });
      //       this.taskTypes.sort();
      //       this.taskTypes = Array.from(new Set(this.taskTypes));
      //       console.log(this.taskTypes);
      //       this.tasks = response.data[0];
      //       this.smartsheetControl = response.data[1]
      //       this.tasks.forEach((el) => {
      //         el.startDate = dayjs(el.startDate).format("YYYY-MM-DD")
      //         el.endDate = dayjs(el.endDate).format("YYYY-MM-DD")
      //         let filtered = this.smartsheetControl.filter((el2) => {
      //           return el2.smartsheetId === el.sheetId
      //         })
      //         el.PercentCompleteId = filtered[0].PercentComplete
      //       })
      //       console.log(this.smartsheetControl)
      //     },
      //     (error) => {
      //       console.log(error);
      //     }
      //   )
      //   .catch((e) => {
      //     console.log(e);
      //   });
    },
    async postProgress() {
      let finalTasks = [];
      let assignedTo = "";
      if (this.suppliersChosen.length && this.suppliersChosen.length > 1) {
        assignedTo = this.suppliersChosen.join(",");
      } else if (
        this.suppliersChosen.length &&
        this.suppliersChosen.length === 1
      ) {
        assignedTo = this.suppliersChosen[0];
      } else {
        assignedTo = "";
      }
      this.tasks.forEach(el => {
        if (el.process === true) {
          let insert = {
            assignedTo: assignedTo,
            assignedToId: el.columnId,
            rowId: el.rowId,
            sheetId: el.sheetId,
            id: el.id
          };
          finalTasks.push(insert);
        }
        // finalTasks.push(insert)
      });
      let data = {
        token: this.token,
        finalTasks: finalTasks
      };
      await axios({
        method: "post",
        url: `${url}/postSmartSubcontractors`,
        data: data
      })
        .then(
          response => {
            console.log("the response", response.data);
            if (response.data.success) {
              this.snackbarMessage =
                "Smartsheet & database succesfully updated";
              this.snackbar = true;
              this.getTaskList();
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

<template>
  <div class="about">
    <v-container>
      <h1>Progress</h1>
      <!-- <v-btn>reset</v-btn> -->
      <h3
        v-if="taskTypeChosen.length && taskType.length"
        style="color: #0F0F0F;"
      >
        {{ taskTypeChosen }}
      </h3>
      <br />
      <v-btn
        text
        v-if="items.length"
        @click="showChoices = !showChoices"
        color="#0F0F0F"
        >Amend Selection</v-btn
      >
      <br />
      <br />
      <v-card v-if="showChoices" class="mx-auto" max-width="1050" tile>
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
        <v-col v-if="taskType.length" :cols="flex" :offset="offset">
          <v-autocomplete
            v-model="taskTypeChosen"
            :items="taskType"
            item-text="taskName"
            label="Task Category"
            chips
            shaped
            filled
            outlined
            prepend-icon="mdi-tag-heart"
            color="#0F0F0F"
            item-color="#0F0F0F"
            @change="getTasks"
          ></v-autocomplete>
        </v-col>
      </v-card>
      <v-card class="mx-auto" max-width="1050" tile v-if="items.length">
        <v-toolbar color="#0F0F0F" dark>
          <v-toolbar-title style="font-size: 125%;"
            >Progress Items - Unit: {{ unitChosen }} - Fix: {{ items[0].fix }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <div style="margin-top: 15px; margin-right: 12px;">
            <v-radio-group row v-model="fixChosen">
              <v-radio
                v-for="item in fixes"
                :key="item.id"
                :id="item.id.toString()"
                :label="item.fix"
                :value="item.fix"
              ></v-radio>
            </v-radio-group>

            <v-spacer></v-spacer>
          </div>

          <!-- <div>
            <vue-numeric-input
              style="background-color: white;"
              :disabled="fixChosen === 'Ret' && fixes.length > 1"
              v-model="allTaskProgress"
              
              label="Testing"
              :min="allTaskProgressStart"
              :max="100"
              :step="25"
          
              @change="changeTotalProgress"
            ></vue-numeric-input>
          </div> -->
          <v-spacer></v-spacer>

          <div>
            <v-btn icon @click="showTasks"
              ><v-icon>{{ btnIcon }}</v-icon
              >{{ btnText }}</v-btn
            >
          </div>
          <div v-if="fixChosen !== 'Ret'">
            <v-btn
              icon
              @click="dialog2 = true"
              :disabled="
                totalAmountDigits <= allTaskProgressStart || fixChosen === 'Ret'
              "
              ><v-icon color="yellow">mdi-upload-multiple</v-icon></v-btn
            >
          </div>
          <div v-else>
            <v-btn
              icon
              @click="dialog = true"
              :disabled="fixChosen !== 'Ret' || fixes.length > 1"
              ><v-icon color="lime">mdi-upload-multiple</v-icon></v-btn
            >
          </div>
        </v-toolbar>
        <br />
        <v-progress-linear
          v-model="allTaskProgress"
          style="margin-top: 5px;"
          color="orange"
          height="18"
          @change="changeTotalProgress"
        >
          <template v-slot:default="{ value }">
            <strong style="color: white;">{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <span>Total Value: {{ totalAmount }}</span>

        <v-progress-linear
          v-if="averageTime <= allTaskProgress"
          :value="averageTime"
          style="margin-top: 5px;"
          color="green"
          height="12"
        >
          <template v-slot:default="{ value }">
            <small style="color: white;">{{ Math.ceil(value) }}%</small>
          </template>
        </v-progress-linear>

        <v-progress-linear
          v-else
          :value="averageTime"
          style="margin-top: 5px;"
          color="red"
          height="12"
        >
          <template v-slot:default="{ value }">
            <small style="color: white;">{{ Math.ceil(value) }}%</small>
          </template>
        </v-progress-linear>
        <span>Now: {{ today }}</span>

        <!-- <span>Total Value: {{ totalAmount }}</span> -->
        <v-list two-line v-show="showDetail">
          <v-list-item-group v-model="selected" multiple>
            <!-- <template v-for="item in items"> -->
            <template v-for="item in items">
              <v-list-item
                :key="item.id"
                style="border-bottom: 1px solid black;"
                :id="item.id"
              >
                <template :id="item.id">
                  <v-list-item-content>
                    <v-spacer></v-spacer>

                    <div style="display: flex;">
                      <v-list-item-title
                        v-text="item.taskDescription"
                      ></v-list-item-title>
                      <v-list-item-title
                        v-text="
                          'Value: ' +
                            convertToString(item.price - item.remaining)
                        "
                      ></v-list-item-title>
                    </div>
                    <!-- v-model="allTaskProgress" -->
                    <v-progress-linear
                      style="margin-top: 5px;"
                      v-model="item.progress"
                      color="#0F0F0F"
                      height="18"
                      @change="changeIndividualProgress"
                    >
                      <template v-slot:default="{ value }">
                        <strong style="color: white;"
                          >{{ Math.ceil(value) }}%</strong
                        >
                      </template>
                    </v-progress-linear>
                    <v-divider></v-divider>
                    <div style="display: flex; justify-content: space-between;">
                      <span
                        ><small>{{ item.startDate }}</small></span
                      >
                      <span
                        style="color:red;"
                        v-if="item.currentTime > item.progress"
                        ><small><strong>Behind Schedule</strong></small></span
                      >
                      <span style="color:green" v-else
                        ><small><strong>On Schedule</strong></small></span
                      >
                      <span
                        ><small>{{ item.endDate }}</small></span
                      >
                    </div>
                    <!-- @mouseover="changeValue" -->
                    <v-progress-linear
                      v-if="item.currentTime > item.progress"
                      style="margin-top: 5px;"
                      :value="item.currentTime"
                      color="red"
                      height="10"
                      class="test"
                    >
                      <template v-slot:default="{ value }">
                        <small style="color: white;"
                          >{{ Math.ceil(value) }}%</small
                        >
                      </template>
                    </v-progress-linear>
                    <v-progress-linear
                      v-else
                      style="margin-top: 5px;"
                      :value="item.currentTime"
                      color="green"
                      height="10"
                      class="test"
                    >
                      <template v-slot:default="{ value }">
                        <small style="color: white;"
                          >{{ Math.ceil(value) }}%</small
                        >
                      </template>
                    </v-progress-linear>
                  </v-list-item-content>
                </template>
                <v-list-item-action>
                  <v-btn icon :id="item.id" @click="addTime"
                    ><v-icon color="green">mdi-camera-timer</v-icon></v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list-item>
              <!-- <template v-slot:default="{ active }"> -->
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-container>
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Post Progress</span>
        </v-card-title>
        <v-card-text>
          <span>This will Post all progress</span><br />
          <span>Are you sure?</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#0F0F0F" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#0F0F0F" text @click="saveProgressRetention">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Post Progress</span>
        </v-card-title>
        <v-card-text>
          <span>This will Post all progress</span><br />
          <span>Are you sure?</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog2 = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="saveProgressAll">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog3" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Push Time forwards</span>
        </v-card-title>
        <v-card-text>
          <span>This will affect all linked tasks</span><br />
          <span>Are you sure?</span><br />

          <!-- v-model="allTaskProgress" -->
          <vue-numeric-input
            v-model="addDays"
            style="background-color: white;"
            label="Testing"
            :min="-100"
            :max="100"
            :step="1"
          ></vue-numeric-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog3 = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="addDays !== 0"
            color="blue darken-1"
            text
            @click="saveAddedTime"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// dayjs.extend(utc)
// dayjs.extend(utc)
dayjs.extend(utc);
dayjs.extend(timezone);
import businessDays from "dayjs-business-days";

// dayjs.extend(dayjsBusinessDays);
// const goodFriday = "2021-04-02"
// const easterMonday = "2021-04-05"

const options = {
  holidays: [
    "2021-04-02",
    "2021-04-05",
    "2021-04-27",
    "2021-06-16",
    "2021-08-09",
    "2021-09-24",
    "2021-12-16",
    "2021-12-27"
  ],
  holidayFormat: "YYYY-MM-DD"
};
dayjs.extend(businessDays, options);

// dayjs.extend(dayjsBusinessDays);

// const options = {
//   holidays: ['2020-12-25'],
//   holidayFormat: 'YYYY-MM-DD',
// };
// dayjs.extend(businessDays, options);
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "Progress",
  metaInfo: {
    title: "Progress",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Update progress Here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      addDays: 0,
      addDaysId: 0,
      today: null,
      timeProgressActive: true,
      showDetail: true,
      btnIcon: "mdi-arrow-down",
      btnText: "Hide",
      allTaskProgress: 0,

      dialog2: false,
      dialog3: false,
      dialog: false,
      disabled: true,

      windowWidth: null,
      flex: 12,
      offset: 0,
      snackbar: false,
      snackBarMessage: "",
      developments: [],
      developmentChosen: [],
      developments2: [],
      developmentChosen2: [],
      subsection: [],
      subsectionChosen: [],
      units: [],
      unitChosen: [],
      taskType: [],
      taskTypeChosen: [],
      tasks: [],

      developmentParam: 0,
      subsectionParam: 0,
      unitParam: 0,
      taskTypeParam: 0,
      // value: 0,

      // dialog: false,
      taskId: null,
      progressId: null,
      taskDescription: null,
      unitNumber: null,
      done: null,
      itemToPost: [],
      menu: false,
      date: new Date().toISOString().substr(0, 10),

      selected: [0],
      items: [],
      itemsDuplicated: [],
      showChoices: true,
      fixes: [],
      fixChosen: "",
      fixValue: [],

      totalAmount: "",
      allTaskProgressStart: 0,
      totalAmountDigits: 0,
      averageTime: 0
    };
  },
  watch: {
    fixChosen: function() {
      if (this.items.length) {
        this.items = this.itemsDuplicated.filter(el => {
          return el.fix === this.fixChosen;
        });
      }
      if (this.items.length) {
        let total = this.items.reduce((acc, el) => {
          return acc + (el.price * el.lastCertificateIssuedAt) / 100;
        }, 0);
        total = Math.round(total, 2);

        this.allTaskProgressStart = total;

        this.changeIndividualProgress();
      }
      if (this.items.length) {
        let average = this.items.reduce((acc, el) => {
          return acc + el.currentTime;
        }, 0);
        average = average / this.items.length;

        this.averageTime = average;

        // this.changeIndividualProgress();
      }
    }
  },
  async mounted() {
    this.checkToken();
    console.log(dayjs("2020-12-25").isBusinessDay());
    // console.log("Christmas Day is holiday?:", dayjs('2020-12-25').options())
    // console.log("Christmas Day is holiday?:", dayjs('2020-12-25').businessDaysInMonth())
    axios.defaults.headers.common["Authorization"] = this.$store.state.token;

    this.items = [];
    this.developments = [];
    this.developmentChosen = [];
    this.developments2 = [];
    this.developmentChosen2 = [];
    this.subsection = [];
    this.subsectionChosen = [];
    this.units = [];
    this.unitChosen = [];
    this.taskType = [];
    this.taskTypeChosen = [];
    this.tasks = [];
    this.fixes = [];

    this.developmentParam = this.$store.state.development.id;
    this.subsectionParam = 0;
    this.unitParam = 0;
    this.taskTypeParam = 0;
    this.getSubsections();
  },
  methods: {
    changeTotalProgress() {
      this.allTaskProgress = Math.round(this.allTaskProgress / 5) * 5;
      this.items.forEach(el => {
        el.progress = this.allTaskProgress;
        if (el.progress < el.lastCertificateIssuedAt) {
          el.progress = el.lastCertificateIssuedAt;
        }
        el.remaining = el.price - (el.price * el.progress) / 100;
      });
      let progressAmount = this.items.reduce((acc, el) => {
        return acc + (el.price * el.progress) / 100;
      }, 0);
      let totalAmount = this.items.reduce((acc, el) => {
        return acc + el.price;
      }, 0);
      this.totalAmountDigits = progressAmount;
      this.totalAmount = this.convertToString(
        totalAmount - (totalAmount - progressAmount)
      );
      this.$nextTick(() => {
        this.allTaskProgress = Math.round((progressAmount / totalAmount) * 100);
      });
    },
    changeIndividualProgress() {
      this.items.forEach(el => {
        if (el.progress < el.lastCertificateIssuedAt) {
          el.progress = el.lastCertificateIssuedAt;
        } else {
          el.progress = Math.round(el.progress / 5) * 5;
          el.remaining = el.price - (el.price * el.progress) / 100;
        }
      });
      let progressAmount = this.items.reduce((acc, el) => {
        return acc + (el.price * el.progress) / 100;
      }, 0);
      let totalAmount = this.items.reduce((acc, el) => {
        return acc + el.price;
      }, 0);
      let startAmount = this.items.reduce((acc, el) => {
        return acc + (el.price * el.lastCertificateIssuedAt) / 100;
      }, 0);

      let newPercentage = Math.round((progressAmount / totalAmount) * 100);

      this.allTaskProgress = Math.round(newPercentage);
      this.totalAmountDigits = progressAmount;
      this.totalAmount = this.convertToString(
        totalAmount - (totalAmount - progressAmount)
      );
      this.allTaskProgressStart = startAmount;
    },
    showTasks() {
      if (this.btnIcon === "mdi-arrow-down") {
        this.btnIcon = "mdi-arrow-up";
        this.showDetail = false;
        this.btnText = "Show";
      } else {
        this.btnIcon = "mdi-arrow-down";
        this.showDetail = true;
        this.btnText = "Hide";
      }
    },
    async saveProgress() {
      let data = {
        task: this.taskId,
        unitNumber: this.unitNumber,
        progress: this.done,
        progressDate: this.date,
        progressId: this.progressId
      };
      await axios({
        method: "post",
        url: `${url}/progressPost`,
        data: data
      })
        .then(result => {
          this.dialog = false;
          if (result.status === 200) {
            this.getTasks();
          }
        })
        .catch(() => {
          this.snackBarMessage = "There was an error, please try again later!";
          this.snackbar = true;
        });
      this.dialog = false;
    },
    async saveProgressRetention() {
      let progress = [];
      let taskIds = [];
      this.items.forEach(el => {
        if (el.fix === "Ret") {
          taskIds = [];
          taskIds.push(this.$store.state.development.id);
          taskIds.push(el.supplier);
          taskIds.push(el.taskType);
          taskIds.push(el.unitNumber);
          taskIds.push(this.allTaskProgress);
          taskIds.push(el.totalRetention);
          taskIds.push(el.retentionToDate);
          taskIds.push(this.date);
          taskIds.push(el.progressID);
          progress.push(taskIds);
        }
      });
      let data = {
        allTasks: progress
      };

      await axios({
        method: "post",
        url: `${url}/progressPostRetained`,
        data: data
      })
        .then(result => {
          this.dialog = false;

          if (result.status === 200) {
            this.fixes = [];
            this.getTasks();
            this.dialog = false;
          }
        })
        .catch(() => {
          this.snackBarMessage = "There was an error, please try again later!";
          this.snackbar = true;
        });
      this.dialog = false;
    },
    async saveProgressAll() {
      let progress = [];
      let taskIds = [];
      this.items.forEach(el => {
        if (el.fix !== "Ret") {
          taskIds = [];
          taskIds.push(el.id);
          taskIds.push(el.unitNumber);
          taskIds.push(el.progress);
          taskIds.push(this.date);
          // taskIds.push(this.allTaskProgress);
          taskIds.push(el.progress);
          taskIds.push(el.progressID);
          progress.push(taskIds);
        }
      });
      let data = {
        allTasks: progress
      };

      await axios({
        method: "post",
        url: `${url}/progressPostAll`,
        data: data
      })
        .then(result => {
          this.dialog = false;
          if (result.status === 200) {
            this.fixes = [];
            this.getTasks();
            this.dialog2 = false;
          }
        })
        .catch(() => {
          this.snackBarMessage = "There was an error, please try again later!";
          this.snackbar = true;
        });
      this.dialog2 = false;
    },
    openPostDialog(event) {
      let targetID = event.currentTarget.id;
      this.taskId = targetID;
      let itemToPost = this.items.filter(el => {
        return el.id == this.taskId;
      });
      this.progressId = itemToPost[0].progressID;
      this.taskDescription = itemToPost[0].taskDescription;
      this.done = itemToPost[0].progress;
      this.unitNumber = itemToPost[0].unitNumber;
      this.dialog = true;
    },
    getSubsections() {
      this.units = [];
      this.unitChosen = [];
      this.taskType = [];
      this.taskTypeChosen = [];
      this.items = [];
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
          this.subsection = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    getUnits() {
      this.taskType = [];
      this.taskTypeChosen = [];
      this.items = [];
      let parameter = "";
      if (this.subsection.length) {
        let unit = this.subsection.filter(el => {
          return el.subsectionName === this.subsectionChosen;
        });
        parameter = unit[0].id;
        this.subsectionParam = parameter;
        axios({
          method: "get",
          url: `${url}/getUnits/${this.developmentParam}/${this.subsectionParam}`
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
      }
    },
    getTaskTypes() {
      this.taskType = [];
      this.taskTypeChosen = [];
      this.items = [];
      let parameter = "";
      if (this.units.length) {
        let unit = this.units.filter(el => {
          return el.unitName === this.unitChosen;
        });
        parameter = unit[0].id;
        this.unitParam = parameter;

        let data = {
          id: this.$store.state.development.id,
          unit: this.unitParam
        };
        axios({
          method: "post",
          url: `${url}/taskTypesR`,
          data: data
        }).then(
          response => {
            this.taskType = response.data;
          },
          error => {
            console.log(error);
          }
        );
      }
    },
    getTasks() {
      let parameter = "";
      if (this.taskType.length) {
        let taskType = this.taskType.filter(el => {
          return el.taskName === this.taskTypeChosen;
        });
        this.fixes = [];
        this.fixValue = [];
        this.fixChosen = "";

        parameter = taskType[0].id;
        this.taskTypeParam = parameter;
        axios({
          method: "get",
          url: `${url}/tasks/${this.unitParam}/${this.taskTypeParam}`
        }).then(
          response => {
            if (response.data.remaining.length) {
              console.log(response.data);
              this.tasks = response.data.remaining;
              let today = dayjs().format("YYYY-MM-DD HH:mm:ss");
              this.today = today;

              // console.log(today)
              this.tasks.forEach(el => {
                el.endDate = dayjs(el.endDate).format("YYYY-MM-DD HH:mm:ss");
                el.startDate = dayjs(el.startDate).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                // let endDate = dayjs(el.endDate).format("YYYY-MM-DD  HH:mm:ss");
                // let startDate = dayjs(el.startDate).format("YYYY-MM-DD  HH:mm:ss");

                // el.duration = dayjs(endDate).diff(dayjs(startDate), "day");
                // if (today >= el.endDate) {
                //   console.log(el.taskDescription)
                // }

                if (today > el.endDate) {
                  el.currentTime = 100;
                  el.originalTime = el.currentTime;
                  // let endDate = el.endDate.substr(0,10)
                  // let diff = dayjs(el.endDate).businessDiff(dayjs(today), "day");
                  // let duration =
                  // console.log("diff past", diff);
                  // console.log(el.taskDescription)

                  // } else if (today >= dayjs(el.startDate) && today < dayjs(el.endDate)){
                } else if (today <= el.endDate && today >= el.startDate) {
                  let diff = dayjs(el.endDate).diff(dayjs(today));
                  let durationDiff = dayjs(el.endDate).diff(
                    dayjs(el.startDate)
                  );
                  // console.log("diff in period", diff);
                  // console.log(el.description)
                  el.currentTime = ((durationDiff - diff) / durationDiff) * 100;
                  // el.currentTime = (((el.duration * 24 * 60 * 60 * 1000) - diff) / (el.duration * 24 * 60 * 60 * 1000)) * 100;
                  el.originalTime = el.currentTime;
                } else if (today < el.startDate) {
                  // let diff = dayjs(endDate).diff(dayjs(today), "day");
                  // console.log("diff", diff);
                  el.currentTime = 0;
                  el.originalTime = el.currentTime;
                }
              });

              let totalValue = this.tasks.reduce((acc, pv) => {
                return (
                  acc +
                  (((pv.price * pv.lastCertificateIssuedAt) / 100) *
                    this.tasks[0].retention) /
                    100
                );
              }, 0);

              if (totalValue > 0) {
                let totalValueStr = this.convertToString(totalValue);
                if (!response.data.retention.length) {
                  let item = {
                    fix: "Ret",
                    lastCertificateIssuedAt: 0,
                    taskType: this.tasks[this.tasks.length - 1].taskType,
                    unitNumber: this.tasks[this.tasks.length - 1].unitNumber,
                    taskDescription: `Retention held  ${totalValueStr}`,
                    progress: 0,
                    totalRetention: totalValue,
                    retentionToDate: 0,
                    progressID: null,
                    supplier: this.tasks[0].supplier
                  };
                  this.tasks.push(item);
                } else {
                  let item = response.data.retention;
                  item.forEach(el => {
                    el.fix = "Ret";
                    el.totalValue = totalValue;
                    el.totalValueStr = this.convertToString(totalValue);
                    el.taskDescription = `Retention held  ${el.totalValueStr}`;

                    this.tasks.push(el);
                  });
                }
              }

              this.items = this.tasks.filter(el => {
                return el.lastCertificateIssuedAt !== 100;
                // return el.progress !== 100;
              });
              this.items.forEach(el => {
                el.editDate = new Date().toISOString().substr(0, 10);
              });

              let fixes = [];
              this.items.forEach(el => {
                fixes.push(el.fix);
              });
              fixes = Array.from(new Set(fixes)).sort();
              // fixes.push('Ret')
              fixes.forEach((el, index) => {
                let insert = {
                  id: index,
                  fix: el
                };
                this.fixes.push(insert);
              });

              if (this.fixes.length) {
                this.fixChosen = this.fixes[0].fix;
              }

              this.showChoices = false;
              if (this.items.length) {
                if (this.items[0].progress === undefined) {
                  this.allTaskProgress = 0;
                } else {
                  this.allTaskProgress = this.items[0].progress;
                }
                this.allTaskProgressStart = this.allTaskProgress;
              } else {
                this.items = [];
                this.taskType = [];
                this.showChoices = !this.showChoices;
              }

              this.itemsDuplicated = this.items;
            } else {
              this.snackBarMessage = `There are no ${this.taskTypeChosen} tasks for this unit`;
              this.snackbar = true;

              this.items = [];
              this.developments = [];
              this.developmentChosen = [];
              this.developments2 = [];
              this.developmentChosen2 = [];
              this.subsection = [];
              this.subsectionChosen = [];
              this.units = [];
              this.unitChosen = [];
              this.taskType = [];
              this.taskTypeChosen = [];
              this.tasks = [];
              this.fixes = [];

              this.developmentParam = this.$store.state.development.id;
              this.subsectionParam = 0;
              this.unitParam = 0;
              this.taskTypeParam = 0;
              this.getSubsections();
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    },
    addTime(event) {
      console.log(event.currentTarget.id);
      this.dialog3 = true;
      console.log(this.itemsDuplicated);
      this.addDaysId = parseInt(event.currentTarget.id);
      // this.itemsDuplicated.forEach((el, index, arr) => {
      //   if (el.id === parseInt(event.currentTarget.id)) {
      //     console.log("Index", index)
      //     console.log(arr[index])
      //   }
      // })
      // console.log(this.fixChosen)
    },
    async saveAddedTime() {
      console.log(this.addDaysId);
      this.itemsDuplicated.forEach((el, index, arr) => {
        if (el.id === parseInt(this.addDaysId)) {
          console.log("Index", index);
          console.log(arr[index]);
          for (let i = index; i < this.itemsDuplicated.length; i++) {
            console.log(i);
            if (i === index) {
              this.itemsDuplicated[i].endDate = dayjs(
                this.itemsDuplicated[i].endDate
              )
                .businessDaysAdd(this.addDays)
                .format("YYYY-MM-DD HH:mm:ss");
              this.itemsDuplicated[i].duration = dayjs(
                this.itemsDuplicated[i].endDate
              ).businessDiff(dayjs(this.itemsDuplicated[i].startDate), "d");
            } else {
              this.itemsDuplicated[i].endDate = dayjs(
                this.itemsDuplicated[i].endDate
              )
                .businessDaysAdd(this.addDays)
                .format("YYYY-MM-DD HH:mm:ss");
              this.itemsDuplicated[i].startDate = dayjs(
                this.itemsDuplicated[i].startDate
              )
                .businessDaysAdd(this.addDays)
                .format("YYYY-MM-DD HH:mm:ss");
              this.itemsDuplicated[i].duration = dayjs(
                this.itemsDuplicated[i].endDate
              ).businessDiff(dayjs(this.itemsDuplicated[i].startDate), "d");
            }
          }
        }
      });
      let data = this.itemsDuplicated;
      console.log("length",data.length)
      await axios({
        method: "post",
        url: `${url}/upDateTasksFromProgress`,
        data: data
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });

      this.dialog3 = false;
      this.addDays = 0;
      this.getTasks();
    }
  }
};
</script>

<style scoped>
.listDiv {
  display: flex;
  justify-content: space-evenly;
}
.test:readonly {
  background-color: purple;
}
</style>

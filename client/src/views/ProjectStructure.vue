<template>
  <div class="about">
    <br /><br /><br />
    <h4>Project Scheduling</h4>
    <v-row>
      <v-col cols="5" offset="1">
        <v-card scrollable>
          <v-toolbar color="indigo" dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Fixes</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list
            three-line
            outlined
            shaped
            multi-select
            class="overflow-y-auto"
            max-height="80vh"
          >
            <v-subheader>
              Fixes
            </v-subheader>
            <draggable
              v-model="items"
              :group="group"
              style="min-height: 10px"
              multi-drag
            >
              <template v-for="item in items">
                <v-list-item :key="item.id" ripple active-class="pink--text">
                  <v-list-item-icon>
                    <v-icon color="green">mdi-home-city-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="item.subtitle"
                    ></v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-html="item.subtitle2"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <!-- <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-check-bold</v-icon>
                    </v-btn>
                  </v-list-item-action> -->
                </v-list-item>
              </template>
            </draggable>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card scrollable>
          <v-toolbar color="indigo" dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Edit Fixes</v-toolbar-title>
            <v-btn
              icon
              v-if="items2.length > 0"
              style="margin-left: 20px;"
              @click="finish"
            >
              <v-icon color="white">mdi-check-all</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list
            three-line
            outlined
            shaped
            class="overflow-y-auto"
            max-height="60vh"
          >
            <!-- <v-btn
            icon
            v-if="items2.length > 0"
            style="margin-left: 20px;"
            @click="finish"
          >
            <v-icon color="blue">mdi-check-all</v-icon>
          </v-btn>
          <hr v-if="items2.length > 0" /> -->
            <v-subheader>
              Create Links & Edit
            </v-subheader>
            <draggable
              v-model="items2"
              :group="group1"
              task="task"
              style="min-height: 10px"
              @change="onChange"
              @unchoose="unChoose"
            >
              <template v-for="item in items2">
                <v-list-item
                  :key="item.id"
                  :id="item.id"
                  ripple
                  @click="getTasks"
                  v-bind:class="{
                    'selectedTheme overflow-y-auto': item.selected,
                    'theme2 overflow-y-auto': !item.selected
                  }"
                  max-height="80vh"
                >
                  <!-- class="overflow-y-auto"
             -->
                  <v-list-item-icon>
                    <v-icon color="red">mdi-toolbox</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="item.subtitle"
                    ></v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-html="item.subtitle2"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <!-- @click.native.stop="editFix" -->
                  <v-list-item-action>
                    <v-btn
                      icon
                      :id="item.id"
                      @click.native.stop="editFix"
                      v-if="items3.length && items3[0].parentId === item.id"
                    >
                      <v-icon color="blue">mdi-calendar-clock</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </draggable>
          </v-list>
        </v-card>
        <br /><br />
        <v-list
          three-line
          outlined
          shaped
          class="overflow-y-auto"
          max-height="70vh"
        >
          <v-subheader>
            Tasks
          </v-subheader>
          <draggable
            v-model="items3"
            task="task"
            style="min-height: 10px"
            @change="onChangeTask"
          >
            <template v-for="item in items3">
              <v-list-item :key="item.id" :id="item.id" ripple :class="theme2">
                <v-list-item-icon>
                  <v-icon color="purple">mdi-tools</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.subtitle"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="item.subtitle2"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon :id="item.id" @click="editTask">
                    <v-icon color="orange">mdi-calendar-clock</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
        <br /><br />
        <v-list
          three-line
          outlined
          shaped
          class="overflow-y-auto"
          max-height="90vh"
        >
          <v-subheader>
            DONE
          </v-subheader>
          <draggable v-model="items4" :group="group" style="min-height: 10px">
            <template v-for="item in items4">
              <v-list-item :key="item.id" :id="item.id" ripple :class="theme2">
                <v-list-item-icon>
                  <v-icon color="purple">mdi-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.subtitle"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="item.subtitle2"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <!-- <v-list-item-action>
                  <v-btn icon :id="item.id">
                    <v-icon color="orange">mdi-calendar-clock</v-icon>
                  </v-btn>
                </v-list-item-action> -->
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="900px" persistant>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Fix</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5" sm="5" md="5" offset="1">
                <div style="display: flex; flex-direction: column;">
                  <span>Choose Start Date</span>
                  <v-date-picker
                    v-model="datePickerFix"
                    color="green lighten-1"
                    header-color="primary"
                  ></v-date-picker>
                </div>
              </v-col>
              <v-col cols="5" sm="5" md="5" offset="0">
                <div style="display: flex; flex-direction: column;">
                  <span>Choose Start Time</span>
                  <v-time-picker
                    v-model="timePickerFix"
                    ampm-in-title
                  ></v-time-picker>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveFixChanges">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" persistent max-width="900px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Fix</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5" sm="5" md="5" offset="1">
                <v-text-field
                  v-model="taskDuration"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog2 = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveTaskChanges">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog3" persistent max-width="250px">
      <v-card>
        <v-card-title>
          <span class="headline">Save Changes</span>
        </v-card-title>
        <v-card-text>
          Do you wish to save changes?
          <!-- <v-container>
            <v-row>
              <v-col cols="5" sm="5" md="5" offset="1">
                <v-text-field
                  v-model="taskDuration"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container> -->
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog3 = false">
            Close
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="completed">
            Save
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import dayjs from "dayjs";
import businessDays from "dayjs-business-days";
import axios from "axios";
const options1 = {
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
dayjs.extend(businessDays, options1);
var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
let url = process.env.VUE_APP_BASEURL;

export default {
  name: "ProjectStructure",
  components: {
    draggable
  },
  metaInfo: {
    title: "Project Structure",
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
      group: "group",
      group1: "group",
      theme1: "selectedTheme",
      theme2: "unselectedTheme",
      // group: {
      //   group: "people",
      // },
      // task: {
      //   group: "people",
      // },
      dialog: false,
      dialog2: false,
      dialog3: false,
      timePickerFix: "08:00",
      datePickerFix: new Date().toISOString().substr(0, 10),
      fixId: "",
      taskId: null,
      taskDuration: 0,
      searchItem: "",
      items: [],
      // itemsDuplicated: [],
      items2: [],
      items3: [],
      items4: []
    };
  },
  mounted() {
    this.items = [];
    this.items2 = [];
    this.items3 = [];
    this.items4 = [];
    this.getFixes();
  },
  methods: {
    onChange: function(/**Event*/ evt) {
      evt.newIndex; // most likely why this event is used is to get the dragging element's current index

      if ((evt.added || evt.moved) && this.items2.length > 1) {
        this.items2.forEach((el, index, arr) => {
          if (index < arr.length - 1) {
            el.dependantOn = null;
            el.dependantOn = arr[index + 1].id;
          } else {
            el.dependantOn = null;
          }
        });
      }
    },
    onChangeTask: function(/**Event*/ evt) {
      evt.newIndex; // most likely why this event is used is to get the dragging element's current index
      // same properties as onEnd

      if (evt.moved && this.items3.length > 1) {
        this.items3.forEach((el, index, arr) => {
          if (index < arr.length - 1) {
            el.dependantOn = arr[index + 1].id.toString();
          } else {
            el.dependantOn = null;
          }
          el.sortIndex = index;
        });
      }
    },

    async getFixes() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getFixes`,
        data: data
      })
        .then(
          response => {
            let dataToUpdate = [];
            if (response.data[0].length > response.data[1].length) {
              response.data[0].forEach(el => {
                let filterData = response.data[1].filter(el2 => {
                  return (
                    el.taskType === el2.taskType &&
                    el.unitNumber === el2.unitNumber &&
                    el.supplier === el2.supplier &&
                    el.fix === el2.fix &&
                    el.subsectionName === el2.subsectionName
                  );
                });
                if (!filterData.length) {
                  dataToUpdate.push(el);
                }
              });
              dataToUpdate.forEach(el => {
                el.id = `${el.taskType}-${el.supplier}-${el.unitNumber}-${el.fix}`;
                el.development = this.$store.state.development.id;
              });

              this.postFixes(dataToUpdate);
            } else if (response.data[0].length === response.data[1].length) {
              response.data[1].forEach(el => {
                el.title = `${el.subsectionName}: ${el.unitName} - ${el.taskName} - ${el.fix}`;
                el.subtitle = el.subsectionName;
                el.subtitle2 = `${dayjs
                  .tz(el.startDate, "Africa/Johannesburg")
                  .format("YYYY-MM-DD HH:mm")}`;
              });
              this.items = response.data[1];
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
    async postFixes(data) {
      await axios({
        method: "post",
        url: `${url}/postFixes`,
        data: data
      })
        .then(
          () => {
            if (!this.items.length) {
              this.getFixes();
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
    async getTasks(event) {
      let info = {
        fixes: this.items2,
        tasks: this.items3
      };
      this.postData(info);
      this.items3 = [];

      this.items2.forEach(el => {
        if (el.id === event.currentTarget.id) {
          el.selected = true;

          this.datePickerFix = new Date(el.startDate)
            .toISOString()
            .substr(0, 10);
        } else {
          el.selected = false;
        }
      });
      let filteredData = this.items2.filter(el => {
        return el.id === event.currentTarget.id;
      });
      let data = filteredData[0];

      await axios({
        method: "post",
        url: `${url}/getRelatedTasks`,
        data: data
      })
        .then(
          response => {
            response.data.forEach(el => {
              el.title = el.taskDescription;
              el.subtitle = `${el.duration} days`;
              el.subtitle2 = `${dayjs
                .tz(el.startDate, "Africa/Johannesburg")
                .format("YYYY-MM-DD HH:mm")} - ${dayjs
                .tz(el.endDate, "Africa/Johannesburg")
                .format("YYYY-MM-DD HH:mm")}`;
            });
            this.items3 = response.data;
            this.saveFixChanges();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    editFix(event) {
      let id = event.currentTarget.id;
      this.fixId = id;

      setTimeout(() => {
        this.timePickerFix = "08:00";
        let filtered = this.items2.filter(el => {
          return el.id === id;
        });

        let startDate = filtered[0].startDate.substr(0, 10);

        if (startDate === new Date().toISOString().substr(0, 10)) {
          this.datePickerFix = this.items3[0].startDate.substr(0, 10);
        }
        this.dialog = true;
      }, 350);
    },
    editTask(event) {
      let id = parseInt(event.currentTarget.id);
      this.taskId = id;

      let filteredData = this.items3.filter(el => {
        return el.id === this.taskId;
      });

      this.taskDuration = filteredData[0].duration;

      this.dialog2 = true;
    },
    saveTaskChanges() {
      this.items3.forEach(el => {
        if (el.id === this.taskId) {
          el.duration = this.taskDuration;
          if (el.duration > 1) {
            el.subtitle = `${el.duration} days`;
          } else {
            el.subtitle = `${el.duration} day`;
          }
        }
      });
      this.saveFixChanges();
      this.dialog2 = false;
    },
    saveFixChanges() {
      let startDate = `${this.datePickerFix} ${this.timePickerFix}:00`;

      this.items3.forEach((el, index, arr) => {
        if (index === 0) {
          el.startDate = dayjs(startDate).format("YYYY-MM-DD HH:mm");
          el.endDate = dayjs(el.startDate)
            .businessDaysAdd(el.duration - 1)
            .add(9, "hour")
            .format("YYYY-MM-DD HH:mm");
          el.subtitle2 = `${dayjs
            .tz(el.startDate, "Africa/Johannesburg")
            .format("YYYY-MM-DD HH:mm")} - ${dayjs
            .tz(el.endDate, "Africa/Johannesburg")
            .format("YYYY-MM-DD HH:mm")}`;
        } else {
          el.startDate = dayjs(arr[index - 1].endDate)
            .businessDaysAdd(1)
            .subtract(9, "hour")
            .format("YYYY-MM-DD HH:mm");
          el.endDate = dayjs(el.startDate)
            .businessDaysAdd(el.duration - 1)
            .add(9, "hour")
            .format("YYYY-MM-DD HH:mm");
          el.subtitle2 = `${dayjs
            .tz(el.startDate, "Africa/Johannesburg")
            .format("YYYY-MM-DD HH:mm")} - ${dayjs
            .tz(el.endDate, "Africa/Johannesburg")
            .format("YYYY-MM-DD HH:mm")}`;
        }
      });

      let endDate = dayjs(this.items3[this.items3.length - 1].endDate).format(
        "YYYY-MM-DD HH:mm"
      );

      this.items2.forEach(el => {
        if (el.id === this.fixId) {
          el.startDate = startDate;
          el.endDate = endDate;
          el.subtitle2 = `${el.startDate} - ${el.endDate}`;
        }
      });

      this.dialog = false;
    },
    finish() {
      this.dialog3 = true;
    },
    completed() {
      let data = {
        fixes: this.items2,
        tasks: this.items3
      };

      this.postData(data);
      this.items2.forEach(el => {
        this.items4.push(el);
      });
      this.items2 = [];
      this.items3 = [];
      this.dialog3 = false;
    },
    async postData(data) {
      await axios({
        method: "post",
        url: `${url}/saveProjectChanges`,
        data: data
      })
        .then(
          () => {},
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
.selectedTheme {
  background-color: lightblue;
}
</style>

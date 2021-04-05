<template>
  <div id="app">
    <v-row class="text-center">
      <v-col class="mb-0" offset="1" cols="10">
        <v-col class="mb-0" offset="1" cols="10">
          <v-btn
            class="mr-2"
            color="white"
            style="color: #111d5e"
            dark
            @click="demoViewMode('Quarter Day')"
            >1/4 D</v-btn
          >
          <v-btn
            class="mr-2"
            color="transparent"
            style="color: #111d5e"
            dark
            @click="demoViewMode('Half Day')"
            >1/2 D</v-btn
          >
          <v-btn
            class="mr-2"
            color="transparent"
            style="color: #111d5e"
            dark
            @click="demoViewMode('day')"
            >Day</v-btn
          >
          <v-btn
            class="mr-2"
            color="transparent"
            style="color: #111d5e"
            dark
            @click="demoViewMode('week')"
            >Wk</v-btn
          >
          <v-btn
            class="mr-2"
            color="transparent"
            style="color: #111d5e"
            dark
            @click="demoViewMode('month')"
            >Mth</v-btn
          >
        </v-col>
        <v-btn text @click="changeDependancies">
          Dependencies
        </v-btn>
        <FrappeGantt
          v-if="showChart"
          :view-mode="mode"
          :tasks="tasks"
          @task-updated="testThis($event)"
          @task-date-updated="updateTaskDates($event)"
          @task-progress-change="debugEventLog.push($event)"
        />
        <v-btn text @click="changeDependancies">
          Dependencies
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card
        max-width="500px"
        style="position: absolute; top: 0px; right: 0px;"
      >
        <v-card-title>
          <span class="headline">Change Dependancies</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-select
                  v-model="thisIsDependant"
                  :items="tasks"
                  item-text="name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  chips
                  hint="This task is dependant"
                  persistent-hint
                ></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-checkbox
                  v-model="removeDependancyCheck"
                  :label="
                    removeDependancyCheck === true
                      ? 'Add Dependancy'
                      : 'Remove Dependancy'
                  "
                  color="red"
                  :value="removeDependancyCheck"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="9" md="9">
                <v-select
                  v-if="!removeDependancyCheck"
                  v-model="onThese"
                  :items="tasks"
                  item-text="name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Select"
                  multiple
                  chips
                  hint="This task is depended upon"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="processDependancies"
            v-if="
              (thisIsDependant.length && removeDependancyCheck == true) ||
                (thisIsDependant.length &&
                  (removeDependancyCheck == null ||
                    removeDependancyCheck == false) &&
                  onThese.length)
            "
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" persistent max-width="900px">
      <v-card max-width="900px">
        <v-card-title>
          <span class="headline">Change Dependancies</span>
        </v-card-title>
        <!-- <v-card-text> -->
        <div class="row ">
          <v-col cols="6" sm="6" md="6">
            <h3>Draggable 1</h3>
            <draggable
              class="list-group"
              :list="list1"
              group="people"
              @change="log"
            >
              <div
                class="list-group-item"
                v-for="element in list1"
                :key="element.name"
              >
                {{ element.name }}
              </div>
            </draggable>
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <h3>Draggable 2</h3>
            <draggable
              class="list-group"
              :list="list2"
              group="people"
              @change="log"
            >
              <div
                class="list-group-item"
                v-for="element in list2"
                :key="element.name"
              >
                {{ element.name }}
              </div>
            </draggable>
          </v-col>

          <!-- <rawDisplayer class="col-3" :value="list1" title="List 1" />

    <rawDisplayer class="col-3" :value="list2" title="List 2" /> -->
        </div>
        <!-- </v-card-text> -->
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog2 = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import { Drag, Drop } from "vue-drag-drop";
import FrappeGantt from "../components/Frappe-Gantt";
import * as moment from "moment/moment";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import uuidv4 from "uuid/v4";
export default {
  name: "App",
  metaInfo: {
    title: "Gantt",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Gantt here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  components: {
    FrappeGantt,
    // Drag,
    // Drop,
    draggable
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        // { name: "Juan", id: 5 },
        // { name: "Edgard", id: 6 },
        // { name: "Johnson", id: 7 },
      ],

      dialog: false,
      dialog2: false,
      thisIsDependant: [],
      onThese: [],
      showChart: false,
      removeDependancyCheck: false,
      mode: "Day",
      tasks: [],
      debugEventLog: []
    };
  },
  async mounted() {
    this.checkToken();
    axios.defaults.headers.common["Authorization"] = this.$store.state.token;
    this.tasks = [];
    this.list1 = [];
    await axios({
      method: "get",
      url: `${url}/progressGantt/${this.$store.state.development.id}`
    }).then(
      response => {
        if (response.data.success === false) {
          return this.$router.push({ name: "Login" });
        }

        response.data.forEach(el => {
          let insert = {
            id: `${el.taskType}-${el.unitId}-${el.fix}`,
            name: `${el.taskName}: ${el.subsectionName} - ${el.unitName} - ${el.fix} fix`,
            start: moment(el.startDate).format("YYYY-MM-DD HH:mm"),
            end: moment(el.endDate).format("YYYY-MM-DD HH:mm"),
            progress: el.progressMade,
            fix: el.fix,
            unitNumber: el.unitId,
            taskType: el.taskType,
            dependencies: JSON.parse(el.dependencies)
          };
          this.tasks.push(insert);
          this.list1.push(insert);
        });
      },
      error => {
        console.log(error);
      }
    );

    this.showChart = true;
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan" });
    },
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    log: function(evt) {
      window.console.log(evt);
    },
    // handleDrop(toList, data) {
    //   const fromList = data.list;
    //   if (fromList) {
    //     toList.push(data.item);
    //     fromList.splice(fromList.indexOf(data.item), 1);
    //     toList.sort((a, b) => a > b);
    //   }
    // },
    testThis(event) {
      console.log("Hello:", event);
      // debugEventLog.push($event)
    },
    updateTaskDates(event) {
      //WORK ON THIS!!!!!! DATABASE LOCK!!!!
      this.debugEventLog = [];
      this.debugEventLog.push(event);
      console.log(this.debugEventLog);
      // setTimeout(() => {
      // let changes = this.debugEventLog;
      // // changes.reverse()
      // console.log("changes", changes);
      // let data = [];
      // changes.forEach(el => {
      //   let insert = {
      //     taskType: el.task.taskType,
      //     unitNumber: el.task.unitNumber,
      //     fix: el.task.fix,
      //     start: moment
      //       .utc(
      //         moment(el.start)
      //           .format("YYYY-MM-DD")
      //           .toString() +
      //           " " +
      //           moment(el.task.start)
      //             .format("HH:mm:ss")
      //             .toString()
      //       )
      //       .format("YYYY-MM-DD HH:mm:ss"),
      //     end: moment
      //       .utc(
      //         moment(el.end)
      //           .format("YYYY-MM-DD")
      //           .toString() +
      //           " " +
      //           moment(el.task.end)
      //             .format("HH:mm:ss")
      //             .toString()
      //       )
      //       .format("YYYY-MM-DD HH:mm:ss")
      //   };
      //   data.push(insert);
      // });
      // // console.log(data)
      // axios({
      //   method: "post",
      //   url: `${url}/processDateChanges`,
      //   data: data
      // }).catch(e => {
      //   console.log(e);
      // });
      // this.debugEventLog = [];

      // },200)
    },

    addRandomTask() {
      const id = uuidv4();
      this.tasks.push({
        id: id,
        name: id,
        start: "2019-01-01",
        end: "2019-01-05",
        progress: Math.random() * 100
      });
    },
    changeDependancies() {
      this.dialog2 = true;
    },
    async processDependancies() {
      let thisIsDependant = this.tasks.filter(el => {
        return el.name === this.thisIsDependant;
      });
      let thisIsDependantId = thisIsDependant[0].id;
      if (!this.removeDependancyCheck) {
        let onThese = [];
        this.onThese.forEach(el => {
          let name = el;
          this.tasks.forEach(el2 => {
            if (el2.name === name) {
              onThese.push(el2.id);
            }
          });
        });
        this.tasks.forEach(el => {
          if (el.id === thisIsDependantId) {
            onThese.forEach(el2 => {
              el.dependencies.push(el2);
            });
          }
        });
      } else {
        this.tasks.forEach(el => {
          if (el.id === thisIsDependantId) {
            el.dependencies = [];
          }
        });
      }
      let data = thisIsDependant[0];
      await axios({
        method: "post",
        url: `${url}/progressDependency`,
        data: data
      })
        .then(error => {
          console.log(error);
        })
        .catch(e => {
          console.log(e);
        });
      //SHOULD THIS MOVE INTO THEN???
      this.showChart = false;
      setTimeout(() => {
        this.$nextTick(() => {
          this.showChart = true;
        });
      });
      this.dialog = false;
      this.removeDependancyCheck = false;
      this.thisIsDependant = [];
      this.onThese = [];
    },
    demoViewMode(viewMode) {
      this.mode = viewMode;
    }
  }
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.list-group-item:nth-child(even) {
  background-color: lime;
}
.list-group-item {
  width: 100%;
}
.col-3 {
  width: 100%;
}
.test {
  width: 600px;
}
</style>

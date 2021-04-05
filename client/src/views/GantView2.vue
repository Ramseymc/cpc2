<template>
  <div class="container">
    <div>
      <v-btn text @click="showGrid">Grid</v-btn>
      <v-btn text @click="checkTasks">Messages</v-btn>
    </div>
    <v-col cols="10" offset="1" xs-12>
      <v-card xs-12 :max-height="maxHeight">
        <!-- FILTER DETAILS -->
        <div style="display:flex; justify-content: space-around;">
          <v-card-title style="font-size: 80%;" @click="showSort"
            >Sort Options
            <v-btn icon
              ><v-icon x-large>mdi-chevron-down</v-icon></v-btn
            ></v-card-title
          >
          <v-btn
            style="font-weight: bold;"
            v-if="filterUnitValue || filterBlockValue || filterTaskValue"
            @click="clearFilter"
            color="red"
            text
            >Clear Sort</v-btn
          >
        </div>

        <!-- <v-row style="padding: 5px;"> -->
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              class="ml-4"
              v-model="filterBlockValue"
              :items="blockFilter"
              dense
              filled
              label="Block"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="filterUnitValue"
              :items="unitFilter"
              dense
              filled
              label="Unit"
              color="#0F0F0F"
              @change="filterDataforGrid"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              class="mr-4"
              v-model="filterTaskValue"
              :items="taskFilter"
              dense
              filled
              label="Task"
              color="#0F0F0F"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- <v-col cols="12">
          <v-btn
            v-if="filterUnitValue || filterBlockValue || filterTaskValue"
            @click="clearFilter"
            color="#0F0F0F"
            text
            >Clear Sort</v-btn
          >
        </v-col> -->
      </v-card>
    </v-col>
    <div class="right-container" v-if="showLeft">
      <div class="gantt-selected-info">
        <div v-if="selectedTask">
          <h2>{{ selectedTask.text }}</h2>
          <span><b>ID: </b>{{ selectedTask.id }}</span
          ><br />
          <span><b>Progress: </b>{{ selectedTask.progress | toPercent }}%</span
          ><br />
          <span
            ><b>Start Date: </b>{{ selectedTask.start_date | niceDate }}</span
          ><br />
          <span><b>End Date: </b>{{ selectedTask.end_date | niceDate }}</span
          ><br />
        </div>
        <div v-else class="select-task-prompt">
          <h2>Click any task</h2>
        </div>
      </div>
      <ul class="gantt-messages">
        <li
          class="gantt-message"
          v-for="(message, index) in messages"
          v-bind:key="index"
        >
          {{ message }}
        </li>
      </ul>
    </div>
    <!-- //tasks -->
    <gantt
      :key="componentKey"
      class="left-container"
      :tasks="tasks"
      :showGrid="gridWidth"
      @task-updated="logTaskUpdate"
      @link-updated="logLinkUpdate"
      @task-selected="selectTask"
    ></gantt>
  </div>
</template>

<script>
import Gantt from "../components/Gantt.vue";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
// import * as moment from "moment/moment";
import * as dayjs from "dayjs";
export default {
  name: "ganttv2",
  components: { Gantt },
  data() {
    return {
      maxHeight: 50,
      showSorting: false,
      gridWidth: true,
      componentKey: 0,
      showLeft: false,
      filterData: [],
      blockFilter: [],
      unitFilter: [],
      taskFilter: [],
      filterBlockValue: "",
      filterUnitValue: "",
      filterTaskValue: "",

      tasks: {
        data: [
          {
            id: 1,
            text: "Task #1",
            start_date: "2020-03-10",
            duration: 3,
            progress: 0.6
          },
          {
            id: 2,
            text: "Task #2",
            start_date: "2020-03-14",
            duration: 3,
            progress: 0.4
          },
          {
            id: 3,
            text: "Task #3",
            start_date: "2020-03-20",
            duration: 2,
            progress: 0.7
          }
        ],
        links: [
          { id: 1, source: 1, target: 2, type: "0" },
          { id: 2, source: 2, target: 3, type: "0" }
        ]
      },
      tasksDataOriginal: "",
      messages: [],
      selectedTask: null, //TEST THIS OUT,
      testTasks: []
    };
  },
  filters: {
    toPercent(val) {
      if (!val) return "0";
      return Math.round(+val * 100);
    },
    niceDate(obj) {
      return `${obj.getFullYear()} / ${obj.getMonth()} / ${obj.getDate()}`;
    }
  },
  // created() {
  //   this.gridWidth = this.$store.state.gridWidth
  // },
  computed: {
    // dataFiltered() {
    //   if (this.filterUnitValue === "") {
    //     return this.tasks;
    //   } else {
    //     // const filter = "nature";
    //     // const filteredResult = initialState.filter((item) => {
    //     //   return item.tags.indexOf(filter) >= 0;
    //     // });
    //     let data = this.tasks.data.filter((el) => {
    //       // console.log(this.tasks);
    //       return (
    //         !this.filterUnitValue ||
    //         el.text.toLowerCase().indexOf(this.filterUnitValue.toLowerCase()) >
    //           -1
    //         //   ||
    //         // el.unitName.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
    //         //   -1 ||
    //         // el.comments.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
    //         //   -1 ||
    //         // el.createdAt
    //         //   .toLowerCase()
    //         //   .indexOf(this.searchImages.toLowerCase()) > -1 ||
    //         // el.uploadedBy
    //         //   .toLowerCase()
    //         //   .indexOf(this.searchImages.toLowerCase()) > -1
    //       );
    //     });
    //      this.tasks.data = data
    //     return this.tasks;
    //   }
    // },
  },
  beforeMount() {
    // this.tasks.data = [];
    // this.getData();
  },
  mounted() {
    setTimeout(() => {
      this.tasks.data = [];
      this.getData();
      this.componentKey++;
    }, 150);
  },
  async beforeDestroy() {
    if (this.tasksDataOriginal !== JSON.stringify(this.tasks.data)) {
      // console.log("HELLO", this.tasks.data);
      this.tasks.data.forEach(el => {
        el.endDate = dayjs(el.start_date)
          .add(el.duration - 1, "days")
          .format("YYYY-MM-DD");
        let split = el.id.split("-");
        el.taskType = parseInt(split[0]);
        el.unitNumber = parseInt(split[1]);
        el.fix = split[2];
      });
      let data = {
        id: this.$store.state.development.id,
        data: this.tasks.data
      };
      await axios({
        method: "post",
        url: `${url}/updateTasksFromGantt`,
        data: data
      }).then(
        response => {
          console.log(response.data);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      console.log("No Changes");
    }
    // console.log(this.tasks.data);
  },
  methods: {
    filterDataforGrid() {
      this.getData().then(() => {
        setTimeout(() => {
          this.componentKey++;
        }, 100);
      });

      // if (this.filterUnitValue !== "") {
      //   let data = this.tasks.data.filter((el) => {
      //     return el.text.toLowerCase().indexOf(this.filterUnitValue.toLowerCase()) >
      //       -1;
      //   });
      //   this.tasks.data = data;

      //   // return this.tasks
      // }
      // console.log(this.tasks.data)
      // setTimeout(() => {
      // this.componentKey++

      // }, 500)
    },
    clearFilter() {
      this.filterBlockValue = "";
      this.filterUnitValue = "";
      this.filterTaskValue = "";
    },
    // createFilters() {
    //   if (this.filterUnitValue !== "") {

    //   }
    // },
    showSort() {
      console.log("Show Sort");
      this.showSorting = !this.showSorting;
      if (this.showSorting) {
        this.maxHeight = 150;
      } else {
        this.maxHeight = 50;
      }
    },
    async getData() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      this.tasks.data = [];
      // this.tasks.links = [];
      await axios({
        method: "get",
        url: `${url}/progressGantt/${this.$store.state.development.id}`
      }).then(
        response => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          // let startDateA = dayjs().format("YYYY-MM-DD");
          this.tasks.data = [];
          this.tasks.links = [];
          console.log(response.data);
          let data = response.data;
          if (this.filterUnitValue !== "") {
            data = data.filter(el => {
              return el.unitName === this.filterUnitValue;
            });
          }
          console.log(data);
          data.forEach(el => {
            console.log(el);
            // if (el.unitName === this.filterUnitValue)
            let dependencies = JSON.parse(el.dependencies);
            if (dependencies === null) {
              dependencies = [];
            }
            if (dependencies.length) {
              dependencies = dependencies[0];
            } else {
              dependencies = null;
            }
            // console.log(dependencies);
            // startDateA = dayjs(startDateA).add(2, "d");
            console.log(el.progressMade / 100);
            let insert2 = {
              id: `${el.taskType}-${el.unitId}-${el.fix}`,
              duration: 2,
              progress: parseFloat(el.progressMade / 100),
              oldStartDate: dayjs(el.startDate).format("YYYY-MM-DD"),
              start_date: dayjs(el.startDate).format("YYYY-MM-DD"),
              text: `${el.taskName}: ${el.unitName} - ${el.fix} fix`,
              change: 0,
              dependencies: dependencies
            };
            this.tasks.data.push(insert2);
          });
          console.log(this.tasks.data);
          this.tasks.links = [];
          let filterData = [];
          this.tasks.data.forEach((el, index) => {
            if (el.dependencies !== null) {
              let insert = {
                id: index,
                source: el.dependencies,
                target: el.id,
                type: "0"
              };
              this.tasks.links.push(insert);
            }
            // let insert2 = {
            //   id: el.id,
            //   tex: el.text
            // }
            filterData.push(el.text);
            this.filterData = filterData;
          });
        },
        error => {
          console.log(error);
        }
      );
      let taskFilter = [];
      let blockFilter = [];
      let unitFilter = [];
      // console.log(this.filterData);
      this.filterData.forEach(el => {
        let splitData = el.split(/:|-| fix/);
        taskFilter.push(splitData[0]);
        unitFilter.push(splitData[1].trim());
      });
      taskFilter = Array.from(new Set(taskFilter));
      unitFilter = Array.from(new Set(unitFilter));
      console.log(taskFilter);
      console.log(unitFilter);
      unitFilter.forEach(el => {
        blockFilter.push(`Block ${el.substr(0, 1)}`);
      });
      blockFilter = Array.from(new Set(blockFilter));
      console.log(blockFilter);
      this.unitFilter = unitFilter;
      this.blockFilter = blockFilter;
      this.taskFilter = taskFilter;

      // console.log(this.tasks.data);
      this.tasksDataOriginal = JSON.stringify(this.tasks.data);
      setTimeout(() => {
        this.$nextTick(() => {
          console.log(this.tasks.data);
        }, 300);
        this.componentKey++;
      }, 200);
      // console.log(this.tasksDataOriginal)
    },
    showGrid() {
      this.gridWidth = !this.gridWidth;
      this.tasks.data.sort((a, b) => {
        return a.test - b.text;
      });
      setTimeout(() => {
        this.componentKey++;
      }, 100);
    },
    checkTasks() {
      this.showLeft = !this.showLeft;
      // console.log(this.tasks);
    },
    addMessage(message) {
      this.messages.unshift(message);
      if (this.messages.length > 40) {
        this.messages.pop();
      }
    },

    logTaskUpdate(id, mode, task) {
      let text = task && task.text ? ` (${task.text})` : "";
      let message = `Task ${mode}: ${id} ${text}`;
      this.addMessage(message);
      // console.log("task", task);

      this.tasks.data.forEach(el => {
        if (el.id === task.id) {
          (el.duration = task.duration),
            (el.start_date = task.start_date),
            (el.progress = task.progress),
            (el.change = dayjs(el.start_date).diff(
              dayjs(el.oldStartDate),
              "days"
            ));
          task.change = el.change;
          el.oldStartDate = el.start_date;
        }
      });
      this.tasks.links.forEach(el => {
        let source = el.source;
        let target = el.target;
        this.tasks.data.forEach(el2 => {
          if (el2.id === target) {
            let filteredSource = this.tasks.data.filter(el3 => {
              return el3.id === source;
            });
            el2.change = filteredSource[0].change;
            el2.start_date = dayjs(el2.start_date)
              .add(el2.change, "days")
              .format("YYYY-MM-DD");
            el2.oldStartDate = el2.start_date;
          }
        });
      });

      setTimeout(() => {
        this.componentKey++;
      }, 150);
    },

    logLinkUpdate(id, mode, link) {
      let message = `Link ${mode}:`;
      if (link) {
        message += ` ( source: ${link.source}, target: ${link.target} )`;
      }
      this.addMessage(message);
      if (mode === "delete") {
        this.tasks.links = this.tasks.links.filter(el => {
          return link.source !== el.source && link.target !== el.target;
        });
      } else {
        this.tasks.links.push(link);
      }
      this.$nextTick(() => {
        this.tasks.data.forEach(el => {
          let links = this.tasks.links.filter(el2 => {
            return el2.target === el.id;
          });
          if (!links.length) {
            el.dependencies = null;
          } else {
            el.dependencies = links[0].source;
          }
        });
      });
    },
    selectTask: function(task) {
      this.selectedTask = task;
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.container {
  height: 100%;
  width: 100%;
}
.left-container {
  overflow: hidden;
  position: relative;
  height: 100vh;
}
.right-container {
  border-right: 1px solid #cecece;
  float: right;
  height: 100%;
  width: 340px;
  box-shadow: 0 0 1px 1px #aaa;
  position: relative;
  z-index: 0;
}
.gantt-messages {
  list-style-type: none;
  height: 50%;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 5px;
}
.gantt-messages > .gantt-message {
  background-color: #f4f4f4;
  box-shadow: inset 5px 0 #d69000;
  font-family: Geneva, Arial, Helvetica, sans-serif;
  font-size: 14px;
  margin: 5px 0;
  padding: 8px 0 8px 10px;
}
.gantt-selected-info {
  border-bottom: 1px solid #cecece;
  box-sizing: border-box;
  font-family: Geneva, Arial, Helvetica, sans-serif;
  height: 50%;
  line-height: 28px;
  padding: 10px;
}
.gantt-selected-info h2 {
  border-bottom: 1px solid #cecece;
}
.select-task-prompt h2 {
  color: #d9d9d9;
}
.gantt_task_line.gantt_task_inline_color .gantt_task_progress {
  background-color: rgb(216, 47, 47);
  opacity: 0.9;
}
</style>

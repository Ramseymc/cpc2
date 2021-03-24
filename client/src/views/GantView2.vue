<template>
  <div class="container">
    <div>
      <v-btn text @click="showGrid">Grid</v-btn>
      <v-btn text @click="checkTasks">Messages</v-btn>
    </div>
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
      gridWidth: true,
      componentKey: 0,
      showLeft: false,

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
  beforeMount() {
    this.tasks.data = [];
    this.getData();
  },
  mounted() {
    setTimeout(() => {
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
          response.data.forEach(el => {
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
          });
        },
        error => {
          console.log(error);
        }
      );

      // console.log(this.tasks.data);
      this.tasksDataOriginal = JSON.stringify(this.tasks.data);
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

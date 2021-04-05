<template>
  <div>
    <!-- <v-card class="mx-auto" max-width="1200" v-if="tasks.length">
      <v-toolbar color="#0F0F0F" height="85" class="ml-4 mr-4">
        <v-btn v-if="searchImages != ''" @click="clearSearch">Clear</v-btn>
        <v-spacer></v-spacer>

        <v-checkbox
          v-model="options.calendar.hour.display"
          dark
          label="Show/Hide hours"
        ></v-checkbox>
        <v-spacer></v-spacer>

        <v-text-field
          dark
          prepend-icon="mdi-magnify"
          label="Filter Data (Block, unit or task Name)"
          v-model="searchImages"
        >
        </v-text-field>
      </v-toolbar>
    </v-card> -->
    <!-- <div
      v-if="progressCircle"
      style="display: flex; flex-direction: column; justify-content: center;align-items: center;"
    >
      <v-progress-circular
        :size="120"
        :width="15"
        label="Hello"
        indeterminate
      ></v-progress-circular>
    </div> -->

    <!-- <v-col v-if="showGant">
      <gantt-elastic
        :key="componentKey"
        :options="options"
        :tasks="dataFiltered"
        @tasks-changed="tasksUpdate"
        @options-changed="optionsUpdate"
        @dynamic-style-changed="styleUpdate"
      >
        <gantt-header slot="header"></gantt-header>
      </gantt-elastic>
      <div class="q-mt-md" />
    </v-col> -->

    <h1 class="text-center">
      <!-- <a href="#" target="_blank"> -->
      Vue-AnyChart
      <!-- <p>the component of Vue 2+ for AnyChart</p> -->
      <!-- </a> -->
    </h1>
    <button @click="changeChart">Daily</button>
    <button @click="collapseAll">Collapse</button>

    <div
      id="container"
      style="height: 100vh; width: 80vw; display: flex; justify-content: center; margin-right: 50px;"
    >
      <section class="chart-container">
        <VueAnychart :key="componentKey" />
      </section>
    </div>
  </div>
</template>

<style></style>

<script>
// import VueAnychart from "./components/VueAnychart";
import VueAnychart from "../components/VueAnychart";
import Anychart from "anychart";
// import GanttElastic from "gantt-elastic";
// import GanttHeader from "gantt-elastic-header";
import dayjs from "dayjs";
import businessDays from "dayjs-business-days";

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

// let options = {
//   taskMapping: {
//     progress: "percent"
//   },
//   maxRows: 100,
//   maxHeight: 500,
//   title: {
//     label: "Your project title as html (link or whatever...)",
//     html: false
//   },
//   row: {
//     height: 12
//   },
//   calendar: {
//     hour: {
//       display: false
//     }
//   },
//   chart: {
//     progress: {
//       bar: true
//     },
//     expander: {
//       display: true
//     }
//   },
//   taskList: {
//     expander: {
//       straight: false
//     },
//     columns: [
//       // {
//       //   id: 1,
//       //   label: "ID",
//       //   value: "id",
//       //   width: 40,
//       // },
//       {
//         id: 2,
//         label: "Description",
//         value: "label",
//         width: 200,
//         expander: true,
//         html: true,
//         events: {
//           click({ data }) {
//             alert(data.label);
//           }
//         }
//       },
//       // {
//       //   id: 3,
//       //   label: "Duration",
//       //   value: "duration",
//       //   width: 150,
//       //   // html: true
//       // },
//       // {
//       //   id: 3,
//       //   label: "Assigned to",
//       //   value: "user",
//       //   width: 130,
//       //   html: true,
//       // },
//       {
//         id: 4,
//         label: "Start",
//         value: task => dayjs(task.start).format("YYYY-MM-DD"),
//         width: 78
//       },
//       // // {
//       // //   id: 5,
//       // //   label: "Type",
//       // //   value: "type",
//       // //   width: 68,
//       // },
//       {
//         id: 6,
//         label: "%",
//         value: "progress",
//         width: 35,
//         style: {
//           "task-list-header-label": {
//             "text-align": "center",
//             width: "100%"
//           },
//           "task-list-item-value-container": {
//             "text-align": "center",
//             width: "100%"
//           }
//         }
//       }
//     ]
//   },
//   locale: {
//     name: "en",
//     Now: "Now",
//     "X-Scale": "Zoom-X",
//     "Y-Scale": "Zoom-Y",
//     "Task list width": "Task list",
//     "Before/After": "Expand",
//     "Display task list": "Task list"
//   }
// };
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "ganttv3A",
  components: {
    // GanttElastic,
    // GanttHeader
    VueAnychart
  },
  data() {
    return {
      showGant: false,
      // componentKey: 0,
      searchImages: "",
      progressCircle: true,
      tasks: [],
      tasks2: [],
      // options,
      dynamicStyle: {},
      lastId: 16,

      Anychart: Anychart,
      chart: null,
      treeData: null,
      componentKey: 0,

      data: [
        {
          id: "1",
          name: "Development Life Cycle",
          actualStart: Date.UTC(2021, 1, 2),
          actualEnd: Date.UTC(2021, 8, 10),
          children: [
            {
              id: "1_1",
              name: "Planning",
              actualStart: Date.UTC(2021, 1, 2),
              actualEnd: Date.UTC(2021, 8, 10),
              connectTo: "1_2",
              connectorType: "finish-start",
              progressValue: "75%"
            },
            {
              id: "1_2",
              name: "Design and Prototyping",
              actualStart: Date.UTC(2021, 1, 23),
              actualEnd: Date.UTC(2021, 2, 20),
              connectTo: "1_3",
              connectorType: "start-start",
              progressValue: "60%"
            },
            {
              id: "1_3",
              name: "Evaluation Meeting",
              actualStart: Date.UTC(2021, 2, 23),
              actualEnd: Date.UTC(2021, 2, 23),
              connectTo: "1_4",
              connectorType: "start-start",
              progressValue: "80%"
            },
            {
              id: "1_4",
              name: "Application Development",
              actualStart: Date.UTC(2021, 2, 26),
              actualEnd: Date.UTC(2021, 4, 26),
              connectTo: "1_5",
              connectorType: "finish-finish",
              progressValue: "90%"
            },
            {
              id: "1_5",
              name: "Testing",
              actualStart: Date.UTC(2021, 4, 29),
              actualEnd: Date.UTC(2021, 5, 15),
              connectTo: "1_6",
              connectorType: "start-finish",
              progressValue: "60%"
            },
            {
              id: "1_6",
              name: "Deployment",
              actualStart: Date.UTC(2021, 5, 20),
              actualEnd: Date.UTC(2021, 5, 27),
              connectTo: "1_7",
              connectorType: "start-finish",
              progressValue: "100%"
            },
            {
              id: "1_7",
              name: "Maintenance",
              actualStart: Date.UTC(2021, 5, 30),
              actualEnd: Date.UTC(2021, 6, 11),
              progressValue: "40%"
            },
            {
              id: "1_6",
              name: "Deployment",
              actualStart: Date.UTC(2021, 5, 20),
              actualEnd: Date.UTC(2021, 5, 27),
              connectTo: "1_7",
              connectorType: "start-finish",
              progressValue: "100%"
            },
            {
              id: "1_7",
              name: "Maintenance",
              actualStart: Date.UTC(2021, 5, 30),
              actualEnd: Date.UTC(2021, 6, 11),
              progressValue: "40%"
            },
            {
              id: "1_6",
              name: "Deployment",
              actualStart: Date.UTC(2021, 5, 20),
              actualEnd: Date.UTC(2021, 5, 27),
              connectTo: "1_7",
              connectorType: "start-finish",
              progressValue: "100%"
            },
            {
              id: "1_7",
              name: "Maintenance",
              actualStart: Date.UTC(2021, 6, 6),
              actualEnd: Date.UTC(2021, 6, 12),
              progressValue: "40%"
            },
            {
              id: "1_6",
              name: "Deployment",
              actualStart: Date.UTC(2021, 5, 20),
              actualEnd: Date.UTC(2021, 5, 27),
              connectTo: "1_7",
              connectorType: "start-finish",
              progressValue: "100%"
            },
            {
              id: "1_7",
              name: "Maintenance",
              actualStart: Date.UTC(2021, 6, 6),
              actualEnd: Date.UTC(2021, 6, 12),
              progressValue: "40%"
            },
            {
              id: "1_6",
              name: "Deployment",
              actualStart: Date.UTC(2021, 5, 20),
              actualEnd: Date.UTC(2021, 5, 27),
              connectTo: "1_7",
              connectorType: "start-finish",
              progressValue: "100%"
            },
            {
              id: "1_7",
              name: "Maintenance",
              actualStart: Date.UTC(2021, 6, 6),
              actualEnd: Date.UTC(2021, 8, 12),
              progressValue: "40%"
            }
          ]
        }
      ]
    };
  },
  created() {
    // this.getTasks();

    // var treeData = anychart.data.tree(this.data, "as-table");
    var treeData = anychart.data.tree(this.data, "as-tree");
    var chart = anychart.ganttProject();
    chart.data(treeData);
    // chart.maxHeight(1000)
    // chart.minHeight(1000)
    // chart.defaultRowHeight(35);
    // chart.xScroller().orientation("top");
    // chart.yScroller().orientation("left");

    chart.title("HELLO");
    chart.splitterPosition("20%");
    chart.zoomIn(5);
    var marker_1 = chart.getTimeline().lineMarker(1);
    marker_1.value(new Date());
    // this.chart.getTimeline().scale().maximum(Date.UTC(2021,11,30));
    //     this.chart.getTimeline().scale().zoomLevels([
    //   [
    //     // {unit: "month", count: 1},
    //     {unit: "day", count: 2},
    //     // {unit: "quarter", count: 1}
    //   ]
    // ]);
    chart.container("container");
    chart.draw();
    // this.chart.fitAll();
    // this.chart.collapseAll();

    chart.fitToTask();
  },
  computed: {
    // dataFiltered() {
    //   //   return this.filterInfo();
    //   //   // if (this.searchImages === "") {
    //   //   //   return this.tasks;
    //   //   // } else {
    //   //   //   return this.tasks.filter(el => {
    //   //   //     return (
    //   //   //       !this.searchImages ||
    //   //   //       el.block
    //   //   //         .toLowerCase()
    //   //   //         .indexOf(this.searchImages.toLowerCase()) > -1 ||
    //   //   //       el.unit.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
    //   //   //         -1 ||
    //   //   //       el.taskName.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
    //   //   //         -1
    //   //   //     );
    //   //   //   });
    //   //   // }
    //   }
  },
  methods: {
    changeChart() {
      // this.chart
      //   .getTimeline()
      //   .scale()
      //   .maximum('2021-03-01');

      this.chart
        .getTimeline()
        .scale()
        .zoomLevels([
          [
            // {unit: "month", count: 1},
            { unit: "day", count: 1 }
            // {unit: "quarter", count: 1}
          ]
        ]);
      this.chart.container("container");
      this.chart.draw();

      this.chart.fitToTask();
      // this.componentKey++
    },
    collapseAll() {
      this.chart.collapseAll();
    },

    clearSearch() {
      this.progressCircle = true;
      this.searchImages = "";
      this.showGant = false;
      this.tasks = this.tasks2;
      setTimeout(() => {
        this.showGant = true;
        this.progressCircle = false;
      }, 350);
    },
    filterInfo() {
      // this.showGant = false
      if (this.searchImages === "") {
        return this.tasks;
      } else {
        return this.tasks.filter(el => {
          return (
            !this.searchImages ||
            el.block.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
              -1 ||
            el.unit.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
              -1 ||
            el.taskName.toLowerCase().indexOf(this.searchImages.toLowerCase()) >
              -1
          );
        });
      }
    },

    async getTasks() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getAllTasksforGant`,
        data: data
      })
        .then(response => {
          console.log(response.data);
          let finalFixArray = [];
          let fixArray = [];
          response.data.forEach(el => {
            fixArray.push(el.parentId);
            let dependsOn = [];
            if (el.dependantOn !== "null") {
              dependsOn.push(parseInt(el.dependantOn));
              el.dependentOn = dependsOn;
            } else {
              el.dependentOn = null;
            }
            // console.log(el.dependentOn)
          });
          fixArray = Array.from(new Set(fixArray));
          // console.log(fixArray);
          fixArray.forEach(el => {
            let dataStartArray = response.data.filter(el2 => {
              return el2.parentId === el;
            });
            let startDate = [];
            let endDate = [];
            let userArr = [];
            let progress = [];

            dataStartArray.forEach(el3 => {
              startDate.push(el3.startDate);
              endDate.push(el3.endDate);
              userArr.push(el3.supplier);
              progress.push(el3.progress);
            });
            let finalProgress =
              progress.reduce((prev, el) => {
                return prev + el;
              }, 0) / progress.length;
            startDate = Array.from(new Set(startDate));
            startDate.sort();
            endDate = Array.from(new Set(endDate));
            endDate.sort();
            let start = dayjs(startDate[0]).format("YYYY-MM-DD HH:mm:ss");
            let duration = dayjs(endDate[endDate.length - 1]).diff(
              dayjs(startDate[0])
            );

            userArr = Array.from(new Set(userArr));
            console.log(userArr[0]);
            let insert = {
              id: el,
              label: `${dataStartArray[0].taskName}: Unit ${dataStartArray[0].unitName} - ${dataStartArray[0].fix} Fix`,
              start: start,
              duration: duration,
              block: dataStartArray[0].subsectionName,
              unit: dataStartArray[0].unitName,
              taskName: dataStartArray[0].taskName,
              percent: finalProgress,
              user: userArr[0],
              type: "milestone",
              collapsed: true,
              style: {
                base: {
                  fill: "#8E44AD",
                  stroke: "#7E349D"
                }
              }
            };
            // console.log(insert);
            finalFixArray.push(insert);
          });
          finalFixArray.forEach((el, index, arr) => {
            if (index !== 0) {
              if (el.user == arr[index - 1].user) {
                // console.log("match", el.id, arr[index - 1].id)
                let depArr = [];
                depArr.push(arr[index - 1].id);
                el.dependentOn = depArr;
                console.log(el.dependentOn);
              } else {
                // el.dependentOn = null
                // console.log("mismatch")
              }
            }
          });

          response.data.forEach(el => {
            let duration = dayjs(el.endDate).diff(dayjs(el.startDate));

            let dependsOn = [];
            if (el.dependantOn !== "null") {
              dependsOn.push(parseInt(el.dependantOn));
              // el.dependentOn = dependsOn
            } else {
              el.dependentOn = null;
            }
            let insert = {
              id: el.id,
              user: el.supplier,
              label: el.taskDescription,
              dependentOn: dependsOn,
              parentId: el.parentId,
              start: el.startDate,
              duration: duration,
              percent: el.progress,
              type: "task",
              block: el.subsectionName,
              unit: el.unitName,
              taskName: el.taskName
            };
            finalFixArray.push(insert);
          });

          console.log(finalFixArray);
          this.tasks = finalFixArray;
          this.tasks2 = finalFixArray;
          // setTimeout(() => {
          this.showGant = true;
          this.progressCircle = false;
          // }, 500);
        })
        .catch(e => {
          console.log(e);
        });
    },
    // addTask() {
    //   this.tasks.push({
    //     id: this.lastId++,
    //     label:
    //       '<a href="https://images.pexels.com/photos/423364/pexels-photo-423364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" target="_blank" style="color:#0077c0;">Yeaahh! you have added a task bro!</a>',
    //     user:
    //       '<a href="https://images.pexels.com/photos/423364/pexels-photo-423364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" target="_blank" style="color:#0077c0;">Awesome!</a>',
    //     start: getDate(24 * 3),
    //     duration: 1 * 24 * 60 * 60 * 1000,
    //     percent: 50,
    //     type: "project",
    //   });
    // },
    tasksUpdate(tasks) {
      this.tasks = tasks;
    },
    optionsUpdate(options) {
      this.options = options;
    },
    styleUpdate(style) {
      this.dynamicStyle = style;
    }
  }
};
</script>

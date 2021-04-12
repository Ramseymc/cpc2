<template>
  <div>
    <v-card class="mx-auto" width="100%" v-if="showFilter">
      <v-toolbar height="220" class="ml-4 mr-4">
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              v-model="blockChosen"
              :items="items"
              item-text="block"
              dense
              filled
              label="Block"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="unitChosen"
              :items="items"
              item-text="unit"
              dense
              filled
              label="Unit"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="taskChosen"
              :items="items"
              item-text="task"
              dense
              filled
              label="Task"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-btn @click="clearFilter">Clear</v-btn>
          </v-col>
        </v-row>
      </v-toolbar>
    </v-card>

    <div v-if="!showProgress">
      <v-btn text @click="showAll" style="margin: 20px;"
        ><v-icon color="black">{{ showFilterIcon }}</v-icon
        >Filter</v-btn
      >
      <v-btn text @click="changeChart" style="margin: 20px;"
        ><v-icon color="purple">{{ headerLevelIcon }}</v-icon>
        {{ headerLevel ? "Day" : "Week" }}</v-btn
      >
      <v-btn text @click="collapseAll" style="margin: 20px;"
        ><v-icon color="green">{{ collapsedIcon }}</v-icon>
        {{ collapsed ? "Expand" : "Collapse" }}
      </v-btn>
      <v-btn text @click="hideGrid" style="margin: 20px;"
        ><v-icon :color="showGridColor">{{ showGridIcon }}</v-icon>
        {{ showGrid ? "Hide Grid" : "Show Grid" }}
      </v-btn>
      <v-btn text  style="margin: 20px;" @click="legendDialog = true"
        ><v-icon color="red">mdi-map-legend</v-icon>
        
      </v-btn>
    </div>
    <v-progress-circular
      style="margin-top: 100px;"
      v-if="showProgress"
      :size="100"
      :width="15"
      color="purple"
      indeterminate
    ></v-progress-circular>
    <div
      id="container"
      style="height: 100vh; width: 100vw; display: flex; justify-content: center; padding: 20px;"
    >
      <section class="chart-container">
        <VueAnychart :key="componentKey" />
      </section>
    </div>
    <v-row justify="center">
    <v-dialog
      v-model="legendDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          Legend
        </v-card-title>
        <v-card-text>
           <strong><u>Top Line - Actual Progess</u></strong><br>
          <div style="width: 100%;height: 25px; background-color: blue; color: white;"><strong>Progress to date</strong></div> 
          <div style="width: 100%;height: 25px; background-color: black;opacity: 0.7; color: white;"><strong>Not yet done</strong></div><br> 
          <strong><u>Bottom Line - baseline</u></strong><br>
          <div style="width: 100%;height: 25px; background-color: lime; color: black;"><strong>Task within budgetted timeline</strong></div> 
          <div style="width: 100%;height: 25px; background-color: red; color: white;"><strong>Task pushed out in time</strong></div> 
          <div style="width: 100%;height: 25px; background-color: orange; color: black;"><strong>Task in timeline but previous pushed out</strong></div> 
          <div style="width: 100%;height: 25px; background-color: blue; color: white;"><strong>Task timeline reduced</strong></div>
         
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="black darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn> -->
          <v-btn
            color="black darken-1"
            text
            @click="legendDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
  
</template>

<script>
/* eslint-disable */

import VueAnychart from "@/components/VueAnychart";
import Anychart from "anychart";
import dayjs from "dayjs";
import businessDays from "dayjs-business-days";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;

const options1 = {
  holidays: [
    "2021-04-02",
    "2021-04-05",
    "2021-04-27",
    "2021-06-16",
    "2021-08-09",
    "2021-09-24",
    "2021-12-16",
    "2021-12-27",
  ],
  holidayFormat: "YYYY-MM-DD",
};
dayjs.extend(businessDays, options1);

export default {
  name: "App",
  components: {
    VueAnychart,
  },
  data() {
    return {
      anychart: Anychart,
      chart: null,
      treeData: null,
      componentKey: 0,
      showGrid: true,
      showGridIcon: "mdi-grid-off",
      showGridColor: "red",
      collapsed: true,
      collapsedIcon: "mdi-arrow-expand-vertical",
      showFilter: false,
      showFilterIcon: "mdi-filter",
      headerLevel: true,
      headerLevelIcon: "mdi-calendar-today",
      data: [],
      data2: [],

      items: [],
      tasks: [],
      blockChosen: "",
      unitChosen: "",
      taskChosen: "",
      showProgress: true,
      legendDialog: false
    };
  },
  watch: {
    unitChosen: function() {
      if (this.unitChosen !== "") {
        this.data = this.data.filter((el) => {
          return el.unit === this.unitChosen;
        });
        this.chart.dispose();
        this.chart = null;
        this.createChart();
      }
    },
    taskChosen: function() {
      if (this.taskChosen !== "") {
        this.data = this.data.filter((el) => {
          return el.taskName === this.taskChosen;
        });
        this.chart.dispose();
        this.chart = null;
        this.createChart();
      }
    },
    blockChosen: function() {
      if (this.blockChosen !== "") {
        this.data = this.data.filter((el) => {
          return el.block === this.blockChosen;
        });
        this.chart.dispose();
        this.chart = null;
        this.createChart();
      }
    },
  },
  async mounted() {
    await this.getTasks();
    await this.createChart();
  },
  methods: {
    createChart() {
      console.time("Create Chart");
      this.treeData = anychart.data.tree(this.data, "as-tree");
      this.chart = anychart.ganttProject();
      this.chart.data(this.treeData);
      this.chart.defaultRowHeight(18);
      this.chart.headerHeight(40);
      this.chart.splitterPosition("19%");
      this.chart.zoomIn(5);
      var marker_1 = this.chart.getTimeline().lineMarker(1);
      marker_1.value(new Date());
      marker_1.stroke("4 #dd2c00");
      this.chart
        .dataGrid()
        .column(0)
        .width(35);
      this.chart
        .dataGrid()
        .column(1)
        .width(220);
      this.chart
        .getTimeline()
        .scale()
        .zoomLevels([
          [
            { unit: "week", count: 1 },
            { unit: "month", count: 1 },
          ],
        ]);

      var dataGrid = this.chart.dataGrid();
      dataGrid.rowEvenFill("gray 0.3");
      dataGrid.rowOddFill("gray 0.1");
      dataGrid.rowHoverFill("#ffd54f 0.3");
      dataGrid.rowSelectedFill("#ffd54f 0.3");
      dataGrid.columnStroke("2 #64b5f6");
      dataGrid.headerFill("#64b5f6 0.2");

      var timeline = this.chart.getTimeline();
      timeline.rowEvenFill("gray 0.3");
      timeline.rowOddFill("gray 0.1");
      timeline.rowHoverFill("#ffd54f 0.3");
      timeline.rowSelectedFill("#ffd54f 0.3");
      timeline.columnStroke(null);

      var header = this.chart.getTimeline().header();
      header.fill("#64b5f6 0.2");
      header.stroke("#64b5f6");
      header.fontColor("#64b5f6");
      header.fontWeight(600);
      // header.rowHeight(18)

      header.level(0).format("{%tickValue}{dateTimeFormat:dd}");
      this.chart.xScale().minimum(this.data[0].actualStart);
      this.chart.xScale().maximum(this.data[this.data.length - 1].actualEnd);

      this.chart.zoomTo("day", 50, "firstDate");

      var title = this.chart.title();
      title.enabled(true);
      title.text(`${this.blockChosen} ${this.unitChosen} ${this.taskChosen}`);
      title.fontColor("#64b5f6");
      title.fontSize(18);
      title.fontWeight(600);
      title.padding(5);

      var baselines = this.chart.getTimeline().baselines();
      baselines.normal().fill("#dd2c00 0.3");
      baselines.normal().stroke(null);
      baselines.selected().fill("#ef6c00 0.3");
      baselines.selected().stroke(null);
      baselines.above(false);

      var connectors = this.chart.getTimeline().connectors();
      connectors.normal().fill("#ffa000");
      connectors.selected().fill("#ef6c00");
      connectors.normal().stroke("2 #ffa000");
      connectors.selected().stroke("2 #ef6c00");

      this.chart.xScale().minimum(this.data[0].actualStart);
      this.chart.xScale().maximum(this.data[this.data.length - 1].actualEnd);

      // Set zoom to range.
      this.chart.zoomTo("day", 50, "firstDate");

      this.chart.container("container");
      this.chart.draw();
      // this.chart.fitAll();
      this.chart.collapseAll();

      this.chart.fitToTask();
      this.showProgress = false;
      console.timeEnd("Create Chart");
    },
    clearFilter() {
      this.showProgress = true;
      this.unitChosen = "";
      this.blockChosen = "";
      this.taskChosen = "";
      this.data = this.data2;
      this.chart.dispose();
      this.chart = null;
      this.createChart();
      this.showAll();
    },
    hideGrid() {
      this.showGrid = !this.showGrid;
      this.chart.dataGrid(this.showGrid);
      if (this.showGrid) {
        this.showGridIcon = "mdi-grid-off";
        this.showGridColor = "red";
      } else {
        this.showGridIcon = "mdi-grid";
        this.showGridColor = "green";
      }
    },
    changeChart() {
      this.headerLevel = !this.headerLevel;
      if (!this.headerLevel) {
        this.headerLevelIcon = "mdi-calendar-week";
        var header = this.chart.getTimeline().header();
        header.level(0).format("{%tickValue}{dateTimeFormat:dd}");
        this.chart.xScale().minimum(this.data[0].actualStart);
        this.chart.xScale().maximum(this.data[this.data.length - 1].actualEnd);

        // Set zoom to range.
        this.chart.zoomTo("day", 50, "firstDate");
      } else {
        this.headerLevelIcon = "mdi-calendar-today";
        this.chart
          .getTimeline()
          .scale()
          .zoomLevels([
            [
              { unit: "week", count: 1 },
              { unit: "month", count: 1 },
            ],
          ]);
        header.level(0).format("{%tickValue}{dateTimeFormat:dd}");
        this.chart.xScale().minimum(this.data[0].actualStart);
        this.chart.xScale().maximum(this.data[this.data.length - 1].actualEnd);
        this.chart.zoomTo("day", 50, "firstDate");
      }
      this.chart
        .getTimeline()
        .scale()
        .zoomLevels([[{ unit: "day", count: 1 }]]);
      this.chart.container("container");
      this.chart.draw();

      this.chart.fitToTask();
    },
    collapseAll() {
      this.$nextTick(() => {
        if (this.collapsed) {
          this.collapsed = !this.collapsed;
          this.collapsedIcon = "mdi-arrow-collapse-vertical";
          this.chart.expandAll();
        } else {
          this.collapsed = !this.collapsed;
          this.collapsedIcon = "mdi-arrow-expand-vertical";
          this.chart.collapseAll();
        }
      });
    },
    showAll() {
      this.showFilter = !this.showFilter;
      if (this.showFilter) {
        this.showFilterIcon = "mdi-filter-off";
      } else {
        this.showFilterIcon = "mdi-filter";
      }
    },
    async getTasks() {
      let data = {
        id: this.$store.state.development.id,
      };
      await axios({
        method: "post",
        url: `${url}/getAllTasksforGant`,
        data: data,
      })
        .then((response) => {
          console.time("TimeThis");
          console.log(response.data)
          let finalFixArray = [];
          let fixArray = [];
          response.data.forEach((el) => {
            fixArray.push(el.parentId);
            let dependsOn = [];
            if (el.dependantOn !== "null") {
              dependsOn.push(parseInt(el.dependantOn));
              el.dependentOn = dependsOn;
            } else {
              el.dependentOn = null;
            }
          });
          fixArray = Array.from(new Set(fixArray));
          fixArray.forEach((el, index) => {
            let dataStartArray = response.data.filter((el2) => {
              return el2.parentId === el;
            });
            let startDate = [];
            let endDate = [];
            let baseStartDate = [];
            let baseEndDate = [];
            let userArr = [];
            let progress = [];

            dataStartArray.forEach((el3) => {
              startDate.push(el3.startDate);
              endDate.push(el3.endDate);
              userArr.push(el3.supplier);
              progress.push(el3.progress);
              baseStartDate.push(el3.baselineStartDate);
              baseEndDate.push(el3.baselineEndDate);
            });
            let finalProgress =
              progress.reduce((prev, el) => {
                return prev + el;
              }, 0) / progress.length;
            startDate = Array.from(new Set(startDate));
            startDate.sort();
            endDate = Array.from(new Set(endDate));
            endDate.sort();
            baseStartDate = Array.from(new Set(baseStartDate));
            baseStartDate.sort();
            baseEndDate = Array.from(new Set(baseEndDate));
            baseEndDate.sort();

            let start = dayjs(startDate[0]).format("YYYY-MM-DD HH:mm:ss");
            let duration = dayjs(endDate[endDate.length - 1]).diff(
              dayjs(startDate[0])
            );
            let end = dayjs(endDate[endDate.length - 1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            let baselineStart = dayjs(baseStartDate[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            let baselineEnd = dayjs(baseEndDate[baseEndDate.length - 1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            userArr = Array.from(new Set(userArr));
            let diffEndDate = dayjs(end).businessDiff(dayjs(baselineEnd), "d");
            let diffStartDate = dayjs(start).businessDiff(
              dayjs(baselineStart),
              "d"
            );
            let color;
            if (diffEndDate > diffStartDate && diffStartDate == 0) {
              color = "#F44336";
            } else if (diffEndDate === diffStartDate && diffEndDate > 0) {
              color = "#F57C00";
            } else if (diffEndDate < diffStartDate && diffStartDate > 0) {
              color = "#40C4FF";
            } else {
              color = "lime";
              // color = "#4CAF50";
            }
            let totalCost = dataStartArray.reduce((prev, el) => {
              return el.price + prev;
            }, 0);
            let totalDone = dataStartArray.reduce((prev, el) => {
              return (el.price * el.progress) / 100 + prev;
            }, 0);
            let finalPercentage = `${(totalDone / totalCost) * 100}%`;
            let baseline = { fill: `${color} 0.8`, stroke: `0.9 ${color}` };
            let insert = {
              id: el,
              name: `${dataStartArray[0].taskName}: Unit ${dataStartArray[0].unitName} - ${dataStartArray[0].fix} Fix`,
              actualStart: start,
              actualEnd: end,
              baselineStart: baselineStart,
              baselineEnd: baselineEnd,
              baseline: baseline,
              duration: duration,
              fix: dataStartArray[0].fix,
              block: dataStartArray[0].subsectionName,
              unit: dataStartArray[0].unitName,
              taskName: dataStartArray[0].taskName,
              percent: finalProgress,
              user: userArr[0],
              progressValue: finalPercentage,
              children: [],
            };
            finalFixArray.push(insert);
          });

          finalFixArray.forEach((el, index, arr) => {
            if (index !== 0) {
              if (el.user == arr[index - 1].user) {
                let depArr = [];
                depArr.push(arr[index - 1].id);
                el.dependentOn = depArr;
              }
            }
          });

          finalFixArray.forEach((el, index, arr) => {
            if (index < arr.length - 1) {
              if (el.user == arr[index + 1].user) {
                el.connectTo = arr[index + 1].id;
                el.connectorType = "finish-start";
              }
            }
          });
          finalFixArray.forEach((el) => {
            let filtered = response.data.filter((el2) => {
              return (
                el.block === el2.subsectionName &&
                el.unit === el2.unitName &&
                el.taskName === el2.taskName &&
                el.fix === el2.fix
              );
            });
            filtered.forEach((el3) => {
              let diffEndDate = dayjs(el3.endDate).businessDiff(
                dayjs(el3.baselineEndDate),
                "d"
              );
              let diffStartDate = dayjs(el3.startDate).businessDiff(
                dayjs(el3.baselineStartDate),
                "d"
              );
              let color;
              if (diffEndDate > diffStartDate && diffStartDate == 0) {
                color = "#F44336";
              } else if (diffEndDate === diffStartDate && diffEndDate > 0) {
                color = "#F57C00";
              } else if (diffEndDate < diffStartDate && diffStartDate > 0) {
                color = "#40C4FF";
              } else {
                // color = "#4CAF50";
                color = "lime";
              }
              let baseline = { fill: `${color} 0.8`, stroke: `0.9 ${color}` };
              let insert = {
                id: el3.id,
                name: el3.taskDescription,
                actualStart: el3.startDate,
                actualEnd: el3.endDate,
                baselineStart: el3.baselineStartDate,
                baselineEnd: el3.baselineEndDate,
                baseline: baseline,
                progressValue: `${el3.progress}%`,
              };
              el.children.push(insert);
            });
          });
          finalFixArray.forEach((el) => {
            el.children.forEach((el2, index, arr) => {
              if (index < arr.length - 1) {
                el2.connectTo = arr[index + 1].id;
                el2.connectorType = "finish-start";
              } 
              // else {
              //   console.log("Err", index, arr.length);
              // }
            });

          });

          // console.log(finalFixArray);

          this.tasks = finalFixArray;
          this.data = finalFixArray;
          console.log(this.data)
          this.data2 = finalFixArray;
          this.items = [];
          response.data.forEach((el) => {
            let insert = {
              block: el.subsectionName,
              unit: el.unitName,
              task: el.taskName,
            };
            this.items.push(insert);
          });
          console.timeEnd("TimeThis");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="css">

</style>

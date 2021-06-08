<template>
  <div>
    <br /><br />
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
              @change="changeBlock"
              :readonly="blockDisabled"
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
              :readonly="unitDisabled"
              @change="changeUnit"
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
              @change="changeTask"
              :readonly="taskDisabled"
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
      <v-btn text style="margin: 20px;" @click="legendDialog = true"
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
      <v-dialog v-model="legendDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">
            Legend
          </v-card-title>
          <v-card-text>
            <strong><u>Top Line - Actual Progess</u></strong
            ><br />
            <div
              style="width: 100%;height: 25px; background-color: blue; color: white;"
            >
              <strong>Progress to date</strong>
            </div>
            <div
              style="width: 100%;height: 25px; background-color: black;opacity: 0.7; color: white;"
            >
              <strong>Not yet done</strong>
            </div>
            <br />
            <strong><u>Bottom Line - baseline</u></strong
            ><br />
            <div
              style="width: 100%;height: 25px; background-color: lime; color: black;"
            >
              <strong>Task within budgetted timeline</strong>
            </div>
            <div
              style="width: 100%;height: 25px; background-color: red; color: white;"
            >
              <strong>Task pushed out in time</strong>
            </div>
            <div
              style="width: 100%;height: 25px; background-color: orange; color: black;"
            >
              <strong>Task in timeline but previous pushed out</strong>
            </div>
            <div
              style="width: 100%;height: 25px; background-color: blue; color: white;"
            >
              <strong>Task timeline reduced</strong>
            </div>
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
            <v-btn color="black darken-1" text @click="legendDialog = false">
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
      legendDialog: false,
      unitDisabled: false,
      blockDisabled: false,
      taskDisabled: false
    };
  },
  computed: {
    itemsFiltered() {
      if (this.unitChosen !== "") {
        return this.items;
      } else {
        return this.items.filter(el => {
          return (
            el.unitName = this.unitChosen
          );
        });
      }
    }
  },
  watch: {
    // itemsFiltered: function() {
    //   if (this.unitChosen !== "") {
    //     this.itemsFiltered = this.items.filter((el) => {
    //       return el.unitName === this.unitChosen
    //     })
    //   }
    // },
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
    this.processNotifications()
  },
  methods: {
    changeBlock() {

      this.blockDisabled = true
      this.items = this.items.filter((el) => {
        return el.block = this.blockChosen
      })
    },
    changeUnit() {
   
      this.unitDisabled = true
      this.items = this.items.filter((el) => {
        return el.unit = this.unitChosen
      })
      
    },
    changeTask() {
 
      this.taskDisabled = true
      this.items = this.items.filter((el) => {
        return el.task = this.taskChosen
      })

    },
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
      this.items = []
      this.data.forEach((el) => {
            let insert = {
              block: el.subsectionName,
              unit: el.unitName,
              task: el.taskName,
            };
            this.items.push(insert);
          });
      // this.items = this.itemsDuplicated
      this.blockDisabled = false
      this.unitDisabled = false
      this.taskDisabled = false
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
          console.time("Time Get Data");

      await axios({
        method: "post",
        url: `${url}/getAllTasksforGant`,
        data: data,
      })
        .then((response) => {
          
   
          this.data2 = []
          this.tasks = response.data;
          this.data = response.data;
          this.data.forEach((el) => {
            this.data2.push(el)
          })

          console.log(this.data)

          this.items = [];
          response.data.forEach((el) => {
            let insert = {
              block: el.subsectionName,
              unit: el.unitName,
              task: el.taskName,
            };
            this.items.push(insert);
          });
          // console.timeEnd("Create Filter Data")
          this.itemsDuplicated = []
          this.items.forEach((el) => {
            this.itemsDuplicated.push(el)
          })
        
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

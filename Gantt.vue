<template>
  <div ref="gantt"></div>
</template>

<script>
import { gantt } from "dhtmlx-gantt";
export default {
  name: "gantt",
  props: {
    showGrid: Number,
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      },
    },
  },
  watch: {
    showGrid: function() {
      // gantt.config.grid_width = this.showGrid;
      console.log("gridWith Changed", this.showGrid)
      // this.$forceUpate();

      //   setTimeout(() => {
      //   this.$nextTick(() => {
      //   this.loadGantt()

      //   })
      //   },1000)
    },
  },
  //   computed: {
  // computed: {
  //         // Or use a computed property if only accessing it in the script
  //         // getUser() {
  //         //     return gantt.config.grid_width = this.showGrid;
  //         // }
  //     }
  //   },
  updated() {
    // this.loadGantt()
    this.$forceUpate();
  },
  mounted() {
    this.loadGantt();
    // gantt.config.xml_date = "%Y-%m-%d";
    // gantt.config.highlight_critical_path = true;
    // gantt.config.grid_width = this.showGrid;
    // gantt.attachEvent("onTaskSelected", (id) => {
    //   let task = gantt.getTask(id);
    //   this.$emit("task-selected", task);
    // });
    // gantt.attachEvent("onTaskIdChange", (id, new_id) => {
    //   if (gantt.getSelectedId() == new_id) {
    //     let task = gantt.getTask(new_id);
    //     this.$emit("task-selected", task);
    //   }
    // });
    // gantt.init(this.$refs.gantt);
    // gantt.createDataProcessor((entity, action, data, id) => {
    //   this.$emit(`${entity}-updated`, id, action, data);
    // });
    // gantt.parse(this.$props.tasks);
  },
  methods: {
    showLeftGrid() {
      return (gantt.config.grid_width = this.showGrid);
    },
    loadGantt() {
      gantt.config.grid_width = this.showGrid;
      gantt.config.xml_date = "%Y-%m-%d";
      gantt.config.highlight_critical_path = true;
      gantt.config.grid_width = this.showGrid;
      gantt.attachEvent("onTaskSelected", (id) => {
        let task = gantt.getTask(id);
        this.$emit("task-selected", task);
      });
      gantt.attachEvent("onTaskIdChange", (id, new_id) => {
        if (gantt.getSelectedId() == new_id) {
          let task = gantt.getTask(new_id);
          this.$emit("task-selected", task);
        }
      });
      
      gantt.init(this.$refs.gantt);
      gantt.createDataProcessor((entity, action, data, id) => {
        this.$emit(`${entity}-updated`, id, action, data);
      });
      gantt.parse(this.$props.tasks);
      console.log("Now",this.showGrid);
    },
  },
};
</script>

<style>
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>

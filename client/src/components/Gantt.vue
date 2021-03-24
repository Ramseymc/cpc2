<template>
  <div ref="gantt"></div>
</template>

<script>
import { gantt } from "dhtmlx-gantt";
export default {
  name: "gantt",
  props: {
    showGrid: Boolean,
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      }
    }
  },
  watch: {
    // showGrid: function() {
    //   console.log("gridWith Changed", this.showGrid)
    //   gantt.config.grid_width = 450;
    //   gantt.config.show_grid = this.showGrid;
    //   // console.log(gantt.config.grid_width)
    // },
  },
  beforeMount() {
    gantt.config.grid_width = 350;
    gantt.config.show_grid = this.showGrid;
    gantt.config.auto_scheduling = true;
    gantt.config.columns = [
      { name: "text", tree: true, width: "*", resize: true },
      { name: "start_date", align: "center", resize: true },
      { name: "duration", align: "center", resize: true }
      // { name: "add", width: 44 },
      // { name: "dependencies", align: "center", resize: true },
    ];
    //  gantt.config.task_height = 10
    // gantt.task.color = "red";
    //     .gantt_task_line.gantt_task_inline_color .gantt_task_progress {
    //     background-color: rgb(54, 54, 54);
    //     opacity: 0.2;
    // }

    // var markerId = gantt.addMarker({
    //   start_date: new Date(),
    //   css: "today",
    //   text: "Now",
    //   title:new Date().toISOString().substr(0,10),
    // });
    // gantt.getMarker(markerId);
  },
  mounted() {
    this.loadGantt();
  },
  methods: {
    loadGantt() {
      gantt.config.xml_date = "%Y-%m-%d";

      gantt.plugins({
        marker: true,
        auto_scheduling: true
      });

      var date_to_str = gantt.date.date_to_str(gantt.config.task_date);

      var id = gantt.addMarker({
        start_date: new Date(),
        css: "today",
        title: date_to_str(new Date())
      });
      var timer = setInterval(function() {
        var today = gantt.getMarker(id);
        if (!today) {
          clearInterval(timer);
          return;
        }
        today.start_date = new Date();
        today.title = date_to_str(today.start_date);
        gantt.updateMarker(id);
      }, 1000 * 60);

      gantt.config.highlight_critical_path = true;
      gantt.config.grid_width = this.showGrid;
      gantt.attachEvent("onTaskSelected", id => {
        let task = gantt.getTask(id);
        this.$emit("task-selected", task);
      });
      gantt.attachEvent("onTaskIdChange", (id, new_id) => {
        if (gantt.getSelectedId() == new_id) {
          let task = gantt.getTask(new_id);
          this.$emit("task-selected", task);
        }
      });
      // 3333333333333
      gantt.attachEvent("onTaskDrag", function(id, mode, task, original){
          var modes = gantt.config.drag_mode;
          console.log(task)
          console.log(original)
          if(mode == modes.move){
              var diff = task.start_date - original.start_date;
              // console.log(diff)
              gantt.eachTask(function(child){
                console.log("Hello:",child)
                  child.start_date = new Date(+child.start_date + diff);
                  console.log(child.start_date)
                  child.end_date = new Date(+child.end_date + diff);
                  gantt.refreshTask(child.id, true);
              },id );
          }
      });
      //rounds positions of the child items to scale
      gantt.attachEvent("onAfterTaskDrag", function(id, mode){
          var modes = gantt.config.drag_mode;
          console.log(mode)
          if(mode == modes.move ){
              var state = gantt.getState();
              console.log(state)
              gantt.eachTask(function(child){
                console.log("Hello:",child)

                  child.start_date = gantt.roundDate({
                      date:child.start_date,
                      unit:state.scale_unit,
                      step:state.scale_step
                  });
                  child.end_date = gantt.calculateEndDate(child.start_date,
                      child.duration, gantt.config.duration_unit);
                  gantt.updateTask(child.id);
              },id );
          }
      });

      // 3333333333333

      // gantt.config.grid_width = 350;

      gantt.init(this.$refs.gantt);
      gantt.createDataProcessor((entity, action, data, id) => {
        this.$emit(`${entity}-updated`, id, action, data);
      });
      gantt.parse(this.$props.tasks);
    }
  }
};
</script>

<style>
/* @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css"; */
/* @import "../../node_modules/dhtmlx-gantt/codebase/skins/dhtmlxgantt_broadway.css"; */
@import "../../node_modules/dhtmlx-gantt/codebase/skins/dhtmlxgantt_meadow.css";
/* dhtmlxgantt_broadway.css */
</style>

<template>
  <div>
    <svg ref="gantt" />
  </div>
</template>

<script>
// import * as moment from "moment/moment";
import Gantt from "frappe-gantt";
export default {
  name: "FrappeGantt",
  props: {
    viewMode: {
      type: String,
      required: false,
      default: "Day"
    },
    tasks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      gantt: {}
    };
  },
  watch: {
    viewMode() {
      this.updateViewMode();
    },
    tasks() {
      this.updateTasks();
    }
  },
  mounted() {
    this.setupGanttChart();
  },
  methods: {
    setupGanttChart() {
      // const options = {
      //   header_height: 50,
      //   column_width: 30,
      //   step: 24,
      //   view_modes: ["Quarter Day", "Half Day", "Day", "Week", "Month"],
      //   bar_height: 10,
      //   bar_corner_radius: 3,
      //   arrow_curve: 5,
      //   padding: 18,
      //   view_mode: "Day",
      //   date_format: "YYYY-MM-DD",
      //   custom_popup_html: null,
      // };
      this.gantt = new Gantt(this.$refs.gantt, this.tasks, {
        header_height: 50,
        column_width: 30,
        bar_height: 20,
        step: 24,
        arrow_curve: 5,
        bar_corner_radius: 3,
        date_format: "YYYY-MM-DD HH:mm",
        padding: 18,
        on_click: task => {
          this.$emit("task-updated", task);
        },
        on_date_change: (task, start, end) => {
          this.$emit("task-date-updated", { task, start, end });
        },
        on_progress_change: (task, progress) => {
          this.$emit("task-progress-updated", { task, progress });
        }
      });
      this.updateTasks();
      this.updateViewMode();
    },
    updateViewMode() {
      this.gantt.change_view_mode(
        this.viewMode[0].toUpperCase() + this.viewMode.substring(1)
      );
    },
    updateTasks() {
      this.gantt.refresh(this.tasks);
    }
  }
};
</script>

<style scoped>
@import "../../node_modules/frappe-gantt/dist/frappe-gantt.css";
.details-containerA {
  background-color: red;
  color: red;
}
</style>

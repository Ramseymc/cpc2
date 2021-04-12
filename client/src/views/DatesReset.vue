<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1>ResetDates</h1>
        <v-btn @click="resetTasks">Reset Tasks</v-btn><br /><br />
        <v-btn @click="resetData">Reset Data</v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" absolute center color="blue" shaped top>
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script>
// import PDFViewer from "../components/PDFViewer"
import dayjs from "dayjs";
import businessDays from "dayjs-business-days";

// dayjs.extend(dayjsBusinessDays);
// const goodFriday = "2021-04-02"
// const easterMonday = "2021-04-05"

const options = {
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
dayjs.extend(businessDays, options);
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "DateReset",
  components: {
    // PDFViewer,
    // PDFViewer: () => import("../components/PDFViewer")
  },
  metaInfo: {
    title: "About us",
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
      // getComponent: false,
      // showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      // showFileName: "Elec-Elec-001",
      // showPDF: true
      tasks: [],
      snackbar: false,
      snackbarMessage: ""
    };
  },
  async mounted() {
    // let data = {
    //     allTasks: progress
    //   };
    console.log(dayjs("2021-04-02").isHoliday());
    console.log(dayjs("2021-04-05").isHoliday());
    await axios({
      method: "get",
      url: `${url}/getAllTasks`
      // data: data
    })
      .then(response => {
        console.log(response.data);
        this.tasks = response.data;
        // this.dialog = false;

        // if (result.status === 200) {
        //   this.fixes = [];
        //   this.getTasks();
        //   this.dialog = false;
        // }
      })
      .catch(e => {
        console.log(e);
        // this.snackBarMessage = "There was an error, please try again later!";
        // this.snackbar = true;
      });
    // this.dialog = false;
  },
  methods: {
    async resetTasks() {
      console.time("start This");
      let startDate = dayjs("2021-03-25 08:00:00").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let durationDays = 1;
      let workingHours = 9;
      let nextTaskStartDays = 1;
      this.tasks.forEach(function(el, index, arr) {
        el.parentId = `${el.taskType}-${el.supplier}-${el.unitNumber}-${el.fix}`;
        if (index > 0 && index < arr.length) {
          if (
            el.supplier === arr[index - 1].supplier &&
            el.unitNumber === arr[index - 1].unitNumber &&
            el.fix === arr[index - 1].fix
          ) {
            el.dependantOn = [`${arr[index - 1].id}`];
            let update = [];
            el.dependantOn.forEach(el => {
              update.push(parseInt(el));
            });
            el.dependantOn = `${arr[index - 1].id}`;
          } else {
            console.log("Different");
          }
        }
        if (index > 0 && index < arr.length) {
          if (el.supplier === arr[index - 1].supplier) {
            el.startDate = dayjs(arr[index - 1].endDate)
              .businessDaysAdd(nextTaskStartDays)
              .subtract(workingHours, "h")
              .format("YYYY-MM-DD HH:mm:ss");
            el.endDate = dayjs(el.startDate)
              .businessDaysAdd(durationDays)
              .add(workingHours, "h")
              .format("YYYY-MM-DD HH:mm:ss");
            el.duration = dayjs(el.endDate).businessDiff(
              dayjs(el.startDate),
              "d"
            );
          } else {
            el.startDate = startDate;
            el.endDate = dayjs(el.startDate)
              .businessDaysAdd(durationDays)
              .add(workingHours, "h")
              .format("YYYY-MM-DD HH:mm:ss");
            el.duration = dayjs(el.endDate).businessDiff(
              dayjs(el.startDate),
              "d"
            );
          }
        } else {
          el.startDate = startDate;
          el.endDate = dayjs(el.startDate)
            .businessDaysAdd(durationDays)
            .add(workingHours, "h")
            .format("YYYY-MM-DD HH:mm:ss");
          el.duration = dayjs(el.endDate).businessDiff(
            dayjs(el.startDate),
            "d"
          );
        }
      });
      console.log(this.tasks);
      console.timeEnd("start This");
      let info = [];
      this.tasks.forEach(el => {
        let insert = {
          id: el.id,
          startDate: el.startDate,
          endDate: el.endDate,
          duration: el.duration,
          parentId: el.parentId,
          dependantOn: el.dependantOn,
          fix: el.fix
        };
        info.push(insert);
      });
      console.log(info.length);
      while (info.length) {
        let b = info.splice(0, 400);
        console.log(b);
        console.log(info.length);
        let data = {
          info: b
        };
        if (!info.length) {
          this.snackbarMessage = "Dates successfully reset";
          this.snackbar = true;
        }

        //  var formData = new FormData();
        //  formData.append("files", data);
        // console.log(data.length)
        await axios({
          method: "post",
          url: `${url}/postTaskUpdates`,
          data: data
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    async resetData() {
      await axios({
        method: "post",
        url: `${url}/resetData`
      })
        .then(response => {
          console.log(response.data);
          this.snackbarMessage = "Data successfully reset";
          this.snackbar = true;
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

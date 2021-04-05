<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1>ResetDates</h1>
        <v-btn @click="resetTasks">Reset Tasks</v-btn>
        <!-- <v-btn :id="10" icon @click="getPDF($event)"
          ><v-icon color="red">mdi-file-pdf-box</v-icon></v-btn
        >
        <PDFViewer
          :fileName="showFileName"
          :dialog="showPDF"
          :documentName="showSrc"
          v-if="getComponent"
          @update-opened="updateOpened"
        /> -->
      </v-col>
    </v-row>
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
      tasks: []
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
          if (
            el.supplier === arr[index - 1].supplier
          ) {
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
      let data = [];
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
        data.push(insert);
      });
       var formData = new FormData();
       formData.append("files", data);
      // console.log(data.length)
      await axios({
        method: "post",
        url: `${url}/postTaskUpdates`,
        data: formData
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>


Request URL: https://www.cape-projectsbe.co.za/upDateTasksFromProgress
Request Method: POST
Status Code: 200 OK
Remote Address: 172.104.153.244:443
Referrer Policy: strict-origin-when-cross-origin
Accept-Ranges: bytes
Access-Control-Allow-Origin: https://www.cape-projects.co.za
Access-Control-Expose-Headers: sessionId
Age: 0
Connection: keep-alive
Content-Encoding: gzip
Content-Type: application/json; charset=utf-8
Date: Mon, 05 Apr 2021 09:05:21 GMT
ETag: W/"e9c-Ltl3NW7v/sjOqYEsbinvYeMYBvQ"
Status: 200 OK
Transfer-Encoding: chunked
Vary: Origin, Accept-Encoding
X-Cache: MISS
X-Varnish: 194978724
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate, br
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJFbWFpbCI6IndheW5lYnJ1dG9uQGljbG91ZC5jb20iLCJ1c2VyTmFtZSI6IldheW5lIEJydXRvbiIsInVzZXJSb2xlIjoxLCJ1c2VyVGl0bGUiOjEsInVzZXJNb2JpbGUiOiIwNzQgMDYyIDg3NDIiLCJpYXQiOjE2MTcyNjA5MjMsImV4cCI6MTYxNzg2NTcyM30.U1cUEnHji-Cirn9T6voIvBq6Qzk1V3xNu6YqZEf0dgo
Connection: keep-alive
Content-Length: 8723
Content-Type: application/json;charset=UTF-8
Host: www.cape-projectsbe.co.za
Origin: https://www.cape-projects.co.za
Referer: https://www.cape-projects.co.za/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: cross-site
Sec-GPC: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36
[,…]
0: {id: 1, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "Distribution Board",…}
1: {id: 2, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
2: {id: 4, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
3: {id: 7, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "Dual socket (ZAR)",…}
4: {id: 10, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "Stove isolator",…}
5: {id: 11, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "Stove connection",…}
6: {id: 12, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
7: {id: 13, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "Fibre connection",…}
8: {id: 14, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "DSTV connection",…}
9: {id: 15, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "Telco connection",…}
10: {id: 16, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
11: {id: 17, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
12: {id: 18, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
13: {id: 19, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
14: {id: 20, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
15: {id: 21, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
16: {id: 22, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
17: {id: 23, taskType: 1, supplier: 2, retention: 10, unitNumber: 54, taskDescription: "2 Way switchpoint",…}
18: {id: 24, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
19: {id: 25, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
20: {id: 26, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}
21: {id: 27, taskType: 1, supplier: 2, retention: 10, unitNumber: 54,…}


Request URL: https://www.cape-projectsbe.co.za/postTaskUpdates
Referrer Policy: strict-origin-when-cross-origin
Age: 0
Connection: keep-alive
Content-Encoding: gzip
Content-Security-Policy: default-src 'none'
Content-Type: text/html; charset=utf-8
Date: Mon, 05 Apr 2021 09:06:07 GMT
Status: 413 Request Entity Too Large
Transfer-Encoding: chunked
Vary: Accept-Encoding
X-Cache: MISS
X-Content-Type-Options: nosniff
X-Varnish: 194915960
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate, br
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJFbWFpbCI6IndheW5lYnJ1dG9uQGljbG91ZC5jb20iLCJ1c2VyTmFtZSI6IldheW5lIEJydXRvbiIsInVzZXJSb2xlIjoxLCJ1c2VyVGl0bGUiOjEsInVzZXJNb2JpbGUiOiIwNzQgMDYyIDg3NDIiLCJpYXQiOjE2MTcyNjA5MjMsImV4cCI6MTYxNzg2NTcyM30.U1cUEnHji-Cirn9T6voIvBq6Qzk1V3xNu6YqZEf0dgo
Connection: keep-alive
Content-Length: 190908
Content-Type: application/json;charset=UTF-8
Host: www.cape-projectsbe.co.za
Origin: https://www.cape-projects.co.za
Referer: https://www.cape-projects.co.za/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: cross-site
Sec-GPC: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36
[{id: 1, startDate: "2021-03-25 08:00:00", endDate: "2021-03-26 17:00:00", duration: 2,…},…]
[0 … 99]
[100 … 199]
[200 … 299]
[300 … 399]
[400 … 499]
[500 … 599]
[600 … 699]
[700 … 799]
[800 … 899]
[900 … 999]
[1000 … 1099]
[1100 … 1199]
[1200 … 1272]

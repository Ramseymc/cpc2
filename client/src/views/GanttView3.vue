<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4">
        <GanttElastic :tasks="tasks" />
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
function getDate(hours) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const timeStamp = new Date(
    currentYear,
    currentMonth,
    currentDay,
    0,
    0,
    0
  ).getTime();
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}

export default {
  name: "ganttv3",
  components: {
    // PDFViewer,
    GanttElastic: () => import("../components/Gantt3")
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
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      showPDF: true,

      tasks: [
        {
          id: 1,
          label: "Make some noise",
          user:
            '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">John Doe</a>',
          start: getDate(-24 * 5),
          duration: 15 * 24 * 60 * 60 * 1000,
          percent: 85,
          type: "project"
          //collapsed: true,
        },
        {
          id: 2,
          label: "With great power comes great responsibility Yes Baby!!",
          user:
            '<a href="https://www.google.com/search?q=Peter+Parker" target="_blank" style="color:#0077c0;">Peter Parker</a>',
          // parentId: 1,
          start: new Date("2021-03-26"),
          duration: 9 * 24 * 60 * 60 * 1000,
          // duration: 4 * 24 * 60 * 60 * 1000,
          percent: 50,
          type: "milestone",
          collapsed: true,
          style: {
            base: {
              fill: "#1EBC61",
              stroke: "#0EAC51"
            }
          }
        },
        {
          id: 3,
          label: "Courage is being scared to death, but saddling up anyway.",
          user:
            '<a href="https://www.google.com/search?q=John+Wayne" target="_blank" style="color:#0077c0;">John Wayne</a>',
          parentId: 2,
          start: getDate(-24 * 3),
          duration: 2 * 24 * 60 * 60 * 1000,
          percent: 60,
          type: "task",
          dependentOn: [2],
          style: {
            base: {
              fill: "orange",
              stroke: "#0EAC51"
            }
          }
        },
        {
          id: 4,
          label: "Put that toy AWAY!",
          user:
            '<a href="https://www.google.com/search?q=Clark+Kent" target="_blank" style="color:#0077c0;">Clark Kent</a>',
          parentId: 2,
          start: getDate(-24 * 2),
          duration: 2 * 24 * 60 * 60 * 1000,
          percent: 50,
          type: "task",
          dependentOn: [3]
        },
        {
          id: 5,
          label:
            "One billion, gajillion, fafillion... shabadylu...mil...shabady......uh, Yen. Yebo",
          user:
            '<a href="https://www.google.com/search?q=Austin+Powers" target="_blank" style="color:#0077c0;">Austin Powers</a>',
          parentId: 4,
          start: getDate(0),
          duration: 2 * 24 * 60 * 60 * 1000,
          percent: 10,
          type: "milestone",
          style: {
            base: {
              fill: "#0287D0",
              stroke: "#0077C0"
            }
          }
        },
        {
          id: 6,
          label: "Butch Mario and the Luigi Kid",
          user:
            '<a href="https://www.google.com/search?q=Mario+Bros" target="_blank" style="color:#0077c0;">Mario Bros</a>',
          parentId: 5,
          start: getDate(24),
          duration: 1 * 24 * 60 * 60 * 1000,
          percent: 50,
          type: "task",
          collapsed: true,
          style: {
            base: {
              fill: "#8E44AD",
              stroke: "#7E349D"
            }
          }
        },
        {
          id: 7,
          label: "Devon, the old man wanted me, it was his dying request",
          user:
            '<a href="https://www.google.com/search?q=Knight+Rider" target="_blank" style="color:#0077c0;">Knight Rider</a>',
          parentId: 2,
          dependentOn: [6],
          start: getDate(24 * 2),
          duration: 4 * 60 * 60 * 1000,
          percent: 20,
          type: "task",
          collapsed: true
        },
        {
          id: 8,
          label: "Hey, Baby! Anybody ever tell you I have beautiful eyes?",
          user:
            '<a href="https://www.google.com/search?q=Johhny+Bravo" target="_blank" style="color:#0077c0;">Johhny Bravo</a>',
          parentId: 7,
          dependentOn: [7],
          start: getDate(24 * 3),
          duration: 1 * 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task"
        },
        {
          id: 9,
          label:
            "This better be important, woman. You are interrupting my very delicate calculations.",
          user:
            '<a href="https://www.google.com/search?q=Dexter\'s+Laboratory" target="_blank" style="color:#0077c0;">Dexter\'s Laboratory</a>',
          parentId: 8,
          dependentOn: [8, 7],
          start: getDate(24 * 4),
          duration: 4 * 60 * 60 * 1000,
          percent: 20,
          type: "task",
          style: {
            base: {
              fill: "#8E44AD",
              stroke: "#7E349D"
            }
          }
        },
        {
          id: 10,
          label: "current task",
          user:
            '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">Johnattan Owens</a>',
          start: getDate(24 * 5),
          duration: 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task"
        },
        {
          id: 11,
          label: "test task1",
          user:
            '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">Johnattan Owens</a>',
          start: getDate(24 * 6),
          duration: 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task",
          dependentOn: [10]
        },
        {
          id: 12,
          label: "test task2",
          user:
            '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">Johnattan Owens</a>',
          start: getDate(24 * 7),
          duration: 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task",
          parentId: 11,
          dependentOn: [11]
        },
        {
          id: 13,
          label: "test task3",
          user:
            '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">Johnattan Owens</a>',
          start: getDate(24 * 8),
          duration: 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task"
          // dependentOn: [12],
        },
        {
          id: 14,
          label: "test task4",
          user:
            '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">Johnattan Owens</a>',
          parentId: 13,
          start: getDate(24 * 9),
          duration: 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task",
          dependentOn: [13]
        },
        {
          id: 15,
          label: "test task5",
          user:
            '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">Johnattan Owens</a>',
          parentId: 13,
          start: getDate(24 * 16),
          duration: 24 * 60 * 60 * 1000,
          percent: 0,
          type: "task",
          dependentOn: [14]
        }
      ]
    };
  },
  methods: {
    getPDF(event) {
      let targetId = event.currentTarget.id;
      console.log(targetId);
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    }
  }
};
</script>

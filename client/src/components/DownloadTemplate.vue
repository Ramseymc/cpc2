<template>
  <div>
    <section>
      <!-- <h3>Download Template</h3> -->
      <xlsx-workbook>
        <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in sheets"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download>
          <v-btn text color="#0F0F0F"
            ><strong><u>Download Template</u></strong></v-btn
          >
        </xlsx-download>
      </xlsx-workbook>
    </section>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import {
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload
} from "../../node_modules/vue-xlsx/dist/vue-xlsx.es";

export default {
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
  },
  data() {
    return {
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: [],
      collection: [{ a: 1, b: 2 }]
    };
  },
  async mounted() {
    console.time("getInfo");
    let data = {
      developmentId: this.$store.state.development.id
    };
    await axios({
      method: "post",
      url: `${url}/getDataforTemplate`,
      data: data
    })
      .then(
        response => {
          this.sheets = [];

          let development = {
            name: "Development",
            data: []
          };
          response.data[0].forEach(el => {
            development.data.push(el);
          });
          this.sheets.push(development);

          let subsections = {
            name: "Subsection",
            data: []
          };
          response.data[1].forEach(el => {
            subsections.data.push(el);
          });
          this.sheets.push(subsections);

          let units = {
            name: "Units",
            data: []
          };
          response.data[2].forEach(el => {
            units.data.push(el);
          });
          this.sheets.push(units);

          let taskTypes = {
            name: "TaskType",
            data: []
          };
          response.data[3].forEach(el => {
            taskTypes.data.push(el);
          });
          this.sheets.push(taskTypes);

          let suppliers = {
            name: "Suppliers",
            data: []
          };
          response.data[4].forEach(el => {
            suppliers.data.push(el);
          });
          this.sheets.push(suppliers);
          let tasks = {
            name: "Task",
            data: []
          };
          let taskHeaders = {
            ID: null,
            Dev: null,
            taskId: null,
            TaskName: null,
            UnitId: null,
            Unit: null,
            Description: null,
            Cost: null,
            Quantity: null,
            Price: null,
            Fix: null,
            Duration: null,
            StartDate: null,
            EndDate: null,
            Supplier: null
          };
          tasks.data.push(taskHeaders);
          this.sheets.push(tasks);
        },
        error => {
          console.log("An Error", error);
        }
      )
      .catch(e => {
        console.log(e);
      });
    console.timeEnd("getInfo");
  },
  methods: {}
};
</script>

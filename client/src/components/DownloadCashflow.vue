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
          <v-btn dark text color="#0F0F0F">
            <v-icon color="green">mdi-microsoft-excel</v-icon
            ><strong><u>Download</u></strong>
          </v-btn>
        </xlsx-download>
      </xlsx-workbook>
    </section>
  </div>
</template>
<script>
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
  props: {
    startData: Array
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
  mounted() {
    this.sheets = [];
    let development = {
      name: "Development",
      data: []
    };

    this.startData.forEach(el => {
      let insert = {
        documentType: el.documentType,
        supplierName: el.supplierName,
        dueDate: el.dueDate,
        documentValue: el.documentValue
      };
      development.data.push(insert);
    });
    this.sheets.push(development);
  },
  methods: {}
};
</script>

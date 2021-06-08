<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" cols="10" offset="1">
        <v-data-table
          :headers="headers"
          :items="items"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title style="color: red;"
                >INSTRUCTIONS TO COMMENCE</v-toolbar-title
              >

              <v-divider class="mx-4" inset vertical></v-divider>

              <label>Total: {{ totalITCDone }}</label>
              <v-spacer></v-spacer>

              <v-btn text @click="createITC">Add Instruction</v-btn>
            </v-toolbar>
          </template>
          <!-- @click="viewCertsUnissued" -->
          <template v-slot:item.actions="{ item }">
            <v-btn :id="item.id" icon @click="getPDF($event)"
              ><v-icon color="red">mdi-file-pdf-box</v-icon></v-btn
            >
          </template>
          <template v-slot:item.email="{ item }">
            <v-icon
              v-if="item.sentToSupplier"
              :id="item.id"
              class="mr-2"
              @click="sendStatement($event)"
              color="green"
            >
              mdi-email
            </v-icon>
            <v-icon
              v-else
              :id="item.id"
              class="mr-2"
              @click="sendStatement($event)"
              color="brown"
            >
              mdi-email
            </v-icon>
          </template>
          <template v-slot:item.delete="{ item }">
            <v-btn :id="item.id" icon @click="deleteITC($event)"
              ><v-icon color="green">mdi-trash-can</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top shaped color="blue">
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="850px">
        <v-card>
          <v-card-title>
            <span class="headline">Create ITC</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                    :items="subcontractors"
                    v-model="subcontractorChosen"
                    label="Subcontractors"
                    item-text="supplierName"
                    @change="getTasks"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                    v-if="subcontractorChosen"
                    :items="taskTypes"
                    v-model="taskTypeChosen"
                    item-text="taskName"
                    label="Task"
                    @change="getBlocks"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-autocomplete
                    v-if="taskTypeChosen"
                    :items="blocks"
                    v-model="blockChosen"
                    item-text="subsectionName"
                    label="Block"
                    @change="getUnits"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <!-- :items="units" -->
                  <v-autocomplete
                    v-if="blockChosen"
                    :items="filteredUnits"
                    v-model="unitChosen"
                    item-text="unitName"
                    label="Unit"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-autocomplete
                    v-if="unitChosen"
                    v-model="floorChosen"
                    :items="[
                      'Subsurface',
                      'Ground floor',
                      'First Floor',
                      'Second floor',
                      'Parapet',
                    ]"
                    label="Floor"
                    @change="getValue"
                  ></v-autocomplete>
                </v-col>
                <!-- <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Issuer"
                    disabled
                    v-model="issuer"
                    v-if="floorChosen"
                    outlined
                    filled
                  ></v-text-field>
                </v-col> -->
                <v-col cols="12" sm="12" md="12">
                  <div
                    style="display: flex;"
                    v-for="value in finalUnits"
                    :key="value.mainId"
                    :id="value.mainId"
                  >
                    <!-- v-if="floorChosen"
                    v-model="value" -->
                    <v-text-field
                    style="width: 300px"
                      v-if="floorChosen"
                      :label="`${value.fix} ${value.unitName}`"
                      :value="value.total"
                      outlined
                      width="50%"
                    ></v-text-field>
                    <masked-input v-if="floorChosen" v-model="value.date" mask="1111-11-11" placeholder="yyyy/mm/dd" style="height: 55px; border: 1px solid grey; border-radius: 5%; width: 125px; margin-left: 50px; margin-right: 50px;padding-left: 10px;"/>
                    <v-checkbox v-if="floorChosen" v-model="value.processITC" color="red"></v-checkbox>
                    <!-- <v-dialog
                      v-if="floorChosen"
                      :ref="value.ref"
                      :id="value.mainId"
                      v-model="value.modal"
                      :return-value.sync="value.date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :id="value.mainId"
                          v-model="value.date"
                          label="Start Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="value.date"
                        scrollable
                        :id="value.mainId"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          :id="value.mainId"
                          @click="closeDatePicker"
                        >
                          Cancel
                        </v-btn>

                        <v-btn
                          text
                          color="primary"
                          @click="'$refs.' + value.ref + '.save(value.date)'"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog> -->
                  </div>
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="Notes"
                    rows="4"
                    outlined
                    v-if="floorChosen"
                    v-model="notes"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveITC"
              v-if="floorChosen"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" bottom top>
        {{ snackbarMessage }}
        <v-btn color="pink" text timeout="10000" @click="snackbar = false"
          >Close</v-btn
        >
      </v-snackbar>
    </v-row>
    <PDFViewer
      :fileName="showFileName"
      :dialog="showPDF"
      :documentName="showSrc"
      v-if="getComponent"
      @update-opened="updateOpened"
    />
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import * as dayjs from "dayjs";
import MaskedInput from "vue-masked-input";
// import DatePicker from 'vue2-datepicker';
//   import 'vue2-datepicker/index.css';
export default {
  name: "ITC",
  components: {
    PDFViewer: () => import("../components/PDFViewer"),
   MaskedInput
    // DatePicker
    
  },
  metaInfo: {
    title: "Instruction",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `About CPC here.`,
      },
    ],
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },
  data() {
    return {
      time2: new Date().toISOString().substr(0, 10),
      showPDF: true,
      getComponent: false,
      showSrc: "http://localhost:3000/Elec-Elec-001.pdf",
      showFileName: "Elec-Elec-001",
      snackbar: false,
      snackbarMessage: "Still Busy on this",
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      dialog: false,
      items: [],
      issuer: "",
      subcontractors: [],
      subcontractorChosen: "",
      taskTypes: [],
      taskTypeChosen: "",
      units: [],
      unitChosen: "",
      blocks: [],
      blockChosen: "",
      floorChosen: "",
      value: 0,
      valueStr: "",
      values: [],
      latestITCRefNumber: "",
      totalITCDone: "",
      vatVendor: true,
      notes: "Put in as move as you want here",
      headers: [
        {
          text: "Supplier",
          align: "start",
          sortable: false,
          value: "supplierName",
          width: 120,
        },
        {
          text: "Task",
          align: "start",
          sortable: false,
          value: "taskName",
          width: 120,
        },
        { text: "Block", value: "subsectionName", width: 120 },
        { text: "Unit", value: "unitName", width: 120 },
        { text: "Ref", value: "itcRefNumber", width: 120 },
        { text: "Start", value: "startDate", width: 120 },
        { text: "Done By", value: "issuer", width: 120 },
        { text: "Value", value: "netValStr", width: 120 },
        { text: "View", value: "actions", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Delete", value: "delete", sortable: false },
      ],
    };
  },
  computed: {
    filteredUnits: function() {
      if (this.blockChosen !== "") {
        return this.units.filter((el) => {
          return el.subsectionName === this.blockChosen;
        });
      } else {
        return this.units;
      }
    },
    finalUnits: function() {
      if (this.unitChosen !== "") {
        return this.filteredUnits.filter((el) => {
          return el.unitName === this.unitChosen
        })
      } else {
        return this.filteredUnits
      }
    }
  },
  mounted() {
    this.processNotifications();
    this.initialLoad();
    this.issuer = this.$store.state.userName;
  },
  methods: {
    closeDatePicker(event) {
      console.log(event.currentTarget.id);
      this.filteredUnits.forEach((el) => {
        if (el.mainId === event.currentTarget.id) {
          console.log("TEST GOOD", el.mainId);
          console.log(el.modal);
          el.modal = false;
          console.log(el.modal);
        }
      });
    },
    getPDF(event) {
      let targetId = event.currentTarget.id;
      let itemToFetch = this.items.filter((el) => {
        return el.id === parseInt(targetId);
      });
      this.showSrc = itemToFetch[0].hrefCert;
      this.showFileName = itemToFetch[0].showFileName;
      this.getComponent = true;
    },
    updateOpened() {
      this.getComponent = false;
    },
    async initialLoad() {
      let data = {
        id: this.$store.state.development.id,
      };
      await axios({
        method: "post",
        url: `${url}/getAllItc`,
        data: data,
      })
        .then(
          (response) => {
            if (response.data.length) {
              this.items = response.data;
              this.items.forEach((el) => {
                el.netValStr = this.convertToString(el.netVal);
                el.startDate = dayjs(el.startDate).format("YYYY-MM-DD");
                el.hrefCert = `${process.env.VUE_APP_BASEURL}/purchaseorders/${el.itcRefNumber}.pdf`;
              });
              this.latestITCRefNumber = `ITC-${this.items[0].id + 1}`;

              let totalITCDone = this.items.reduce((prev, curr) => {
                return prev + curr.netVal;
              }, 0);
              this.totalITCDone = this.convertToString(totalITCDone);
            } else {
              this.items = [];
              this.latestITCRefNumber = `ITC-1`;
            }
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async createITC() {
      await axios({
        method: "post",
        url: `${url}/getSubcontractors`,
      })
        .then(
          (response) => {
            this.subcontractors = response.data;
            this.subcontractorChosen = "";
            this.taskTypeChosen = "";
            this.unitChosen = "";
            this.floorChosen = "";
            this.notes = "";
            this.value = null;
            this.dialog = true;
            this.blockChosen = "";
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async getTasks() {
      let filtered = this.subcontractors.filter((el) => {
        return el.supplierName === this.subcontractorChosen;
      });
      let vatVendor = filtered[0].vatVendor;

      if (vatVendor === 0) {
        this.vatVendor = false;
      } else {
        this.vatVendor = true;
      }
      let data = {
        supplier: filtered[0].id,
        development: this.$store.state.development.id,
      };

      await axios({
        method: "post",
        url: `${url}/getTaskTotals`,
        data: data,
      })
        .then(
          (response) => {
            response.data.forEach((el) => {
              if (this.vatVendor === false) {
                el.total = el.total / 1.15;
              } else {
                el.total = el.total * 1;
              }
            });

            this.taskTypes = response.data;
            console.log(this.taskTypes);
            this.taskTypes.forEach((el, index) => {
              el.date = new Date().toISOString().substr(0, 10);
              el.modal = false;
              el.mainId = index.toString();
              el.processITC = false
            });
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    getUnits() {
      this.units = this.taskTypes.filter((el) => {
        return el.taskName === this.taskTypeChosen;
      });
    },
    getBlocks() {
      this.blocks = this.taskTypes.filter((el) => {
        return el.taskName === this.taskTypeChosen;
      });
      console.log(this.blocks);
    },
    getValue() {
      let filtered = this.taskTypes.filter((el) => {
        return (
          el.taskName === this.taskTypeChosen && el.unitName === this.unitChosen
        );
      });
      console.log(filtered);
      this.values = filtered;
      this.value = filtered[0].total.toFixed(2);
      this.valueStr = this.convertToString(this.value);
    },
    async saveITC() {
      let pdfData = [
        {
          itcRefNumber: this.latestITCRefNumber,
          subsection: this.taskTypes.filter((el) => {
            return el.subsectionName === this.blockChosen;
          })[0].subsectionName,
          unit: this.taskTypes.filter((el) => {
            return el.unitName === this.unitChosen;
          })[0].unitName,
          floorLevel: this.floorChosen,
          supplier: this.taskTypes.filter((el) => {
            return el.supplierName === this.subcontractorChosen;
          })[0].supplierName,
          netVal: this.value,
          startDate: this.date,
          taskType: this.taskTypes.filter((el) => {
            return el.taskName === this.taskTypeChosen;
          })[0].taskName,
          issuer: this.issuer,
          notes: this.notes,
        },
      ];
      let data = {
        pdfData: pdfData,
        itcRefNumber: this.latestITCRefNumber,
        development: this.$store.state.development.id,
        subsection: this.taskTypes.filter((el) => {
          return el.subsectionName === this.blockChosen;
        })[0].id,
        unit: this.taskTypes.filter((el) => {
          return el.unitName === this.unitChosen;
        })[0].unitNumber,
        floorLevel: this.floorChosen,
        supplier: this.taskTypes.filter((el) => {
          return el.supplierName === this.subcontractorChosen;
        })[0].supplier,
        netVal: this.value,
        startDate: this.date,
        taskType: this.taskTypes.filter((el) => {
          return el.taskName === this.taskTypeChosen;
        })[0].taskType,
        issuer: this.issuer,
        notes: this.notes,
      };

      await axios({
        method: "post",
        url: `${url}/saveITC`,
        data: data,
      })
        .then(
          () => {
            this.initialLoad();

            this.dialog = false;
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async deleteITC(event) {
      let filter = this.items.filter((el) => {
        return el.id === parseInt(event.currentTarget.id);
      });
      let data = {
        id: filter[0].id,
        supplier: filter[0].supplier,
        taskType: parseInt(filter[0].taskType),
        unitNumber: filter[0].unit,
      };
      await axios({
        method: "post",
        url: `${url}/deleteITC`,
        data: data,
      })
        .then(
          () => {
            this.initialLoad();
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
    async sendStatement(event) {
      let targetId = event.currentTarget.id;
      let fileInfo = this.items.filter((el) => {
        return el.id === parseInt(targetId);
      });

      let data = {
        supplier: fileInfo[0].supplier,
        itcRefNumber: fileInfo[0].itcRefNumber,
        id: fileInfo[0].id,
      };
      await axios({
        method: "post",
        url: `${url}/sendITC`,
        data: data,
      })
        .then(
          (response) => {
            if (response.data.success) {
              this.snackbarMessage = `Mail sent successfully to ${response.data.fileName}`;
              this.snackbar = true;
            } else {
              this.snackbarMessage =
                "There was a problem, Please try again later.";
              this.snackbar = true;
            }
          },
          (error) => {
            console.log("the Error", error);
          }
        )
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped></style>

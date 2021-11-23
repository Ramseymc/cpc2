<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <h1>Add SmartSheets for Progress</h1>
        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Add Sheets</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="900px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.smartsheetName"
                            :items="smartsheetToAdd"
                            item-text="name"
                            dense
                            filled
                            label="smartSheet Name"
                            @change="getNewSheetWB"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.smartsheetId"
                            label="smartsheetId"
                            readonly
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.TaskName"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="TaskName"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.isUnit"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="isUnit"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.isTaskType"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="isTaskType"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.isTask"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="isTask"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.Duration"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="Duration"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.StartDate"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="StartDate"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.EndDate"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="EndDate"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.Predecessors"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="Predecessors"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.PercentComplete"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="PercentComplete"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.Status"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="Status"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.AssignedTo"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="AssignedTo"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.Comments"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="Comments"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.Subcontractor1"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="Subcontractor1"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.Subcontractor2"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="Subcontractor2"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.LabourCost"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="LabourCost"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.MaterialCost"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="MaterialCost"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.TotalCost"
                            :items="columns"
                            item-text="title"
                            dense
                            filled
                            label="TotalCost"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.block"
                            :items="blocks"
                            item-text="subsectionName"
                            dense
                            filled
                            label="Block"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.development"
                            readonly
                          >
                            {{ development }}
                          </v-text-field>

                          <!-- <v-autocomplete
                            v-model="editedItem.development"
                            :items="development"
                            item-text="developmentName"
                            dense
                            filled
                            label="Development"
                          ></v-autocomplete> -->
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <!-- {
      
     
    
   
     
      
    
    
     
   
    
      
     

     { text: "MaterialCost", value: "MaterialCost" },
      { text: "TotalCost", value: "TotalCost" },
      { text: "Block", value: "block" },
      { text: "development", value: "development" }, -->
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                      v-if="
                        editedItem.smartsheetId !== '' &&
                          editedItem.smartsheetName !== '' &&
                          editedItem.TaskName !== '' &&
                          editedItem.isUnit !== '' &&
                          editedItem.isTaskType !== '' &&
                          editedItem.isTask !== '' &&
                          editedItem.Duration !== '' &&
                          editedItem.StartDate !== '' &&
                          editedItem.EndDate !== '' &&
                          editedItem.Predecessors !== '' &&
                          editedItem.PercentComplete !== '' &&
                          editedItem.Status !== '' &&
                          editedItem.AssignedTo !== '' &&
                          editedItem.Comments !== '' &&
                          editedItem.Subcontractor1 !== '' &&
                          editedItem.Subcontractor2 !== '' &&
                          editedItem.LabourCost !== '' &&
                          editedItem.MaterialCost !== '' &&
                          editedItem.TotalCost !== ''
                      "
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon> -->
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
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
  </div>
</template>

<script>
// import PlanType1 from "../components/plans/PlanType1";
// import PlanType1 from '../../public/PlanType1.svg';

import axios from "axios";
let url = process.env.VUE_APP_BASEURL;

export default {
  name: "AddSmartsheets",
  data: () => ({
    token: [],
    smartsheetToAdd: [],
    columns: [],
    blocks: [],
    development: null,
    snackbar: false,
    snackbarMessage: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "smartsheetId",
        align: "start",
        sortable: true,
        value: "smartsheetId"
      },
      { text: "smartsheetName", value: "smartsheetName" },
      { text: "TaskName", value: "TaskName" },
      { text: "isUnit", value: "isUnit" },
      { text: "isTaskType", value: "isTaskType" },
      { text: "isTask", value: "isTask" },
      { text: "Duration", value: "Duration" },
      { text: "StartDate", value: "StartDate" },
      { text: "EndDate", value: "EndDate" },
      { text: "Predecessors", value: "Predecessors" },
      { text: "% Complete", value: "PercentComplete" },
      { text: "Status", value: "Status" },
      { text: "AssignedTo", value: "AssignedTo" },
      { text: "Comments", value: "Comments" },
      { text: "Subcontractor1", value: "Subcontractor1" },
      { text: "Subcontractor2", value: "Subcontractor2" },
      { text: "LabourCost", value: "LabourCost" },
      { text: "MaterialCost", value: "MaterialCost" },
      { text: "TotalCost", value: "TotalCost" },
      { text: "Block", value: "block" },
      { text: "development", value: "development" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      AssignedTo: "",
      Comments: "",
      Duration: "",
      EndDate: "",
      LabourCost: "",
      MaterialCost: "",
      PercentComplete: "",
      Predecessors: "",
      StartDate: "",
      Status: "",
      Subcontractor1: "",
      Subcontractor2: "",
      TaskName: "",
      TotalCost: "",
      block: 0,
      development: 0,
      id: 0,
      isTask: "",
      isTaskType: "",
      isUnit: "",
      sheetName: "",
      smartsheetId: ""
    },
    defaultItem: {
      AssignedTo: "",
      Comments: "",
      Duration: "",
      EndDate: "",
      LabourCost: "",
      MaterialCost: "",
      PercentComplete: "",
      Predecessors: "",
      StartDate: "",
      Status: "",
      Subcontractor1: "",
      Subcontractor2: "",
      TaskName: "",
      TotalCost: "",
      block: 0,
      development: 0,
      id: 0,
      isTask: "",
      isTaskType: "",
      isUnit: "",
      sheetName: "",
      smartsheetId: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  mounted() {
    this.getInitialData();
    setTimeout(() => {
      this.getnewSheets();
    }, 500);
    this.editedItem.development = this.$store.state.development.id;
    this.defaultItem.development = this.$store.state.development.id;
  },

  methods: {
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };

      await axios({
        method: "post",
        url: `${url}/getsmartsheetControlWB`,
        data: data
      }).then(
        response => {
          console.log(response.data);
          this.desserts = response.data[0];
          this.desserts.forEach(el => {
            el.smartsheetName = el.sheetName;
          });
          this.token = response.data[1];
          this.blocks = response.data[2];
          // this.development  = response.data[3];
          this.development = this.$store.state.development.id;
          console.log(this.token[0].access_token);
        },
        error => {
          console.log(error);
        }
      );
    },
    async getnewSheets() {
      let data = {
        id: this.$store.state.development.id,
        access_token: this.token[0].access_token
      };

      await axios({
        method: "post",
        url: `${url}/addSmartSheetsWB`,
        data: data
      }).then(
        response => {
          console.log(response.data);
          this.smartsheetToAdd = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },
    async getNewSheetWB() {
      console.log(this.editedItem);

      let filtered = this.smartsheetToAdd.filter(el => {
        return el.name === this.editedItem.smartsheetName;
      });
      console.log("filtered", filtered);
      this.editedItem.smartsheetId = filtered[0].id.toString();

      let data = {
        id: filtered[0].id,
        access_token: this.token[0].access_token
      };

      await axios({
        method: "post",
        url: `${url}/getNewSheetWB`,
        data: data
      }).then(
        response => {
          console.log(response.data);
          this.columns = response.data;
          // this.smartsheetToAdd = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },

    // editItem(item) {
    //   this.editedIndex = this.desserts.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialog = true;
    // },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      console.log(this.editedItem);
      let data = {
        id: this.editedItem.id
      };
      await axios({
        method: "post",
        url: `${url}/deleteSheetFromControlWB`,
        data: data
      }).then(
        response => {
          console.log(response.data);

          this.closeDelete();
          this.getInitialData();
          // this.smartsheetToAdd = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      console.log(this.editedItem);
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        let taskNameFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.TaskName;
        });
        if (taskNameFiltered.length) {
          this.editedItem.TaskName = taskNameFiltered[0].id.toString();
        }
        let isUnitFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.isUnit;
        });
        if (isUnitFiltered.length) {
          this.editedItem.isUnit = isUnitFiltered[0].id.toString();
        }
        let isTaskTypeFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.isTaskType;
        });
        if (isTaskTypeFiltered.length) {
          this.editedItem.isTaskType = isTaskTypeFiltered[0].id.toString();
        }
        let isTaskFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.isTask;
        });
        if (isTaskFiltered.length) {
          this.editedItem.isTask = isTaskFiltered[0].id.toString();
        }
        let DurationFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.Duration;
        });
        if (DurationFiltered.length) {
          this.editedItem.Duration = DurationFiltered[0].id.toString();
        }
        let StartDateFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.StartDate;
        });
        if (StartDateFiltered.length) {
          this.editedItem.StartDate = StartDateFiltered[0].id.toString();
        }
        let EndDateFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.EndDate;
        });
        if (EndDateFiltered.length) {
          this.editedItem.EndDate = EndDateFiltered[0].id.toString();
        }
        let PredecessorsFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.Predecessors;
        });
        if (PredecessorsFiltered.length) {
          this.editedItem.Predecessors = PredecessorsFiltered[0].id.toString();
        }
        let PercentCompleteFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.PercentComplete;
        });
        if (PercentCompleteFiltered.length) {
          this.editedItem.PercentComplete = PercentCompleteFiltered[0].id.toString();
        }
        let StatusFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.Status;
        });
        if (StatusFiltered.length) {
          this.editedItem.Status = StatusFiltered[0].id.toString();
        }
        let AssignedToFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.AssignedTo;
        });
        if (AssignedToFiltered.length) {
          this.editedItem.AssignedTo = AssignedToFiltered[0].id.toString();
        }
        let CommentsFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.Comments;
        });
        if (CommentsFiltered.length) {
          this.editedItem.Comments = CommentsFiltered[0].id.toString();
        }
        let Subcontractor1Filtered = this.columns.filter(el => {
          return el.title === this.editedItem.Subcontractor1;
        });
        if (Subcontractor1Filtered.length) {
          this.editedItem.Subcontractor1 = Subcontractor1Filtered[0].id.toString();
        }
        let Subcontractor2Filtered = this.columns.filter(el => {
          return el.title === this.editedItem.Subcontractor2;
        });
        if (Subcontractor2Filtered.length) {
          this.editedItem.Subcontractor2 = Subcontractor2Filtered[0].id.toString();
        }
        let LabourCostFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.LabourCost;
        });
        if (LabourCostFiltered.length) {
          this.editedItem.LabourCost = LabourCostFiltered[0].id.toString();
        }
        let MaterialCostFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.MaterialCost;
        });
        if (MaterialCostFiltered.length) {
          this.editedItem.MaterialCost = MaterialCostFiltered[0].id.toString();
        }
        let TotalCostFiltered = this.columns.filter(el => {
          return el.title === this.editedItem.TotalCost;
        });
        if (TotalCostFiltered.length) {
          this.editedItem.TotalCost = TotalCostFiltered[0].id.toString();
        }
        let blockFiltered = this.blocks.filter(el => {
          return el.subsectionName === this.editedItem.block;
        });
        if (blockFiltered.length) {
          this.editedItem.block = blockFiltered[0].id;
        }
        await axios({
          method: "post",
          url: `${url}/addSmartSheetsToControlWB`,
          data: this.editedItem
        }).then(
          response => {
            console.log(response.data);
            this.desserts.unshift(this.editedItem);
            this.close();
            this.getInitialData();
            // this.smartsheetToAdd = response.data;
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }
};
</script>

<style scoped></style>

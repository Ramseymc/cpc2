<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-data-table
          :headers="headers"
          :items="items"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>PO Allocations</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="900px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.id"
                            label="PO ID"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.unitName"
                            label="Unit"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.unitNumber"
                            label="Unit Number"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.PONumber"
                            label="PO Number"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.supplier"
                            label="Supplier ID"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.supplierName"
                            label="Supplier"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.itemDescription"
                            label="Item Purchased"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <!-- v-model="values" -->
                          <v-combobox
                            v-model="editedItem.taskDescription"
                            :items="items2"
                            outlined
                            item-text="taskDescription"
                            dense
                            chips
                            small-chips
                            label="taskDescription"
                            @change="chooseTaskDescription"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <!-- v-model="values" -->
                          <v-combobox
                            v-if="items3.length"
                            v-model="editedItem.newTask"
                            :items="items3"
                            outlined
                            dense
                            chips
                            item-text="unitNumber"
                            small-chips
                            label="Choose Unit"
                            @change="chooseUnit"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <!-- v-model="values" -->
                          <v-combobox
                            v-if="items4.length && !differentUnitDialog"
                            v-model="editedItem.newSupplier"
                            :items="items4"
                            outlined
                            dense
                            chips
                            item-text="supplierName"
                            small-chips
                            label="Choose Supplier"
                            @change="changeSupplierOnly"
                          ></v-combobox>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <!-- <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- <v-dialog v-model="dialogDelete" max-width="500px">
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
              </v-dialog> -->
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)" color="green">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="differentUnitDialog" persistent max-width="800">
      <v-card>
        <v-card-title class="text-h5">
          No such Task?
        </v-card-title>
        <v-card-text
          >There is no such task for the current unit in the database. Do you
          want to insert a new task?
          <v-autocomplete
            v-model="editedItem.taskType"
            :items="taskTypes"
            item-text="taskName"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn color="black" text @click="differentUnitDialog = false">
            No
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="black" text @click="insertNewTask">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="differentSupplierDialog" persistent max-width="800">
      <v-card>
        <v-card-title class="text-h5">
          Change in supplier
        </v-card-title>
        <v-card-text
          >This is a different supplier to what was originally budgetted, do you
          want to change the supplier or add a new supplier?</v-card-text
        >
        <v-card-actions>
          <v-btn color="black" text @click="differentSupplierDialog = false">
            Abort
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn color="black" text @click="addNewSupplierToTasks">
            Add new Supplier
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="black" text @click="changeSupplierInTasks">
            Change existing supplier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      absolute
      centered
      color="deep-purple accent-4"
      elevation="24"
    >
      To be discussed on way forward.
    </v-snackbar>
    <!-- <v-dialog v-model="brandNewTaskDialog" persistent max-width="800">
      <v-card>
        <v-card-title class="text-h5">
          Brand New Task
        </v-card-title>
        <v-card-text
          >This task description does not exist - Create new task for this unit?</v-card-text
        >
        <v-card-actions>
          <v-btn color="black" text @click="brandNewTaskDialog = false">
            No - try again
          </v-btn>
          <v-spacer></v-spacer>

       
          <v-btn color="black" text @click="brandNewTaskDialog = false">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "PurchaseOrderAllocate",
  components: {},
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
  data: () => ({
    snackbar: false,
    dialog: false,
    differentUnitDialog: false,
    differentSupplierDialog: false,
    brandNewTaskDialog: false,
    // dialogDelete: false,
    taskTypes: [],
    items: [],
    items2: ["foo", "bar", "fizz", "buzz"],
    items3: [],
    items4: [],
    rawData: [],
    taskDescriptions: [],
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id"
      },
      { text: "PO Number", value: "PONumber" },
      { text: "Unit", value: "unitName" },
      { text: "Nett", value: "nettCost" },
      { text: "Supplier", value: "supplierName" },
      { text: "Reference", value: "reference" },
      { text: "Item", value: "itemDescription" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      task: 0,
      PONumber: "",
      supplier: 0,
      reference: "",
      supplierName: "",
      itemDescription: "",
      taskDescription: "",
      unitNumber: 0,
      unitName: ""
    },
    defaultItem: {
      id: 0,
      task: 0,
      PONumber: "",
      supplier: 0,
      reference: "",
      supplierName: "",
      itemDescription: "",
      taskDescription: "",
      unitNumber: 0,
      unitName: ""
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
    }
  },

  created() {
    this.getInitialData();
  },

  methods: {
    changeSupplierOnly() {
      console.log(this.editedItem);
      if (this.editedItem.newSupplier.supplier !== this.editedItem.supplier) {
        this.differentSupplierDialog = true;
      }
    },
    chooseUnit() {
      console.log(this.editedItem);
      let filteredData = this.items3.filter(el => {
        return this.editedItem.newTask.unitNumber === el.unitNumber;
      });
      if (this.editedItem.newTask.unitNumber !== this.editedItem.unitNumber) {
        this.differentUnitDialog = true;
      }
      this.items4 = filteredData;

      console.log(filteredData);
    },
    chooseTaskDescription() {
      console.log("Awesome!!");
      console.log(this.editedItem);
      console.log(this.editedItem.taskDescription);
      console.log(this.taskDescriptions);
      let filtered = this.taskDescriptions.filter(el => {
        return (
          el.taskDescription ===
            this.editedItem.taskDescription.taskDescription &&
          el.unitNumber === this.editedItem.unitNumber
        );
      });
      console.log("filtered", filtered);
      if (!filtered.length) {
        this.differentUnitDialog = true;
      }
      this.items3 = filtered;
    },
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/PONotAllocatedWB`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.rawData = JSON.parse(JSON.stringify(response.data[0]));
            const ids = response.data[0].map(o => o.id);
            const filtered = response.data[0].filter(
              ({ id }, index) => !ids.includes(id, index + 1)
            );
            console.log(filtered);
            // this.items = filtered;
            this.items = filtered;
            this.items.forEach(el => {
              el.newSupplier = null;
              el.newTask = null;
              el.createdAt = dayjs(el.createdAt).format("YYYY-MM-DD");
            });
            let taskDescriptions = [];
            response.data[1].forEach(el => {
              taskDescriptions.push(el.taskDescription);
            });
            console.log(response.data[1]);
            this.taskDescriptions = response.data[1];
            this.taskTypes = response.data[2];
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.items2 = this.taskDescriptions.filter(el => {
        return el.unitNumber === this.editedItem.unitNumber;
      });
      this.editedItem.taskDescription = null;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async insertNewTask() {
      // console.log(this.editedIndex);
      console.log("Items2", this.items2);
      console.log(this.taskTypes);
      if (this.editedItem.taskType) {
        let filtered = this.taskTypes.filter(el => {
          return el.taskName === this.editedItem.taskType;
        });
        this.editedItem.taskTypeId = filtered[0].id;
        console.log("filtered", filtered);
      }
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        console.log("Insert new Task", this.editedItem);

        await axios({
          method: "post",
          url: `${url}/insertNewTaskFromPO`,
          data: this.editedItem
        })
          .then(
            response => {
              console.log(response.data);
              this.updateTasksAll();
              this.getInitialData();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
      this.differentUnitDialog = false;
      this.close();
    },
    async updateTasksAll() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/updateTasksWithPayDateWB`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            // this.getInitialData();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async changeSupplierInTasks() {
      console.log(this.editedIndex);
      console.log("Items2", this.items2);
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        console.log("Change Supplier", this.editedItem);
        // let filtered = this.rawData.filter((el) => {
        //   return (
        //     el.taskDescription === this.editedItem.taskDescription &&
        //     el.id === this.editedItem.id
        //   );
        // });
        // console.log(filtered);
        // if (filtered.length > 0) {
        //   let data = {
        //     task: filtered[0].taskId,
        //     id: filtered[0].id,
        //   };
        await axios({
          method: "post",
          url: `${url}/changeTaskSupplierWB`,
          data: this.editedItem
        })
          .then(
            response => {
              console.log(response.data);
              this.getInitialData();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
        // }
      }
      this.differentSupplierDialog = false;
      this.close();
    },
    async addNewSupplierToTasks() {
      console.log(this.editedIndex);
      console.log("Items2", this.items2);
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        console.log("Add new Supplier to tasks", this.editedItem);
        this.snackbar = true;
        // let filtered = this.rawData.filter((el) => {
        //   return (
        //     el.taskDescription === this.editedItem.taskDescription &&
        //     el.id === this.editedItem.id
        //   );
        // });
        // console.log(filtered);
        // if (filtered.length > 0) {
        //   let data = {
        //     task: filtered[0].taskId,
        //     id: filtered[0].id,
        //   };
        //   await axios({
        //     method: "post",
        //     url: `${url}/allocateTasksToPOWB`,
        //     data: data,
        //   })
        //     .then(
        //       (response) => {
        //         console.log(response.data);
        //         this.getInitialData();
        //       },
        //       (error) => {
        //         console.log(error);
        //       }
        //     )
        //     .catch((e) => {
        //       console.log(e);
        //     });
        // }
      }
      this.differentSupplierDialog = false;
      this.close();
    },

    async save() {
      // console.log(this.editedIndex);
      // if (this.editedIndex > -1) {
      //   Object.assign(this.items[this.editedIndex], this.editedItem);
      //   console.log("WAYNE", this.editedItem);
      //   let filtered = this.rawData.filter((el) => {
      //     return (
      //       el.taskDescription === this.editedItem.taskDescription &&
      //       el.id === this.editedItem.id
      //     );
      //   });
      //   console.log(filtered);
      //   if (filtered.length > 0) {
      //     let data = {
      //       task: filtered[0].taskId,
      //       id: filtered[0].id,
      //     };
      //     await axios({
      //       method: "post",
      //       url: `${url}/allocateTasksToPOWB`,
      //       data: data,
      //     })
      //       .then(
      //         (response) => {
      //           console.log(response.data);
      //           this.getInitialData();
      //         },
      //         (error) => {
      //           console.log(error);
      //         }
      //       )
      //       .catch((e) => {
      //         console.log(e);
      //       });
      //   }
      // } else {
      //   this.items.push(this.editedItem);
      //   console.log("WAYNE Index -1", this.editedItem);
      //   console.log(this.items);
      // }
      // this.close();
    }
  }
};
</script>

<style scoped></style>

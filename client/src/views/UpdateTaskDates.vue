<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <!-- <v-col class="mb-4" offset="1" cols="10" sm="10" md="10"> -->
      <v-col offset="1" cols="10" sm="10" md="10">
        <h3>Choose Payment Date Range</h3>
      </v-col>
      <v-col offset="1" cols="10" sm="10" md="10">
        <h4>Excludes Purchase Orders and Payment Certificates</h4>
        <h5>These get processed by Amina</h5>
      </v-col>
      <v-col class="mb-4" offset="1" cols="4" sm="4" md="4">
        <v-menu
          ref="menuFrom"
          v-model="menuFrom"
          :close-on-content-click="false"
          :return-value.sync="dateFrom"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFrom"
              label="Date from"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateFrom" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuFrom = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menuFrom.save(dateFrom)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="mb-4" cols="4" sm="4" md="4">
        <v-menu
          ref="menu"
          v-model="menuTo"
          :close-on-content-click="false"
          :return-value.sync="dateTo"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateTo"
              label="Date To"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateTo" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuTo = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(dateTo)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-btn @click="getDatsaToEdit">Get Data</v-btn>
      </v-col>
      <v-col offset="1" cols="10" sm="10" md="10" v-if="desserts.length">
        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
          multi-sort
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Amend Task Dates & Paydates</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>

              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
              ></v-text-field>
              <!-- <v-spacer></v-spacer> -->
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
                            v-model="editedItem.supplierName"
                            label="Supplier"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.paymentDate"
                            :label="
                              editedItem.paymentDate
                                ? 'push out task end date'
                                : 'push out payment date'
                            "
                          ></v-switch>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                          v-if="editedItem.paymentDate"
                        >
                          <v-text-field
                            v-model="editedItem.endDate"
                            label="Task End Date"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                          v-if="!editedItem.paymentDate"
                        >
                          <v-text-field
                            v-model="editedItem.payDate"
                            label="Pay Date"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            :items="items"
                            v-model="editedItem.daysChange"
                            label="push Out Date (days)"
                            @change="changeDays"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                      v-if="editedItem.daysChange !== 0"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)" color="green">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col offset="1" cols="10" sm="10" md="10" v-else>
        <h4 style="color: red;">No data for given dates</h4>
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
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "UpdateTaskDates",
  components: {
    // PlanType1
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
      items: [-21, -14, -7, 7, 14, 21],
      search: "",
      snackbar: false,
      snackbarMessage: "",
      dateFrom: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menuFrom: false,
      dateTo: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menuTo: false,

      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Supplier",
          align: "start",
          sortable: true,
          value: "supplierName"
        },
        {
          text: "Unit",
          align: "start",
          sortable: true,
          value: "unitName"
        },
        { text: "Task", value: "taskName" },
        { text: "Start", value: "startDate" },
        { text: "End", value: "endDate" },
        { text: "Cost", value: "price", align: "end" },
        { text: "Pay Date", value: "payDate" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        endDate: "",
        payDate: "",
        taskType: 0,
        unitNumber: 0,
        supplierName: "",
        supplier: "",
        daysChange: 0,
        paymentDate: false
      },
      defaultItem: {
        endDate: "",
        payDate: "",
        taskType: 0,
        unitNumber: 0,
        supplierName: "",
        supplier: "",
        daysChange: 0,
        paymentDate: false
      }
    };
  },
  mounted() {},
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
  // created() {
  //   this.initialize();
  // },
  methods: {
    changeDays() {
      let daysChange = parseInt(this.editedItem.daysChange);
      if (!this.editedItem.paymentDate) {
        this.editedItem.payDate = dayjs(this.editedItem.payDate)
          .add(daysChange, "day")
          .format("YYYY-MM-DD");
      } else {
        this.editedItem.endDate = dayjs(this.editedItem.endDate)
          .add(daysChange, "day")
          .format("YYYY-MM-DD");
        this.editedItem.payDate = null;
      }
      console.log(this.editedItem);
    },
    async getDatsaToEdit() {
      console.log("Awesome!!!!");
      let data = {
        id: this.$store.state.development.id,
        dateFrom: dayjs(this.dateFrom).format("YYYY-MM-DD"),
        dateTo: dayjs(this.dateTo).format("YYYY-MM-DD")
      };
      console.log(data);
      await axios({
        method: "post",
        url: `${url}/getSubcontractorPayments`,
        data: data
      }).then(response => {
        console.log(response.data);
        this.desserts = response.data;
        this.desserts.forEach(el => {
          el.payDate = dayjs(el.payDate).format("YYYY-MM-DD");
          el.startDate = dayjs(el.startDate).format("YYYY-MM-DD");
          el.endDate = dayjs(el.endDate).format("YYYY-MM-DD");
          el.price = this.convertToString(el.price);
          el.daysChange = 0;
          el.paymentDate = false;
        });
      });
      //   .catch(() => {});
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    // deleteItem(item) {
    //   this.editedIndex = this.desserts.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },

    // deleteItemConfirm() {
    //   this.desserts.splice(this.editedIndex, 1);
    //   this.closeDelete();
    // },

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

    async save() {
      if (this.editedIndex > -1) {
        this.editedItem.daysChange = 0;
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
        console.log(this.editedItem);
        await axios({
          method: "post",
          url: `${url}/editSubcontractorPaymentEndDates`,
          data: this.editedItem
        })
          .then(response => {
            console.log(response.data);
            this.updateTasksAll();
            this.getDatsaToEdit();
          })
          .catch(() => {});
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style scoped>
.corner {
  background-color: orange;
  cursor: pointer;
}
svg {
  height: 80vh;
}
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
</style>

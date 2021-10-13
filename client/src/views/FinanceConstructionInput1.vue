<template>
  <div class="about">
    <br /><br /><br /><br />
    <v-row class="text-center">
      <v-col class="mb-4" offset="1" cols="10" sm="10" md="10">
        <v-data-table
          :headers="headers"
          :items="items"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="idIndex"
          show-expand
          sort-by="calories"
          class="elevation-1"
          :item-class="itemRowColor"
          multi-sort
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Construction Payments</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <span>{{ totalBudget }}</span>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialog" max-width="900px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="black"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <!-- <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.id"
                            label="ID"
                            readonly
                          ></v-text-field>
                        </v-col> -->

                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.paymentDate"
                            label="Payment Date"
                            placeholder="YYYY-MM-DD"
                            hint="YYYY-MM-DD"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.actualAmount"
                            label="Actual Amount"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.budgetAmount"
                            label="Budget Amount"
                          ></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.supplier"
                            label="Supplier"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.supplierName"
                            label="Supplier Name"
                          ></v-text-field>
                        </v-col> -->
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.supplierName"
                            :items="suppliers"
                            item-text="supplierName"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Supplier"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <!-- <v-text-field
                            v-model="editedItem.vatVendor"
                            label="vatVendor"
                          ></v-text-field> -->
                          <v-switch
                            v-model="editedItem.vatVendor"
                            :label="
                              `VatVendor: ${editedItem.vatVendor.toString()}`
                            "
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.invoiceNumber"
                            label="Invoice Number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.invoiceDate"
                            label="Invoice Date"
                            placeholder="YYYY-MM-DD"
                            hint="YYYY-MM-DD"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <!-- <v-text-field
                            v-model="editedItem.finalised"
                            label="Finalised"
                          ></v-text-field> -->
                          <v-switch
                            v-model="editedItem.finalised"
                            :label="
                              `Finalised: ${editedItem.finalised.toString()}`
                            "
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <!-- <v-text-field
                            v-model="editedItem.paid"
                            label="Paid"
                          ></v-text-field> -->
                          <v-switch
                            v-model="editedItem.paid"
                            :label="`Paid: ${editedItem.paid.toString()}`"
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            v-model="editedItem.unitName"
                            :items="units"
                            item-text="unitName"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Unit for"
                          ></v-autocomplete>
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
                      v-if="
                        editedItem.paymentDate !== null &&
                          editedItem.paymentDate !== ''
                      "
                      color="blue darken-1"
                      text
                      @click="save"
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
            <v-icon small class="mr-2" @click="editItem(item)" color="green">
              mdi-pencil
            </v-icon>
            <!-- <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon> -->
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.supplierName }}
              <v-data-table
                :headers="headers2"
                :items="item.subItems"
                hide-default-footer
                disable-pagination
                sort-by="calories"
                class="elevation-1"
              ></v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- <v-snackbar v-model="snackbar" bottom top shaped color="blue">
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar> -->
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "FinanceConstructionInput",
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
  data: () => ({
    expanded: [],
    singleExpand: true,
    paymentCertificatesToProcess: [],
    purchaseOrdersAllocatedToTasks: [],
    purchaseOrdersNotAllocatedToTasks: [],
    items: [],
    subItems: [],
    dialog: false,
    dialogDelete: false,
    rawData: [],
    taskDescriptions: [],
    units: [],
    suppliers: [],
    totalBudget: 0,
    headers2: [
      {
        text: "Unit",
        align: "start",
        sortable: false,
        value: "unitName"
      },
      {
        text: "Budget",
        align: "start",
        sortable: false,
        value: "budgetAmount"
      },
      {
        text: "PC Number",
        align: "start",
        sortable: false,
        value: "paymentCertificateNumber"
      },
      {
        text: "PC Amount",
        align: "start",
        sortable: false,
        value: "paymentCertificateAmount"
      },
      {
        text: "PO Number",
        align: "start",
        sortable: false,
        value: "purchaseOrderNumber"
      },
      {
        text: "PO Amount",
        align: "start",
        sortable: false,
        value: "purchaseOrderAmount"
      }
    ],
    headers: [
      { text: "", value: "data-table-expand" },
      {
        text: "Supplier",
        align: "start",
        sortable: true,
        value: "supplierName"
      },
      {
        text: "Budget",
        value: "budgetAmountStr",
        align: "end",
        width: 150,
        sortable: true
      },
      {
        text: "Actual",
        value: "actualAmountStr",
        align: "end",
        width: 150,
        sortable: true
      },
      {
        text: "Payment Date",
        value: "paymentDate",
        align: "center",
        width: 120,
        sortable: true
      },
      {
        text: "Finalised",
        value: "finalised",
        align: "center",
        sortable: true
      },
      { text: "Paid", value: "paid", align: "center", sortable: true },
      { text: "Actions", value: "actions", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      actualAmount: 0,
      budgetAmount: 0,
      budgetted: 1,
      development: 1,
      finalised: 0,
      idIndex: 0,
      id: 0,
      invoiceDate: null,
      invoiceNumber: null,
      paid: 0,
      paymentDate: "",
      supplier: 223,
      supplierName: "",
      task: 0,
      taskType: 0,
      unitName: "",
      unitNumber: 0,
      vatDate: "",
      vatVendor: 0
    },
    defaultItem: {
      actualAmount: 0,
      budgetAmount: 0,
      budgetted: 1,
      development: 1,
      finalised: 0,
      idIndex: 0,
      id: 0,
      invoiceDate: null,
      invoiceNumber: null,
      paid: 0,
      paymentDate: "",
      supplier: 223,
      supplierName: "",
      task: 0,
      taskType: 0,
      unitName: "",
      unitNumber: 0,
      vatDate: "",
      vatVendor: 0
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

  created() {
    // this.initialize();
    this.getInitialData();
  },

  methods: {
    async getInitialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/insertFinanceConstructionInputWB`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            response.data.forEach(el => {
              el.createdAt = dayjs(el.createdAt).format("YYYY-MM-DD");
            });
            this.paymentCertificatesToProcess = response.data;
            if (response.data.length > 0) {
              this.procesPaymentCertificates();
            }
            this.getPoToProcessToFinanceInput();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async getPoToProcessToFinanceInput() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getPOtoInsertIntoFinanceConstructionWB`,
        data: data
      })
        .then(
          response => {
            console.log("XX", response.data);
            this.purchaseOrdersAllocatedToTasks = JSON.parse(
              JSON.stringify(
                response.data.filter(el => {
                  return el.task !== 0;
                })
              )
            );
            this.purchaseOrdersNotAllocatedToTasks = JSON.parse(
              JSON.stringify(
                response.data.filter(el => {
                  return el.task === 0;
                })
              )
            );
            console.log(this.purchaseOrdersAllocatedToTasks);
            console.log(this.purchaseOrdersNotAllocatedToTasks);
            this.purchaseOrdersNotAllocatedToTasks.forEach(el => {
              el.createdAt = dayjs(el.createdAt).format("YYYY-MM-DD");
              if (el.vat !== 0) {
                el.vatVendor = true;
              } else {
                el.vatVendor = false;
              }
              if (dayjs(el.createdAt).month() + (1 % 2) === 0) {
                el.vatDate = dayjs(el.createdAt)
                  .endOf("month")
                  .add(1, "month")
                  .format("YYYY-MM-DD");
                // console.log("even Month")
              } else {
                el.vatDate = dayjs(el.createdAt)
                  .endOf("month")
                  .add(2, "month")
                  .format("YYYY-MM-DD");

                // console.log("odd Month")
              }
              el.paymentDate = dayjs(el.createdAt)
                .add(1, "month")
                .format("YYYY-MM-DD");

              // console.log(dayjs(el.createdAt).month())
            });
            // if (this.purchaseOrdersAllocatedToTasks.length > 0) {
            this.processPOAllocated();
            // }
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async processPOAllocated() {
      let data = {
        id: this.$store.state.development.id,
        pos: this.purchaseOrdersAllocatedToTasks
      };
      await axios({
        method: "post",
        url: `${url}/processPOAllocatedWB`,
        data: data
      })
        .then(
          response => {
            console.log("YY", response.data);
            // if (this.purchaseOrdersNotAllocatedToTasks.length > 0){
            this.processPONotAllocated();
            // } else {
            //   console.log("All Done!!")
            // }
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async processPONotAllocated() {
      let info = this.purchaseOrdersNotAllocatedToTasks;
      while (info.length) {
        let splicedInfo = info.splice(0, 25);
        let data = {
          id: this.$store.state.development.id,
          pos: splicedInfo
        };
        console.log("$$$$", this.purchaseOrdersNotAllocatedToTasks.length);
        await axios({
          method: "post",
          url: `${url}/processPONotAllocatedWMB`,
          data: data
        })
          .then(
            response => {
              console.log("YY", response.data);
              this.tasksListforFinance();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
      if (!info.length) {
        this.tasksListforFinance();
      }
    },
    async tasksListforFinance() {
      let data = {
        id: this.$store.state.development.id
        // pos: this.purchaseOrdersNotAllocatedToTasks
      };
      await axios({
        method: "post",
        url: `${url}/tasksListforFinanceWB`,
        data: data
      })
        .then(
          response => {
            console.log("ZZ", response.data);
            this.items = response.data[1];
            this.items.forEach((el, index) => {
              if (el.invoiceDate !== null) {
                el.invoiceDate = dayjs(el.invoiceDate).format("YYYY-MM-DD");
              }
              el.idIndex = index;
              el.paymentDate = dayjs(el.paymentDate).format("YYYY-MM-DD");
              el.budgetAmountStr = this.convertToString(el.budgetAmount);
              el.actualAmountStr = this.convertToString(el.actualAmount);
              if (el.finalised === 1) {
                el.finalised = true;
              } else {
                el.finalised = false;
              }
              if (el.vatVendor === 1) {
                el.vatVendor = true;
              } else {
                el.vatVendor = false;
              }
              if (el.paid === 1) {
                el.paid = true;
              } else {
                el.paid = false;
              }
              el.subItems = [];
              el.actualAmount = el.actualAmount.toFixed(2);
              el.budgetAmount = el.budgetAmount.toFixed(2);
              // if (el.invoiceDate !== null) {
              //   el.invoiceDate = dayjs(el.invoiceDate).format("YYYY-MM-DD")
              // }
            });
            this.totalBudget = this.convertToString(
              this.items.reduce((prev, curr) => {
                return parseFloat(curr.budgetAmount) + prev;
              }, 0)
            );
            this.subItems = response.data[0];
            this.subItems.forEach(el => {
              el.paymentDate = dayjs(el.paymentDate).format("YYYY-MM-DD");
            });
            this.items.forEach(el => {
              let filteredData = this.subItems.filter(el2 => {
                return (
                  el.supplier === el2.supplier &&
                  el.paymentDate === el2.paymentDate
                );
              });
              filteredData.forEach(el3 => {
                el.subItems.push(el3);
              });
            });
            this.items.forEach(el => {
              let filteredData = el.subItems.filter(el2 => {
                return (
                  el2.PONumber !== null && el2.paymentCertificateNumber !== null
                );
              });
              if (filteredData.length > 0) {
                el.docsProcessed = true;
              } else {
                el.docsProcessed = false;
              }

              // console.log(filteredData)
            });
            let units = [];
            this.subItems.forEach(el => {
              let insert = {
                id: el.unitNumber,
                unitName: el.unitName
              };
              units.push(insert);
            });
            let suppliers = [];

            console.log(units);
            const ids = units.map(o => o.id);
            const filtered = units.filter(
              ({ id }, index) => !ids.includes(id, index + 1)
            );
            filtered.sort((a, b) => (a.id > b.id ? 1 : -1));
            console.log(filtered);
            this.units = filtered;
            this.items.forEach(el => {
              let insert = {
                id: el.supplier,
                supplierName: el.supplierName
              };
              suppliers.push(insert);
            });
            const idSuppliers = suppliers.map(o => o.id);
            const filteredSuppliers = suppliers.filter(
              ({ id }, index) => !idSuppliers.includes(id, index + 1)
            );
            filteredSuppliers.sort((a, b) => (a.id > b.id ? 1 : -1));
            console.log(filteredSuppliers);
            this.suppliers = filteredSuppliers;
            this.items = this.items.filter(el => {
              return (
                parseFloat(el.budgetAmount) + parseFloat(el.actualAmount) !== 0
              );
            });
            // let test = this.items.filter((el) => {
            //   return
            // })
            // console.log(this.items);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    itemRowColor(item) {
      //CHANGES ROW COLOR WHEN TASK BEHIND SCGEDULE
      if (item.docsProcessed) {
        return "green accent-2";
      }
    },
    async procesPaymentCertificates() {
      console.log(this.paymentCertificatesToProcess);

      let data = {
        id: this.$store.state.development.id,
        pcs: this.paymentCertificatesToProcess
      };
      await axios({
        method: "post",
        url: `${url}/insertPCtoFinanceConstructionInputWB`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            // this.paymentCertificatesToProcess = response.data
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
      this.taskDescriptions = [];
      this.editedItem.taskDescription = null;
      let filteredData = this.rawData.filter(el => {
        return el.id === this.editedItem.id;
      });
      // this.taskDescriptions.push("")
      console.log(filteredData);
      filteredData.forEach(el => {
        this.taskDescriptions.push(el.taskDescription);
      });

      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
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
      // console.log(this.editedIndex);

      let supplier = this.suppliers.filter(el => {
        return el.supplierName === this.editedItem.supplierName;
      });
      this.editedItem.supplier = supplier[0].id;
      let unit = this.units.filter(el => {
        return el.unitName === this.editedItem.unitName;
      });
      if (unit.length > 0) {
        this.editedItem.unitNumber = unit[0].id;
      } else {
        this.editedItem.unitNumber = 0;
      }
      if (this.editedItem.finalised === true) {
        console.log("Awesome");
        this.editedItem.finalised = 1;
      } else {
        this.editedItem.finalised = 0;
      }
      // console.log("supplier",supplier)
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        console.log("WAYNE Existing", this.editedItem);
        // let actualAmountOriginal = this.editedItem.subItems.reduce((prev, curr) => {
        //   return prev + parseFloat(curr.actualAmount)
        // },0)
        let budgetAmountOriginal = this.editedItem.subItems.reduce(
          (prev, curr) => {
            return prev + parseFloat(curr.budgetAmount);
          },
          0
        );
        this.editedItem.subItems.forEach(el => {
          el.invoiceNumber = this.editedItem.invoiceNumber;
          el.paymentDate = this.editedItem.paymentDate;
          el.invoiceDate = this.editedItem.invoiceDate;
          el.finalised = this.editedItem.finalised;
          el.paid = this.editedItem.paid;
          el.actualAmount =
            (parseFloat(this.editedItem.actualAmount) / budgetAmountOriginal) *
            el.budgetAmount;
          el.budgetAmount =
            (parseFloat(this.editedItem.budgetAmount) / budgetAmountOriginal) *
            el.budgetAmount;
        });
        console.log(this.editedItem);
        let data = {
          updateData: this.editedItem.subItems
        };
        await axios({
          method: "post",
          url: `${url}/updateFinanceConstructionWB`,
          data: data
        })
          .then(
            response => {
              console.log(response.data);
              this.tasksListforFinance();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      } else {
        this.items.push(this.editedItem);
        this.editedItem.development = this.$store.state.development.id;
        this.editedItem.idIndex = this.items.length;
        console.log("WAYNE Index New", this.editedItem);
        let data = {
          insertData: this.editedItem
        };
        await axios({
          method: "post",
          url: `${url}/insertFinanceConstructionWB`,
          data: data
        })
          .then(
            response => {
              console.log(response.data);
              this.tasksListforFinance();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
      this.close();
    }
  }
};
</script>

<style scoped></style>

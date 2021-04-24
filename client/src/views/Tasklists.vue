<template>
  <div class="about">
    <br /><br /><br />
    <!-- <v-container fluid> -->
    <h2>Needs / Additions / Suggestions</h2>
    <v-btn text @click="dialog = true">ADD TO LIST</v-btn>
    <v-row>
      <!-- <v-layout align-start justify-center> -->
      <v-col cols="8" offset="2">
        <v-list three-line outlined shaped>
          <v-subheader>
            Tasks WIP and ToDo
          </v-subheader>
          <draggable
            v-model="items"
            :group="group1"
            style="min-height: 10px"
            @change="itemsChanged"
          >
            <template v-for="item in items">
              <v-list-item :key="item.id" ripple active-class="pink--text">
                <v-list-item-icon>
                  <v-icon large color="purple">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="item.taskTitle"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="`${item.typeTask} - ${item.estimate}`"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="item.userName"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <!-- <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-check-bold</v-icon>
                    </v-btn>
                  </v-list-item-action> -->
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="2">
        <v-list
          three-line
          outlined
          shaped
          class="overflow-y-auto"
          max-height="90vh"
        >
          <v-subheader>
            Suggested Tasks
          </v-subheader>
          <draggable
            v-model="items1"
            :group="group2"
            style="min-height: 10px"
            @change="items1Changed"
            :disabled="disabled"
          >
            <template v-for="item in items1">
              <v-list-item :key="item.id" ripple>
                <v-list-item-icon>
                  <v-icon large color="green">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="item.taskTitle"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="`${item.typeTask} - ${item.estimate}`"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="item.userName"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <div style="display: flex;">
                    <v-btn
                      icon
                      v-if="
                        userName === item.userName ||
                          userName === 'Wayne Bruton'
                      "
                      :id="item.id"
                      @click="deleteTask"
                    >
                      <v-icon color="red">mdi-trash-can</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      v-if="
                        userName === item.userName ||
                          userName === 'Wayne Bruton'
                      "
                      :id="item.id"
                      @click="editTask"
                    
                    >
                      <v-icon color="blue">mdi-file-edit</v-icon>
                    </v-btn>
                    <v-btn :id="item.id" icon @click="viewTask">
                      <v-icon color="green">mdi-binoculars</v-icon>
                    </v-btn>
                  </div>
                </v-list-item-action>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-col>
      <v-col cols="4" offset="0">
        <v-list three-line outlined shaped>
          <v-subheader>
            Completed for Testing
          </v-subheader>
          <draggable
            v-model="items2"
            :group="group3"
            style="min-height: 10px"
            @change="items2Changed"
            
          >
            <template v-for="item in items2">
              <v-list-item :key="item.id" ripple>
                <v-list-item-icon>
                  <v-icon large color="blue">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="`${item.typeTask} - ${item.estimate}`"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="item.userName"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-col>
      <v-col cols="4" offset="6">
        <v-list three-line outlined shaped>
          <v-subheader>
            Finalised
          </v-subheader>
          <draggable
            v-model="items3"
            :group="group4"
            style="min-height: 10px"
            @change="items3Changed"
          >
            <template v-for="item in items3">
              <v-list-item :key="item.id" ripple>
                <v-list-item-icon>
                  <v-icon large color="red">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="`${item.typeTask} - ${item.estimate}`"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="item.userName"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-col>
      <!-- </v-layout> -->
    </v-row>
    <!-- </v-container> -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Task Details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="!viewOnly"
                    label="User*"
                    v-model="userName"
                    required
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Title*"
                    required
                    v-model="title"
                    placeholder="Enter title of your request"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Text*"
                    type="password"
                    required
                    v-model="text"
                    placeholder="Place description / explanation here"
                    :readonly="viewOnly"
                  ></v-textarea>
                </v-col>
                 <v-col cols="12">
                  <v-text-field
                    label="Time Estimate"
                    required
                    v-model="estimate"
                    placeholder="Estimate of Time"
                    v-if="userName = 'Wayne Bruton' || viewOnly"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeView">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveTask"
              v-if="!viewOnly"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>


    <v-row justify="center">
      <v-dialog v-model="dialog1" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Task</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="!viewOnly"
                    label="User*"
                    v-model="userName"
                    required
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Title*"
                    required
                    v-model="title"
                    placeholder="Enter title of your request"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Text*"
                    type="password"
                    required
                    v-model="text"
                    placeholder="Place description / explanation here"
                    :readonly="viewOnly"
                  ></v-textarea>
                </v-col>
                 <v-col cols="12">
                  <v-text-field
                    label="Time Estimate"
                    required
                    v-model="estimate"
                    placeholder="Estimate of Time"
                    v-if="userName = 'Wayne Bruton' || viewOnly"
                    :readonly="viewOnly"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog1 = false">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
            @click="saveEditTask"
              v-if="!viewOnly"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
import draggable from "vuedraggable";
export default {
  name: "TaskList",
  components: {
    draggable
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
      dialog: false,
      dialog1: false,
      userName: this.$store.state.userName,
      editId: 0,
      title: "",
      estimate: "1 Day",
      text: "",
      viewOnly: false,
      group1: "group",
      group2: "group",
      group3: "group",
      group4: "group",
      disabled: true,
      group: {
        group: "people"
      },
      items: [
        // {
        //   id: 1,
        //   icon: "mdi-progress-wrench",
        //   title:
        //     "Do drag and drop for tasks & amend Start Dates and Durations.",
        //   subtitle: "WIP",
        //   subtitle2: "Wayne Bruton",
        //   typeTask: "WIP",
        //   fixed: true
        // }
      ],
      items1: [
        // {
        //   id: 77,
        //   icon: "mdi-thought-bubble",
        //   title: "Do some other stuff",
        //   subtitle: "WIP4",
        //   fixed: true,
        //   typeTask: "Suggested"
        // }
      ],
      items2: [
        // {
        //   id: 2,
        //   icon: "mdi-checkbox-marked-circle",
        //   title: "Recovery Statements",
        //   subtitle: "Next",
        //   fixed: false,
        //   typeTask: "Completed"
        // },
        // {
        //   id: 3,
        //   icon: "mdi-checkbox-marked-circle",
        //   title: "Add Individual Tasks",
        //   subtitle: "Subtitle 3",
        //   fixed: false,
        //   typeTask: "Completed"
        // }
      ],
      items3: [
        // {
        //   id: 4,
        //   icon: "mdi-emoticon-happy",
        //   title: "Quality control signatures",
        //   subtitle: "Subtitle 4",
        //   fixed: false,
        //   typeTask: "Finalised"
        // },
        // {
        //   id: 5,
        //   icon: "mdi-emoticon-happy",
        //   title: "Add some arbitrary task",
        //   subtitle: "Subtitle 5",
        //   fixed: false,
        //   typeTask: "Finalised"
        // }
      ]
    };
  },
  beforeDestroy() {
    console.log("OKAY!!!!");
    this.updateTasks();
  },
  mounted() {
    this.getTasks();
    if (this.$store.state.userName === "Wayne Bruton" || this.$store.state.userName === "Wayne Bruton" || this.$store.state.userName === "Wayne Bruton") {
      this.disabled = false
    }
    if (this.$store.state.userName === "Wayne Bruton") {
      this.group1 = "group";
      this.group2 = "group";
      this.group3 = "group";
      this.group4 = "group";
    } else {
      this.group1 = "group1";
      this.group2 = "group2";
      this.group3 = "group3";
      this.group4 = "group4";
    }
  },
  methods: {
    async getTasks() {
      this.items = [];
      this.items1 = [];
      this.items2 = [];
      this.items3 = [];
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getTaskList`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            response.data.forEach(el => {
              if (el.typeTask === "WIP") {
                this.items.push(el);
              } else if (el.typeTask === "Suggested") {
                this.items1.push(el);
              } else if (el.typeTask === "Completed") {
                this.items2.push(el);
              } else if (el.typeTask === "Finalised") {
                this.items3.push(el);
              }
            });
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async updateTasks() {
      let dataToUpdate = [];
      this.items.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });
      this.items1.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });
      this.items2.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });
      this.items3.forEach((el, index) => {
        el.sortIndex = index;
        dataToUpdate.push(el);
      });

      let data = {
        info: dataToUpdate
      };
      await axios({
        method: "post",
        url: `${url}/updateTaskList`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    async saveTask() {
      let insert = {
        development: this.$store.state.development.id,
        taskText: this.text,
        taskTitle: this.title,
        userName: this.userName,
        icon: "mdi-thought-bubble",
        typeTask: "Suggested", 
        sortIndex: this.items1.length,
        estimate: this.estimate
      };
      await axios({
        method: "post",
        url: `${url}/createTaskListItem`,
        data: insert
      })
        .then(
          response => {
            console.log(response.data);
            this.items1.push(insert);
            this.title = "";
            this.text = "";
            this.dialog = false;
            this.getTasks();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    items1Changed(evt) {
      console.log(evt);
      if (evt.added) {
        console.log(evt.added.element.id);

        this.items1.forEach(el => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-thought-bubble";
            el.typeTask = "Suggested";
          }
        });
      }
      if (evt.moved) {
        this.items1.forEach(el => {
          if (el.id === evt.moved.element.id) {
            el.sortIndex = evt.moved.newIndex;
            console.log(evt.moved.element.id);
          }
        });
      }
    },
    itemsChanged(evt) {
      if (evt.added) {
        console.log(evt.added.element.id);

        this.items.forEach(el => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-progress-wrench";
            el.typeTask = "WIP";
          }
        });
      }
    },
    items2Changed(evt) {
      if (evt.added) {
        console.log(evt.added.element.id);
        this.items2.forEach(el => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-checkbox-marked-circle";
            el.typeTask = "Completed";
          }
        });
      }
    },
    items3Changed(evt) {
      if (evt.added) {
        console.log(evt.added.element.id);

        this.items3.forEach(el => {
          if (el.id === evt.added.element.id) {
            el.icon = "mdi-emoticon-happy";
            el.typeTask = "Finalised";
          }
        });
      }
    },
    viewTask(event) {
      console.log(event.currentTarget.id);
      let filteredData = this.items1.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      console.log(filteredData);
      this.viewOnly = true;
      this.title = filteredData[0].taskTitle;
      this.text = filteredData[0].taskText;
      this.estimate = filteredData[0].estimate
      this.dialog = true;
    },
    editTask(event) {
      console.log(event.currentTarget.id);
      let filteredData = this.items1.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      console.log(filteredData);
      this.title = filteredData[0].taskTitle;
      this.text = filteredData[0].taskText;
      this.estimate = filteredData[0].estimate
      this.editId = parseInt(event.currentTarget.id)
      this.dialog1 = true;
    },
    saveEditTask() {
      this.items1.forEach((el) => {
        if (el.id === this.editId) {
          console.log(el)
          el.taskText = this.text
          el.estimate = this.estimate
          el.taskTitle = this.title
        }
      })
      this.dialog1 = false

    },
    closeView() {
      this.dialog = false;
      this.viewOnly = false;
    },
    async deleteTask(event) {
      console.log(event.currentTarget.id);
      let data = {
        id: event.currentTarget.id
      };
      await axios({
        method: "post",
        url: `${url}/deleteTaskListItem`,
        data: data
      })
        .then(
          response => {
            console.log(response.data);
            this.getTasks();
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

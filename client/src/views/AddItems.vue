<template>
  <div>
    <br /><br />
    <v-card class="mx-auto" max-width="80%">
      <v-toolbar color="#0F0F0F" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Task Items</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = true">
          <v-icon>mdi-text-box-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list two-line>
        <v-list-item-group
          v-model="selected"
          active-class="blue--text"
          multiple
        >
          <template v-for="item in items">
            <v-list-item :key="item.id">
              <v-list-item-content>
                <v-list-item-title v-text="item.taskName"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <div>
                  <v-btn :id="item.id" text @click="deleteTask($event)"
                    ><v-icon color="red">mdi-delete</v-icon></v-btn
                  >
                  <v-btn :id="item.id" text @click="editTask($event)"
                    ><v-icon color="green"
                      >mdi-file-document-edit</v-icon
                    ></v-btn
                  >
                </div>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Add TaskType</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Task Name"
                    v-model="taskName"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#0F0F0F" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#0F0F0F" text @click="addTask" v-show="taskName">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackbarMessage }}
      <v-btn color="pink" text timeout="10000" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "additems",
  metaInfo: {
    title: "Add Items",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `Add Items here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      selected: [2],
      dialog: false,
      taskName: "",
      snackbarMessage: "This functionality still coming",
      snackbar: false,
      items: [
        {
          id: 1,
          taskName: "Electrical"
        }
      ]
    };
  },
  mounted() {
    this.checkToken();
    this.getTasks();
  },
  methods: {
    async getTasks() {
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "get",
        url: `${url}/taskTypes/${this.$store.state.development.id}`
        // data: data
      })
        .then(
          response => {
            this.items = response.data;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    editTask(event) {
      let targetId = event.currentTarget.id;
      console.log(targetId);
      this.snackbar = true;
    },
    deleteTask(event) {
      let targetId = event.currentTarget.id;
      console.log(targetId);
      this.snackbar = true;
    },
    async addTask() {
      let data = {
        development: this.$store.state.development.id,
        taskName: this.taskName
      };
      axios.defaults.headers.common["Authorization"] = this.$store.state.token;
      await axios({
        method: "post",
        url: `${url}/addTaskTypes`,
        data: data
      })
        .then(
          response => {
            console.log(response);
            this.dialog = false;
            this.taskName = "";

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

<template>
  <div>
    <v-col cols="auto">
      <v-dialog
        transition="dialog-top-transition"
        max-width="600"
        v-model="dialog"
        persistent
      >
        <v-card>
          <v-toolbar color="#0F0F0F" dark>Choose Development</v-toolbar>
          <v-card-text>
            <div class="text-h4 pa-12">Developments</div>
            <v-col cols="12">
              <v-autocomplete
                v-model="value"
                :items="items"
                item-text="developmentName"
                dense
                filled
                label="Development"
              ></v-autocomplete>
            </v-col>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="chooseDevelopment">Choose</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  data() {
    return {
      dialog: true,
      items: [],
      value: null
    };
  },
  async mounted() {
    axios.defaults.headers.common["Authorization"] = this.$store.state.token;
    await axios({
      method: "get",
      url: `${url}/development2`
    })
      .then(
        response => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          this.items = response.data;
          this.value = response.data[0].developmentName;
        },
        error => {
          console.log(error);
        }
      )
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    chooseDevelopment() {
      let development = this.items.filter(el => {
        return el.developmentName === this.value;
      });
      this.$store.dispatch("chooseDevelopment", development[0]);
      this.dialog = false;
    }
  }
};
</script>

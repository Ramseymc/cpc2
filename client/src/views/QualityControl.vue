<template>
  <div class="about">
    <br /><br /><br /><br />

    <h1>Quality Control</h1>
    <h3 v-if="taskTypeChosen.length" style="color: #0F0F0F;">
      {{ taskTypeChosen }}
    </h3>
    <br />
    <v-btn
      text
      v-if="items.length"
      @click="showChoices = !showChoices"
      color="#0F0F0F"
      >Amend Selection</v-btn
    >
    <br />
    <br />
    <v-card v-if="showChoices" class="mx-auto" max-width="1050" tile>
      <br />
      <v-col v-if="subsection.length" :cols="10" :offset="1">
        <v-autocomplete
          v-model="subsectionChosen"
          :items="subsection"
          item-text="subsectionName"
          label="Choose Block"
          chips
          shaped
          filled
          outlined
          prepend-icon="mdi-tag-heart"
          color="#0F0F0F"
          item-color="#0F0F0F"
          @change="getUnits"
        ></v-autocomplete>
      </v-col>
      <v-col v-if="units.length" :cols="10" :offset="1">
        <v-autocomplete
          v-model="unitChosen"
          :items="units"
          item-text="unitName"
          label="Choose Unit"
          chips
          shaped
          filled
          outlined
          prepend-icon="mdi-tag-heart"
          color="#0F0F0F"
          item-color="#0F0F0F"
          @change="getTaskTypes"
        ></v-autocomplete>
      </v-col>
      <v-col v-if="taskType.length" :cols="10" :offset="1">
        <v-autocomplete
          v-model="taskTypeChosen"
          :items="taskType"
          item-text="shortName"
          label="Quality Check"
          chips
          shaped
          filled
          outlined
          prepend-icon="mdi-tag-heart"
          color="#0F0F0F"
          item-color="#0F0F0F"
          @change="getQC"
        ></v-autocomplete>
      </v-col>
    </v-card>
    <QControl
      :unit="unitChosen"
      :section="subsectionChosen"
      :QualityType="qualityType"
      :close="showComponent"
      @closed="closed"
      v-if="showComponent"
    />
  </div>
</template>

<script>
import axios from "axios";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "QualityControl",
  components: {
    QControl: () => import("../components/QControl")
  },
  metaInfo: {
    title: "Quality Control",
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
      subsection: [],
      subsectionChosen: [],
      units: [],
      unitChosen: [],
      taskType: [],
      taskTypeChosen: [],
      items: [],
      showChoices: true,

      // showElectrical: false,
      // showBalustrades: false,
      // showTimberandIron: false,
      showComponent: false,
      qualityType: "",
      disciplineType: [
        "electrical",
        "balustrades",
        "timberIron",
        "glazing",
        "structuralSteel"
      ]
    };
  },
  mounted() {
    this.getSubsections();
    this.processNotifications();
  },
  methods: {
    choose(event) {
      console.log(event.currentTarget.id);
      console.log(this.disciplineType[parseInt(event.currentTarget.id)]);
      this.qualityType = this.disciplineType[parseInt(event.currentTarget.id)];
      this.showComponent = true;
    },
    getQC() {
      this.qualityType = this.taskTypeChosen;
      console.log(this.qualityType);
      this.showComponent = true;
      this.taskTypeChosen = [];
    },
    // getBalustrades() {
    //   this.showBalustrades = true
    //   this.qualityType = "Handrails & Balustrades"
    // },
    closed(event) {
      console.log(event);
      this.showComponent = event;
    },
    getSubsections() {
      this.units = [];
      this.unitChosen = [];
      this.taskType = [];
      this.taskTypeChosen = [];
      this.items = [];
      let parameter = this.$store.state.development.id;
      this.developmentParam = parameter;
      axios({
        method: "get",
        url: `${url}/subsection/${parameter}`
      }).then(
        response => {
          if (response.data.success === false) {
            return this.$router.push({ name: "Login" });
          }
          this.subsection = response.data;
          console.log(response.data);
        },
        error => {
          console.log(error);
        }
      );
    },
    getUnits() {
      this.taskType = [];
      this.taskTypeChosen = [];
      this.items = [];
      let parameter = "";
      if (this.subsection.length) {
        let unit = this.subsection.filter(el => {
          return el.subsectionName === this.subsectionChosen;
        });
        parameter = unit[0].id;
        this.subsectionParam = parameter;
        axios({
          method: "get",
          url: `${url}/getUnits/${this.developmentParam}/${this.subsectionParam}`
        }).then(
          response => {
            this.units = response.data;

            this.units.forEach(el => {
              if (el.unitName.substring(1, 2) === ".") {
                this.units.push(this.units.shift()); // results in [1, 2, 3, 4, 5, 6, 7, 8]
              }
            });
          },
          error => {
            console.log(error);
          }
        );
      }
    },
    getTaskTypes() {
      // this.taskType = this.disciplineType
      // this.taskType = [];
      this.taskTypeChosen = [];
      // this.items = [];
      // let parameter = "";
      // if (this.units.length) {
      //   let unit = this.units.filter(el => {
      //     return el.unitName === this.unitChosen;
      //   });
      //   parameter = unit[0].id;
      //   this.unitParam = parameter;

      axios({
        method: "get",
        url: `${url}/qcshortname`
      }).then(
        response => {
          this.taskType = response.data;
          console.log(response.data);
        },
        error => {
          console.log(error);
        }
      );
    }

    // closedE(event) {
    //   console.log("ELEC", event);
    //   this.showElectrical = event;
    // },
    // closedB(event) {
    //   console.log("BAL", event);
    //   this.showBalustrades = event;
    // },
    // closedT(event) {
    //   console.log("TIM", event);
    //   this.showTimberandIron = event;
    // }
  }
};
</script>

<style scoped>
.qualityList {
  list-style: none;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>

<template>
  <div>
    <!-- <v-dialog v-model="dialog" max-width="50%"> -->
    <v-card class="mxauto" max-width="100%">
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <div class="container">
        <div class="row">
          <div class="col-12 mt-2" style="border: 1px solid black;">
            <VueSignaturePad
              id="signature"
              width="100%"
              height="200px"
              ref="signaturePad"
              :options="options"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-3 mt-2">
            <v-btn text @click="undo">
              Undo
            </v-btn>
          </div>
          <div class="col-3 mt-2">
            <v-btn text @click="save">
              Save
            </v-btn>
          </div>
          <div class="col-3 mt-2" v-if="options.penColor === '#000'">
            <v-btn text @click="change">
              Blue
            </v-btn>
          </div>
          <div class="col-3 mt-2" v-if="options.penColor === '#00f'">
            <v-btn text @click="resume">
              Black
            </v-btn>
          </div>
          <div class="col-3 mt-2">
            <v-btn text @click="closeSig($event)">Close</v-btn>
          </div>
        </div>
      </div>
    </v-card>
    <!-- </v-dialog> -->
  </div>
</template>

<script>
export default {
  name: "Signature",
  props: {
    dialog: Boolean,
    title: String
  },
  data() {
    return {
      // dialog: true,
      options: {
        penColor: "#000"
      }
    };
  },
  mounted() {
    this.undo();
  },
  methods: {
    closeSig() {
      this.$emit("done", true);
      this.undo();
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      //   alert("Open DevTools see the save data.");
      console.log(isEmpty);
      if (!isEmpty) {
        this.$emit("signatureFile", { title: this.title, data });
        this.$emit("done", true);
        this.undo();
      }
    },
    change() {
      this.options = {
        penColor: "#00f"
      };
    },
    resume() {
      this.options = {
        penColor: "#000"
      };
    }
  }
};
</script>

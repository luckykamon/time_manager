<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="success" dark v-bind="attrs" v-on="on">Ajouter</v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">Ajouter un working time</v-card-title>
        <v-card-text>
          <div class="timepicker">
            <v-datetime-picker
              label="Select start date"
              v-model="startDate"
            ></v-datetime-picker>
          </div>
          <div class="timepicker">
            <v-datetime-picker
              label="Select end date"
              v-model="endDate"
            ></v-datetime-picker>
          </div>
          <v-text-field
            label="User"
            v-model="userId"
            type="number"
            color="#027186"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn color="green darken-1" text @click="createWorkingTime()">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'WorkingtimeAdd',
  data() {
    return {
      userId: null,
      dialog: false,
      startDate: null,
      endDate: null,
    }
  },
  methods: {
    createWorkingTime() {
      this.dialog = false
      let data = {
        start: this.startDate.getTime(),
        end: this.endDate.getTime(),
        userID: this.userId,
      }
      this.$emit('createWorkingTime', data)
    },
  },
}
</script>
<style>
.v-btn {
  margin: 0.5em;
}
</style>

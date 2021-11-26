<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="warning" fab x-small dark v-bind="attrs" v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">Modifier un working time</v-card-title>
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
          <v-btn color="green darken-1" text @click="updateWorkingTime()">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'WorkingtimeUpdate',
  data() {
    return {
      userId: this.workingTimes.userID,
      dialog: false,
      menu1: false,
      menu2: false,
      startDate: new Date(this.workingTimes.start),
      endDate: new Date(this.workingTimes.end),
    }
  },
  props: {
    workingTimes: {
      required: true,
    },
  },
  methods: {
    updateWorkingTime() {
      this.dialog = false
      let data = {
        id: this.workingTimes.workingtimeID,
        start: this.startDate.getTime(),
        end: this.endDate.getTime(),
        userID: this.userId,
      }
      this.$emit('updateWorkingTime', data)
    },
  },
}
</script>
<style>
.v-btn {
  margin: 0.5em;
}
</style>

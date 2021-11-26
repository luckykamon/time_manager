<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="warning" fab x-small dark v-bind="attrs" v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">Modifier un clock</v-card-title>
        <v-card-text>
          <div class="timepicker">
            <v-datetime-picker
              label="Select start date"
              v-model="time"
            ></v-datetime-picker>
          </div>
          <select v-model="status">
            <option value="" disabled selected>ClockIn</option>
            <option value="1">True</option>
            <option value="0">False</option>
          </select>
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
          <v-btn color="green darken-1" text @click="clock()">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'clockUpdate',
  data() {
    return {
      userId: this.clocks.userID,
      dialog: false,
      menu: false,
      status: this.clocks.status,
      time: new Date(this.clocks.time),
    }
  },
  props: {
    clocks: {
      required: true,
    },
  },
  methods: {
    clock() {
      this.dialog = false
      let data = {
        id: this.clocks.clockID,
        time: this.time.getTime(),
        status: this.status,
        userID: this.userId,
      }
      this.$emit('clock', data)
    },
  },
}
</script>
<style>
.v-btn {
  margin: 0.5em;
}
select {
  margin-top: 5px;
  width: 100%;
  font-size: 1.5vw;
  padding: 10px;
  border: black solid 1px;
  outline: none;
  border-radius: 5px;
}
</style>

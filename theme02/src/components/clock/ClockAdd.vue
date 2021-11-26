<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="success" dark v-bind="attrs" v-on="on">Ajouter</v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">Ajouter un clock</v-card-title>
        <v-card-text>
          <div class="timepicker">
            <v-datetime-picker
              label="Select start date"
              v-model="time"
            ></v-datetime-picker>
          </div>
          <select v-model="status">
            <option value="" disabled selected>ClockIn</option>
            <option value="1">Arrivée</option>
            <option value="0">Départ</option>
          </select>
          <v-text-field
            v-if="currentRole != 'user'"
            label="User"
            v-model="typedUserId"
            type="number"
            color="#027186"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn color="green darken-1" text @click="createClock()">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'clockAdd',
  data() {
    return {
      typedUserId: null,
      dialog: false,
      menu: false,
      status: null,
      time: null,
    }
  },
  props: {
    currentRole: {
      required: true,
    },
    userId: {
      required: true,
    },
  },
  methods: {
    createClock() {
      this.dialog = false
      let data = {}
      if (this.currentRole == 'user') {
        data = {
          time: this.time.getTime(),
          status: this.status,
          userID: this.userId,
        }
      } else {
        data = {
          time: this.time.getTime(),
          status: this.status,
          userID: this.typedUserId,
        }
      }
      this.$emit('createClock', data)
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
  font-size: 2vw;
  padding: 10px;
  border: black solid 1px;
  outline: none;
  border-radius: 5px;
}
</style>

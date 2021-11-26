<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="warning" fab x-small dark v-bind="attrs" v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">Modifier une équipe</v-card-title>
        <v-card-text>
          <v-text-field
            label="Nom de l'équipe"
            v-model="name"
            color="#027186"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn color="green darken-1" text @click="updateTeam()">
            Valider
          </v-btn>
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
      name: this.teams.name,
      dialog: false,
    }
  },
  props: {
    teams: {
      required: true,
    },
  },
  methods: {
    updateTeam() {
      this.dialog = false
      let data = {
        teamId: this.teams.teamID,
        name: this.name,
      }
      this.$emit('updateTeam', data)
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

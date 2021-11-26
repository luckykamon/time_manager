<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="success" dark v-bind="attrs" v-on="on">Ajouter</v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">Ajouter une équipe</v-card-title>
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
          <v-btn color="green darken-1" text @click="createTeam()">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'teamAdd',
  data() {
    return {
      name: null,
      dialog: false,
    }
  },
  methods: {
    createTeam() {
      this.dialog = false
      let data = {
        name: this.name,
      }
      this.$emit('createTeam', data)
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

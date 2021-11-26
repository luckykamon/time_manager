<template>
  <v-card>
    <v-card-title v-if="currentRole != 'user'">
      Ajouter ou modifier une équipe
    </v-card-title>
    <v-card-title v-else>
      Consulter vos équipes
    </v-card-title>
    <div class="ajout">
      <TeamAdd
        v-if="currentRole == 'general_manager'"
        @createTeam="createTeam"
      />
    </div>
    <v-simple-table class="table-align" fixed-header height="30em">
      <thead>
        <tr>
          <th v-if="currentRole != 'user'">TeamId</th>
          <th>Nom de l'équipe</th>
          <th>Consulter les utilisateurs</th>
          <th v-if="currentRole != 'user'">Modifier</th>
          <th v-if="currentRole == 'general_manager'">Supprimer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in teamsList" :key="team.teamID" class="text-left">
          <td v-if="currentRole != 'user'">{{ team.teamID }}</td>
          <td>{{ team.name }}</td>
          <td>
            <TeamUsersManager
              :team="team"
              :getTeamUsers="getTeamUsers"
              @deleteUserFromTeam="deleteUserFromTeam"
              @addUserInTeam="addUserInTeam"
            />
          </td>
          <td v-if="currentRole != 'user'">
            <TeamUpdate :teams="team" @updateTeam="updateTeam" />
          </td>
          <td v-if="currentRole == 'general_manager'">
            <v-btn color="error" fab x-small dark @click="confirmDelete(team)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-dialog v-model="confirm" max-width="500px">
      <v-card>
        <v-card-title>
          Confirmation de suppression
        </v-card-title>
        <v-card-text>
          <h3>Êtes-vous sûr de vouloir supprimer cette équipe?</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancel">
            Annuler
          </v-btn>
          <v-btn color="green darken-1" text @click="deleteTeam">
            Oui
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import TeamAdd from './TeamAdd.vue'
import TeamUpdate from './TeamUpdate.vue'
import TeamUsersManager from './TeamUsersManager.vue'
export default {
  name: 'teamManager',
  components: {
    TeamAdd,
    TeamUpdate,
    TeamUsersManager,
  },
  data() {
    return {
      teamsList: null,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      userId: JSON.parse(localStorage.getItem('user')).userID,
      confirm: false,
      teamToDelete: null,
    }
  },
  props: {
    getTeams: {
      required: true,
    },
    getTeamUsers: {
      required: true,
    },
  },
  methods: {
    createTeam(data) {
      this.$emit('createTeam', data)
    },
    updateTeam(data) {
      this.$emit('updateTeam', data)
    },
    cancel() {
      this.confirm = false
    },
    confirmDelete(data) {
      this.confirm = true
      this.teamToDelete = data
    },
    deleteTeam() {
      this.$emit('deleteTeam', this.teamToDelete.teamID)
    },
    deleteUserFromTeam(data) {
      this.$emit('deleteUserFromTeam', data)
    },
    addUserInTeam(data) {
      this.$emit('addUserInTeam', data)
    },
  },
  mounted() {
    this.teamsList = []
    this.teamsList = this.getTeams
  },
}
</script>
<style>
.ajout {
  text-align: left;
  padding-left: 0.5em;
}
.table-align {
  padding: 0.5em;
}
.v-btn {
  margin: 0.5em;
}
</style>

<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" fab x-small dark v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title v-if="currentRole != 'user'">
          Ajouter ou modifier les membres de l'équipe
        </v-card-title>
        <v-card-title v-else>
          Consulter les membres de l'équipe
        </v-card-title>
        <div class="ajout">
          <TeamAddUser
            v-if="currentRole != 'user'"
            :team="team"
            @addUserInTeam="addUserInTeam"
          />
        </div>
        <v-simple-table class="table-align" fixed-header height="30em">
          <thead>
            <tr>
              <th v-if="currentRole != 'user'">TeamId</th>
              <th>Nom de la team</th>
              <th v-if="currentRole != 'user'">UserId</th>
              <th>Nom d'utilisateur</th>
              <th v-if="currentRole != 'user'">Supprimer de l'équipe</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in getTeamUsers"
              :key="index"
              class="text-left"
            >
              <td v-if="user.teamID == team.teamID && currentRole != 'user'">
                {{ user.teamID }}
              </td>
              <td v-if="user.teamID == team.teamID">{{ user.name }}</td>
              <td v-if="user.teamID == team.teamID && currentRole != 'user'">
                {{ user.userID }}
              </td>
              <td v-if="user.teamID == team.teamID">{{ user.username }}</td>
              <td v-if="user.teamID == team.teamID && currentRole != 'user'">
                <v-btn
                  color="error"
                  fab
                  x-small
                  dark
                  @click="confirmDelete(user)"
                >
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
              <h3>
                Êtes-vous sûr de vouloir retirer l'utilisatuer de cette équipe?
              </h3>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="cancel">
                Annuler
              </v-btn>
              <v-btn color="green darken-1" text @click="deleteUserFromTeam">
                Oui
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TeamAddUser from './TeamAddUser.vue'
export default {
  name: 'teamUserManager',
  components: {
    TeamAddUser,
  },
  data() {
    return {
      dialog: false,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      userToDelete: null,
      confirm: false,
    }
  },
  props: {
    team: {
      required: true,
    },
    getTeamUsers: {
      required: true,
    },
  },
  methods: {
    cancel() {
      this.confirm = false
    },
    confirmDelete(data) {
      this.confirm = true
      this.userToDelete = data
    },
    deleteUserFromTeam() {
      let data = {
        userID: this.userToDelete.userID,
        teamID: this.userToDelete.teamID,
      }
      this.$emit('deleteUserFromTeam', data)
    },
    addUserInTeam(data) {
      this.$emit('addUserInTeam', data)
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

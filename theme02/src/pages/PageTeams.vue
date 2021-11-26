<template>
  <v-app>
    <v-card elevation="2" class="team-card-parent" color="#eeeeee">
      <v-card-title>Administrer les équipes</v-card-title>
      <v-card class="team-card">
        <Team
          v-if="fetched"
          :getTeams="getTeams"
          :getTeamUsers="getTeamUsers"
          @createTeam="createTeam"
          @updateTeam="updateTeam"
          @deleteTeam="deleteTeam"
          @deleteUserFromTeam="deleteUserFromTeam"
          @addUserInTeam="addUserInTeam"
        />
      </v-card>
    </v-card>
  </v-app>
</template>

<script>
import Team from '../components/team/TeamManager.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Team,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem('user')).userID,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      fetched: false,
    }
  },
  computed: {
    ...mapGetters('teams', ['getTeams']),
    ...mapGetters('teams', ['getTeamUsers']),
  },
  methods: {
    createTeam(data) {
      this.$store.dispatch('teams/createTeam', data).then(() => {
        location.reload()
      })
    },
    updateTeam(data) {
      this.$store.dispatch('teams/updateTeam', data).then(() => {
        location.reload()
      })
    },
    deleteTeam(data) {
      this.$store.dispatch('teams/deleteTeam', data).then(() => {
        location.reload()
      })
    },
    deleteUserFromTeam(data) {
      this.$store.dispatch('teams/deleteUserFromTeam', data).then(() => {
        location.reload()
      })
    },
    addUserInTeam(data) {
      this.$store.dispatch('teams/addUserInTeam', data).then(() => {
        location.reload()
      })
    },
  },
  mounted() {
    if (this.currentRole == 'general_manager') {
      this.$store.dispatch('teams/getAllTeams').then(() => {
        this.$store.dispatch('teams/getAllTeamUsers').then(() => {
          this.fetched = true
        })
      })
    } else {
      this.$store.dispatch('teams/getUserTeams', this.userId).then(() => {
        this.$store.dispatch('teams/getAllTeamUsers').then(() => {
          this.fetched = true
        })
      })
    }
  },
}
</script>
<style>
.team-card-parent {
  margin: 0.5em;
  text-align: center;
  height: 100%;
}
.team-card {
  margin: 0.5em;
  text-align: center;
}
</style>

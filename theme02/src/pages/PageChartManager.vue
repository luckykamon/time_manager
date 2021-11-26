<template>
  <v-app>
    <v-card elevation="2" class="chart-card-parent" color="#eeeeee">
      <v-card-title>Consulter les graphiques</v-card-title>
      <v-card class="chart-card">
        <ChartManager
            v-if="fetched"
            :getWorkingTimes="getWorkingTimes"
            :getUser="getUser"
            :getClocks="refresh"
            :getTeamsFromUser="getTeam"
            :getUsersFromTeam="getTeamUsers"
            @updateUser="updateUser"
        />
      </v-card>
    </v-card>
  </v-app>
</template>

<script>
import ChartManager from "../components/Charts/ChartManager";
import {mapGetters} from "vuex";

export default {
  components: {
    ChartManager,
  },
  data() {
    return {
      userId: 1,
      userChosenId: 1,
      userConnectedID: 2,
      // userConnectedID: JSON.parse(localStorage.getItem('user')).userID,
      teamID: 1, // team ID sera l'ID de la team dont l'userConnectedID fait parti
      fetched: false
    };
  },
  computed: {

    ...mapGetters("workingtimes", ["getWorkingTimes"]),
    ...mapGetters("users", ["getUser"]),
    ...mapGetters("clocks", ["refresh"]),
    ...mapGetters("teamConnect", ["getTeamUsers"]),
    ...mapGetters("teamConnect", ["getTeam"]),


  },
  methods: {
    updateUser(userChosenId) {
      this.fetched = false;
      this.userId = userChosenId;
      this.$store.dispatch("workingtimes/getUserWorkingTimes", this.userId)
      this.fetched = true;
    }
  },
  mounted() {
    this.$store.dispatch("clocks/getAllClocks")
    this.$store.dispatch("workingtimes/getAllWorkingTimes")
    this.$store.dispatch("users/getAllUsers")
    this.$store.dispatch("teamConnect/getTeamsFromUser", this.userConnectedID)
    this.$store.dispatch("teamConnect/getUsersFromTeam")

        .then(() => {
          this.fetched = true;
        });
  },
};
</script>

<style>
.chart-card-parent {
  margin: 0.5em;
  text-align: center;
  height: 100%;
}

.chart-card {
  margin: 0.5em;
  text-align: center;
}

</style>
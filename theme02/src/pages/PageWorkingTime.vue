<template>
  <v-app v-if="currentRole == 'general_manager'">
    <v-card elevation="2" class="workingtime-card-parent" color="#eeeeee">
      <v-card-title>Administrer les plannings</v-card-title>
      <v-card class="workingtime-card">
        <WorkingTime
          v-if="fetched"
          :getWorkingTimes="getWorkingTimes"
          @createWorkingTime="createWorkingTime"
          @updateWorkingTime="updateWorkingTime"
          @deleteWorkingTime="deleteWorkingTime"
        />
      </v-card>
    </v-card>
  </v-app>
</template>

<script>
import WorkingTime from '../components/workingTime/WorkingTimeGet.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    WorkingTime,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem('user')).userID,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      fetched: false,
    }
  },
  computed: {
    ...mapGetters('workingtimes', ['getWorkingTimes']),
  },
  methods: {
    createWorkingTime(data) {
      this.$store.dispatch('workingtimes/createWorkingTime', data).then(() => {
        location.reload()
      })
    },
    updateWorkingTime(data) {
      this.$store.dispatch('workingtimes/updateWorkingTime', data).then(() => {
        location.reload()
      })
    },
    deleteWorkingTime(data) {
      this.$store.dispatch('workingtimes/deleteWorkingTime', data).then(() => {
        location.reload()
      })
    },
  },
  mounted() {
    if (this.currentRole == 'general_manager') {
      this.$store.dispatch('workingtimes/getAllWorkingTimes').then(() => {
        this.fetched = true
      })
    }
  },
}
</script>
<style>
.workingtime-card-parent {
  margin: 0.5em;
  text-align: center;
  height: 100%;
}
.workingtime-card {
  margin: 0.5em;
  text-align: center;
}
</style>

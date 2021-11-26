<template>
  <v-app v-if="currentRole == 'general_manager'">
    <v-card elevation="2" class="clock-card-parent" color="#eeeeee">
      <v-card-title>Administrer les clocks</v-card-title>
      <v-card class="clock-card">
        <ClockManager
          v-if="fetched"
          :refresh="refresh"
          @createClock="createClock"
          @clock="clock"
        />
      </v-card>
    </v-card>
  </v-app>
</template>

<script>
import ClockManager from '../components/clock/ClockManager.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    ClockManager,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem('user')).userID,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      fetched: false,
    }
  },
  computed: {
    ...mapGetters('clocks', ['refresh']),
  },
  methods: {
    createClock(data) {
      this.$store.dispatch('clocks/createClock', data).then(() => {
        location.reload()
      })
    },
    clock(data) {
      this.$store.dispatch('clocks/clock', data).then(() => {
        location.reload()
      })
    },
  },
  mounted() {
    if (this.currentRole == 'general_manager') {
      this.$store.dispatch('clocks/getUserClocks', this.userId).then(() => {
        this.fetched = true
      })
    }
  },
}
</script>
<style>
.clock-card-parent {
  margin: 0.5em;
  text-align: center;
  height: 100%;
}
.clock-card {
  margin: 0.5em;
  text-align: center;
}
</style>

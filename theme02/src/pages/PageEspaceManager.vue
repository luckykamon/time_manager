<template>
  <v-app>
    <EspaceManager
      v-if="fetched && currentRole != 'user'"
      :refresh="refresh"
      :getWorkingTimes="getWorkingTimes"
      @createClock="createClock"
      @clock="clock"
      @createWorkingTime="createWorkingTime"
      @updateWorkingTime="updateWorkingTime"
      @deleteWorkingTime="deleteWorkingTime"
    />
  </v-app>
</template>

<script>
import EspaceManager from '../components/EspaceManager.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    EspaceManager,
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
    ...mapGetters('workingtimes', ['getWorkingTimes']),
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
    if (this.currentRole != 'user') {
      this.$store.dispatch('clocks/getUserClocks', this.userId).then(() => {
        this.$store
          .dispatch('workingtimes/getAllWorkingTimes', this.userId)
          .then(() => {
            this.fetched = true
          })
      })
      // this.$store.dispatch('clocks/getAllClocks').then(() => {
      //   this.$store
      //     .dispatch('workingtimes/getAllWorkingTimes', this.userId)
      //     .then(() => {
      //       this.fetched = true
      //     })
      // })
    }
  },
}
</script>

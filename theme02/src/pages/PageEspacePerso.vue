<template>
  <v-app>
    <EspacePerso
      v-if="fetched"
      :currentRole="currentRole"
      :user="getUser"
      :refresh="refresh"
      :getWorkingTimes="getWorkingTimes"
      @createClock="createClock"
      @clock="clock"
      @deleteUser="deleteUser"
      @updateUser="updateUser"
    />
  </v-app>
</template>

<script>
import EspacePerso from '../components/EspacePerso.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    EspacePerso,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem('user')).userID,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      fetched: false,
    }
  },
  computed: {
    ...mapGetters('users', ['getUser']),
    ...mapGetters('clocks', ['refresh']),
    ...mapGetters('workingtimes', ['getWorkingTimes']),
  },
  methods: {
    dispatchAll() {
      this.$store.dispatch('users/getUserById', this.userId).then(() => {
        this.$store.dispatch('clocks/getUserClocks', this.userId).then(() => {
          //this.$store.dispatch('clocks/getUserClocks', this.userId).then(() => {
          this.$store
            .dispatch('workingtimes/getUserWorkingTimes', this.userId)
            .then(() => {
              this.fetched = true
            })
        })
      })
    },
    updateUser(data) {
      data.userID = this.userId
      this.$store.dispatch('users/updateUser', data).then(() => {
        location.reload()
      })
    },
    deleteUser() {
      this.$store.dispatch('users/deleteUser', this.userId)
      this.$store.dispatch('account/logout')
      this.$router.push('/login').catch((e) => {
        console.error(e)
      })
    },
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
    this.dispatchAll()
  },
}
</script>

<template>
  <v-alert v-if="alert.type" shaped dismissible :type="alert.type">
    {{ alert.message }}
  </v-alert>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'alert',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      alert: 'alert/getAlert',
    }),
  },
  methods: {
    clearAlert() {
      this.$store.dispatch('alert/clear')
    },
  },
  watch: {
    $route() {
      // clear alert on location change
      this.clearAlert()
    },
  },
}
</script>

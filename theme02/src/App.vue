<template>
  <v-app id="app">
    <alert></alert>
    <router-view></router-view>
  </v-app>
</template>

<script>
import alert from '@/components/Alert.vue'
export default {
  name: 'App',
  components: {
    alert,
  },
}
</script>
<style>
#app {
  background-color: #027186;
  font-family: system-ui;
}
</style>

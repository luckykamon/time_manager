<template>
  <div class="text-center table-align">
    <v-card color="#eeeeee">
      <v-card-title>Administrer vos teams</v-card-title>
      <div class="container">
        <div class="top-content">
          <ClockManager
            :refresh="refresh"
            @createClock="createClock"
            @clock="clock"
          />
          <WorkingTime
            :getWorkingTimes="getWorkingTimes"
            @createWorkingTime="createWorkingTime"
            @updateWorkingTime="updateWorkingTime"
            @deleteWorkingTime="deleteWorkingTime"
          />
        </div>
        <div class="bot-content"></div>
      </div>
    </v-card>
  </div>
</template>
<script>
import ClockManager from '../components/clock/ClockManager.vue'
import WorkingTime from '../components/workingTime/WorkingTimeGet.vue'

export default {
  name: 'EspaceManager',
  components: {
    ClockManager,
    WorkingTime,
  },
  props: {
    refresh: {
      required: true,
    },
    getWorkingTimes: {
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    createClock(data) {
      this.$emit('createClock', data)
    },
    clock(data) {
      this.$emit('clock', data)
    },
    createWorkingTime(data) {
      this.$emit('createWorkingTime', data)
    },
    updateWorkingTime(data) {
      this.$emit('updateWorkingTime', data)
    },
    deleteWorkingTime(data) {
      this.$emit('deleteWorkingTime', data)
    },
  },
  mounted() {},
}
</script>
<style>
.table-align {
  margin: 0.5em;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.top-content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1em;
}
.bot-content {
  display: flex;
  flex-direction: column;
}
</style>

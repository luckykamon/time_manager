<template>
  <div class="text-center table-align">
    <v-card elevation="2">
      <v-card-title>
        Consulter votre planning
      </v-card-title>
      <v-simple-table class="table-align" fixed-header height="30em">
        <thead>
          <tr>
            <th>start</th>
            <th>end</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="workingtime in workingtimesList"
            :key="workingtime.workingtimeID"
            class="text-left"
          >
            <td>{{ workingtime.start }}</td>
            <td>{{ workingtime.end }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Workingtimes',
  data() {
    return {
      workingtimesList: null,
    }
  },
  props: {
    getWorkingTimes: {
      required: true,
    },
  },
  methods: {
    setDateFormat() {
      this.workingtimesList = this.getWorkingTimes
      this.workingtimesList.forEach((workingtime) => {
        let tempEnd = new Date(workingtime.end)
        let tempStart = new Date(workingtime.start)
        workingtime.end =
          tempEnd.getFullYear() +
          '-' +
          (tempEnd.getMonth() + 1) +
          '-' +
          tempEnd.getDate() +
          ' ' +
          tempEnd.getHours() +
          ':' +
          tempEnd.getMinutes() +
          ':' +
          tempEnd.getSeconds()
        workingtime.start =
          tempStart.getFullYear() +
          '-' +
          (tempStart.getMonth() + 1) +
          '-' +
          tempStart.getDate() +
          ' ' +
          tempStart.getHours() +
          ':' +
          tempStart.getMinutes() +
          ':' +
          tempStart.getSeconds()
      })
    },
  },
  mounted() {
    this.setDateFormat()
  },
}
</script>
<style>
.table-align {
  margin: 0.5em;
}
</style>

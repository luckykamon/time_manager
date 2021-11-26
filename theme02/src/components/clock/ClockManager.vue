<template>
  <v-card>
    <v-card-title>
      Ajouter ou modifier un clock
    </v-card-title>
    <div class="ajout">
      <ClockAdd
        @createClock="createClock"
        :currentRole="currentRole"
        :userId="userId"
      />
    </div>
    <v-simple-table class="table-align" fixed-header height="30em">
      <thead>
        <tr>
          <th v-if="currentRole != 'user'">ClockId</th>
          <th>Start dateTime</th>
          <th>ClockIn</th>
          <th v-if="currentRole != 'user'">UserId</th>
          <th>Modifier</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="aClock in clocksList"
          :key="aClock.clockID"
          class="text-left"
        >
          <td v-if="currentRole != 'user'">{{ aClock.clockID }}</td>
          <td>{{ aClock.time }}</td>
          <td v-if="aClock.status == 1">True</td>
          <td v-else>False</td>
          <td v-if="currentRole != 'user'">{{ aClock.userID }}</td>
          <td>
            <ClockUpdate :clocks="aClock" @clock="clock" />
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import ClockAdd from './ClockAdd.vue'
import ClockUpdate from './ClockUpdate.vue'
export default {
  name: 'clockManager',
  components: {
    ClockAdd,
    ClockUpdate,
  },
  data() {
    return {
      clocksList: null,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      userId: JSON.parse(localStorage.getItem('user')).userID,
    }
  },
  props: {
    refresh: {
      required: true,
    },
  },
  methods: {
    setDateFormat() {
      this.clocksList = this.refresh
      this.clocksList.forEach((clock) => {
        let tempTime = new Date(clock.time)
        clock.time =
          tempTime.getFullYear() +
          '-' +
          (tempTime.getMonth() + 1) +
          '-' +
          tempTime.getDate() +
          ' ' +
          tempTime.getHours() +
          ':' +
          tempTime.getMinutes() +
          ':' +
          tempTime.getSeconds()
      })
    },
    createClock(data) {
      this.$emit('createClock', data)
    },
    clock(data) {
      this.$emit('clock', data)
    },
  },
  mounted() {
    this.setDateFormat()
  },
}
</script>
<style>
.ajout {
  text-align: left;
  padding-left: 0.5em;
}
.table-align {
  padding: 0.5em;
}
.v-btn {
  margin: 0.5em;
}
</style>

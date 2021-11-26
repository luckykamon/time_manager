<template>
  <div>
    Voir les working times de l'utilisateur :

    <select v-if="fetched" id="selectUser" v-model="userChosen.id">
      <option
        v-for="user in userPickList"
        v-bind:key="user.userID"
        v-bind:value="user.userID"
      >
        {{ user.username }}
      </option>
    </select>

    <button className="Button big" @click="initiateBarList(userChosen.id)">
      Valider
    </button>

    <br />
    <br />
    Planning de l'employee ID {{ userChosen.id }} cette semaine:
    <br />

    <ChartBarStacked
      :GETworkingtimesListBar="GETworkingtimesListBar"
      ref="rendChart2"
    />
    <br />

    Absences de l'employé ID {{ userChosen.id }} cette semaine:

    <AbsenceDoughnut
      v-if="currentRole != 'user'"
      :presenceAbsence="presenceAbsence"
      ref="rendChartABS"
    />
    <br />
    <p v-if="messageAbsenceNegative">
      Attention, l'employé a été présent + de jours que prévu
    </p>
    Comparaison des heures travaillées dans mon équipe :
    <br />
    <ChartTeamClocks
      v-if="currentRole != 'user'"
      :teamList="teamList"
      ref="rendChart3"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import ChartBarStacked from '@/components/Charts/ChartBarStacked'
import ChartTeamClocks from '@/components/Charts/ChartTeamClocks'
import AbsenceDoughnut from '@/components/Charts/AbsenceDoughnut'

export default {
  name: 'ChartManager',
  extends: Bar,
  data() {
    return {
      fetched: false,
      currentRole: JSON.parse(localStorage.getItem('user')).role,
      currentUserID: JSON.parse(localStorage.getItem('user')).userID,
      usersList: [0], //API getUser
      userPickList: [0],
      workingtimesList: [0], // API getWorkingTimes
      userChosen: {
        name: 'Lucas',
        id: 1,
      },
      // chartBAR
      GETworkingtimesListBar: [0],
      //chartAREA
      teamList: [0], // list of teams, unused for now
      teamsFromUser: [0], //API getTeamsFromUser - list of teams of selected user (connected one)
      usersFromTeamList: [0], // API getUsersFromTeam - all users from the team of the connected user
      userNamesFromTeamList: ['JeanMichel', 'Taz'],
      clockListRaw: [0], // API getClocks (all)
      FinalClockList: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ], //Final ClockList to send to component
      tableauTimeWeekDebut: [0, 0, 0, 0, 0, 0, 0],
      tableauTimeWeekFin: [0, 0, 0, 0, 0, 0, 0],
      // DOUGHNUT
      presenceAbsence: [2, 1], // [0] en Presence et [1] en Absence
      presencePlanned: 0,
      presenceWorked: 0,
      messageAbsenceNegative: 0,
    }
  },
  props: {
    getWorkingTimes: {
      required: true,
    },
    getUser: {
      required: true,
    },
    getClocks: {
      required: true,
    },
    getTeamsFromUser: {
      required: true,
    },
    getUsersFromTeam: {
      required: true,
    },
  },
  methods: {
    // InitiateBarList is working
    initiateBarList(userChosenId) {
      this.GETworkingtimesListBar = [0]
      let row = 0
      for (let i = 0; i < this.workingtimesList.length; i++) {
        if (this.workingtimesList[i].userID == userChosenId) {
          this.GETworkingtimesListBar[row] = this.workingtimesList[i]
          row++
        }
      }
      let child2 = this.$refs.rendChart2
      child2.rendChartBar()
      this.sendDoughnut()
    },

    sendClocksToAreaChart() {
      let now = new Date()
      let adjustmentDay = now.getDay() - 1
      let thisMonday = now.getDate() - adjustmentDay
      let thisMonth = now.getMonth()
      let thisYear = now.getFullYear()

      this.clockListRaw = this.getClocks

      for (let i = 0; i < this.usersFromTeamList.length; i++) {
        for (let u = 0; u < this.usersList.length; u++) {
          if (this.usersList[u].userID == this.usersFromTeamList[i].userID) {
            this.userNamesFromTeamList[i] = this.usersList[u].username
          }
        }

        this.tableauTimeWeekDebut = [0, 0, 0, 0, 0, 0, 0]
        this.tableauTimeWeekFin = [0, 0, 0, 0, 0, 0, 0]
        for (let j = 0; j < this.clockListRaw.length; j++) {
          if (this.clockListRaw[j].userID == this.usersFromTeamList[i].userID) {
            let clockDate = new Date(this.clockListRaw[j].time)

            for (let day = 0; day < 7; day++) {
              if (
                this.clockListRaw[j].status == 1 &&
                clockDate.getMonth() === thisMonth &&
                clockDate.getFullYear() === thisYear &&
                clockDate.getDate() === thisMonday + day
              ) {
                this.tableauTimeWeekDebut[day] += clockDate.getHours()
              } else if (
                this.clockListRaw[j].status == 0 &&
                clockDate.getMonth() === thisMonth &&
                clockDate.getFullYear() === thisYear &&
                clockDate.getDate() === thisMonday + day
              ) {
                this.tableauTimeWeekFin[day] += clockDate.getHours()
              }
            }
          }
        }
        for (let day = 0; day < 7; day++) {
          this.FinalClockList[i][day] +=
            Math.floor(
              (this.tableauTimeWeekFin[day] - this.tableauTimeWeekDebut[day]) *
                10,
            ) / 10
        }
      }
      let child3 = this.$refs.rendChart3
      child3.rendAreaChart(this.FinalClockList, this.userNamesFromTeamList)
    },

    sendDoughnut() {
      this.presenceAbsence = [0, 0]
      this.presencePlanned = 0
      this.presenceWorked = 0
      this.messageAbsenceNegative = 0
      let now = new Date()
      let adjustmentDay = now.getDay() - 1
      let thisMonday = now.getDate() - adjustmentDay
      let thisMonth = now.getMonth()
      let thisYear = now.getFullYear()
      // GO THROUGH WORKINGTIMES PLANNING
      for (let i = 0; i < this.GETworkingtimesListBar.length; i++) {
        let debut = new Date(this.workingtimesList[i].start)
        if (
          debut.getMonth() === thisMonth &&
          debut.getFullYear() === thisYear
        ) {
          if (
            debut.getDate() >= thisMonday ||
            debut.getDate() <= thisMonday + 6
          ) {
            this.presencePlanned++
          }
        }
      }
      // GO THROUGH CLOCKS - TIME REALLY WORKED
      for (let j = 0; j < this.clockListRaw.length; j++) {
        if (
          this.clockListRaw[j].userID == this.userChosen.id &&
          this.clockListRaw[j].status === 1
        ) {
          let debut = new Date(this.clockListRaw[j].time)
          if (
            debut.getMonth() === thisMonth &&
            debut.getFullYear() === thisYear
          ) {
            if (
              debut.getDate() >= thisMonday ||
              debut.getDate() <= thisMonday + 6
            ) {
              this.presenceWorked++
            }
          }
        }
      }
      this.presenceAbsence[0] = this.presenceWorked
      this.presenceAbsence[1] = this.presencePlanned - this.presenceWorked

      if (this.presenceAbsence[1] < 0) {
        this.messageAbsenceNegative = 1
        this.presenceAbsence[1] = 0
      }
      let childABS = this.$refs.rendChartABS
      childABS.rendChartABS(this.presenceAbsence)
    },

    initiateUserList() {
      for (let i = 0; i < this.usersFromTeamList.length; i++) {
        for (let j = 0; j < this.usersList.length; j++) {
          if (this.usersList[j].userID === this.usersFromTeamList[i].userID) {
            this.userPickList[i] = this.usersList[j]
          }
        }
      }
    },

    fetching() {
      this.usersList = this.getUser
      this.clockListRaw = this.getClocks
      this.workingtimesList = this.getWorkingTimes
      this.usersFromTeamList = this.getUsersFromTeam
      this.teamsFromUser = this.getTeamsFromUser
    },
  },

  components: {
    ChartBarStacked,
    ChartTeamClocks,
    AbsenceDoughnut,
  },
  async mounted() {
    this.fetched = false
    await this.fetching()
    await this.initiateUserList()
    await this.sendClocksToAreaChart()
    this.fetched = true
  },
}
</script>
<style scoped>
.big {
  font-size: larger;
  font-weight: bold;
}
</style>

<template>
  <v-card>
    <v-card-title>
      Ajouter ou modifier un planning
    </v-card-title>
    <div class="add-workingtime">
      <WorkingTimeAdd @createWorkingTime="createWorkingTime" />
    </div>
    <v-simple-table fixed-header class="table-align" height="30em">
      <thead>
        <tr>
          <th>workingTimeId</th>
          <th>start</th>
          <th>end</th>
          <th>userId</th>
          <th>Modifier</th>
          <th>Supprimer</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="workingtime in workingtimesList"
          :key="workingtime.workingtimeID"
          class="text-left"
        >
          <td>{{ workingtime.workingtimeID }}</td>
          <td>{{ workingtime.start }}</td>
          <td>{{ workingtime.end }}</td>
          <td>{{ workingtime.userID }}</td>
          <td>
            <WorkingTimeUpdate
              :workingTimes="workingtime"
              @updateWorkingTime="updateWorkingTime"
            />
          </td>
          <td>
            <v-btn
              color="error"
              fab
              x-small
              dark
              @click="confirmDelete(workingtime)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-dialog v-model="confirm" max-width="500px">
      <v-card>
        <v-card-title>
          Confirmation de suppression
        </v-card-title>
        <v-card-text>
          <h3>Êtes-vous sûr de vouloir supprimer ce working time?</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancel">
            Annuler
          </v-btn>
          <v-btn color="green darken-1" text @click="deleteWorkingTime">
            Oui
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import WorkingTimeAdd from './WorkingTimeAdd.vue'
import WorkingTimeUpdate from './WorkingTimeUpdate.vue'
export default {
  name: 'Workingtime',
  components: {
    WorkingTimeAdd,
    WorkingTimeUpdate,
  },
  data() {
    return {
      workingtimesList: null,
      confirm: false,
      workingTimeToDelete: null,
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
    createWorkingTime(data) {
      this.$emit('createWorkingTime', data)
    },
    updateWorkingTime(data) {
      this.$emit('updateWorkingTime', data)
    },
    cancel() {
      this.confirm = false
    },
    confirmDelete(data) {
      this.confirm = true
      this.workingTimeToDelete = data
    },
    deleteWorkingTime() {
      this.confirm = false
      this.$emit('deleteWorkingTime', {
        userID: this.workingTimeToDelete.userID,
        id: this.workingTimeToDelete.workingtimeID,
      })
    },
  },
  mounted() {
    this.setDateFormat()
  },
}
</script>
<style>
.add-workingtime {
  display: flex;
  text-align: center;
  padding-left: 0.5em;
}
.table-align {
  margin: 0.5em;
}
.v-btn {
  margin: 0.5em;
}
</style>

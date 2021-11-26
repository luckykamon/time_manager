<template>
  <div class="text-center table-align">
    <v-card color="#eeeeee">
      <v-card-title>Espace personnel de {{ username }}</v-card-title>
      <div class="container">
        <div class="top-content">
          <div class="content-left">
            <v-card>
              <v-card-title>
                Administrer votre compte
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Username"
                  v-model="username"
                  color="#027186"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  v-model="email"
                  color="#027186"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="error" text @click="confirmDelete()">
                  Supprimer le compte
                </v-btn>
                <v-btn color="green darken-1" text @click="updateUser()">
                  Valider les modifications
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-card>
              <v-card-title>
                Consulter vos graphiques
              </v-card-title>
              <v-card-text>
                <v-icon large color="#027186" @click="goToChart">
                  mdi-chart-bar
                </v-icon>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title v-if="currentRole != 'user'">
                Administrer vos équipes
              </v-card-title>
              <v-card-title v-else>
                Consulter vos équipes
              </v-card-title>
              <v-card-text>
                <v-icon large color="#027186" @click="goToTeams">
                  mdi-account-group
                </v-icon>
              </v-card-text>
            </v-card>
            <v-card v-if="currentRole != 'user'">
              <v-card-title>
                Accéder à l'espace manager
              </v-card-title>
              <v-card-text>
                <v-icon large color="#027186" @click="goToManagerSpace">
                  mdi-account-tie
                </v-icon>
              </v-card-text>
            </v-card>
          </div>
          <div class="content-right">
            <ClockManager
              :refresh="refresh"
              @createClock="createClock"
              @clock="clock"
            />
          </div>
        </div>
        <div class="bot-content">
          <WorkingTimes :getWorkingTimes="getWorkingTimes" />
        </div>
        <v-dialog v-model="confirm" max-width="500px">
          <v-card>
            <v-card-title>
              Confirmation de suppression
            </v-card-title>
            <v-card-text>
              <h3>Êtes-vous sûr de vouloir supprimer votre compte?</h3>
              <h3>
                Toute suppression est définitive et vos données seront perdues.
              </h3>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="cancel">
                Annuler
              </v-btn>
              <v-btn color="green darken-1" text @click="deleteUser">
                Oui
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>
<script>
import ClockManager from '../components/clock/ClockManager.vue'
import WorkingTimes from '../components/workingTime/WorkingTimesGet.vue'
export default {
  name: 'EspacePerso',
  components: {
    ClockManager,
    WorkingTimes,
  },
  props: {
    user: {
      required: true,
    },
    currentRole: {
      required: true,
    },
    refresh: {
      required: true,
    },
    getWorkingTimes: {
      required: true,
    },
  },
  data() {
    return {
      email: null,
      username: null,
      confirm: false,
    }
  },
  methods: {
    setData() {
      this.user.forEach((u) => {
        this.email = u.email
        this.username = u.username
      })
    },
    goToChart() {
      this.$router.push('/chartManager').catch((e) => {
        console.error(e)
      })
    },
    goToManagerSpace() {
      this.$router.push('/managers').catch((e) => {
        console.error(e)
      })
    },
    goToTeams() {
      this.$router.push('/teams').catch((e) => {
        console.error(e)
      })
    },
    updateUser() {
      let data = {
        userID: 0,
        username: this.username,
        email: this.email,
      }
      this.$emit('updateUser', data)
    },
    deleteUser() {
      this.$emit('deleteUser')
    },
    confirmDelete() {
      this.confirm = true
    },
    cancel() {
      this.confirm = false
    },
    createClock(data) {
      this.$emit('createClock', data)
    },
    clock(data) {
      this.$emit('clock', data)
    },
  },
  mounted() {
    this.setData()
  },
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
.content-left {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
</style>

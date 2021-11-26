<template>
  <v-app>
    <div id="nav">
      <div class="accueil">
        <router-link to="/">
          <img id="logo" src="time-manager.png" />
        </router-link>
      </div>
      <v-spacer />
      <div class="menu" v-if="currentRole == 'general_manager'">
        <router-link to="/managers">
          <v-icon large color="#027186">
            mdi-account-tie
          </v-icon>
        </router-link>
        |
        <router-link to="/users">
          <v-icon large color="#027186">
            mdi-account-edit
          </v-icon>
        </router-link>
        |
        <router-link to="/teams">
          <v-icon large color="#027186">
            mdi-account-group
          </v-icon>
        </router-link>
        |
        <router-link to="/workingtime">
          <v-icon large color="#027186">
            mdi-account-clock
          </v-icon>
        </router-link>
        |
        <router-link to="/chartManager">
          <v-icon large color="#027186">
            mdi-chart-bar
          </v-icon>
        </router-link>
        |
        <router-link to="/clocks">
          <v-icon large color="#027186">
            mdi-clock
          </v-icon>
        </router-link>
        |
        <v-icon large color="#027186" @click="logout">
          mdi-logout
        </v-icon>
      </div>
      <div class="menu" v-if="currentRole == 'manager'">
        <router-link to="/teams">
          <v-icon large color="#027186">
            mdi-account-group
          </v-icon>
        </router-link>
        |
        <router-link to="/managers">
          <v-icon large color="#027186">
            mdi-account-tie
          </v-icon>
        </router-link>
        |
        <router-link to="/chartManager">
          <v-icon large color="#027186">
            mdi-chart-bar
          </v-icon>
        </router-link>
        |
        <v-icon large color="#027186" @click="logout">
          mdi-logout
        </v-icon>
      </div>
      <div class="menu" v-if="currentRole == 'user'">
        <router-link to="/teams">
          <v-icon large color="#027186">
            mdi-account-group
          </v-icon>
        </router-link>
        |
        <router-link to="/chartManager">
          <v-icon large color="#027186">
            mdi-chart-bar
          </v-icon>
        </router-link>
        |
        <v-icon large color="#027186" @click="logout">
          mdi-logout
        </v-icon>
      </div>
    </div>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      currentRole: JSON.parse(localStorage.getItem('user')).role,
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('account/logout')
      this.$router.push('/login').catch((e) => {
        console.error(e)
      })
    },
  },
}
</script>
<style>
#logo {
  height: 3.3em;
  width: 14em;
  margin-top: -0.5em;
  overflow: none;
}
#nav {
  padding-top: 0.5em;
  height: 3.5em;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  border-bottom: 1px solid #e2e2e2;
}
.accueil {
  padding-left: 0.5em;
}
.menu {
  padding-right: 0.5em;
}
#nav a {
  font-weight: bold;
  color: #027186;
}
#nav a.router-link-exact-active {
  color: #022127;
}
</style>

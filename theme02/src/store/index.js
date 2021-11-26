import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users'
import workingtimes from './modules/workingtimes'
import clocks from './modules/clocks'
import account from './modules/account'
import alert from './modules/alert'
import teams from './modules/teams'
import teamConnect from './modules/teamConnect'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    users,
    workingtimes,
    clocks,
    account,
    alert,
    teams,
    teamConnect
  },
})

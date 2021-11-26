import router from '../../router/router'
import { userService } from '@/service/user-service'

const user = JSON.parse(localStorage.getItem('user'))
const state = () => ({
  user: user,
  status: { loggedIn: false },
})

const getters = {
  getStatus: (state) => {
    return state.status
  },
}

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true }
    state.user = user
  },
  loginFailure(state) {
    state.status = {}
    state.user = null
  },
  logout(state) {
    state.status = {}
    state.user = null
  },
}

const actions = {
  login({ dispatch, commit }, { username, password }) {
    commit('loginRequest', { username })

    userService.login(username, password).then((user) => {
      if (user.succes && user.succes === 'false') {
        commit('loginFailure', user.msg)
        dispatch('alert/error', user.msg, { root: true })
      } else {
        commit('loginSuccess', user)
        router.push('/')
      }
    })
  },
  logout({ commit }) {
    userService.logout()
    commit('logout')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

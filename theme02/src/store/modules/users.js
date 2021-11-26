import { HTTP } from '../../utils/http-common'

const state = () => ({
  users: [],
})

const getters = {
  getUser: (state) => {
    return state.users
  },
  copyright: () => {
    const currentYear = new Date().getFullYear()
    return `Copyright ${currentYear}`
  },
}

const mutations = {
  setUser(state, data) {
    state.users = data
  },
}

const actions = {
  getAllUsers({ commit }) {
    return HTTP.get('api/users/all')
      .then((response) => {
        commit('setUser', response.data)
      })
      .catch((e) => {
        console.error(e)
      })
  },
  getUserById({ dispatch, commit }, id) {
    return HTTP.get('api/users/' + id)
      .then((response) => {
        commit('setUser', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  getUsersByEmailUsername({ dispatch, commit }, data) {
    return HTTP.get(
      'api/users?email=' + data.getEmail + '&username=' + data.getUsername,
    )
      .then((response) => {
        commit('setUser', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  updateUser({ dispatch, commit }, user) {
    return HTTP.put('api/users/' + user.userID, user)
      .then((response) => {
        commit('setUser', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  addUser({ dispatch, commit }, user) {
    return HTTP.post('api/users', user)
      .then((response) => {
        commit('setUser', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  deleteUser({ dispatch, commit }, idUser) {
    return HTTP.delete('api/users/' + idUser)
      .then((response) => {
        commit('setUser', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

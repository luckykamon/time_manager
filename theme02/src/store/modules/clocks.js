import { HTTP } from '../../utils/http-common'

const state = () => ({
  clocks: null,
})
const mutations = {
  setClocks(state, data) {
    state.clocks = data
  },
}

const getters = {
  refresh: (state) => {
    return state.clocks
  },
}
const actions = {

  getUserClocks({ dispatch, commit }, userID) {
    return HTTP.get('api/clocks/' + userID)
      .then((response) => {
        commit('setClocks', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  getAllClocks({ dispatch, commit }) {
    return HTTP.get('api/clocks/')
      .then((response) => {
        commit('setClocks', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  createClock({ dispatch, commit }, data) {
    return HTTP.post('api/clocks/' + data.userID, data).then(() => {
      HTTP.get('api/clocks/' + data.userID)
        .then((response) => {
          commit('setClocks', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  clock({ dispatch, commit }, data) {
    return HTTP.put('api/clocks/' + data.id, data).then(() => {
      HTTP.get('api/clocks/' + data.userID)
        .then((response) => {
          commit('setClocks', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
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

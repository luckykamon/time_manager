import { HTTP } from '../../utils/http-common'

const state = () => ({
  workingtimes: null,
})
const mutations = {
  setWorkingTimes(state, data) {
    state.workingtimes = data
  },
}

const getters = {
  getWorkingTimes: (state) => {
    return state.workingtimes
  },
}
const actions = {
  getAllWorkingTimes({ dispatch, commit }) {
    return HTTP.get('api/workingtimes/')
      .then((response) => {
        commit('setWorkingTimes', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },

  getUserWorkingTimes({ dispatch, commit }, userId) {
    return HTTP.get('api/workingtimes/' + userId)
      .then((response) => {
        commit('setWorkingTimes', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  createWorkingTime({ dispatch, commit }, data) {
    return HTTP.post('api/workingtimes/' + data.userID, data).then(() => {
      HTTP.get('api/workingtimes/' + data.userID)
        .then((response) => {
          commit('setWorkingTimes', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  updateWorkingTime({ dispatch, commit }, data) {
    return HTTP.put('api/workingtimes/' + data.id, data).then(() => {
      HTTP.get('api/workingtimes/' + data.userID)
        .then((response) => {
          commit('setWorkingTimes', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  deleteWorkingTime({ dispatch, commit }, data) {
    return HTTP.delete('api/workingtimes/' + data.id).then(() => {
      HTTP.get('api/workingtimes/' + data.userID)
        .then((response) => {
          commit('setWorkingTimes', response.data)
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

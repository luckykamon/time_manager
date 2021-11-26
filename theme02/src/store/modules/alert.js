const state = {
  type: null,
  message: null,
}

const getters = {
  getAlert: (state) => {
    return { type: state.type, message: state.message }
  },
}

const mutations = {
  success(state, message) {
    state.type = 'success'
    state.message = message
  },
  error(state, message) {
    state.type = 'error'
    state.message = message
  },
  clear(state) {
    state.type = null
    state.message = null
  },
}

const actions = {
  success({ commit }, message) {
    commit('success', message)
  },
  error({ commit }, message) {
    commit('error', message)
  },
  clear({ commit }) {
    commit('clear')
  },
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

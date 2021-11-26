import { HTTP } from '../../utils/http-common'

const state = () => ({
  teams: [],
  users: null,
})
const mutations = {
  setTeams(state, data) {
    state.teams = data
  },
  setTeamUsers(state, data) {
    state.users = data
  },
  setUserTeams(state, data) {
    data.teams.forEach((ts) => {
      data.team.forEach((t) => {
        if (ts.teamID == t.teamID) {
          state.teams.push(ts)
        }
      })
    })
  },
}

const getters = {
  getTeams: (state) => {
    return state.teams
  },
  getTeamUsers: (state) => {
    return state.users
  },
}
const actions = {
  getAllTeams({ dispatch, commit }) {
    return HTTP.get('api/teams/')
      .then((response) => {
        commit('setTeams', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  getUserTeams({ dispatch, commit }, userId) {
    return HTTP.get('api/teams_connect/teams/' + userId).then((response) => {
      HTTP.get('api/teams/')
        .then((teamResponse) => {
          commit('setUserTeams', {
            team: response.data,
            teams: teamResponse.data,
          })
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  getTeamUsers({ dispatch, commit }, teamId) {
    return HTTP.get('api/teams_connect/users/' + teamId)
      .then((response) => {
        commit('setTeamUsers', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  getAllTeamUsers({ dispatch, commit }) {
    return HTTP.get('api/teams_connect/')
      .then((response) => {
        commit('setTeamUsers', response.data)
      })
      .catch((e) => {
        dispatch('alert/error', e, { root: true })
      })
  },
  createTeam({ dispatch, commit }, data) {
    return HTTP.post('api/teams/', data).then(() => {
      HTTP.get('api/teams/all/')
        .then((response) => {
          commit('setTeams', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  addUserInTeam({ dispatch, commit }, data) {
    return HTTP.post('api/teams_connect/', data).then(() => {
      HTTP.get('api/teams/all/')
        .then((response) => {
          commit('setTeams', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  updateTeam({ dispatch, commit }, data) {
    return HTTP.put('api/teams/' + data.teamId, data).then(() => {
      HTTP.get('api/teams/all/')
        .then((response) => {
          commit('setTeams', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  deleteUserFromTeam({ dispatch, commit }, data) {
    return HTTP.delete('api/teams_connect', data).then(() => {
      HTTP.get('api/teams/all/')
        .then((response) => {
          commit('setTeams', response.data)
        })
        .catch((e) => {
          dispatch('alert/error', e, { root: true })
        })
    })
  },
  deleteTeam({ dispatch, commit }, data) {
    return HTTP.delete('api/teams/' + data).then(() => {
      HTTP.get('api/teams/all/')
        .then((response) => {
          commit('setTeams', response.data)
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

import { HTTP } from '@/utils/http-common'

const state = () => ({
    TeamUsers_connect: [],
    Team_connect: [],
})

const testXadTeamID = 1

const getters = {
    getTeamUsers: (state) => {
        return state.TeamUsers_connect
    },
    getTeam: (state) => {
        return state.Team_connect
    },

    copyright: () => {
        const currentYear = new Date().getFullYear()

        return `Copyright ${currentYear}`
    },
}

const mutations = {
    setTeamUsers(state, data) {
        state.TeamUsers_connect = data
    },
    setTeam(state, data) {
        state.Team_connect = data
    },
}

const actions = {

    getUsersFromTeam({ commit }) {
        return HTTP.get('api/teams_connect/users/' + testXadTeamID)
            .then((response) => {
                commit('setTeamUsers', response.data)

            })
            .catch((e) => {
                console.error(e)
            })
    },
    getTeamsFromUser({ commit }, userID) {
        return HTTP.get('api/teams_connect/teams/' + userID)
            .then((response) => {
                commit('setTeam', response.data)
                this.testXadTeamID = response.data[0].teamID
            })
            .catch((e) => {
                console.error(e)
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

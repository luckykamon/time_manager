import axios from 'axios'

const URL = process.env.VUE_APP_URL_SERVEUR

export const userService = {
  login,
  logout,
}

function login(username, password) {
  let config = {
    method: 'get',
    url: URL + 'api/users?username=' + username + '&password=' + password,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return axios(config)
    .then((data) => {
      // login successful if there's a jwt token in the response
      if (data.data[0].jwt_token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(data.data[0]))
      }
      return data.data[0]
    })
    .catch(function () {
      return { succes: 'false', msg: 'Login ou mot de passe incorrect' }
    })
}
function logout() {
  localStorage.removeItem('user')
}

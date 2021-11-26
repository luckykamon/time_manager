export function authHeader() {
  // retourne authorization header avec jwt token
  let user = JSON.parse(localStorage.getItem('user'))
  if (user && user.jwt_token) {
    return { Authorization: 'Bearer ' + user.jwt_token }
  } else {
    return {}
  }
}

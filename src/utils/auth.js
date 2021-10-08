// import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'

export function getToken(TokenKey) {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

export function setToken(TokenKey, token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken(TokenKey) {
  // return Cookies.remove(TokenKey)
  return sessionStorage.clear()
}

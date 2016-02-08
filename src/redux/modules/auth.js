// import { actions as loading } from './loading'
import { createAction } from 'redux-actions'

let CLIENT_ID = '135058793686-m93p5sfrukker5hs09rl2gejr7k4uea1.apps.googleusercontent.com'
let SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly'
]

export const AUTH_ACCEPT = 'AUTH_ACCEPT'
function acceptResult (result) {
  return {
    type: AUTH_ACCEPT,
    result: result
  }
}

export const AUTH_CHECK = 'AUTH_CHECK'
export const initiate = createAction(AUTH_CHECK, (background, callback) => {
  window.checkAuth = function () {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: background
    }, callback)
  }

  let s = document.createElement('script')
  s.setAttribute('src', 'https://apis.google.com/js/client.js?onload=checkAuth')
  document.body.appendChild(s)
})

export const initiateBackground = (cb) => {
  return (dispatch, getState) => {
    // dispatch(loading.start('authenticating'))
    dispatch(initiate(true, (response) => {
      dispatch(acceptResult(response))
      // dispatch(loading.end('authenticating'))
    }))
  }
}

export const initiateForeground = (cb) => {
  return (dispatch, getState) => {
    // dispatch(loading.start('authenticating'))
    dispatch(initiate(false, (response) => {
      dispatch(acceptResult(response))
      // dispatch(loading.end('authenticating'))
    }))
  }
}

export const actions = {
  initiateForeground,
  initiateBackground,
  initiate
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function (state = {
  authenticating: false,
  isAuthenticated: false
}, action) {
  switch (action.type) {
    case AUTH_ACCEPT:
      return Object.assign({}, state, {
        authenticating: false,
        result: action.result
      })
    case AUTH_CHECK:
      return Object.assign({}, state, {
        authenticating: true
      })
    default:
      return state
  }
}

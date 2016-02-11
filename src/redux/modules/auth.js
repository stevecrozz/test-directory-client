import { actions as loading } from './loading'
import { createAction } from 'redux-actions'
import { routeActions } from 'react-router-redux'

let CLIENT_ID = '135058793686-m93p5sfrukker5hs09rl2gejr7k4uea1.apps.googleusercontent.com'
let SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly'
]

export const AUTH_ACCEPT = 'AUTH_ACCEPT'
function acceptResult (result, redirectTo) {
  return {
    type: AUTH_ACCEPT,
    result: result,
    redirectTo: redirectTo
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

  if (window.gapi) {
    window.checkAuth()
  } else {
    let s = document.createElement('script')
    s.setAttribute('src', 'https://apis.google.com/js/client.js?onload=checkAuth')
    document.body.appendChild(s)
  }
})

export const initiateBackground = () => {
  return (dispatch, getState) => {
    dispatch(loading.start('auth'))
    dispatch(initiate(true, (response) => {
      dispatch(acceptResult(response))
      dispatch(loading.end('auth'))
    }))
  }
}

export const initiateForeground = (redirectTo) => {
  return (dispatch, getState) => {
    // dispatch(loading.start('auth'))
    dispatch(initiate(false, (response) => {
      dispatch(acceptResult(response, redirectTo))
      dispatch(routeActions.push(redirectTo))
      // dispatch(loading.end('auth'))
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
  needBackgroundAuth: true,
  isAuthenticated: false
}, action) {
  switch (action.type) {
    case AUTH_ACCEPT:
      return Object.assign({}, state, {
        needBackgroundAuth: false,
        isAuthenticated: action.result && !action.result.error,
        result: Object.assign({}, action.result)
      })
    case AUTH_CHECK:
      return Object.assign({}, state, {
        needBackgroundAuth: true,
        isAuthenticated: false
      })
    default:
      return state
  }
}

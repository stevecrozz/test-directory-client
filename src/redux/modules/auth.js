import { actions as loading } from './loading'
import { createAction } from 'redux-actions'
import { routeActions } from 'react-router-redux'

let CLIENT_ID = '135058793686-m93p5sfrukker5hs09rl2gejr7k4uea1.apps.googleusercontent.com'
let SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly'
]

let gapiLoaded = new Promise((resolve, reject) => {
  if (window.gapi) {
    resolve()
  } else {
    window.gapiFinishedLoading = () => {
      resolve()
      delete window.gapiFinishedLoading
    }

    let s = document.createElement('script')
    s.setAttribute('src', 'https://apis.google.com/js/client.js?onload=gapiFinishedLoading')
    document.body.appendChild(s)
  }
})

export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS'
function authLoginSuccess (response, redirectTo) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    response: response,
    redirectTo: redirectTo
  }
}

export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE'
function authLoginFailure (response) {
  return {
    type: AUTH_LOGIN_FAILURE
  }
}

export const AUTH_LOGIN_INITIATE = 'AUTH_LOGIN_INITIATE'
export const initiate = createAction(AUTH_LOGIN_INITIATE, (callback) => {
  gapiLoaded.then(() => {
    var authArgs = {
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: false,
      authuser: -1
    }

    gapi.auth.authorize(authArgs, callback)
  })
})

export const initiateBackground = (redirectTo) => {
  return (dispatch, getState) => {
    gapiLoaded.then(() => {
      let currentTimestamp = Math.floor(Date.now() / 1000)
      let authResult = JSON.parse(window.localStorage.getItem('auth.response'))
      let expiresAt = authResult && window.parseInt(authResult.expires_at)

      if (expiresAt && expiresAt > currentTimestamp) {
        gapi.auth.setToken(authResult)
        dispatch(authLoginSuccess(authResult, redirectTo))
      } else {
        dispatch(authLoginFailure())
      }
    })
  }
}

export const initiateForeground = (redirectTo) => {
  return (dispatch, getState) => {
    dispatch(initiate((response) => {
      let authResponse = Object.assign({}, response)

      // g-oauth-window contains a reference to the child window which cannot
      // be accessed when blocked by the same origin policy so we have to strip
      // it out in order to store the rest of the response in the local session
      delete authResponse['g-oauth-window']
      window.localStorage.setItem('auth.response', JSON.stringify(authResponse))

      dispatch(authLoginSuccess(response, redirectTo))
      dispatch(routeActions.push(redirectTo))
      dispatch(loading.end('auth.login'))
    }))
    dispatch(loading.start('auth.login'))
  }
}

export const AUTH_LOGOUT_INITIATE = 'AUTH_LOGOUT_INITIATE'
export const logoutInitiate = createAction(AUTH_LOGOUT_INITIATE, () => {
  window.localStorage.removeItem('auth.response')
})

export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS'
export const logoutSuccess = createAction(AUTH_LOGOUT_SUCCESS, () => {
})

export const logout = (redirectTo) => {
  return (dispatch, getState) => {
    dispatch(loading.start('auth.logout'))
    dispatch(logoutInitiate())

    gapi.auth.signOut()

    // not actually async now, but could be if necessary
    let handleLogoutSuccess = () => {
      dispatch(logoutSuccess())
      dispatch(loading.end('auth.logout'))
      dispatch(routeActions.push('/'))
    }

    handleLogoutSuccess()
  }
}

export const actions = {
  initiateForeground,
  initiateBackground,
  initiate,
  logout
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function (state = {
  triedBackgroundAuth: false,
  isAuthenticated: false,
  isAuthenticating: false
}, action) {
  switch (action.type) {
    case AUTH_LOGIN_INITIATE:
      return Object.assign({}, state, {
        triedBackgroundAuth: true,
        isAuthenticated: false,
        isAuthenticating: true
      })
    case AUTH_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        triedBackgroundAuth: true,
        isAuthenticated: action.response && !action.response.error,
        isAuthenticating: false,
        response: Object.assign({}, action.response)
      })
    case AUTH_LOGIN_FAILURE:
      return Object.assign({}, state, {
        triedBackgroundAuth: true,
        isAuthenticated: false,
        isAuthenticating: false
      })
    case AUTH_LOGOUT_INITIATE:
      return state
    case AUTH_LOGOUT_SUCCESS:
      let newState = Object.assign({}, state, {
        isAuthenticated: false
      })

      delete newState.response

      return newState
    default:
      return state
  }
}

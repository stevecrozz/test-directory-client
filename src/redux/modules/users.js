// import fetch from 'isomorphic-fetch'
// import { createAction, handleAction } from 'redux-actions'
import { actions as loading } from './loading'

export const USERS_REQUEST = 'USERS_REQUEST'
function requestUsers () {
  return {
    type: USERS_REQUEST
  }
}

export const USERS_RECEIVE = 'USERS_RECEIVE'
function receiveUsers (json) {
  return {
    type: USERS_RECEIVE,
    users: json
  }
}

export const USERS_REFRESH = 'USERS_REFRESH'
function refresh () {
  return (dispatch) => {
    dispatch(loading.start('users'))
    dispatch(requestUsers())
    setTimeout(() => {
      dispatch(loading.end('users'))
      dispatch(receiveUsers([1, 2, 3]))
    }, 2000)

    // return fetch(`http://www.reddit.com/r/stuff.json`)
    //   .then(response => response.json())
    //   .then(json => dispatch(receiveUsers(json)))
  }
}

export const actions = { refresh }

export default function (state = {
  items: []
}, action) {
  switch (action.type) {
    case USERS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case USERS_REFRESH:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.users
      })
    default:
      return state
  }
}

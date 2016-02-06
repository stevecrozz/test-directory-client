// import fetch from 'isomorphic-fetch'
// import { createAction, handleAction } from 'redux-actions'

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
    dispatch(requestUsers())
    setTimeout(() => {
      dispatch(receiveUsers([1, 2, 3]))
    }, 2000)

    // return fetch(`http://www.reddit.com/r/stuff.json`)
    //   .then(response => response.json())
    //   .then(json => dispatch(receiveUsers(json)))
  }
}

export const actions = { refresh }

// reducers
import { combineReducers } from 'redux'

function refreshReducer (state = {
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

const usersReducers = combineReducers({
  refreshReducer
})

export default usersReducers

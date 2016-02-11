// import fetch from 'isomorphic-fetch'
// import { createAction, handleAction } from 'redux-actions'
import { actions as loading } from './loading'
import { actions as error } from './error'

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

    gapi.client.load('admin', 'directory_v1', function () {
      var request = gapi.client.directory.users.list({
        'customer': 'my_customer',
        'maxResults': 10,
        'orderBy': 'email'
      })

      request.execute(function (resp) {
        if (resp.code === 200) {
          dispatch(receiveUsers(resp.users))
        } else {
          dispatch(error.handleError(resp.message))
        }

        dispatch(loading.end('users'))
      })
    })
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

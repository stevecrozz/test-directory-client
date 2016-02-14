// import fetch from 'isomorphic-fetch'
// import { createAction, handleAction } from 'redux-actions'
import { actions as loading } from './loading'
import { actions as error } from './error'
import User from 'models/user'

export const USERS_REQUEST = 'USERS_REQUEST'
function requestUsers () {
  return {
    type: USERS_REQUEST
  }
}

export const USERS_RECEIVE = 'USERS_RECEIVE'
function receiveUsers (response) {
  return {
    type: USERS_RECEIVE,
    response: response
  }
}

function refresh () {
  return (dispatch) => {
    dispatch(loading.start('users'))
    dispatch(requestUsers())

    gapi.client.load('admin', 'directory_v1', function () {
      var request = gapi.client.directory.users.list({
        'customer': 'my_customer',
        'maxResults': 500,
        'orderBy': 'email'
      })

      request.execute(function (resp) {
        if (resp.code) {
          dispatch(error.handleError(resp.message))
        } else {
          dispatch(receiveUsers(resp.result))
        }

        dispatch(loading.end('users'))
      })
    })
  }
}

export const actions = { refresh }

export default function (state = {
  list: []
}, action) {
  switch (action.type) {
    case USERS_REQUEST:
      return state
    case USERS_RECEIVE:
      return Object.assign({}, state, {
        response: action.response,
        list: action.response.users.map((u) => { return new User(u) })
      })
    default:
      return state
  }
}

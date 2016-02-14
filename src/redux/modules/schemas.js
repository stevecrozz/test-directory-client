import { actions as loading } from './loading'
import { actions as error } from './error'

export const SCHEMAS_CREATE_SEND = 'SCHEMAS_CREATE_SEND'
function createSend (properties) {
  return {
    type: SCHEMAS_CREATE_SEND,
    properties: properties
  }
}

function create (properties) {
  return (dispatch) => {
    dispatch(loading.start('schemas'))
    dispatch(createSend())

    gapi.client.load('admin', 'directory_v1', function () {
      var request = gapi.client.directory.schemas.insert(Object.assign({
        customerId: 'my_customer'
      }, properties))

      request.execute(function (resp) {
        debugger
        if (resp.code) {
          dispatch(error.handleError(resp.message))
        } else {
          dispatch(createReceive(resp.result))
        }

        dispatch(loading.end('schemas'))
      })
    })
  }
}

export const SCHEMAS_REFRESH_SEND = 'SCHEMAS_REFRESH_SEND'
function refreshSend () {
  return {
    type: SCHEMAS_REFRESH_SEND
  }
}

export const SCHEMAS_REFRESH_RECEIVE = 'SCHEMAS_REFRESH_RECEIVE'
function refreshReceive (response) {
  return {
    type: SCHEMAS_REFRESH_RECEIVE,
    response: response
  }
}

function refresh () {
  return (dispatch) => {
    dispatch(loading.start('schemas'))
    dispatch(refreshSend())

    gapi.client.load('admin', 'directory_v1', function () {
      var request = gapi.client.directory.schemas.list({
        'customerId': 'my_customer'
      })

      request.execute(function (resp) {
        if (resp.code) {
          dispatch(error.handleError(resp.message))
        } else {
          dispatch(refreshReceive(resp.result))
        }

        dispatch(loading.end('schemas'))
      })
    })
  }
}

export const actions = { refresh, create }

export default function (state = {
  list: []
}, action) {
  switch (action.type) {
    case SCHEMAS_CREATE_SEND:
      return Object.assign({}, state, {
      })
    case SCHEMAS_REFRESH_SEND:
      return state
    case SCHEMAS_REFRESH_RECEIVE:
      return Object.assign({}, state, {
        response: action.response,
        list: action.response.schemas || []
      })
    default:
      return state
  }
}

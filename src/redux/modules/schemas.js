import { actions as loading } from './loading'
import { actions as error } from './error'
import { routeActions } from 'react-router-redux'

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
      var request = gapi.client.directory.schemas.insert({ customerId: 'my_customer' }, properties)

      request.execute(function (resp) {
        if (resp.code) {
          dispatch(error.handleError(resp.message))
        } else {
          routeActions.push('/schemas')
        }

        dispatch(loading.end('schemas'))
      })
    })
  }
}

export const SCHEMAS_NEW_FIELD_SET = 'SCHEMAS_NEW_FIELD_SET'
function setField (attributes) {
  return {
    type: SCHEMAS_NEW_FIELD_SET,
    attributes: attributes
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

export const SCHEMAS_ACTIVE_FIELD_CLOSE = 'SCHEMAS_ACTIVE_FIELD_CLOSE'
function activeFieldClose (response) {
  return {
    type: SCHEMAS_ACTIVE_FIELD_CLOSE
  }
}

export const SCHEMAS_FIELD_OPEN = 'SCHEMAS_FIELD_OPEN'
function fieldOpen (index) {
  return {
    type: SCHEMAS_FIELD_OPEN,
    index: index
  }
}

export const actions = { refresh, create, setField, activeFieldClose, fieldOpen }

export default function (state = {
  list: [],
  byId: {},
  newForm: {
    activeFieldIndex: -1,
    fields: [],
    newFieldAttributes: {}
  }
}, action) {
  let newState

  switch (action.type) {
    case SCHEMAS_CREATE_SEND:
      return Object.assign({}, state, {
      })
    case SCHEMAS_REFRESH_SEND:
      return state
    case SCHEMAS_REFRESH_RECEIVE:
      newState = Object.assign({}, state, {
        response: action.response,
        list: action.response.schemas || []
      })
      newState.byId = {}
      newState.list.forEach((schema) => {
        newState.byId[schema.schemaId] = {
          schemaName: schema.schemaName,
          fields: schema.fields.map((field) => {
            return {
              fieldId: field.fieldId,
              fieldName: field.fieldName,
              fieldType: field.fieldType,
              indexed: field.indexed,
              multiValued: field.multiValued
            }
          })
        }
      })
      return newState
    case SCHEMAS_FIELD_OPEN:
      return Object.assign({}, state, {
        newForm: Object.assign({}, state.newForm, {
          activeFieldIndex: action.index
        })
      })
    case SCHEMAS_ACTIVE_FIELD_CLOSE:
      return Object.assign({}, state, {
        newForm: Object.assign({}, state.newForm, {
          activeFieldIndex: -1
        })
      })
    default:
      return state
  }
}

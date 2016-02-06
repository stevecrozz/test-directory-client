export const LOADING_START = 'LOADING_START'
function start (key) {
  return {
    type: LOADING_START,
    key: key
  }
}

export const LOADING_END = 'LOADING_END'
function end (key) {
  return {
    type: LOADING_END,
    key: key
  }
}

export const actions = { start, end }

function loading (state = { }, action) {
  switch (action.type) {
    case LOADING_START:
      let newValue = state[action.key] || 0
      return Object.assign({}, state, {
        [action.key]: newValue + 1
      })
    case LOADING_END:
      let newState = Object.assign({}, state, {
        [action.key]: state[action.key] - 1
      })

      if (newState[action.key] === 0) {
        delete newState[action.key]
      }

      return newState
    default:
      return state
  }
}

export default loading

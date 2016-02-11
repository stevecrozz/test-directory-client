export const HANDLE_ERROR = 'HANDLE_ERROR'
function handleError (message) {
  return {
    type: HANDLE_ERROR,
    message: message
  }
}

export const actions = { handleError }

export default function (state = [], action) {
  switch (action.type) {
    case HANDLE_ERROR:
      let newState = state.slice()
      newState.push(action.message)
      return newState
    default:
      return state
  }
}

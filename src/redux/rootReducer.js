import { combineReducers } from 'redux'
import { routeReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import users from './modules/users'
import loading from './modules/loading'
import auth from './modules/auth'
import error from './modules/error'

export default combineReducers({
  router,
  loading,
  auth,
  users,
  error,
  counter
})

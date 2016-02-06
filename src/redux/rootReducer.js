import { combineReducers } from 'redux'
import { routeReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import usersReducers from './modules/users'
import loading from './modules/loading'

export default combineReducers({
  router,
  loading,
  usersReducers,
  counter
})

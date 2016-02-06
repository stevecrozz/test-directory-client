import { combineReducers } from 'redux'
import { routeReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import usersReducers from './modules/users'

export default combineReducers({
  router,
  usersReducers,
  counter
})

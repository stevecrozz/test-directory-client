import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import HomeView from 'views/HomeView/HomeView'
import UserIndexView from 'views/UserIndexView/UserIndexView'
import NotFoundView from 'views/NotFoundView/NotFoundView'
import AuthView from 'views/AuthView/AuthView'
import SchemaIndexView from 'views/SchemaIndexView/SchemaIndexView'
import SchemaNewView from 'views/SchemaIndexView/SchemaNewView'

import { requireAuthentication } from '../components/AuthenticatedComponent'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path='/users' component={requireAuthentication(UserIndexView)} />
    <Route path='/schemas' component={requireAuthentication(SchemaIndexView)} />
    <Route path='/schemas/new' component={requireAuthentication(SchemaNewView)} />
    <Route path='/auth' component={AuthView} />
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
)

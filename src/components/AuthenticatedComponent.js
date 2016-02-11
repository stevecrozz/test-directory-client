import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions } from 'redux/modules/auth'
import { routeActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      isAuthenticating: PropTypes.bool.isRequired,
      triedBackgroundAuth: PropTypes.bool.isRequired,
      location: PropTypes.object.isRequired,
      initiateBackground: PropTypes.func.isRequired,
      path: PropTypes.string.isRequired,
      push: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired
    };

    componentWillMount () {
      this.checkAuth(
          this.props.isAuthenticated,
          this.props.triedBackgroundAuth,
          this.props.isAuthenticating)
    }

    componentWillReceiveProps (nextProps) {
      this.checkAuth(
          nextProps.isAuthenticated,
          nextProps.triedBackgroundAuth,
          nextProps.isAuthenticating)
    }

    checkAuth (isAuthenticated, triedBackgroundAuth, isAuthenticating) {
      if (isAuthenticated || isAuthenticating) {
        return
      }

      if (triedBackgroundAuth) {
        let redirectAfterAuth = this.props.location.pathname
        this.props.dispatch(this.props.push(`/auth?next=${redirectAfterAuth}`))
      } else {
        this.props.initiateBackground(this.props.location.query.next || '/')
      }
    }

    render () {
      return (
        <div>
          {this.props.isAuthenticated === true
            ? <Component {...this.props}/>
            : null
          }
        </div>
      )
    }
  }

  const mapStateToProps = (state, ownProps) => ({
    location: ownProps.location,
    token: state.auth.token,
    userName: state.auth.userName,
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating,
    triedBackgroundAuth: state.auth.triedBackgroundAuth
  })

  const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(actions, dispatch), {
    path: window.location.pathname,
    push: routeActions.push,
    dispatch: dispatch
  })

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}

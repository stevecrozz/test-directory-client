import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions } from 'redux/modules/auth'
import { routeActions } from 'react-router-redux'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      authenticating: PropTypes.bool.isRequired,
      initiateBackground: PropTypes.func.isRequired,
      path: PropTypes.string.isRequired,
      push: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired
    };

    componentWillMount () {
      this.checkAuth()
    }

    componentWillReceiveProps (nextProps) {
      this.checkAuth()
    }

    checkAuth () {
      if (!this.props.isAuthenticated && !this.props.authenticating) {
        this.props.dispatch(this.props.initiateBackground())
      } else {
        let redirectAfterAuth = this.props.path
        this.props.dispatch(this.props.push(`/auth?next=${redirectAfterAuth}`))
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

  const mapStateToProps = (state) => ({
    token: state.auth.token,
    userName: state.auth.userName,
    isAuthenticated: state.auth.isAuthenticated,
    authenticating: state.auth.authenticating
  })

  const mapDispatchToProps = (dispatch) => (Object.assign({}, actions, {
    path: window.location.pathname,
    push: routeActions.push,
    dispatch: dispatch
  }))

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}

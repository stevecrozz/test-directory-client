import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions } from 'redux/modules/auth'
import { routeActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      needBackgroundAuth: PropTypes.bool.isRequired,
      location: PropTypes.object.isRequired,
      initiateBackground: PropTypes.func.isRequired,
      path: PropTypes.string.isRequired,
      push: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired
    };

    componentWillMount () {
      this.checkAuth(this.props.isAuthenticated, this.props.needBackgroundAuth)
    }

    componentWillReceiveProps (nextProps) {
      this.checkAuth(nextProps.isAuthenticated)
    }

    checkAuth (isAuthenticated, needBackgroundAuth) {
      if (isAuthenticated) {
        return
      }

      let redirectAfterAuth = this.props.location.pathname

      if (needBackgroundAuth) {
        this.props.initiateBackground(this.props.location.query.next || '/')
      } else {
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

  const mapStateToProps = (state, ownProps) => ({
    location: ownProps.location,
    token: state.auth.token,
    userName: state.auth.userName,
    isAuthenticated: state.auth.isAuthenticated,
    needBackgroundAuth: state.auth.needBackgroundAuth
  })

  const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(actions, dispatch), {
    path: window.location.pathname,
    push: routeActions.push,
    dispatch: dispatch
  })

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions } from 'redux/modules/auth'

const mapStateToProps = (state) => ({
  auth: state.auth
})

export class AuthView extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    initiateForeground: PropTypes.func.isRequired
  };

  componentWillMount () {
  }

  initiate () {
    this.props.initiate()
  }

  get loggedInOrNot () {
    if (this.props.auth.isAuthenticated) {
      return this.authenticated
    } else {
      return this.notAuthenticated
    }
  }

  get authenticated () {
    return (
      <div>
        authed
      </div>
    )
  }

  get notAuthenticated () {
    return (
      <div>
        In order to use this application, you must authenticate with Google.
        <button className='btn btn-default' onClick={this.props.initiateForeground}>
          Authenticate
        </button>
      </div>
    )
  }

  render () {
    return (
      <div className='container text-center'>
        <div className='row'>
          <div className='col-xs-8 col-xs-offset-2'>
            <h1>Authentication</h1>
            {this.loggedInOrNot}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, actions)(AuthView)

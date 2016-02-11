import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions } from 'redux/modules/auth'
import { bindActionCreators } from 'redux'

export class AuthView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    initiateForeground: PropTypes.func.isRequired
  };

  initiateForeground () {
    this.props.initiateForeground(this.props.location.query.next || '/')
  }

  render () {
    return (
      <div className='container text-center'>
        <div className='row'>
          <div className='col-xs-8 col-xs-offset-2'>
            <h1>Authentication</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-8 col-xs-offset-2'>
            <p>
              In order to use this application, you must authenticate with Google.
            </p>
            <button className='btn btn-default' onClick={this.initiateForeground.bind(this)}>
              Authenticate
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location
})

const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(actions, dispatch), {
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthView)

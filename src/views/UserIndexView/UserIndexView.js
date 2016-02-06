import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as userActions } from '../../redux/modules/users'

const mapStateToProps = (state) => ({
})

export class UserIndexView extends React.Component {
  static propTypes = {
    refresh: PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.refresh()
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <h1>Users</h1>
        </div>
        <div className='row'>
          <div className='col-xs-2 col-xs-offset-5'>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, userActions)(UserIndexView)

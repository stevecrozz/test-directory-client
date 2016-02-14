import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as userActions } from '../../redux/modules/users'

export class UserIndexView extends React.Component {
  static propTypes = {
    users: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.refresh()
  }

  get rows () {
    return this.props.users.list.map((user) => {
      return (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.workPhone}</td>
        </tr>
      )
    })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <h1>Users</h1>
        </div>
        <div className='row'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {this.rows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.users
})

export default connect(mapStateToProps, userActions)(UserIndexView)

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from 'redux/modules/auth'
import { bindActionCreators } from 'redux'
import '../../styles/core.scss'

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
export class CoreLayout extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    initiateForeground: PropTypes.func.isRequired
  };

  logout () {
    this.props.logout()
  }

  render () {
    return (
      <div className='page-container'>
        <div className='view-container'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-sm-2'>
                <ul className='list-unstyled nav'>
                  <li><a href='/users'>Users</a></li>
                  <li><a href='/schemas'>Schemas</a></li>
                  <li><a href='#' onClick={this.logout.bind(this)}>Log Out</a></li>
                </ul>
              </div>
              <div className='col-sm-10'>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

const mapStateToProps = (state, ownProps) => ({
})

const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(authActions, dispatch), {
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)

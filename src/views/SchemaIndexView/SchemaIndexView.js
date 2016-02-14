import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as schemaActions } from '../../redux/modules/schemas'
import { routeActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'

export class SchemaIndexView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    routeActions: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.refresh()
  }

  get rows () {
    return this.props.list.map((schema) => {
      return (
        <tr key={schema.id}>
          <td>hi</td>
        </tr>
      )
    })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12'>
            <h1>Schemas</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <button onClick={() => this.props.dispatch(routeActions.push('/schemas/new'))} className='btn btn-default'>New</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {this.rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  schemas: state.schemas,
  list: state.schemas.list
})

const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(schemaActions, dispatch), {
  path: window.location.pathname,
  routeActions: routeActions,
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(SchemaIndexView)

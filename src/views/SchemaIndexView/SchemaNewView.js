import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as schemaActions } from '../../redux/modules/schemas'
import { bindActionCreators } from 'redux'
import SchemaNewFieldView from './SchemaNewFieldView'
import { routeActions } from 'react-router-redux'

export class SchemaNewView extends React.Component {
  static propTypes = {
    activeFieldClose: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    schemas: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    routeActions: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    fieldOpen: PropTypes.func.isRequired,
    activeFieldIndex: PropTypes.number.isRequired
  };

  componentWillMount () {
    if (this.props.routeParams.id === 'new') {
      return
    }

    if (this.props.schemas.list.length === 0) {
      this.props.refresh()
    }
  }

  value (key) {
    return this.props.schemas.byId[this.props.routeParams.id] &&
      this.props.schemas.byId[this.props.routeParams.id][key]
  }

  closeField () {
    this.props.activeFieldClose()
  }

  openField (index) {
    return () => {
      this.props.fieldOpen(index)
    }
  }

  removeField () {
  }

  get fields () {
    return (this.value('fields') || []).map((field, index) => {
      return (
        <SchemaNewFieldView
          key={index}
          parentSubmit={this.submit.bind(this)}
          field={field}
          close={this.closeField.bind(this)}
          open={this.openField(index).bind(this)}
          remove={this.removeField}
          active={this.props.activeFieldIndex === index}
          only={this.props.fields.length === 1} />
      )
    })
  }

  submit (attributes) {
    if (this.props.fields.length === 1) {
      this.props.create({
        schemaName: document.getElementById('schemaName').value,
        fields: [ attributes ]
      })
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12'><h1>New Schema</h1></div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='form-group'>
              <label htmlFor='schemaName'>Schema name</label>
              <input id='schemaName' name='schemaName' type='text' className='form-control' value={this.value('schemaName')} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <h2>Fields</h2>
            <ul className='list-group'>{this.fields}</ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  schemas: state.schemas,
  fields: state.schemas.newForm.fields,
  activeFieldIndex: state.schemas.newForm.activeFieldIndex
})

const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(schemaActions, dispatch), {
  routeActions: routeActions,
  path: window.location.pathname,
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(SchemaNewView)

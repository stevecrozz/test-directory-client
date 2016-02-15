import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as schemaActions } from '../../redux/modules/schemas'
import { bindActionCreators } from 'redux'
import Winterfell from 'winterfell'

let SchemaNewField = require('./SchemaNewField.json')

export class SchemaNewFieldView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    open: PropTypes.func.isRequired,
    only: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    field: PropTypes.object.isRequired,
    parentSubmit: PropTypes.func.isRequired
  };

  get cancelButton () {
    return (<button onClick={this.props.close} className='btn btn-default'>Cancel</button>)
  }

  get removeButton () {
    return (<button className='btn btn-danger'>Remove</button>)
  }

  onSubmit (attributes) {
    let resource = {
      fieldName: attributes.fieldName,
      fieldType: attributes.fieldType,
      indexed: !!attributes.indexed,
      multiValued: !!attributes.multiValued
    }

    if (attributes.numericIndexingSpecMin) {
      resource['numericIndexingSpec'] = resource['numericIndexingSpec'] || {}
      resource['numericIndexingSpec'].minValue = attributes.numericIndexingSpecMin
    }

    if (attributes.numericIndexingSpecMax) {
      resource['numericIndexingSpec'] = resource['numericIndexingSpec'] || {}
      resource['numericIndexingSpec'].maxValue = attributes.numericIndexingSpecMax
    }

    this.props.parentSubmit(resource)
  }

  render () {
    if (!this.props.active) {
      return (
        <li className='list-group-item' onClick={this.props.open}>
          <a href="#" onClick={this.props.open}>
            {this.props.field.fieldName} : {this.props.field.fieldType}
          </a>
        </li>
      )
    }

    return (
      <li className='list-group-item'>
        <Winterfell
          schema={SchemaNewField}
          disableSubmit
          questionAnswers={this.props.field}
          onSubmit={this.onSubmit.bind(this)} />
        <div className='btn-toolbar'>
          { this.cancelButton }
          { this.props.only ? this.removeButton : '' }
        </div>
      </li>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => Object.assign({}, bindActionCreators(schemaActions, dispatch), {
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(SchemaNewFieldView)

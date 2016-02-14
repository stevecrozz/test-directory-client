import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as schemaActions } from '../../redux/modules/schemas'
import { routeActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import FormGenerator from 'form-generator-react'

export class SchemaNewView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    schemas: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    routeActions: PropTypes.object.isRequired
  };

  static schema = {
    schemaName: {
      type: String,
      label: 'Name'
    },
    fields: {
      label: 'Fields',
      type: [{
        fieldName: {
          type: String,
          label: 'Name'
        },
        fieldType: {
          type: String,
          enum: {
            STRING: 'string',
            INT64: 'integer',
            BOOL: 'boolean',
            DOUBLE: 'float',
            EMAIL: 'email',
            PHONE: 'phone',
            DATE: 'date'
          },
          label: 'Type',
          defaultValue: 'STRING'
        },
        indexed: {
          type: Boolean,
          label: 'Indexed',
          defaultValue: 'true'
        },
        multiValued: {
          type: Boolean,
          label: 'Multi-valued'
        },
        numericIndexingSpec: {
          label: 'Numeric indexing',
          type: {
            minimum: {
              type: Number,
              label: 'Minimum'
            },
            maximum: {
              type: Number,
              label: 'Maximum'
            }
          }
        },
        readAccessType: {
          type: String,
          enum: {
            ALL_DOMAIN_USERS: 'All domain users',
            ADMINS_AND_SELF: 'Admins and self'
          },
          label: 'Read access type',
          defaultValue: 'ALL_DOMAIN_USERS'
        }
      }]
    }
  };

  onSubmit (resource) {
    this.props.dispatch(this.props.create(resource))
  }

  render () {
    var form = FormGenerator.create(
      this.constructor.schema,
      'newSchemaRef',
      this.onSubmit.bind(this)
    )

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12'>
            <h1>New Schema</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            {form}
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

export default connect(mapStateToProps, mapDispatchToProps)(SchemaNewView)

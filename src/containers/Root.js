import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import classes from './Root.scss'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  loading: state.loading
})

export default class Root extends React.Component {
  static propTypes = {
    loading: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    routes: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    loading: {}
  };

  get content () {
    return (
      <Router history={this.props.history}>
        {this.props.routes}
      </Router>
    )
  }

  get devTools () {
    if (__DEBUG__) {
      if (__DEBUG_NEW_WINDOW__) {
        if (!window.devToolsExtension) {
          require('../redux/utils/createDevToolsWindow').default(this.props.store)
        } else {
          window.devToolsExtension.open()
        }
      } else if (!window.devToolsExtension) {
        const DevTools = require('containers/DevTools').default
        return <DevTools />
      }
    }
  }

  get loadingIndicator () {
    let style = { }
    if (Object.keys(this.props.loading).length > 0) {
      style.display = 'block'
    }

    return (
      <div className={classes.loadingContainer} style={style}>
        <div className={classes.loadingSpinner}>
          <div className={classes.loadingSpinnerBlock}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.loadingIndicator}
          {this.content}
          {this.devTools}
        </div>
      </Provider>
    )
  }
}

export default connect(mapStateToProps)(Root)

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NotificationsContainer from '../NotificationsContainer/NotificationsContainer'


let addNotification

const defaultConfig = {
  autoDismiss: 5000,
  position: 'topRight',
}


class Notifications extends Component {

  static propTypes = {
    config: PropTypes.object,
  }

  componentDidMount() {
    // eslint-disable-next-line prefer-destructuring
    addNotification = this.containerEl.addNotification
  }

  render() {
    const config = {
      ...defaultConfig,
      ...(this.props.config || {}),
    }

    return (
      <NotificationsContainer
        ref={(el) => this.containerEl = el}
        config={config}
      />
    )
  }
}

/**
 *
 * @param params {object}
 * @param params.content {string|object}
 */
const notify = (params) => {
  if (typeof addNotification === 'function') {
    addNotification(params)
  }
}


export {
  notify,
  Notifications,
}

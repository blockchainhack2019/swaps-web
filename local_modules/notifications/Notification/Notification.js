import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import s from './Notification.scss'


export default class Notification extends Component {

  static propTypes = {
    autoDismiss: PropTypes.number,
    content: PropTypes.node,
    contentType: PropTypes.oneOf(['text', 'component', 'html']),
    config: PropTypes.shape({
      autoDismiss: PropTypes.number,
      position: PropTypes.oneOf(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
    }),
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    onUserClick: PropTypes.func,
    onUserClose: PropTypes.func,
  }

  static defaultProps = {
    contentType: 'text',
  }

  static childContextTypes = {
    close: PropTypes.func,
  }

  closeTimer = null

  state = {
    mounted: false,
    removed: false,
  }

  getChildContext() {
    return {
      close: this.close,
    }
  }

  componentDidMount() {
    const { config, autoDismiss } = this.props

    setTimeout(() => {
      this.setState({
        mounted: true,
      }, () => {
        if (config.autoDismiss || autoDismiss) {
          this.closeTimer = setTimeout(this.close, config.autoDismiss || autoDismiss)
        }
      })
    }, 0)
  }

  close = () => {
    this.setState({
      removed: true,
    })
  }

  handleClick = () => {
    const { onUserClick } = this.props

    if (typeof onUserClick === 'function') {
      onUserClick()
    }

    this.close()
  }

  handleClose = (event) => {
    const { onUserClose } = this.props

    event.stopPropagation()

    if (typeof onUserClose === 'function') {
      onUserClose()
    }

    this.close()
  }

  render() {
    const { mounted, removed } = this.state
    const { config: { position }, content, type, contentType = 'text' } = this.props

    const containerClassName = cx(s.container, {
      [s.mounted]: mounted,
      [s.removed]: removed,
    })

    const notificationClassName = cx(s.notification, {
      [s.mounted]: mounted,
      [s.removed]: removed,
      [s.info]: type === 'info',
      [s.success]: type === 'success',
      [s.warning]: type === 'warning',
      [s.error]: type === 'error',
    })

    const cssKey = position === 'topLeft' || position === 'topRight' ? 'marginTop' : 'marginBottom'

    const notificationStyle = {
      [cssKey]: '-100%',
    }

    return (
      <div
        className={containerClassName}
        data-position={position}
        data-testid="notificationContainer"
        onClick={this.handleClick}
      >
        <div
          className={notificationClassName}
          style={notificationStyle}
          data-position={position}
          data-testid="notification"
        >
          <div className={s.content}>
            {
              (contentType === 'text' || contentType === 'component') && (
                <div>{content}</div>
              )
            }
            {
              contentType === 'html' && (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

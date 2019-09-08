import React from 'react'
import notifyHelper from 'notifications/helper'
import { notify, Notifications } from 'notifications'
import { Portal } from 'react-portal'

import SwapRequest from 'components/notifications/SwapRequest/SwapRequest'


const templates = {
  /**
   *
   * @param props {object}
   * @param props.item {object}
   */
  swapRequest: (props) => <SwapRequest {...props} />,
}

notifyHelper.subscribe((tplName, props, params = {}) => {
  notify({
    content: templates[tplName](props),
    ...params,
  })
})


const NotificationConductor = () => (
  <Portal>
    <Notifications />
  </Portal>
)


export default NotificationConductor

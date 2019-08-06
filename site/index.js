import React from 'react'
import ReactDOM from 'react-dom'
import routes from 'routes'

import Root from 'containers/Root/Root'


ReactDOM.render(
  <Root routes={routes} />,
  document.getElementById('root')
)

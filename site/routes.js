import React from 'react'
import { Route } from 'react-router-dom'

import App from 'containers/App/App'

import HomePage from 'pages/HomePage/HomePage'


const routes = (
  <App>
    <Route path="/" exact component={HomePage} />
  </App>
)


export default routes

import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import App from 'containers/App/App'

import HomePage from 'pages/HomePage/HomePage'
import WalletsPage from 'pages/WalletsPage/WalletsPage'


const routes = (
  <App>
    <Route path="/" exact render={() => <Redirect to="/exchange" />} />
    <Route path="/exchange" exact component={HomePage} />
    <Route path="/wallets" exact component={WalletsPage} />
  </App>
)


export default routes

import React from 'react'
import store from 'redux/store'
import { StoreContext } from 'store'
import { HashRouter as Router } from 'react-router-dom'


const Root = ({ routes }) => (
  <StoreContext.Provider value={store}>
    <Router>
      {routes}
    </Router>
  </StoreContext.Provider>
)


export default Root

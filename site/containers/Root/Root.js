import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'


const Root = ({ routes }) => (
  <Router>
    {routes}
  </Router>
)


export default Root

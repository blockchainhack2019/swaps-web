import React from 'react'
import 'socket'

import { WidthContainer } from 'components/layout'

import s from './App.scss'


const App = ({ children }) => (
  <WidthContainer className={s.app}>
    {children}
  </WidthContainer>
)


export default App

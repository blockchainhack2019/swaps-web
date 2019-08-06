import React from 'react'
import { StoreContext } from 'store'
import store from 'redux/store'
import 'socket'

import { WidthContainer } from 'components/layout'

import s from './App.scss'




const App = ({ children }) => (
  <StoreContext.Provider value={store}>
    <WidthContainer className={s.app}>
      {children}
    </WidthContainer>
  </StoreContext.Provider>
)


export default App

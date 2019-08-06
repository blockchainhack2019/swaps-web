import React, { useState, useEffect } from 'react'
import socket from 'socket'

import { WidthContainer } from 'components/layout'
import Avatar from 'components/Avatar/Avatar'

import s from './App.scss'


const App = ({ children }) => {
  const [ peerId, setPeerId ] = useState(null)

  useEffect(() => {
    socket.on('login', ({ id }) => {
      setPeerId(id)
    })
  }, [])

  return (
    <div className={s.app}>
      <Avatar className={s.mainAvatar} value={peerId} />
      <WidthContainer>
        {children}
      </WidthContainer>
    </div>
  )
}


export default App

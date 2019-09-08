import React, { useState, useEffect } from 'react'
import socket from 'socket'
import { useReducers } from 'store'
import { btc, eth, qtum, beam } from 'cryptos'

import { WidthContainer } from 'components/layout'
import Avatar from 'components/Avatar/Avatar'

import Header from './Header/Header'

import s from './App.scss'


const App = ({ children }) => {
  const [ peerId, setPeerId ] = useState(null)
  const { user } = useReducers()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    socket.on('login', ({ id }) => {
      setPeerId(id)
    })

    const btcAccount = btc.login()
    const ethAccount = eth.login()
    const qtumWallet = qtum.login()
    const beamWallet = await beam.login({ ethereumAccount: ethAccount })

    user.updateAccounts({
      btc: {
        address: btcAccount.getAddress(),
      },
      eth: {
        address: ethAccount.address,
      },
      qtum: {
        address: qtumWallet.address,
      },
      beam: {
        address: beamWallet.address,
      },
    })
  }

  return (
    <div className={s.app}>
      <Avatar className={s.mainAvatar} value={peerId} />
      <Header />
      <WidthContainer>
        {children}
      </WidthContainer>
    </div>
  )
}


export default App

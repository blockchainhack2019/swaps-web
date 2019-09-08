import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useConnect, useReducers } from 'store'
import { btc, eth, qtum, beam } from 'cryptos'
import notifyHelper from 'notifications/helper'
import { useWillMount } from 'hooks'
import socket from 'socket'

import { WidthContainer } from 'components/layout'
import Avatar from 'components/Avatar/Avatar'

import NotificationsConductor from './NotificationsConductor/NotificationsConductor'
import Header from './Header/Header'

import s from './App.scss'


const App = ({ children, history }) => {
  const { peerId } = useConnect({ peerId: 'user.peerId' })
  const { user } = useReducers()

  useWillMount(() => {
    socket.on('login', ({ id }) => {
      user.setPeerId(id)
    })
  })

  useEffect(() => {
    const init = async () => {
      const btcAccount  = btc.login()
      const ethAccount  = eth.login()
      const qtumAccount = qtum.login()
      const beamWallet  = await beam.login({ ethereumAccount: ethAccount })

      user.updateAccounts({
        btc: {
          address: btcAccount.getAddress(),
        },
        eth: {
          address: ethAccount.address,
        },
        qtum: {
          address: qtumAccount.address,
        },
        beam: {
          address: beamWallet.address,
        },
      })
    }

    init()
  }, [])

  useEffect(() => {
    socket.on('new swap request', (request) => {
      notifyHelper.addNotification('swapRequest', request, {
        onUserClick: () => {
          history.push(`swap/${request.order.id}`)
          socket.emit('accept swap request', request)
        }
      })
    })

    socket.on('swap request accepted', (order) => {
      history.push(`swap/${order.id}`)
    })
  }, [])

  return (
    <div className={s.app}>
      <Avatar className={s.mainAvatar} value={peerId} />
      <Header />
      <WidthContainer>
        {children}
      </WidthContainer>
      <NotificationsConductor />
    </div>
  )
}


export default withRouter(App)

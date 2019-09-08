import React, { useEffect } from 'react'
import socket from 'socket'
import { useConnect, useReducers } from 'store'

import Table from 'components/Table/Table'
import Avatar from 'components/Avatar/Avatar'

import s from './SwapsPage.scss'


const SwapsPage = () => {
  const { items } = useConnect({ items: 'swapRequests.items' })
  const { swapRequests } = useReducers()

  useEffect(() => {
    socket.on('new swap request', (request) => {
      swapRequests.addItem(request)
    })

    socket.on('user disconnected', ({ id: ownerId }) => {
      swapRequests.removeItems(ownerId)
    })
  }, [])

  return (
    <Table
      titles={[ '', 'Sell', 'Buy', 'Rate', '' ]}
      data={items}
      renderRow={({ from, order: { id, sellCurrency, buyCurrency, sellAmount, buyAmount } }) => (
        <Table.Row key={id}>
          <td><Avatar className={s.avatar} value={from} /></td>
          <td>{sellAmount} {sellCurrency}</td>
          <td>{buyAmount} {buyCurrency}</td>
          <td>{(sellAmount / buyAmount).toFixed(7)}</td>
          <td>
            <div className={s.button}>Swap!</div>
          </td>
        </Table.Row>
      )}
    />
  )
}


export default SwapsPage

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useConnect } from 'store'
import socket from 'socket'

import Avatar from 'components/Avatar/Avatar'
import Table from 'components/Table/Table'

import s from './OrderBook.scss'


const OrderBook = () => {
  const { peerId, sellCurrency, buyCurrency } = useConnect({
    peerId: 'user.peerId',
    sellCurrency: 'exchange.sellCurrency',
    buyCurrency: 'exchange.buyCurrency',
  })

  const [ orders, setOrders ] = useState([])

  useEffect(() => {
    socket.on('login', ({ orders }) => {
      setOrders(orders)
    })

    socket.on('new order', (order) => {
      setOrders((orders) => [ ...orders, order ])
    })

    socket.on('user disconnected', ({ orders: orderIds }) => {
      setOrders((orders) => orders.filter(({ id }) => !orderIds.includes(id)))
    })
  }, [])

  const handleSwapClick = useCallback((id) => {
    socket.emit('request swap', { id })
  }, [])

  const filteredOrders = useMemo(() => orders.filter((order) => (
    order.sellCurrency === sellCurrency
    && order.buyCurrency === buyCurrency
  )), [ sellCurrency, buyCurrency, orders ])

  return (
    <div className={s.orderBook}>
      <Table
        titles={[ '', `Sell <span>${sellCurrency}</span>`, `Buy <span>${buyCurrency}</span>`, 'Rate', '' ]}
        data={filteredOrders}
        renderRow={({ id, sellAmount, buyAmount, owner }) => {
          const isMyOrder = owner === peerId

          console.log(111, owner)
          console.log(222, peerId)

          return (
            <Table.Row key={id}>
              <td><Avatar className={s.avatar} value={owner} /></td>
              <td>{sellAmount}</td>
              <td>{buyAmount}</td>
              <td>{(sellAmount / buyAmount).toFixed(7)}</td>
              <td>
                {
                  !isMyOrder && (
                    <div className={s.button} onClick={() => handleSwapClick(id)}>Swap!</div>
                  )
                }
              </td>
            </Table.Row>
          )
        }}
      />
    </div>
  )
}


export default OrderBook

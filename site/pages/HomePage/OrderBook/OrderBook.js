import React, { useState, useEffect, useMemo } from 'react'
import { useConnect } from 'store'
import socket from 'socket'

import s from './OrderBook.scss'


const OrderBook = () => {
  const { sellCurrency, buyCurrency } = useConnect({
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

  const filteredOrders = useMemo(() => orders.filter((order) => (
    order.sellCurrency === sellCurrency
    && order.buyCurrency === buyCurrency
  )), [ sellCurrency, buyCurrency, orders ])

  return (
    <div className={s.orderBook}>
      <table className={s.items}>
        <thead>
        <tr>
          <th>Sell <span>{sellCurrency}</span></th>
          <th>Buy <span>{buyCurrency}</span></th>
          <th>Rate</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {
          filteredOrders.map(({ id, sellAmount, buyAmount }) => (
            <tr key={id} className={s.item}>
              <td>{sellAmount}</td>
              <td>{buyAmount}</td>
              <td>{(sellAmount / buyAmount).toFixed(7)}</td>
              <td>
                <div className={s.buyButton}>Exchange</div>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  )
}


export default OrderBook

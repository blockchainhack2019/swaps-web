import React, { useState, useEffect, useMemo } from 'react'
import socket from 'socket'

import s from './OrderBook.scss'


const OrderBook = () => {
  const [ orders, setOrders ] = useState([])

  const sellCurrency = 'QTUM'
  const buyCurrency = 'BTC'

  useEffect(() => {
    socket.on('login', ({ orders }) => {
      setOrders(orders)
    })

    socket.on('new order', (order) => {
      setOrders((orders) => [ ...orders, order ])
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
          filteredOrders.map(({ sellAmount, buyAmount }, index) => (
            <tr key={index} className={s.item}>
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

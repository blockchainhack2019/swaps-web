import React, { useState, useEffect } from 'react'
import socket from 'socket'

import Table from 'components/Table/Table'
import Avatar from 'components/Avatar/Avatar'

import s from './SwapsPage.scss'


const SwapsPage = () => {
  const [ requests, setRequests ] = useState([])

  useEffect(() => {
    socket.on('new swap request', (request) => {
      setRequests((requests) => [ ...requests, request ])
    })

    socket.on('user disconnected', ({ id }) => {
      setRequests((requests) => requests.filter(({ from }) => from !== id))
    })
  }, [])

  return (
    <Table
      titles={[ '', 'Sell', 'Buy', 'Rate', '' ]}
      data={requests}
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

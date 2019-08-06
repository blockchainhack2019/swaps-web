import React from 'react'

import s from './OrderBook.scss'


const items = [
  {
    sell: 10,
    buy: 10 / 3819.93,
  },
  {
    sell: 18,
    buy: 18 / 3819.33,
  },
  {
    sell: 24,
    buy: 24 / 3824.55,
  },
  {
    sell: 35,
    buy: 35 / 3820.98,
  },
  {
    sell: 7,
    buy: 7 / 3845.45,
  },
]

const OrderBook = () => (
  <div className={s.orderBook}>
    <table className={s.items}>
      <thead>
        <tr>
          <th>Sell <span>QTUM</span></th>
          <th>Buy <span>BTC</span></th>
          <th>Rate</th>
          <th></th>
        </tr>
      </thead>
      {
        items.map(({ sell, buy }) => (
          <tr className={s.item}>
            <td>{sell}</td>
            <td>{buy}</td>
            <td>{(buy / sell).toFixed(7)}</td>
            <td>
              <div className={s.buyButton}>Exchange</div>
            </td>
          </tr>
        ))
      }
    </table>
  </div>
)


export default OrderBook

import React from 'react'

import s from './SwapRequest.scss'


const SwapRequest = ({ from, order: { id, buyAmount, buyCurrency, sellAmount, sellCurrency } }) => (
  <div>
    Income swap request by your order:<br />
    Sell: <b>{sellAmount} {sellCurrency}</b><br />
    Buy: <b>{buyAmount} {buyCurrency}</b>
  </div>
)


export default SwapRequest

import React, { useState, useCallback, useEffect } from 'react'
import Form from 'formular'
import socket from 'socket'

import Card from './Card/Card'

import s from './Exchange.scss'

import swapIcon from './images/swap.svg'


const exchangeRate = 3819.93

const form = new Form({
  fields: {
    sellAmount: {
      validate: [],
      value: 10,
    },
    buyAmount: {
      validate: [],
      value: (10 / exchangeRate).toFixed(5),
    },
  }
})

const Exchange = () => {
  const [ state, setState ] = useState({
    exchangeRate,
    sellCurrency: 'QTUM',
    buyCurrency: 'BTC',
  })

  useEffect(() => {
    let ignoreSellChanges
    let ignoreBuyChanges

    const handleSellChange = (value) => {
      if (!ignoreSellChanges) {
        ignoreBuyChanges = true
        form.fields.buyAmount.set((value / exchangeRate).toFixed(5))
      }
      else {
        ignoreBuyChanges = false
      }
    }

    const handleBuyChange = (value) => {
      if (!ignoreBuyChanges) {
        ignoreSellChanges = true
        form.fields.sellAmount.set((value * exchangeRate).toFixed(5))
      }
      else {
        ignoreSellChanges = false
      }
    }

    const handleFocus = () => {
      ignoreSellChanges = false
      ignoreBuyChanges = false
    }

    form.fields.sellAmount.on('change', handleSellChange)
    form.fields.buyAmount.on('change', handleBuyChange)
    form.fields.sellAmount.on('focus', handleFocus)
    form.fields.buyAmount.on('focus', handleFocus)

    return () => {
      form.fields.sellAmount.off('change', handleSellChange)
      form.fields.buyAmount.off('change', handleBuyChange)
      form.fields.sellAmount.off('focus', handleFocus)
      form.fields.buyAmount.off('focus', handleFocus)
    }
  }, [ exchangeRate ])

  const handleSwapClick = useCallback(() => {
    setState(({ exchangeRate, sellCurrency, buyCurrency }) => ({
      exchangeRate: 1 / exchangeRate,
      sellCurrency: buyCurrency,
      buyCurrency: sellCurrency,
    }))

    form.setValues({
      sellAmount: form.fields.buyAmount.value,
      buyAmount: form.fields.sellAmount.value,
    })
  }, [])

  const handleSubmit = useCallback(() => {
    form.submit()
      .then(({ sellAmount, buyAmount }) => {
        const { sellCurrency, buyCurrency } = state

        socket.placeOrder({
          sellCurrency,
          sellAmount: Number(sellAmount),
          buyCurrency,
          buyAmount: Number(buyAmount),
        })

        form.unsetValues()
      })
  }, [ state ])

  const rate = state.exchangeRate.toFixed(8).replace(/0+$/, '')

  return (
    <div className={s.exchange}>
      <div className={s.rate}>1 {state.buyCurrency} = {rate} {state.sellCurrency}</div>
      <div className={s.swapButton} onClick={handleSwapClick}>
        <img src={swapIcon} />
      </div>
      <Card className={s.from} field={form.fields.sellAmount} currency={state.sellCurrency} />
      <Card className={s.to} field={form.fields.buyAmount} currency={state.buyCurrency} secondary />
      <button className={s.submitButton} onClick={handleSubmit}>Place Order</button>
    </div>
  )
}


export default Exchange

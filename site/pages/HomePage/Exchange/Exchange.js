import React, { useState, useCallback, useEffect } from 'react'
import { useConnect, useReducers } from 'store'
import { useWillMount } from 'hooks'
import Form from 'formular'
import socket from 'socket'

import Card from './Card/Card'

import s from './Exchange.scss'

import swapIcon from './images/swap.svg'


const form = new Form({
  fields: {
    sellAmount: [],
    buyAmount: [],
  }
})

const Exchange = () => {
  const { exchangeRate, sellCurrency, buyCurrency } = useConnect({
    exchangeRate: 'exchange.exchangeRate',
    sellCurrency: 'exchange.sellCurrency',
    buyCurrency: 'exchange.buyCurrency',
  })

  const { exchange } = useReducers()

  useWillMount(() => {
    form.setValues({
      sellAmount: 10,
      buyAmount: (10 / exchangeRate).toFixed(5),
    })
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
    exchange.update({
      exchangeRate: 1 / exchangeRate,
      sellCurrency: buyCurrency,
      buyCurrency: sellCurrency,
    })

    form.setValues({
      sellAmount: form.fields.buyAmount.value,
      buyAmount: form.fields.sellAmount.value,
    })
  }, [ exchangeRate, sellCurrency, buyCurrency ])

  const handleSubmit = useCallback(() => {
    form.submit()
      .then(({ sellAmount, buyAmount }) => {
        socket.emit('place order', {
          sellCurrency,
          sellAmount: Number(sellAmount),
          buyCurrency,
          buyAmount: Number(buyAmount),
        })
      })
  }, [ sellCurrency, buyCurrency ])

  const rate = exchangeRate.toFixed(8).replace(/0+$/, '')

  return (
    <div className={s.exchange}>
      <div className={s.rate}>1 {buyCurrency} = {rate} {sellCurrency}</div>
      <div className={s.swapButton} onClick={handleSwapClick}>
        <img src={swapIcon} />
      </div>
      <Card className={s.from} field={form.fields.sellAmount} currency={sellCurrency} />
      <Card className={s.to} field={form.fields.buyAmount} currency={buyCurrency} secondary />
      <button className={s.submitButton} onClick={handleSubmit}>Place Order</button>
    </div>
  )
}


export default Exchange

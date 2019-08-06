import React, { Fragment, useState, useCallback } from 'react'
import Form from 'formular'

import Card from './Card/Card'

import s from './Exchange.scss'

import swapIcon from './images/swap.svg'


const exchangeRate = 3819.93

const form = new Form({
  fields: {
    from: {
      validate: [],
      value: 100,
    },
    to: {
      validate: [],
      value: (100 / exchangeRate).toFixed(5),
    },
  }
})

const Exchange = () => {
  const [ state, setState ] = useState({
    exchangeRate,
    from: {
      currency: 'QTUM',
    },
    to: {
      currency: 'BTC',
    },
  })

  const handleSwapClick = useCallback(() => {
    setState(({ exchangeRate, from, to }) => {

      return {
        exchangeRate: 1 / exchangeRate,
        from: {
          ...from,
          currency: to.currency,
        },
        to: {
          ...to,
          currency: from.currency,
        }
      }
    })

    form.setValues({
      from: form.fields.to.value,
      to: form.fields.from.value,
    })
  }, [])

  const rate = state.exchangeRate.toFixed(8).replace(/0+$/, '')

  return (
    <div className={s.exchange}>
      <div className={s.rate}>1 {state.to.currency} = {rate} {state.from.currency}</div>
      <div className={s.swapButton} onClick={handleSwapClick}>
        <img src={swapIcon} />
      </div>
      <Card className={s.from} field={form.fields.from} {...state.from} />
      <Card className={s.to} field={form.fields.to} {...state.to} secondary />
      <button className={s.submitButton}>Exchange</button>
    </div>
  )
}


export default Exchange

import React from 'react'
import cx from 'classnames'
import { Input } from 'components/form'

import s from './Card.scss'


const Card = ({ className, field, currency, secondary }) => {
  const rootClassName = cx(s.card, className, {
    [s.secondary]: secondary,
  })

  return (
    <div className={rootClassName}>
      <div className={s.currency}>{currency}</div><br />
      <Input className={s.input} field={field} type="number" />
    </div>
  )
}


export default Card

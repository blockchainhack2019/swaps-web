import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { FieldError } from 'components/form'
import cx from 'classnames'

import s from './Input.scss'


const Input = ({ className, field, label, type }) => {
  const [ _, forceRefresh ] = useState(0)

  useEffect(() => {
    const refresh = () => {
      forceRefresh((v) => ++v)
    }

    field.on('change', refresh)
    field.on('validate', refresh)

    return () => {
      field.off('change', refresh)
      field.off('validate', refresh)
    }
  }, [ field ])

  const handleChange = useCallback((event) => {
    field.set(event.target.value)
  }, [])

  return (
    <Fragment>
      <input
        className={cx(s.input, className)}
        type={type}
        value={field.value}
        onChange={handleChange}
      />
      {
        Boolean(field.error) && (
          <FieldError>{field.error}</FieldError>
        )
      }
    </Fragment>
  )
}


export default Input

import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Select as AntSelect } from 'antd'
import { FieldError } from 'components/form'


const Select = ({ field, ...props }) => {
  const [ _, forceRefresh ] = useState(0)

  useEffect(() => {
    const handleValidate = () => {
      forceRefresh((v) => ++v)
    }

    field.on('change', handleValidate)
    field.on('validate', handleValidate)

    return () => {
      field.off('change', handleValidate)
      field.off('validate', handleValidate)
    }
  }, [ field ])

  const handleChange = useCallback((value) => {
    field.set(value)
  }, [])

  const node = React.createElement(AntSelect, {
    size: 'large',
    style: { width: '100%' },
    defaultValue: field.value,
    onChange: handleChange,
    ...props
  })

  return (
    <Fragment>
      {node}
      {
        Boolean(field.error) && (
          <FieldError>{field.error}</FieldError>
        )
      }
    </Fragment>
  )
}

Select.Option = AntSelect.Option


export default Select

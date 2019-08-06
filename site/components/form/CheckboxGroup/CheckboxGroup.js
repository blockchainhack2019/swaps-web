import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { Checkbox } from 'antd'
import { FieldError } from 'components/form'


const CheckboxGroup = ({ children, field, ...rest }) => {
  const [ _, forceRefresh ] = useState(0)

  useEffect(() => {
    const handleValidate = () => {
      forceRefresh((v) => ++v)
    }

    field.on('validate', handleValidate)

    return () => {
      field.off('validate', handleValidate)
    }
  }, [ field ])

  const handleChange = useCallback((value) => {
    field.set(value)
  }, [])

  const node = React.createElement(Checkbox.Group, {
    onChange: handleChange,
    ...rest
  }, children)

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


export default CheckboxGroup

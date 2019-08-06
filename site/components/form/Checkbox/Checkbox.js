import React, { Fragment, useCallback } from 'react'
import { Checkbox as AntCheckbox } from 'antd'
import { FieldError } from 'components/form'


const Checkbox = ({ children, field, ...rest }) => {
  const handleChange = useCallback((event) => {
    field.set(event.target.value)
  }, [])

  const node = React.createElement(AntCheckbox, {
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


export default Checkbox

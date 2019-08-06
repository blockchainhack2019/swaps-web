import React from 'react'

import s from './FieldError.scss'


const FieldError = ({ children }) => (
  <div className={s.fieldError}>{children}</div>
)


export default FieldError

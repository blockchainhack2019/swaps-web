import React from 'react'

import s from './WidthContainer.scss'


const WidthContainer = ({ children }) => (
  <div className={s.widthContainer}>{children}</div>
)


export default WidthContainer

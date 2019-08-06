import React from 'react'
import cx from 'classnames'

import s from './WidthContainer.scss'


const WidthContainer = ({ children, className }) => (
  <div className={cx(s.widthContainer, className)}>{children}</div>
)


export default WidthContainer

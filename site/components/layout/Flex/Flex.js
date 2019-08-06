import React from 'react'
import cx from 'classnames'

import s from './Flex.scss'


const Flex = ({ children }) => {
  const className = cx(s.flex)

  return (
    <div className={className}>
      {children}
    </div>
  )
}


export default Flex

import React from 'react'
import cx from 'classnames'
import Icon from 'jdenticon'

import s from './Avatar.scss'


const Avatar = ({ className, value }) => {
  const src = `data:image/svg+xml,${encodeURIComponent(Icon.toSvg(value, 50))}`

  return (
    <div className={cx(s.avatar, className)}>
      <img src={src} />
    </div>
  )
}


export default Avatar

import React from 'react'


const Box = ({ children, p }) => {
  const padding = p.split(' ').map((v) => v * 10 + 'px').join(' ')
  
  return (
    <div style={{ padding }}>{children}</div>
  )
}


export default Box

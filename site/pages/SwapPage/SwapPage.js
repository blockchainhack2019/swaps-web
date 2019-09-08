import React from 'react'
import { withRouter } from 'react-router-dom'

import s from './SwapPage.scss'


const SwapPage = ({ match: { params: { id } } }) => {
  console.log(444, id)

  return (
    <div>
      Swap:
    </div>
  )
}


export default withRouter(SwapPage)

import { createStore } from 'store'

import user from './user'
import exchange from './exchange'
import swapRequests from './swapRequests'


const store = createStore({
  user,
  exchange,
  swapRequests,
})


export default store

import { createStore } from 'store'

import user from './user'
import exchange from './exchange'


const store = createStore({
  user,
  exchange,
})


export default store

import io from 'socket.io-client'


let id
const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3060' : 'http://dribbbles.ru')
const myEvents = [ 'connect', 'disconnect', 'login' ]

const on = (event, callback) => {
  socket.on(event, (data) => {
    if (myEvents.includes(event) || !data || (data.from !== id && data.id !== id)) {
      callback(data)
    }
  })
}

on('connect', () => {
  console.log('connect')
})

on('disconnect', () => {
  console.log('disconnect')
})

on('login', (data) => {
  console.log('login', data)
  id = data.id
})

on('user connected', ({ id }) => {
  console.log(`user connected: ${id}`)
})

on('user disconnected', ({ id }) => {
  console.log(`user disconnected: ${id}`)
})

on('public message', ({ from, message }) => {
  console.log('public message', { from, message })
})

on('private message', ({ from, message }) => {
  console.log('private message', { from, message })
})


const sendMessage = (message) => {
  socket.emit('message', { message })
}

const sendPrivateMessage = (to, message) => {
  socket.emit('message', { to, message })
}

/**
 *
 * @param {Object} order
 * @param {string} order.sellCurrency
 * @param {number} order.sellAmount
 * @param {string} order.buyCurrency
 * @param {number} order.buyAmount
 */
const placeOrder = (order) => {
  socket.emit('place order', order)
}


export default {
  on,
  sendMessage,
  sendPrivateMessage,
  placeOrder,
}

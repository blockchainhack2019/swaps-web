import io from 'socket.io-client'


let id
const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3060' : 'http://116.203.203.109:3060')
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

const emit = socket.emit.bind(socket)


export default {
  on,
  emit,
  sendMessage,
  sendPrivateMessage,
}

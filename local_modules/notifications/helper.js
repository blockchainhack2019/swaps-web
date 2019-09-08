let handler

const subscribe = (_handler) => handler = _handler

const addNotification = (tplName, props, params) => {
  if (typeof handler === 'function') {
    handler(tplName, props, params)
  }
}


export default {
  subscribe,
  addNotification,
}

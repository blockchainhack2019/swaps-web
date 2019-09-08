const initialState = {
  items: [],
}

const addItem = (state, request) => ({
  ...state,
  items: [
    ...state.items,
    request,
  ],
})

const removeItems = (state, ownerId) => {
  const newItems = state.items.filter(({ from }) => from !== ownerId)

  return {
    ...state,
    items: newItems,
  }
}


export default {
  initialState,
  addItem,
  removeItems,
}

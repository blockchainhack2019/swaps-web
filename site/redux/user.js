const initialState = {
  peerId: null,
  accounts: {
    btc: {
      address: null,
      balance: 0,
    },
    eth: {
      address: null,
      balance: 0,
    },
    qtum: {
      address: null,
      balance: 0,
    },
    beam: {
      address: null,
      balance: 0,
    },
  },
}

const update = (state, values) => ({ ...state, ...values })

const setPeerId = (state, value) => ({ ...state, peerId: value })

const updateAccounts = (state, accounts) => {
  const updatedAccounts = {}

  Object.keys(state.accounts).map((accountKey) => {
    updatedAccounts[accountKey] = {
      ...state.accounts[accountKey],
      ...accounts[accountKey],
    }
  })

  return { ...state, accounts: updatedAccounts }
}


export default {
  initialState,
  setPeerId,
  update,
  updateAccounts,
}

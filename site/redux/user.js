const initialState = {
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
  },
}

const update = (state, values) => ({ ...state, ...values })

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
  update,
  updateAccounts,
}

import { createStore } from 'store'


const initialState = {
  exchangeRate: 3819.93,
  sellCurrency: 'QTUM',
  buyCurrency: 'BTC',
}

const update = (state, values) => ({ ...state, ...values })
const setSellCurrency = (state, currency) => ({ ...state, sellCurrency: currency })
const setBuyCurrency = (state, currency) => ({ ...state, buyCurrency: currency })

const exchange = {
  initialState,
  update,
  setSellCurrency,
  setBuyCurrency,
}

const store = createStore({ exchange })


export default store

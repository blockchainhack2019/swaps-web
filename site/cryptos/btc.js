import bitcoin  from 'bitcoinjs-lib'
import axios from 'axios'


const network = bitcoin.networks.testnet
let account


const createAccount = () => {
  const privateKey = bitcoin.ECPair.makeRandom({ network }).toWIF()

  localStorage.setItem('btc:privateKey', privateKey)

  account = restoreAccount(privateKey)

  return account
}

const restoreAccount = (privateKey) => {
  return new bitcoin.ECPair.fromWIF(privateKey, network)
}

const login = () => {
  const privateKey = localStorage.getItem('btc:privateKey')

  if (!privateKey) {
    return createAccount()
  }

  account = restoreAccount(privateKey)

  return account
}

const getAccount = () => account

const getAccountPublicKey = () => getPublicKey(account)

const getPublicKey = (account) => account.getPublicKeyBuffer().toString('hex')

const fetchBalance = (address) =>
  axios.get(`https://test-insight.bitpay.com/api/addr/${address}`)
    .then(({ data }) => data)
    .then(({ balance }) => {
      console.log('BTC Balance:', balance)

      return balance
    })

const fetchUnspents = (address) =>
  axios.get(`https://test-insight.bitpay.com/api/addr/${address}/utxo`)
    .then(({ data }) => data)

const broadcastTx = (txRaw) =>
  axios.post('https://test-insight.bitpay.com/api/tx/send', {
    rawtx: txRaw,
  })
    .then(({ data }) => data)


export default {
  network,
  login,
  getAccount,
  getAccountPublicKey,
  getPublicKey,
  fetchBalance,
  fetchUnspents,
  broadcastTx,
}

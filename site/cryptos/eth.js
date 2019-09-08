import web3 from './web3'
import beam from './beam'

let account


const createAccount = () => {
  account = web3.eth.accounts.create()

  localStorage.setItem('eth:privateKey', account.privateKey)
  web3.eth.accounts.wallet.add(account.privateKey)

  // //beam
  // beam.createAccount({ ethereumAccount: account })

  return account
}

const restoreAccount = (privateKey) => {
  account = web3.eth.accounts.privateKeyToAccount(privateKey)

  web3.eth.accounts.wallet.add(account.privateKey)

  return account
}

const login = () => {
  const privateKey = localStorage.getItem('eth:privateKey')

  if (!privateKey) {
    return createAccount()
  }

  return restoreAccount(privateKey)
}

const getBalance = () =>
  web3.eth.getBalance(account.address)
    .then((amount) => web3.utils.fromWei(amount))

const sendMoney = async (to, amount) => {

}


export default {
  login,
  getBalance,
  sendMoney,
}

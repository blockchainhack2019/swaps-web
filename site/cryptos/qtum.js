import { networks, generateMnemonic } from 'qtumjs-wallet'


const network = networks.testnet
let account


const getWalletInfo = () => {
  const publicAddress = account.address
  const privateKey    = account.toWIF()

  return {
    privateKey,
    address: publicAddress,
  }
}

const createWallet = () => {
  const mnemonic  = generateMnemonic()
  const password  = 'superstrong'

  account = network.fromMnemonic(mnemonic, password)

  localStorage.setItem('qtum:privateKey', account.toWIF())

  return account
}

const restoreWallet = (privateKey) => {
  account = network.fromPrivateKey(privateKey)

  return account
}

const login = () => {
  const privateKey = localStorage.getItem('qtum:privateKey')

  if (!privateKey) {
    return createWallet()
  }

  return restoreWallet(privateKey)
}

const getAccount = () => account

const getBalance = async () => {
  const info = await account.getInfo()

  return info.balance
}

const sendMoney = async (to, amount) => {
  const { txid: transactionId } = await account.send(to, amount * 1e8, {
    feeRate: 1000,
  })

  return transactionId
}


export default {
  login,
  getAccount,
  getBalance,
  sendMoney,
  getWalletInfo,
}

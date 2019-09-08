import web3 from './web3'

let account

window.web3 = web3
const apiRoot = 'http://116.203.203.109:3000'

export const login = async ({ ethereumAccount }) => {
  return createAccount({ ethereumAccount })
}

export const request = async ({ method, params }, _account = account) => {
  const rpcRequest = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": method,
    "params": params,
  }

  const message = JSON.stringify(rpcRequest)

  window.account = _account
  const { ethereumAccount } = _account
  const ethereumAddress = ethereumAccount.address

  const hash = web3.utils.sha3(message)
  const signature = await ethereumAccount.sign(hash)
  const url = `${apiRoot}/rpc?ethereumAddress=${ethereumAddress}&sign=${signature}`

  console.log('hash', hash)
  console.log('signature', signature)

  const { result } = await fetch(url, {
    method: "POST",
    body: message,
  }).then(res => res.json())

  return result
}

export const createAccount = async ({ ethereumAccount }) => {
  account = { ethereumAccount }

  const beamAddress = await request({
    method: 'create_address',
    params: {
      expiration: '24h',
    }
  })

  account = {
    ethereumAccount,
    address: beamAddress,
  }

  return account
}

export const updateBalance = async (address = account.address) => {
  // TODO: check method and format ???

  const balance = await request({
    method: 'get_balance',
    params: {
      address: address,
    }
  })

  return balance
}

const beam = { login, request, createAccount }

export default beam

window.beam = beam

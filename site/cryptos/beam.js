import web3 from './web3'

let account

window.web3 = web3
const apiRoot = 'http://116.203.203.109:3000'

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

  return fetch(url, {
    method: "POST",
    body: message,
  })
}

export const createAccount = ({ ethereumAccount }) => {
  account = { ethereumAccount }

  return request({
    method: 'create_address',
    params: {
      expiration: '24h',
    }
  })

  return account
}


const beam = { request, createAccount }

export default beam

window.beam = beam

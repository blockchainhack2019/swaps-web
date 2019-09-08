import web3 from 'cryptos/web3'
import eth from 'cryptos/eth'


class Contract {

  constructor({ isMeOwner, participantAddress }) {
    this.name = 'ETH Contract'

    this.ownerAddress       = isMeOwner ? eth.getAccount().address : participantAddress
    this.participantAddress = isMeOwner ? participantAddress : eth.getAccount().address

    this.gasLimit = 3e6
    this.abi      = [
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "swaps",
        "outputs": [
          {
            "name": "participantAddress",
            "type": "address"
          },
          {
            "name": "secret",
            "type": "bytes32"
          },
          {
            "name": "secretHash",
            "type": "bytes20"
          },
          {
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_secretHash",
            "type": "bytes20"
          },
          {
            "name": "_participantAddress",
            "type": "address"
          }
        ],
        "name": "createSwap",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_ownerAddress",
            "type": "address"
          },
          {
            "name": "_participantAddress",
            "type": "address"
          }
        ],
        "name": "getSecret",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_ownerAddress",
            "type": "address"
          },
          {
            "name": "_participantAddress",
            "type": "address"
          }
        ],
        "name": "getBalance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_secret",
            "type": "bytes32"
          },
          {
            "name": "_ownerAddress",
            "type": "address"
          },
          {
            "name": "_participantAddress",
            "type": "address"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_participantAddress",
            "type": "address"
          }
        ],
        "name": "refund",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
    this.address  = '0x898199A0d05201D6AFFbcb27c1723fBb588aA2f4'
    this.contract = new web3.eth.Contract(this.abi, this.address)
  }

  call(method, args, params = {}, silence) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!silence) console.log(`\nStart ethContract.${method}()`)

        const data = await this.contract.methods[method](...args).call(params)

        if (!silence) console.log(`\rSuccess`)
        resolve(data)
      }
      catch (err) {
        if (!silence) console.log(`\rError:`, err)
        reject(err)
      }
    })
  }

  send(method, args, params = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let error
        let transactionHash

        console.log(`\nStart ethContract.${method}()`)

        const data = await this.contract.methods[method](...args).send({
          ...params,
          gas: this.gasLimit,
        })
          .on('transactionHash', (hash) => {
            console.log(`\rTransaction:`, hash)

            transactionHash = hash
          })
          .on('error', (err) => {
            error = err

            console.log(`\rError:`, err)
            reject({ error, transactionHash })
          })

        if (!error) {
          console.log(`\rSuccess`)
          resolve({ data, transactionHash })
        }
      }
      catch (err) {
        console.log(`\rError:`, err)
        reject(err)
      }
    })
  }

  fund({ secretHash }) {
    const amount      = 0.1
    const amountWei   = web3.utils.toWei(amount.toString())

    const args        = [ `0x${secretHash}`, this.participantAddress ]
    const params      = { from: this.ownerAddress, value: amountWei }

    return this.send('createSwap', args, params)
  }

  getBalance() {
    const args    = [ this.ownerAddress, this.participantAddress ]
    const params  = { from: this.ownerAddress }

    return this.call('getBalance', args, params, true)
  }

  withdraw({ secret }) {
    const args    = [ `0x${secret}`, this.ownerAddress, this.participantAddress ]
    const params  = { from: this.participantAddress }

    return this.send('withdraw', args, params)
  }

  getSecret() {
    const args    = [ this.ownerAddress, this.participantAddress ]
    const params  = { from: this.ownerAddress }

    return this.call('getSecret', args, params)
  }
}


module.exports = Contract

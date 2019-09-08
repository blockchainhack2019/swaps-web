import { encodeMethod } from 'qtumjs-ethjs-abi'
import qtum from 'cryptos/qtum'
import qtumJs from 'qtumjs-lib'


class Contract {

  static modifyWalletAddress(address) {
    return qtumJs.address.fromBase58Check(address).hash.toString('hex')
  }

  constructor({ isMeOwner, participantAddress }) {
    this.name = 'QTUM Contract'

    this.ownerAddress       = Contract.modifyWalletAddress(isMeOwner ? qtum.getAccount().address : participantAddress)
    this.participantAddress = Contract.modifyWalletAddress(isMeOwner ? participantAddress : qtum.getAccount().address)

    this.gasPrice = 400
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
    this.address  = '3d30e97d67dd1332b80858437c1b3e82caaaa15b'

    this.methods = this.abi.reduce((acc, params) => {
      const { name, type } = params

      if (type === 'function') {
        return {
          ...acc,
          [name]: params,
        }
      }

      return acc
    }, {})
  }

  executeMethod(executor, method, args = [], params = {}, silence) {
    const methodParams  = this.methods[method]
    const encodedData   = encodeMethod(methodParams, args).substr(2)

    return new Promise((resolve, reject) => {
      if (!silence) console.log(`\nStart qtumContract.${method}()`)

      qtum.getAccount()[executor](this.address, encodedData, {
        ...params,
        feeRate: this.gasPrice,
      })
        .then((tx) => {
          if (!silence) console.log(`\rSuccess`)
          resolve(tx)
        })
        .catch((err) => {
          if (!silence) console.log(`\rError:`, err)
          reject(err)
        })
    })
  }

  call(method, args, params = {}, silence) {
    return new Promise((resolve, reject) => {
      this.executeMethod('contractCall', method, args, params, silence)
        .then((receipt) => {
          const { executionResult: { output } } = receipt

          resolve(output.replace(/^0+/, '') || null)
        }, (err) => {
          reject(err)
        })
    })
  }

  async send(method, args, params = {}, silence) {
    const { txid } = await this.executeMethod('contractSend', method, args, params, silence)

    console.log('\rTransaction:', txid)

    return txid
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.secretHash
   * @returns {Promise}
   */
  fund({ secretHash }) {
    const amount        = 0.1
    const amountSatoshi = amount * 1e8

    const args    = [ secretHash, this.ownerAddress ]
    const params  = { amount: amountSatoshi }

    return this.send('createSwap', args, params)
  }

  /**
   *
   * @returns {Promise<number>}
   */
  getBalance() {
    const args = [ this.ownerAddress, this.participantAddress ]

    return this.call('getBalance', args, {}, true)
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.secret
   * @returns {Promise}
   */
  withdraw({ secret }) {
    const args = [ secret, this.ownerAddress, this.participantAddress ]

    return this.send('withdraw', args)
  }

  /**
   *
   * @returns {Promise<string>}
   */
  getSecret() {
    const args = [ this.ownerAddress, this.participantAddress ]

    return this.call('getSecret', args)
  }
}


module.exports = new Contract()

import bitcoin from 'bitcoinjs-lib'
import btc from 'cryptos/btc'


const _utcNow    = Math.floor(Date.now() / 1000)
const _lockTime = _utcNow + 3600 * 3 // 3 hours from now

/**
 *
 * @param {Object} data
 * @param {string} data.ownerPublicKey
 * @param {string} data.participantPublicKey
 * @param {string} data.secretHash
 * @param {number} [data.lockTime]
 * @returns {{contract: *, contractAddress: string}}
 */
const create = (data) => {
  console.log('\r\nStart btcContract.create()')

  const { ownerPublicKey, participantPublicKey, secretHash, lockTime = _lockTime } = data

  const contract = bitcoin.script.compile([

    bitcoin.opcodes.OP_RIPEMD160,
    Buffer.from(secretHash, 'hex'),
    bitcoin.opcodes.OP_EQUALVERIFY,

    Buffer.from(participantPublicKey, 'hex'),
    bitcoin.opcodes.OP_EQUAL,
    bitcoin.opcodes.OP_IF,

    Buffer.from(participantPublicKey, 'hex'),
    bitcoin.opcodes.OP_CHECKSIG,

    bitcoin.opcodes.OP_ELSE,

    bitcoin.script.number.encode(lockTime),
    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
    bitcoin.opcodes.OP_DROP,
    Buffer.from(ownerPublicKey, 'hex'),
    bitcoin.opcodes.OP_CHECKSIG,

    bitcoin.opcodes.OP_ENDIF,
  ])

  const publicKey       = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(contract))
  const contractAddress = bitcoin.address.fromOutputScript(publicKey, btc.network)

  console.log('Success')

  return {
    contract,
    contractAddress,
  }
}

/**
 *
 * @param {Object} data
 * @param {string} data.contractAddress
 * @returns {Promise}
 */
const fund = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('\r\nStart btcContract.fund()')

      const { contractAddress } = data

      const tx            = new bitcoin.TransactionBuilder(btc.network)
      const unspents      = await btc.fetchUnspents(Alice.accounts.btc.getAddress())

      const amount        = 0.001
      const fundValue     = amount * 1e8
      const feeValue      = 30000
      const totalUnspent  = unspents.reduce((summ, { satoshis }) => summ + satoshis, 0)
      const skipValue     = totalUnspent - fundValue - feeValue

      unspents.forEach(({ txid, vout }) => tx.addInput(txid, vout))
      tx.addOutput(contractAddress, fundValue)
      tx.addOutput(Alice.accounts.btc.getAddress(), skipValue)
      tx.inputs.forEach((input, index) => tx.sign(index, Alice.accounts.btc))

      const txRaw = tx.buildIncomplete()

      console.log(`\rTransaction:`, txRaw.getId())

      const result = await btc.broadcastTx(txRaw.toHex())

      resolve(result)
    }
    catch (err) {
      console.log(`\rError:`, err)
      reject(err)
    }
  })
}

/**
 *
 * @param {string} address
 * @returns {Promise}
 */
const getBalance = (address) =>
  new Promise(async (resolve, reject) => {
    try {
      const unspents      = await btc.fetchUnspents(address)
      const totalUnspents = unspents && unspents.length && unspents.reduce((summ, { satoshis }) => summ + satoshis, 0)

      resolve(totalUnspents || 0)
    }
    catch (err) {
      reject(err)
    }
  })

/**
 *
 * @param {Object} data
 * @param {Object} data.contract
 * @param {string} data.secret
 * @param {*} data.txRaw
 * @private
 */
const _sign = (data) => {
  console.log('\r\nStart btcContract._sign()')

  const { contract, secret, txRaw } = data

  const hashType      = bitcoin.Transaction.SIGHASH_ALL
  const signatureHash = txRaw.hashForSignature(0, contract, hashType)
  const signature     = Bob.accounts.btc.sign(signatureHash).toScriptSignature(hashType)

  const args = [
    signature,
    Bob.accounts.btc.getPublicKeyBuffer(),
    Buffer.from(secret.replace(/^0x/, ''), 'hex'),
  ]

  const contractSig = bitcoin.script.scriptHash.input.encode(args, contract)

  txRaw.setInputScript(0, contractSig)
}

/**
 *
 * @param {Object} data
 * @param {Object} data.contract
 * @param {string} data.contractAddress
 * @param {string} data.secret
 * @param {number} [data.lockTime]
 * @param {boolean} [data.isRefund]
 * @returns {Promise}
 */
const _getWithdrawRawTransaction = async (data) => {
  console.log('\r\nStart btcContract._getWithdrawRawTransaction()')

  const { contract, contractAddress, secret, lockTime = _lockTime, isRefund } = data

  const tx            = new bitcoin.TransactionBuilder(btc.network)
  const unspents      = await btc.fetchUnspents(contractAddress)
  const totalUnspent  = unspents.reduce((summ, { satoshis }) => summ + satoshis, 0)
  const feeValue      = 30000

  if (isRefund) {
    tx.setLockTime(lockTime)
  }

  unspents.forEach(({ txid, vout }) => tx.addInput(txid, vout, 0xfffffffe))
  tx.addOutput(Bob.accounts.btc.getAddress(), totalUnspent - feeValue)

  const txRaw = tx.buildIncomplete()

  _sign({ contract, secret, txRaw })

  return txRaw
}

/**
 *
 * @param {Object} data
 * @param {Object} data.contract
 * @param {string} data.contractAddress
 * @param {string} data.secret
 * @param {number} [data.lockTime]
 * @param {boolean} [data.isRefund]
 * @returns {Promise}
 */
const withdraw = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('\r\nStart btcContract.withdraw()')

      const txRaw = await _getWithdrawRawTransaction(data)

      console.log(`\rTransaction:`, txRaw.getId())

      const result = await broadcastTx(txRaw.toHex())

      resolve(result)
    }
    catch (err) {
      console.log(`\rError:`, err)
      reject(err)
    }
  })

/**
 *
 * @param {Object} data
 * @param {Object} data.contract
 * @param {string} data.contractAddress
 * @param {string} data.secret
 * @param {number} [data.lockTime]
 * @returns {Promise}
 */
const refund = (data) =>
  withdraw({ ...data, isRefund: true })


module.exports = {
  name: 'BTC Contract',
  create,
  fund,
  getBalance,
  withdraw,
  refund,
}

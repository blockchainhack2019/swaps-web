const btcContract   = require('./helpers/btcContract')
const qtumContract  = require('./helpers/qtumContract')
const checkBalance  = require('./helpers/checkBalance')
const { Alice }     = require('./helpers/participants')
const { wait }      = require('./helpers/loader')


const swap = async () => {
  try {
    // Alice owns BTC, Bob owns QTUM
    // Alice wants to swap BTC to QTUM

    // Alice creates and funds BTC Contract using her secret hash
    const aliceContract = btcContract.create({ secretHash: Alice.info.secretHash })
    await wait(btcContract.fund(aliceContract))

    // Alice sends secret hash to Bob
    // Bob funds QTUM Contract using Alice's secret hash
    await wait(qtumContract.fund({ secretHash: Alice.info.secretHash }))

    await wait(checkBalance(btcContract, false, aliceContract.contractAddress))
    await wait(checkBalance(qtumContract, false))

    // Alice withdraw money from QTUM Contract
    // Alice puts here secret
    await wait(qtumContract.withdraw({ secret: Alice.info.secret }))

    await wait(checkBalance(qtumContract, true))

    // Bob gets secret from QTUM Contract
    const secret = await wait(qtumContract.getSecret())

    // Bob withdraw money from BTC Contract using Alice's secret
    const bobContract = btcContract.create({ secretHash: Alice.info.secretHash })
    await wait(btcContract.withdraw({ ...bobContract, secret }))

    await wait(checkBalance(btcContract, true, bobContract.contractAddress))

    console.log('\nSWAP FINISHED SUCCESSFULLY!')
  }
  catch (err) {
    console.log(err)
  }
}

swap()

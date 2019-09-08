const ethContract   = require('./helpers/ethContract')
const qtumContract  = require('./helpers/qtumContract')
const checkBalance  = require('./helpers/checkBalance')
const { Alice }     = require('./helpers/participants')
const { wait }      = require('./helpers/loader')


const ownerFlow = () => {

}

const participantFlow = () => {

}

const swap = async () => {
  try {
    // Alice owns ETH, Bob owns QTUM
    // Alice wants to swap ETH to QTUM

    // Alice funds QTUM Contract using here secret hash
    await wait(ethContract.fund({ secretHash: Alice.info.secretHash }))

    // Alice sends secret hash to Bob
    // Bob funds QTUM Contract using Alice's secret hash
    await wait(qtumContract.fund({ secretHash: Alice.info.secretHash }))

    await wait(checkBalance(ethContract, false))
    await wait(checkBalance(qtumContract, false))

    // Alice withdraw money from QTUM Contract
    // Alice puts here secret
    await wait(qtumContract.withdraw({ secret: Alice.info.secret }))

    await wait(checkBalance(ethContract, true))

    // Bob gets secret from QTUM Contract
    const secret = await wait(qtumContract.getSecret())

    // Bob withdraw money from ETH Contract using Alice's secret
    await wait(ethContract.withdraw({ secret }))

    await wait(checkBalance(ethContract, true))

    console.log('\nSWAP FINISHED SUCCESSFULLY!')
  }
  catch (err) {
    console.log(err)
  }
}

swap()

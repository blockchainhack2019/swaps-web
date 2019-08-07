import React from 'react'
import { useConnect } from 'store'

import s from './WalletsPage.scss'


const WalletsPage = () => {
  const { wallets } = useConnect(({ user: { accounts } }) => {
    const wallets = Object.keys(accounts).reduce((acc, accountKey) => [
      ...acc,
      {
        name: accountKey,
        ...accounts[accountKey],
      }
    ], [])

    return {
      wallets,
    }
  })

  return (
    <table className={s.items}>
      <thead>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Balance</th>
        <th />
      </tr>
      </thead>
      <tbody>
        {
          wallets.map(({ name, address, balance }) => (
            <tr key={name} className={s.item}>
              <td className={s.name}>{name}</td>
              <td>{address}</td>
              <td>{balance}</td>
              <td>
                <div className={s.button}>Deposit</div>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}


export default WalletsPage

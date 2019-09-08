import React from 'react'
import { useConnect } from 'store'

import Table from 'components/Table/Table'

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
    <Table
      titles={[ 'Name', 'Address', 'Balance' ]}
      data={wallets}
      renderRow={({ name, address, balance }) => (
        <Table.Row key={name}>
          <td className={s.name}>{name}</td>
          <td>{address}</td>
          <td>{balance}</td>
          <td>
            <div className={s.button}>Deposit</div>
          </td>
        </Table.Row>
      )}
    />
  )
}


export default WalletsPage

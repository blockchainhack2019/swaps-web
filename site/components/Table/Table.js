import React from 'react'

import s from './Table.scss'


const Table = ({ titles, data, renderRow }) => (
  <table className={s.items}>
    <thead>
      <tr>
        {
          titles.map((title, index) => (
            <th key={index} dangerouslySetInnerHTML={{ __html: title }} />
          ))
        }
      </tr>
    </thead>
    <tbody>
      {
        data.map((item) => renderRow(item))
      }
    </tbody>
  </table>
)

const Row = ({ children }) => (
  <tr className={s.item}>
    {children}
  </tr>
)

Table.Row = Row


export default Table

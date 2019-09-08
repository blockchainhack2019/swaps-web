import React from 'react'
import { NavLink } from 'react-router-dom'

import { WidthContainer } from 'components/layout'

import s from './Header.scss'


const menu = [
  { title: 'Exchange', link: '/exchange' },
  { title: 'Wallets', link: '/wallets' },
  { title: 'Swap Requests', link: '/swap-requests' },
]

const Header = () => (
  <div className={s.header}>
    <WidthContainer>
      <div className={s.content}>
        <div className={s.menu}>
          {
            menu.map(({ title, link }, index) => (
              <NavLink
                key={index}
                className={s.item}
                activeClassName={s.active}
                to={link}
              >
                {title}
              </NavLink>
            ))
          }
        </div>
      </div>
    </WidthContainer>
  </div>
)


export default Header

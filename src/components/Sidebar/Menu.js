import React from 'react'

import { Sidebar, Menu } from 'semantic-ui-react'

import MenuItems from './MenuItems.js'

const items = [
  {
    title: `Dashboard`,
    link: '/'
  },
  {
    title: `Profile`,
    link: '/profile'
  }
]

function SidebarMenu({ sidebarVisible }) {
  return (
    <Sidebar
      vertical
      borderless
      animation="push"
      as={Menu}
      visible={sidebarVisible}
      content={<MenuItems items={items} />}
      className="mathlab"
    />
  )
}

export default SidebarMenu

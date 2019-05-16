import React from 'react'
import { Menu, Sidebar } from 'semantic-ui-react'
import MenuItems from './MenuItems.js'

const items = [
  {
    title: `Dashboard`,
    link: '/'
  },
  {
    title: `Profile`,
    link: '/profile'
  },
  {
    title: `Users`,
    link: '/users',
    permits: ['admin', 'teacher']
  },
  {
    title: `Courses`,
    link: '/courses',
    permits: ['teacher']
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

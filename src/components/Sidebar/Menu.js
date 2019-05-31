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
    permits: ['admin', 'teacher', 'student']
  },
  {
    title: `MCQs`,
    link: '/mcqs',
    permits: ['admin', 'teacher'],
    items: [
      {
        title: `Tags`,
        link: '/mcqs/tags',
        permits: ['admin', 'teacher']
      }
    ]
  },
  {
    title: `Batches`,
    link: '/batches',
    permits: ['admin', 'teacher']
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

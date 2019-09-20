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
    permits: ['teacher']
  },
  {
    title: `Courses`,
    link: '/courses',
    permits: ['teacher', 'student'],
    items: [
      {
        title: `Tags`,
        link: '/courses/tags',
        permits: ['teacher']
      }
    ]
  },
  {
    title: `MCQs`,
    link: '/mcqs',
    permits: ['teacher'],
    items: [
      {
        title: `Tags`,
        link: '/mcqs/tags',
        permits: ['teacher']
      }
    ]
  },
  {
    title: `Batch Classes`,
    link: '/batchclasses',
    permits: ['teacher']
  }
  // {
  //   title: `Batch Courses`,
  //   link: '/batchcourses',
  //   permits: ['teacher']
  // }
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

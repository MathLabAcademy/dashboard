import { Redirect, Router } from '@reach/router'
import React from 'react'
import WebNotificationsPage from './web'

function NotificationsPage() {
  return (
    <Router>
      <Redirect from="/" to="web/" noThrow />
      <WebNotificationsPage path="web/*" />
    </Router>
  )
}

export default NotificationsPage

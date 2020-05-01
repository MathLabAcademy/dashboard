import { Router } from '@reach/router'
import React from 'react'
import NotificationsSMSPage from './sms'

function NotificationsPage() {
  return (
    <Router>
      <NotificationsSMSPage path="sms/*" />
    </Router>
  )
}

export default NotificationsPage

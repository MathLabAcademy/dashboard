import { Redirect } from 'components/Redirect'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WebNotificationsPage from './web'

function Fallback() {
  return <Redirect from="/" to="web/" />
}

function NotificationsPage() {
  return (
    <Routes>
      <Route element={<WebNotificationsPage />} path="web/*" />
      <Route element={<Fallback />} path="*" />
    </Routes>
  )
}

export default NotificationsPage

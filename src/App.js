import { Router } from '@reach/router'
import Navbar from 'components/Navbar/Main.js'
import SidebarMenu from 'components/Sidebar/Menu.js'
import { get } from 'lodash-es'
import EmailVerification from 'pages/email-verification/Main.js'
import ForgotPassword from 'pages/forgot-password/Main.js'
import LogIn from 'pages/login/Main.js'
import Dashboard from 'pages/Main.js'
import Register from 'pages/register/Main.js'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Segment, Sidebar } from 'semantic-ui-react'
import { checkAuthStatus } from 'store/actions/currentUser.js'
import './App.css'

function App({ checkAuthStatus, userStatus }) {
  const [sidebarVisible, setSidebarVisible] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const toggleSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible)
  }, [sidebarVisible])

  return (
    <Sidebar.Pushable>
      {userStatus.authed ? (
        <SidebarMenu sidebarVisible={sidebarVisible} />
      ) : null}

      <Sidebar.Pusher>
        <Navbar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
        <Segment basic padded>
          <Router>
            <Dashboard path="/*" />
            <LogIn path="/login" />
            <Register path="/register" />
            <EmailVerification path="/verify-email/:token" />
            <EmailVerification
              path="/verify-guardian-email/:token"
              forGuardian
            />
            <ForgotPassword path="/forgot-password/*" />
          </Router>
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

const mapActionToProps = { checkAuthStatus }

export default connect(
  mapStateToProps,
  mapActionToProps
)(App)

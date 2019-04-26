import React from 'react'

import { connect } from 'react-redux'

import get from 'lodash/get'

import { Redirect, Router } from '@reach/router'

import Index from './index/Main.js'
import Profile from './profile/Main.js'

function Dashboard({ userStatus }) {
  return userStatus.loading ? (
    <div>Loading...</div>
  ) : userStatus.authed ? (
    <Router>
      <Index path="/" />
      <Profile path="profile/*" />
    </Router>
  ) : (
    <Redirect to="/login" noThrow />
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(Dashboard)

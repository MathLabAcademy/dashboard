import { Redirect, Router } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import RequestReset from './RequestReset.js'
import Reset from './Reset.js'

function ForgotPassword({ userStatus, location }) {
  return userStatus.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Router>
      <RequestReset path="/" />
      <Reset path=":userId/:token" />
    </Router>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(ForgotPassword)

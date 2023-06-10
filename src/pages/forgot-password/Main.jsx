import { Redirect, Router } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { usePageviewAnalytics } from 'utils/analytics'
import RequestReset from './RequestReset'
import Reset from './Reset'

function ForgotPassword({ userStatus }) {
  usePageviewAnalytics()

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
  userStatus: get(user, 'status'),
})

export default connect(mapStateToProps)(ForgotPassword)
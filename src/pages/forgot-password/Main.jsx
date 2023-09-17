import { Redirect } from 'components/Redirect'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { usePageviewAnalytics } from 'utils/analytics'
import RequestReset from './RequestReset'
import Reset from './Reset'

function ForgotPassword({ userStatus }) {
  usePageviewAnalytics()

  return userStatus.authed ? (
    <Redirect to="/" />
  ) : (
    <Routes>
      <Route element={<RequestReset />} path="/" />
      <Route element={<Reset />} path=":userId/:token" />
    </Routes>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status'),
})

export default connect(mapStateToProps)(ForgotPassword)

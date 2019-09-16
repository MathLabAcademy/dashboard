import { Redirect, Router } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import Batches from './batches/Main.js'
import Courses from './courses/Main.js'
import Index from './index/Main.js'
import MCQs from './mcqs/Main.js'
import Profile from './profile/Main.js'
import Users from './users/Main.js'

function Dashboard({ userStatus }) {
  return userStatus.loading ? (
    <div>Loading...</div>
  ) : userStatus.authed ? (
    <Router>
      <Index path="/" />
      {/* <Batches path="batches/*" /> */}
      <Courses path="courses/*" />
      <MCQs path="mcqs/*" />
      <Profile path="profile/*" />
      <Users path="users/*" />
    </Router>
  ) : (
    <Redirect to="/login" noThrow />
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(Dashboard)

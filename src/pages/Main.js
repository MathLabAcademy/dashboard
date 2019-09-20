import { Redirect, Router } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import BatchClasses from './batch/classes/Main'
// import BatchCourses from './batch/courses/Main'
import Courses from './courses/Main'
import Index from './index/Main'
import MCQs from './mcqs/Main'
import Profile from './profile/Main'
import Users from './users/Main'

function Dashboard({ userStatus }) {
  return userStatus.loading ? (
    <div>Loading...</div>
  ) : userStatus.authed ? (
    <Router>
      <Index path="/" />
      <BatchClasses path="batchclasses/*" />
      {/* <BatchCourses path="batchcourses/*" /> */}
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

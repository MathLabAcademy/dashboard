import { Redirect, Router } from '@reach/router'
import React from 'react'
import { useSelector } from 'react-redux'
import BatchClasses from './batch/classes/Main'
import BatchCourses from './batch/courses/Main'
import Courses from './courses/Main'
import FindUser from './find-user/Main'
import Index from './index/Main'
import MCQs from './mcqs/Main'
import Profile from './profile/Main'
import Users from './users/Main'

function Dashboard() {
  const { status: userStatus } = useSelector((state) => state.user)

  return userStatus.loading ? (
    <div>Loading...</div>
  ) : userStatus.authed ? (
    <Router>
      <Index path="/" />
      <BatchClasses path="batchclasses/*" />
      <BatchCourses path="batchcourses/*" />
      <Courses path="courses/*" />
      <MCQs path="mcqs/*" />
      <Profile path="profile/*" />
      <Users path="users/*" />
      <FindUser path="find-user/*" />
    </Router>
  ) : (
    <Redirect to="/login" noThrow />
  )
}

export default Dashboard

import React from 'react'
import { Link, Router } from '@reach/router'
import CourseEnrollmentList from './List'

function CourseEnrollments({ courseId }) {
  return (
    <Router>
      <CourseEnrollmentList path="/" courseId={courseId} />
    </Router>
  )
}

export default CourseEnrollments

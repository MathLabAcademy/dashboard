import { Router } from '@reach/router'
import React from 'react'
import CourseEnrollmentList from './List'

function CourseEnrollments({ courseId }) {
  return (
    <Router>
      <CourseEnrollmentList path="/" courseId={courseId} />
    </Router>
  )
}

export default CourseEnrollments

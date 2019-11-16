import { Router } from '@reach/router'
import React from 'react'
import List from './List'
import View from './View'

function BatchCourseEnrollments({ batchCourseId }) {
  return (
    <>
      <Router>
        <List
          path="/"
          batchCourseId={batchCourseId}
          linkToBase="enrollments/"
        />
        <List path="enrollments" batchCourseId={batchCourseId} linkToBase="" />
        <View
          path="enrollments/:batchCourseEnrollmentId"
          batchCourseId={batchCourseId}
        />
      </Router>
    </>
  )
}

export default BatchCourseEnrollments

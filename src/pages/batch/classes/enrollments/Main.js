import { Router } from '@reach/router'
import React from 'react'
import List from './List'
import View from './View'

function BatchClassEnrollments({ batchClassId }) {
  return (
    <>
      <Router>
        <List path="/" batchClassId={batchClassId} linkToBase="enrollments/" />
        <List path="enrollments" batchClassId={batchClassId} linkToBase="" />
        <View
          path="enrollments/:batchClassEnrollmentId"
          batchClassId={batchClassId}
        />
      </Router>
    </>
  )
}

export default BatchClassEnrollments

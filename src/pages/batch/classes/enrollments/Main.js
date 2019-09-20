import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'

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

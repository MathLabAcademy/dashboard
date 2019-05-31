import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'

function BatchClassStudents({ batchClassId }) {
  return (
    <>
      <Router>
        <List path="/" batchClassId={batchClassId} linkToBase="students/" />
        <List path="students" batchClassId={batchClassId} linkToBase="" />
        <View path="students/:batchStudentId" batchClassId={batchClassId} />
      </Router>
    </>
  )
}

export default BatchClassStudents

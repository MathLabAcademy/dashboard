import { Router } from '@reach/router'
import React from 'react'
import List from './List'

function BatchCoursePayments({ batchCourseId }) {
  return (
    <>
      <Router>
        <List path="/" batchCourseId={batchCourseId} linkToBase="payments/" />
        <List path="payments" batchCourseId={batchCourseId} linkToBase="" />
      </Router>
    </>
  )
}

export default BatchCoursePayments

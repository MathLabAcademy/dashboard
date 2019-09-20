import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'

function BatchClassPayments({ batchClassId }) {
  return (
    <>
      <Router>
        <List path="/" batchClassId={batchClassId} linkToBase="payments/" />
        <List path="payments" batchClassId={batchClassId} linkToBase="" />
      </Router>
    </>
  )
}

export default BatchClassPayments

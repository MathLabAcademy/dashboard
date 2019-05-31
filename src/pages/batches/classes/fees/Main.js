import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'

function BatchClassFees({ batchClassId }) {
  return (
    <>
      <Router>
        <List path="/" batchClassId={batchClassId} linkToBase="fees/" />
        <List path="fees" batchClassId={batchClassId} linkToBase="" />
      </Router>
    </>
  )
}

export default BatchClassFees

import { Routes, Route } from 'react-router-dom'
import React from 'react'
import List from './List'

function BatchClassPayments({ batchClassId }) {
  return (
    <>
      <Routes>
        <Route
          element={<List batchClassId={batchClassId} linkToBase="payments/" />}
          path="/"
        />
        <Route
          element={<List batchClassId={batchClassId} linkToBase="" />}
          path="payments"
        />
      </Routes>
    </>
  )
}

export default BatchClassPayments

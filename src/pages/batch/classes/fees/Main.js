import { Routes, Route } from 'react-router-dom'
import React from 'react'
import List from './List'

function BatchClassFees({ batchClassId }) {
  return (
    <>
      <Routes>
        <Route
          element={<List batchClassId={batchClassId} linkToBase="fees/" />}
          path="/"
        />
        <Route
          element={<List batchClassId={batchClassId} linkToBase="" />}
          path="fees"
        />
      </Routes>
    </>
  )
}

export default BatchClassFees

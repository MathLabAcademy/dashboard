import { Routes, Route } from 'react-router-dom'
import React from 'react'
import List from './List'
import View from './View'

function BatchClassEnrollments({ batchClassId }) {
  return (
    <>
      <Routes>
        <Route
          element={
            <List batchClassId={batchClassId} linkToBase="enrollments/" />
          }
          path="/"
        />
        <Route
          element={<List batchClassId={batchClassId} linkToBase="" />}
          path="enrollments"
        />
        <Route
          element={<View batchClassId={batchClassId} />}
          path="enrollments/:batchClassEnrollmentId"
        />
      </Routes>
    </>
  )
}

export default BatchClassEnrollments

import { Routes, Route } from 'react-router-dom'
import React from 'react'
import List from './List'

function BatchCoursePayments({ batchCourseId }) {
  return (
    <>
      <Routes>
        <Route
          element={
            <List batchCourseId={batchCourseId} linkToBase="payments/" />
          }
          path="/"
        />
        <Route
          element={<List batchCourseId={batchCourseId} linkToBase="" />}
          path="payments"
        />
      </Routes>
    </>
  )
}

export default BatchCoursePayments

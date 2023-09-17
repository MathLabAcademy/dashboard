import React from 'react'
import { Route, Routes } from 'react-router-dom'
import List from './List'
import View from './View'

function BatchCourseEnrollments({ batchCourseId }) {
  return (
    <>
      <Routes>
        <Route
          element={
            <List batchCourseId={batchCourseId} linkToBase="enrollments/" />
          }
          path="/"
        />
        <Route
          element={<List batchCourseId={batchCourseId} linkToBase="" />}
          path="enrollments"
        />
        <Route
          element={<View batchCourseId={batchCourseId} />}
          path="enrollments/:batchCourseEnrollmentId"
        />
      </Routes>
    </>
  )
}

export default BatchCourseEnrollments

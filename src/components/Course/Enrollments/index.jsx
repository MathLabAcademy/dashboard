import { Routes, Route } from 'react-router-dom'
import React from 'react'
import CourseEnrollmentList from './List'

function CourseEnrollments({ courseId }) {
  return (
    <Routes>
      <Route element={<CourseEnrollmentList courseId={courseId} />} path="/" />
    </Routes>
  )
}

export default CourseEnrollments

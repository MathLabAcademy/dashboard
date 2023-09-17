import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import View from './View'

function CourseMCQExams({ courseId }) {
  const hasAccess = useCourseAccess(courseId)

  if (!hasAccess) {
    return null
  }

  return (
    <Permit roles="teacher,analyst,assistant,student">
      <Routes>
        <Route element={<List courseId={courseId} />} path="/" />
        <Route element={<Create courseId={courseId} />} path="create" />
        <Route element={<Edit courseId={courseId} />} path=":mcqExamId/edit" />
        <Route element={<View courseId={courseId} />} path=":mcqExamId/*" />
      </Routes>
    </Permit>
  )
}

export default CourseMCQExams

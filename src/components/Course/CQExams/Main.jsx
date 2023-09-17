import { Routes, Route } from 'react-router-dom'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import React from 'react'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import TeacherCQExamSubmissionView from './TeacherCQExamSubmissionView'
import View from './View'

function CourseCQExams({ courseId }) {
  const hasAccess = useCourseAccess(courseId)

  if (!hasAccess) {
    return null
  }

  return (
    <Permit roles="teacher,analyst,assistant,student">
      <Routes>
        <Route element={<List courseId={courseId} />} path="/" />
        <Route element={<Create courseId={courseId} />} path="create" />
        <Route element={<Edit courseId={courseId} />} path=":cqExamId/edit" />
        <Route
          element={<TeacherCQExamSubmissionView courseId={courseId} />}
          path=":cqExamId/submissions/:userId"
        />
        <Route element={<View courseId={courseId} />} path=":cqExamId/*" />
      </Routes>
    </Permit>
  )
}

export default CourseCQExams

import { Router } from '@reach/router'
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
      <Router>
        <List path="/" courseId={courseId} />
        <Create path="create" courseId={courseId} />
        <Edit path=":cqExamId/edit" courseId={courseId} />
        <TeacherCQExamSubmissionView
          path=":cqExamId/submissions/:userId"
          courseId={courseId}
        />
        <View path=":cqExamId/*" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseCQExams
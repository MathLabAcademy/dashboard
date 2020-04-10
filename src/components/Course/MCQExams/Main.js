import { Router } from '@reach/router'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import React from 'react'
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
    <Permit roles="teacher,student">
      <Router>
        <List path="/" courseId={courseId} />
        <Create path="create" courseId={courseId} />
        <Edit path=":mcqExamId/edit" courseId={courseId} />
        <View path=":mcqExamId/*" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseMCQExams

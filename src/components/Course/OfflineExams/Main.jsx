import { Router } from '@reach/router'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import React from 'react'
import List from './List'

function CourseOfflineExams({ courseId }) {
  const hasAccess = useCourseAccess(courseId)

  if (!hasAccess) {
    return null
  }

  return (
    <Permit roles="teacher,analyst,assistant,student">
      <Router>
        <List path="/" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseOfflineExams

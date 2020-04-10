import { Redirect, Router } from '@reach/router'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import React from 'react'
import Create from './Create'
import List from './List'
import View from './View'

function CourseVideos({ courseId }) {
  const hasAccess = useCourseAccess(courseId)

  if (!hasAccess) {
    return <Redirect to={'..'} noThrow />
  }

  return (
    <Permit roles="teacher,student">
      <Router>
        <List path="/" courseId={courseId} />
        <View path=":courseVideoId" courseId={courseId} />
        <Create path="create" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseVideos

import { Routes, Route } from 'react-router-dom'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import React from 'react'
import Create from './Create'
import List from './List'
import View from './View'

function CourseVideos({ courseId }) {
  const hasAccess = useCourseAccess(courseId)

  if (!hasAccess) {
    return null
  }

  return (
    <Permit roles="teacher,analyst,assistant,student">
      <Routes>
        <Route element={<List courseId={courseId} />} path="/" />
        <Route element={<View courseId={courseId} />} path=":videoId" />
        <Route element={<Create courseId={courseId} />} path="create" />
      </Routes>
    </Permit>
  )
}

export default CourseVideos

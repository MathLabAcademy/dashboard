import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React from 'react'
import Create from './Create'
import List from './List'

function CourseVideos({ courseId }) {
  return (
    <Permit teacher student>
      <Router>
        <List path="/" courseId={courseId} linkToBase="videos/" />
        <List path="videos" courseId={courseId} linkToBase="" />
        <Create path="videos/create" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseVideos

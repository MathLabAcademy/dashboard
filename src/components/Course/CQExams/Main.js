import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React from 'react'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import View from './View'

function CourseCQExams({ courseId }) {
  return (
    <Permit admin teacher student>
      <Router>
        <List path="/" courseId={courseId} linkToBase="cqexams/" />
        <List path="cqexams" courseId={courseId} linkToBase="" />
        <Create path="cqexams/create" courseId={courseId} />
        <Edit path="cqexams/:cqExamId/edit" courseId={courseId} />
        <View path="cqexams/:cqExamId/*" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseCQExams

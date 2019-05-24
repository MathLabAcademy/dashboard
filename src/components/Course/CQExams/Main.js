import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'

function CourseCQExams({ courseId }) {
  return (
    <Permit teacher student>
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

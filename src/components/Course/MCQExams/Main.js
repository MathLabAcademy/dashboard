import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'

function CourseMCQExams({ courseId }) {
  return (
    <Permit admin teacher student>
      <Router>
        <List path="/" courseId={courseId} linkToBase="mcqexams/" />
        <List path="mcqexams" courseId={courseId} linkToBase="" />
        <Create path="mcqexams/create" courseId={courseId} />
        <Edit path="mcqexams/:mcqExamId/edit" courseId={courseId} />
        <View path="mcqexams/:mcqExamId/*" courseId={courseId} />
      </Router>
    </Permit>
  )
}

export default CourseMCQExams

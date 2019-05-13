import { Router } from '@reach/router'
import React from 'react'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'

function CourseMCQExams({ courseId }) {
  return (
    <Router>
      <List path="/" linkToBase="mcqexams/" courseId={courseId} />
      <List path="mcqexams" linkToBase="" courseId={courseId} />
      <Create path="mcqexams/create" courseId={courseId} />
      <Edit path="mcqexams/:mcqExamId/edit" courseId={courseId} />
      <View path="mcqexams/:mcqExamId/*" courseId={courseId} />
    </Router>
  )
}

export default CourseMCQExams

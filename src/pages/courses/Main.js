import { Router } from '@reach/router'
import React from 'react'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'

function Courses() {
  return (
    <Router>
      <List path="/" />
      <Create path="/create" />
      <View path="/:courseId" />
      <Edit path="/:courseId/edit" />
    </Router>
  )
}

export default Courses

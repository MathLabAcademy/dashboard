import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React from 'react'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import View from './View'

function BatchCourses() {
  return (
    <Permit roles="teacher,analyst,assistant">
      <Router>
        <List path="/" />
        <Create path="create" />
        <Edit path=":batchCourseId/edit" />
        <View path=":batchCourseId/*" />
      </Router>
    </Permit>
  )
}

export default BatchCourses

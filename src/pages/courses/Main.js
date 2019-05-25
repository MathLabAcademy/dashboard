import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'

function Courses() {
  return (
    <Permit admin teacher student>
      <Router>
        <List path="/" />
        <Create path="/create" />
        <Edit path="/:courseId/edit" />
        <View path="/:courseId/*" />
      </Router>
    </Permit>
  )
}

export default Courses

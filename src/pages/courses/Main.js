import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'

function Courses() {
  return (
    <Router>
      <List path="/" />
      <View path="/:courseId" />
    </Router>
  )
}

export default Courses

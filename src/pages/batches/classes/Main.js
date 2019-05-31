import { Router } from '@reach/router'
import React from 'react'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'

function BatchClasses() {
  return (
    <Router>
      <List path="/" />
      <Create path="create" />
      <Edit path=":batchClassId/edit" />
      <View path=":batchClassId/*" />
    </Router>
  )
}

export default BatchClasses

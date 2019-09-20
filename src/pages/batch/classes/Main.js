import { Router } from '@reach/router'
import React from 'react'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import View from './View'
import Permit from 'components/Permit'

function BatchClasses() {
  return (
    <Permit teacher>
      <Router>
        <List path="/" />
        <Create path="create" />
        <Edit path=":batchClassId/edit" />
        <View path=":batchClassId/*" />
      </Router>
    </Permit>
  )
}

export default BatchClasses

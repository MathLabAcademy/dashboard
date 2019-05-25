import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'
import View from './View.js'

function Users() {
  return (
    <Permit admin teacher>
      <Router>
        <List path="/" />
        <View path="/:userId/*" />
      </Router>
    </Permit>
  )
}

export default Users

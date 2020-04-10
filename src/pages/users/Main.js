import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React from 'react'
import List from './List'
import View from './View'

function Users() {
  return (
    <Permit roles="admin,teacher">
      <Router>
        <List path="/" />
        <View path="/:userId/*" />
        <View path="/onsite/:userId/*" onsite={true} />
      </Router>
    </Permit>
  )
}

export default Users

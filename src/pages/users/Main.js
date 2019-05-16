import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'
import AddCredit from './AddCredit.js'

function Users() {
  return (
    <Router>
      <List path="/" />
      <View path="/:userId" />
      <AddCredit path="/:userId/add-credit" />
    </Router>
  )
}

export default Users

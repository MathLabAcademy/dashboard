import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'

function Users() {
  return (
    <Router>
      <List path="/" />
      <View path="/:userId" />
    </Router>
  )
}

export default Users

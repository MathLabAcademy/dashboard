import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'

function Users() {
  return (
    <Router>
      <List path="/" />
      <View path="/:UserId" />
    </Router>
  )
}

export default Users

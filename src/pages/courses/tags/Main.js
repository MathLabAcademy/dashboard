import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'

function Tags() {
  return (
    <Permit admin teacher>
      <Router>
        <List path="/" />
      </Router>
    </Permit>
  )
}

export default Tags

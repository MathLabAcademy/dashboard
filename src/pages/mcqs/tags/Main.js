import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React from 'react'
import List from './List'

function Tags() {
  return (
    <Permit teacher assistant>
      <Router>
        <List path="/" />
      </Router>
    </Permit>
  )
}

export default Tags

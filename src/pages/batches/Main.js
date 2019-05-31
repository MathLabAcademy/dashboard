import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import Classes from './classes/Main.js'

function Batches() {
  return (
    <Permit admin teacher>
      <Router>
        <Classes path="/*" />
      </Router>
    </Permit>
  )
}

export default Batches

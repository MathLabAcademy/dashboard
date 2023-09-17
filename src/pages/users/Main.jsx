import Permit from 'components/Permit'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import List from './List'
import View from './View'

function Users() {
  return (
    <Permit roles="teacher,analyst">
      <Routes>
        <Route element={<List />} path="/" />
        <Route element={<View />} path="/:userId/*" />
        <Route element={<View />} path="/onsite/:userId/*" onsite={true} />
      </Routes>
    </Permit>
  )
}

export default Users

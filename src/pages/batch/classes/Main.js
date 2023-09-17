import Permit from 'components/Permit'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import View from './View'

function BatchClasses() {
  return (
    <Permit roles="teacher,analyst">
      <Routes>
        <Route element={<List />} path="/" />
        <Route element={<Create />} path="create" />
        <Route element={<Edit />} path=":batchClassId/edit" />
        <Route element={<View />} path=":batchClassId/*" />
      </Routes>
    </Permit>
  )
}

export default BatchClasses

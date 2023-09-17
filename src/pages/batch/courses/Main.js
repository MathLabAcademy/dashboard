import { Routes, Route } from 'react-router-dom'
import Permit from 'components/Permit'
import React from 'react'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import View from './View'

function BatchCourses() {
  return (
    <Permit roles="teacher,analyst,assistant">
      <Routes>
        <Route element={<List />} path="/" />
        <Route element={<Create />} path="create" />
        <Route element={<Edit />} path=":batchCourseId/edit" />
        <Route element={<View />} path=":batchCourseId/*" />
      </Routes>
    </Permit>
  )
}

export default BatchCourses

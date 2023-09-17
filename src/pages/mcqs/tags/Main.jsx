import Permit from 'components/Permit'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import List from './List'

function Tags() {
  return (
    <Permit roles="teacher,analyst,assistant">
      <Routes>
        <Route element={<List />} path="/" />
      </Routes>
    </Permit>
  )
}

export default Tags

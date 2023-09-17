import Permit from 'components/Permit'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { fetchAllTagPage } from 'store/actions/mcqTags'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import Tags from './tags/Main'
import View from './View'

function MCQs({ tags, tagsPagination, fetchAllTagPage }) {
  useEffect(() => {
    if (
      !tagsPagination.totalItems ||
      tagsPagination.totalItems !== tags.allIds.length
    ) {
      fetchAllTagPage({ query: 'length=1000' })
    }
  }, [fetchAllTagPage, tags.allIds.length, tagsPagination.totalItems])

  return (
    <Permit roles="teacher,analyst,assistant">
      <Routes>
        <Route element={<List />} path="/" />
        <Route element={<Tags />} path="tags/*" />
        <Route element={<Create />} path="create" />
        <Route element={<View />} path=":mcqId" />
        <Route element={<Edit />} path=":mcqId/edit" />
      </Routes>
    </Permit>
  )
}

const mapStateToProps = ({ mcqTags, pagination }) => ({
  tags: mcqTags,
  tagsPagination: pagination.mcqTags,
})

const mapDispatchToProps = {
  fetchAllTagPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQs)

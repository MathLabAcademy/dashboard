import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
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
      <Router>
        <List path="/" />
        <Tags path="tags/*" />
        <Create path="create" />
        <View path=":mcqId" />
        <Edit path=":mcqId/edit" />
      </Router>
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

import { Router } from '@reach/router'
import Permit from 'components/Permit'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllTagPage } from 'store/actions/courseTags'
import Create from './Create'
import Edit from './Edit'
import List from './List'
import Tags from './tags/Main'
import View from './View'

function Courses({ tags, tagsPagination, fetchAllTagPage }) {
  useEffect(() => {
    if (
      !tagsPagination.totalItems ||
      tagsPagination.totalItems !== tags.allIds.length
    ) {
      fetchAllTagPage({ query: 'length=40' })
    }
  }, [fetchAllTagPage, tags.allIds.length, tagsPagination.totalItems])

  return (
    <Permit roles="teacher,student">
      <Router>
        <List path="/" />
        <Tags path="tags/*" />
        <Create path="/create" />
        <Edit path="/:courseId/edit" />
        <View path="/:courseId/*" />
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

export default connect(mapStateToProps, mapDispatchToProps)(Courses)

import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllTagPage } from 'store/actions/courseTags.js'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import Tags from './tags/Main.js'
import View from './View.js'

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
    <Permit admin teacher student>
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
  tagsPagination: pagination.mcqTags
})

const mapDispatchToProps = {
  fetchAllTagPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses)

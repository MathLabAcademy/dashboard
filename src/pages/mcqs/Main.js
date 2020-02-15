import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllTagPage } from 'store/actions/mcqTags.js'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import Tags from './tags/Main.js'
import View from './View.js'

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
    <Permit teacher>
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
  tagsPagination: pagination.mcqTags
})

const mapDispatchToProps = {
  fetchAllTagPage
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQs)

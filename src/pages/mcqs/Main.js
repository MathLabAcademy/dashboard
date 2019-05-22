import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllTagPage } from 'store/actions/mcqTags.js'
import Create from './Create.js'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'
import Tags from './tags/Main.js'

function MCQs({ mcqTags, mcqTagsPagination, fetchAllTagPage }) {
  useEffect(() => {
    if (
      !mcqTagsPagination.totalItems ||
      mcqTagsPagination.totalItems !== mcqTags.allIds.length
    ) {
      fetchAllTagPage({ query: 'length=40' })
    }
  }, [fetchAllTagPage, mcqTags.allIds.length, mcqTagsPagination.totalItems])

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
  mcqTags,
  mcqTagsPagination: pagination.mcqTags
})

const mapDispatchToProps = {
  fetchAllTagPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQs)

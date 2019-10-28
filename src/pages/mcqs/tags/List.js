import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import usePagination from 'hooks/usePagination'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import { Header, Segment } from 'semantic-ui-react'
import { fetchTagPage } from 'store/actions/mcqTags'
import { emptyArray } from 'utils/defaults'
import Create from './ActionModals/Create'
import Edit from './ActionModals/Edit'

function _TagListItem({ tagId, tag }) {
  return (
    <Segment style={{ margin: '0.5em' }}>
      <Header>{get(tag, 'name')}</Header>
      <Edit tagId={tagId} tag={tag} />
    </Segment>
  )
}

const ListItem = connect(({ mcqTags }, { tagId }) => ({
  tag: get(mcqTags.byId, tagId)
}))(_TagListItem)

const queryObject = { length: 40 }

function TagList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject
  })

  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>MCQ Tags</Header>} />
      </Segment>

      <Segment basic>
        <Flex
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
            <ListItem key={id} id={id} tagId={id} />
          ))}

          <Segment style={{ margin: '0.5em' }}>
            <Create />
          </Segment>
        </Flex>
      </Segment>

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}
const mapStateToProps = ({ pagination }) => ({
  pagination: pagination.mcqTags
})

const mapDispatchToProps = {
  fetchPage: fetchTagPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagList)

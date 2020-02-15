import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import { Header, Segment } from 'semantic-ui-react'
import { fetchAllTagPage } from 'store/actions/mcqTags'
import { emptyArray } from 'utils/defaults'
import Create from './ActionModals/Create'
import Edit from './ActionModals/Edit'
import TagGroupsEditModal from './ActionModals/EditGroups'

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

function TagList({ mcqTags, fetchAllTagPage }) {
  useEffect(() => {
    fetchAllTagPage({ query: 'length=1000' })
  }, [fetchAllTagPage])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>MCQ Tags</Header>}
          Right={<TagGroupsEditModal />}
        />
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
          {get(mcqTags, `allIds`, emptyArray).map(id => (
            <ListItem key={id} id={id} tagId={id} />
          ))}

          <Segment style={{ margin: '0.5em' }}>
            <Create />
          </Segment>
        </Flex>
      </Segment>
    </>
  )
}
const mapStateToProps = ({ mcqTags }) => ({
  mcqTags
})

const mapDispatchToProps = {
  fetchAllTagPage
}

export default connect(mapStateToProps, mapDispatchToProps)(TagList)

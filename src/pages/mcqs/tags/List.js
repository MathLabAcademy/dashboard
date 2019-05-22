import HeaderGrid from 'components/HeaderGrid.js'
import Switcher from 'components/Pagination/Switcher.js'
import usePagination from 'hooks/usePagination.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment } from 'semantic-ui-react'
import { fetchTagPage } from 'store/actions/mcqTags.js'
import { emptyArray } from 'utils/defaults.js'
import Create from './ActionModals/Create.js'
import Edit from './ActionModals/Edit.js'

function _TagListItem({ tagId, tag }) {
  return (
    <Segment>
      <HeaderGrid
        Left={<Header>{get(tag, 'name')}</Header>}
        Right={<Edit tagId={tagId} tag={tag} />}
      />
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
        <HeaderGrid Left={<Header>Tags</Header>} />
      </Segment>

      <Segment basic>
        <Grid columns={5}>
          {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
            <Grid.Column key={id}>
              <ListItem id={id} tagId={id} />
            </Grid.Column>
          ))}

          <Grid.Column>
            <Segment compact>
              <Create />
            </Segment>
          </Grid.Column>
        </Grid>
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

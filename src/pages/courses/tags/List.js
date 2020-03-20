import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import usePagination from 'hooks/usePagination'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment } from 'semantic-ui-react'
import { fetchTagPage } from 'store/actions/courseTags'
import { emptyArray } from 'utils/defaults'
import Create from './ActionModals/Create'
import Edit from './ActionModals/Edit'

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

const ListItem = connect(({ courseTags }, { tagId }) => ({
  tag: get(courseTags.byId, tagId)
}))(_TagListItem)

const queryObject = { length: 40 }

function TagList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject
  })

  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Course Tags</Header>} />
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
  pagination: pagination.courseTags
})

const mapDispatchToProps = {
  fetchPage: fetchTagPage
}

export default connect(mapStateToProps, mapDispatchToProps)(TagList)

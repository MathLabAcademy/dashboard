import HeaderGrid from 'components/HeaderGrid.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import usePagination from 'hooks/usePagination.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { fetchUserPage } from 'store/actions/users.js'
import { emptyArray } from 'utils/defaults.js'
import ListItem from './ListItem.js'

function UserList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage)

  return (
    <Permit admin teacher>
      <Segment>
        <HeaderGrid Left={<Header>Users</Header>} />
      </Segment>

      {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
        <ListItem key={id} id={id} />
      ))}

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </Permit>
  )
}

const mapStateToProps = ({ pagination }) => ({
  pagination: pagination.users
})

const mapDispatchToProps = {
  fetchPage: fetchUserPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)

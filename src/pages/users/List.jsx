import { Box, Heading, Stack } from '@chakra-ui/core'
import Switcher from 'components/Pagination/Switcher'
import Permit from 'components/Permit'
import usePagination from 'hooks/usePagination'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { fetchUserPage } from 'store/actions/users'
import { emptyArray } from 'utils/defaults'
import ListItem from './ListItem'

function UserList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage)

  return (
    <Permit roles="teacher,analyst">
      <Box borderWidth={1} boxShadow="sm" p={4} mb={4}>
        <Heading as="h2" fontSize={3}>
          Users
        </Heading>
      </Box>

      <Stack spacing={4} mb={4}>
        {get(pagination.pages[page], `itemIds`, emptyArray).map((id) => (
          <ListItem key={id} id={id} />
        ))}
      </Stack>

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </Permit>
  )
}

const mapStateToProps = ({ pagination }) => ({
  pagination: pagination.users,
})

const mapDispatchToProps = {
  fetchPage: fetchUserPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)

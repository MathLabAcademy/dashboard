import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import usePagination from 'hooks/usePagination.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { fetchCoursePage } from 'store/actions/courses.js'
import { emptyArray } from 'utils/defaults.js'
import ListItem from './ListItem.js'

function CourseList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage)

  return (
    <Permit admin teacher>
      <Segment>
        <HeaderGrid
          Left={<Header>Courses</Header>}
          Right={
            <Button as={Link} to={`create`} color="blue">
              Create
            </Button>
          }
        />
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
  pagination: pagination.courses
})

const mapDispatchToProps = {
  fetchPage: fetchCoursePage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseList)

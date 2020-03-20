import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import Permit from 'components/Permit'
import usePagination from 'hooks/usePagination'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { fetchBatchCoursePage, getBatchCourse } from 'store/actions/batches'
import { emptyArray } from 'utils/defaults'

function _ListItem({ batchCourseId, batchCourse, getBatchCourse }) {
  useEffect(() => {
    if (!batchCourse) getBatchCourse(batchCourseId)
  }, [batchCourse, batchCourseId, getBatchCourse])

  return (
    <Segment>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>ID: {batchCourseId}</Header.Subheader>
            {get(batchCourse, 'name')}
          </Header>
        }
        Right={
          <>
            <Permit teacher>
              <Button as={Link} to={`${batchCourseId}/edit`}>
                Edit
              </Button>
            </Permit>

            <Button as={Link} to={`${batchCourseId}`} color="blue">
              Open
            </Button>
          </>
        }
      />
    </Segment>
  )
}

const ListItem = connect(
  ({ batches }, { batchCourseId }) => ({
    batchCourse: get(batches.courses.byId, batchCourseId)
  }),
  { getBatchCourse }
)(_ListItem)

function BatchCourseList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage)

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Courses</Header>}
          Right={
            <Permit teacher>
              <Button as={Link} to={`create`} color="blue">
                Create
              </Button>
            </Permit>
          }
        />
      </Segment>

      {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
        <ListItem key={id} batchCourseId={id} />
      ))}

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const mapStateToProps = ({ pagination }) => ({
  pagination: pagination.batchCourses
})

const mapDispatchToProps = {
  fetchPage: fetchBatchCoursePage
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchCourseList)

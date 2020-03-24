import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults'

function _ListItemRow({ userId, user }) {
  return (
    <Table.Row>
      <Table.Cell>
        <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
      </Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(({ users }, { userId }) => {
  const user = get(users.byId, userId, null)
  return {
    user
  }
})(_ListItemRow)

function CourseEnrollmentList({ userIds }) {
  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Online Course Enrollments</Header>}
          Right={
            <Button as={Link} to={`..`}>
              Go Back
            </Button>
          }
        />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {userIds.map(id => (
            <ListItemRow key={id} userId={id} />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ courses }, { courseId }) => ({
  course: get(courses.byId, courseId),
  userIds: get(courses, ['enrollmentsById', courseId], emptyArray)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseEnrollmentList)

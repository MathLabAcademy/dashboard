import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Header, Segment, Table } from 'semantic-ui-react'
import { toggleEnrollmentStatus } from 'store/enrollments'
import { emptyArray } from 'utils/defaults'

function _ListItemRow({
  user,
  enrollment,
  enrollmentId,
  toggleEnrollmentStatus
}) {
  return (
    <Table.Row>
      <Table.Cell>
        <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
      </Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={get(enrollment, 'active')}
          toggle
          onClick={async () => {
            await toggleEnrollmentStatus(enrollmentId)
          }}
        />
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(
  ({ users, enrollments }, { enrollmentId }) => {
    const enrollment = get(enrollments.byId, enrollmentId)
    const user = get(users.byId, get(enrollment, 'userId'), null)

    return {
      enrollment,
      user
    }
  },
  { toggleEnrollmentStatus }
)(_ListItemRow)

function CourseEnrollmentList({ enrollments, enrollmentIds }) {
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
            <Table.HeaderCell>Active</Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {enrollmentIds.map(id => (
            <ListItemRow key={id} enrollmentId={id} />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ courses, enrollments }, { courseId }) => {
  const enrollmentIdPattern = new RegExp(`^${courseId}:.+`)
  const enrollmentIds = enrollments.allIds.filter(id =>
    enrollmentIdPattern.test(id)
  )
  return {
    course: get(courses.byId, courseId),
    userIds: get(courses, ['enrollmentsById', courseId], emptyArray),
    enrollments,
    enrollmentIds
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseEnrollmentList)

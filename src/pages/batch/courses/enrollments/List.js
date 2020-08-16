import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'
import { getAllBatchCourseEnrollmentForYear } from 'store/actions/batches'
import AddEnrollment from './ActionModals/AddEnrollment'
// import EditStudent from './ActionModals/EditStudent'

function _ListItemRow({
  batchCourseEnrollmentId,
  courseEnrollment,
  user,
  linkToBase,
}) {
  return (
    <Table.Row>
      <Table.Cell>{batchCourseEnrollmentId}</Table.Cell>
      <Table.Cell>
        <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
      </Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <Icon
          name={get(courseEnrollment, 'active') ? 'check' : 'close'}
          color={get(courseEnrollment, 'active') ? 'green' : 'red'}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        {/* <Permit roles="teacher,analyst"> */}
        {/* <EditStudent batchStudentId={batchStudentId} /> */}
        {/* </Permit> */}

        <Button
          as={Link}
          to={`${linkToBase}${batchCourseEnrollmentId}`}
          color="blue"
        >
          Open
        </Button>
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(
  ({ batches, users }, { batchCourseEnrollmentId }) => {
    const courseEnrollment = get(
      batches.courseEnrollments.byId,
      batchCourseEnrollmentId
    )

    const user = get(users.byId, get(courseEnrollment, 'userId'), null)

    return {
      courseEnrollment,
      user,
    }
  }
)(_ListItemRow)

function BatchCourseStudentList({
  batchCourseId,
  courseEnrollments,
  getAllBatchCourseEnrollmentForYear,
  linkToBase,
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  const refreshData = useCallback(() => {
    getAllBatchCourseEnrollmentForYear(batchCourseId, year)
  }, [batchCourseId, getAllBatchCourseEnrollmentForYear, year])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const ids = useMemo(() => {
    const regex = new RegExp(`^${batchCourseId}${String(year).slice(-2)}`)
    return courseEnrollments.allIds.filter((id) => regex.test(id)).sort()
  }, [batchCourseId, year, courseEnrollments.allIds])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Course Enrollments</Header>}
          Right={
            <Button as={Link} to={`..`}>
              Go Back
            </Button>
          }
        />
      </Segment>

      <Table>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              <AddEnrollment
                batchCourseId={batchCourseId}
                year={year}
                refreshData={refreshData}
              />
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="1" />
            <Table.HeaderCell colSpan="1" textAlign="right">
              <Input
                ref={yearRef}
                defaultValue={year}
                type="number"
                min="2000"
                max="2099"
                step="1"
                icon="calendar alternate"
                iconPosition="left"
                action={
                  <Button
                    type="button"
                    icon="filter"
                    onClick={handleYearChange}
                  />
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>User ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="center">
              Active
            </Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {ids.map((id) => (
            <ListItemRow
              key={id}
              batchCourseEnrollmentId={id}
              linkToBase={linkToBase}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ batches }) => ({
  courseEnrollments: batches.courseEnrollments,
})

const mapDispatchToProps = {
  getAllBatchCourseEnrollmentForYear,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseStudentList)

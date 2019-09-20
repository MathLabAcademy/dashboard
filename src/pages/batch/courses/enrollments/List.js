import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import usePagination from 'hooks/usePagination'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'
import {
  fetchBatchCourseEnrollmentPage,
  getBatchStudent
} from 'store/actions/batches'
import { emptyArray } from 'utils/defaults'
import AddEnrollment from './ActionModals/AddEnrollment'
// import EditStudent from './ActionModals/EditStudent.js'

function _ListItemRow({
  batchCourseEnrollmentId,
  courseEnrollment,
  studentId,
  student,
  getBatchStudent,
  linkToBase
}) {
  useEffect(() => {
    if (studentId && !student) getBatchStudent(studentId)
  }, [student, studentId, getBatchStudent])

  return (
    <Table.Row>
      <Table.Cell>{batchCourseEnrollmentId}</Table.Cell>
      <Table.Cell>{get(student, 'fullName')}</Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <Icon
          name={get(courseEnrollment, 'active') ? 'check' : 'close'}
          color={get(courseEnrollment, 'active') ? 'green' : 'red'}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        {/* <Permit teacher> */}
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
  ({ batches }, { batchCourseEnrollmentId }) => {
    const courseEnrollment = get(
      batches.courseEnrollments.byId,
      batchCourseEnrollmentId
    )

    const studentId = get(courseEnrollment, 'batchStudentId', null)

    const student = get(batches.students.byId, studentId, null)

    return {
      courseEnrollment,
      studentId,
      student
    }
  },
  { getBatchStudent }
)(_ListItemRow)

function BatchCourseStudentList({
  batchCourseId,
  pagination,
  fetchPage,
  linkToBase
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  const queryObject = useMemo(() => {
    return {
      filter: {
        batchCourseId: { '=': batchCourseId },
        year: { '=': year }
      }
    }
  }, [batchCourseId, year])

  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject
  })

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
              <AddEnrollment batchCourseId={batchCourseId} year={year} />
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
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="center">
              Active
            </Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
            <ListItemRow
              key={id}
              batchCourseEnrollmentId={id}
              linkToBase={linkToBase}
            />
          ))}
        </Table.Body>
      </Table>

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const mapStateToProps = ({ pagination }) => ({
  pagination: pagination.batchCourseEnrollments
})

const mapDispatchToProps = {
  fetchPage: fetchBatchCourseEnrollmentPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseStudentList)

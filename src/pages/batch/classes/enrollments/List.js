import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'
import { getAllBatchClassEnrollmentForYear } from 'store/actions/batches'
import AddEnrollment from './ActionModals/AddEnrollment'
// import EditStudent from './ActionModals/EditStudent.js'

function _ListItemRow({
  batchClassEnrollmentId,
  classEnrollment,
  user,
  linkToBase
}) {
  return (
    <Table.Row>
      <Table.Cell>{batchClassEnrollmentId}</Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <Icon
          name={get(classEnrollment, 'active') ? 'check' : 'close'}
          color={get(classEnrollment, 'active') ? 'green' : 'red'}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        {/* <Permit teacher> */}
        {/* <EditStudent batchStudentId={batchStudentId} /> */}
        {/* </Permit> */}

        <Button
          as={Link}
          to={`${linkToBase}${batchClassEnrollmentId}`}
          color="blue"
        >
          Open
        </Button>
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(
  ({ batches, users }, { batchClassEnrollmentId }) => {
    const classEnrollment = get(
      batches.classEnrollments.byId,
      batchClassEnrollmentId
    )

    const user = get(users.byId, get(classEnrollment, 'userId'), null)

    return {
      classEnrollment,
      user
    }
  }
)(_ListItemRow)

function BatchClassStudentList({
  batchClassId,
  classEnrollments,
  getAllBatchClassEnrollmentForYear,
  linkToBase
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  useEffect(() => {
    getAllBatchClassEnrollmentForYear(batchClassId, year)
  }, [batchClassId, year, getAllBatchClassEnrollmentForYear])

  const ids = useMemo(() => {
    const regex = new RegExp(
      `^${String(year).slice(-2)}${String(batchClassId).padStart(2, '0')}`
    )
    return classEnrollments.allIds.filter(id => regex.test(id)).sort()
  }, [batchClassId, year, classEnrollments.allIds])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Class Enrollments</Header>}
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
              <AddEnrollment batchClassId={batchClassId} year={year} />
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
          {ids.map(id => (
            <ListItemRow
              key={id}
              batchClassEnrollmentId={id}
              linkToBase={linkToBase}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ batches }) => ({
  classEnrollments: batches.classEnrollments
})

const mapDispatchToProps = {
  getAllBatchClassEnrollmentForYear
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassStudentList)

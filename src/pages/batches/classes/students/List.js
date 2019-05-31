import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import usePagination from 'hooks/usePagination.js'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'
import {
  fetchBatchStudentPage,
  getBatchStudent
} from 'store/actions/batches.js'
import { emptyArray } from 'utils/defaults.js'
import AddStudent from './ActionModals/AddStudent.js'
import EditStudent from './ActionModals/EditStudent.js'

function _ListItemRow({
  batchStudentId,
  batchStudent,
  getBatchStudent,
  linkToBase
}) {
  useEffect(() => {
    if (!batchStudent) getBatchStudent(batchStudentId)
  }, [batchStudent, batchStudentId, getBatchStudent])

  return (
    <Table.Row>
      <Table.Cell>{String(batchStudentId).padStart(7, '0')}</Table.Cell>
      <Table.Cell>{get(batchStudent, 'fullName')}</Table.Cell>
      <Table.Cell>{get(batchStudent, 'phone')}</Table.Cell>
      <Table.Cell>{get(batchStudent, 'guardianPhone')}</Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <Icon
          name={get(batchStudent, 'active') ? 'check' : 'close'}
          color={get(batchStudent, 'active') ? 'green' : 'red'}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <Permit teacher>
          <EditStudent batchStudentId={batchStudentId} />
        </Permit>

        <Button as={Link} to={`${linkToBase}${batchStudentId}`} color="blue">
          Open
        </Button>
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(
  ({ batches }, { batchStudentId }) => ({
    batchStudent: get(batches.students.byId, batchStudentId)
  }),
  { getBatchStudent }
)(_ListItemRow)

function BatchClassStudentList({
  batchClassId,
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
        year: { '=': year }
      }
    }
  }, [year])

  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject
  })

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Students</Header>}
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
              <AddStudent batchClassId={batchClassId} year={year} />
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="2" />
            <Table.HeaderCell colSpan="2" textAlign="right">
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
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Guardian's Phone</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="center">
              Active
            </Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
            <ListItemRow key={id} batchStudentId={id} linkToBase={linkToBase} />
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
  pagination: pagination.batchStudents
})

const mapDispatchToProps = {
  fetchPage: fetchBatchStudentPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassStudentList)

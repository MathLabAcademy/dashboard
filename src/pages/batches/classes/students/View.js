import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Icon, Segment, Table } from 'semantic-ui-react'
import { getBatchStudent } from 'store/actions/batches.js'
import Payments from './views/Payments.js'

function BatchClassStudent({
  batchClassId,
  batchStudentId,
  batchStudent,
  getBatchStudent
}) {
  useEffect(() => {
    if (!batchStudent) getBatchStudent(batchStudentId)
  }, [batchStudent, batchStudentId, getBatchStudent])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Student #{get(batchStudent, 'id')}</Header>}
          Right={
            <Button as={Link} to={`..`}>
              Go Back
            </Button>
          }
        />
      </Segment>
      <Segment>
        <Table basic="very" compact className="horizontal-info">
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell collapsing content={`ID`} />
              <Table.Cell content={get(batchStudent, 'id')} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Name`} />
              <Table.Cell content={get(batchStudent, 'fullName')} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Mobile Number`} />
              <Table.Cell content={get(batchStudent, 'phone') || 'N/A'} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell
                collapsing
                content={`Guardian's Mobile Number`}
              />
              <Table.Cell
                content={get(batchStudent, 'guardianPhone') || 'N/A'}
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Active`} />
              <Table.Cell
                content={
                  get(batchStudent, 'active') ? (
                    <Icon name="check" color="green" />
                  ) : (
                    <Icon name="x" color="red" />
                  )
                }
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Waiver`} />
              <Table.Cell content={`${get(batchStudent, 'waiver', 0)}%`} />
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>

      <Payments batchClassId={batchClassId} batchStudentId={batchStudentId} />
    </>
  )
}

const mapStateToProps = ({ batches }, { batchStudentId }) => ({
  batchStudent: get(batches.students.byId, batchStudentId)
})

const mapDispatchToProps = {
  getBatchStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassStudent)

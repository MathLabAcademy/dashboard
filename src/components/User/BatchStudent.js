import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { memo, useState } from 'react'
import { Button, Header, Icon, Segment, Table } from 'semantic-ui-react'
import BatchStudentEditor from './BatchStudentEditor'

function BatchStudent({ batchClassEnrollment, user }) {
  const [editing, setEditing] = useState(false)

  return (
    <Segment>
      <HeaderGrid
        Left={<Header>Student ID: {get(batchClassEnrollment, 'id')}</Header>}
        Right={
          <Button onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        }
      />

      {editing ? (
        <BatchStudentEditor
          batchClassEnrollment={batchClassEnrollment}
          user={user}
        />
      ) : (
        <Table basic="very" compact className="horizontal-info">
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Student ID`} />
              <Table.Cell content={get(batchClassEnrollment, 'id')} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`User ID`} />
              <Table.Cell>
                <Link to={`/users/onsite/${get(user, 'id')}`}>
                  {get(user, 'id')}
                </Link>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Active`} />
              <Table.Cell
                content={
                  get(batchClassEnrollment, 'active') ? (
                    <Icon name="check" color="green" />
                  ) : (
                    <Icon name="x" color="red" />
                  )
                }
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Waiver`} />
              <Table.Cell
                content={`${get(batchClassEnrollment, 'waiver', 0)}%`}
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Full Name`} />
              <Table.Cell content={get(user, 'Person.fullName')} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Short Name`} />
              <Table.Cell content={get(user, 'Person.shortName')} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Mobile Phone`} />
              <Table.Cell content={get(user, 'Person.phone') || 'N/A'} />
            </Table.Row>
            {/* <Table.Row>
      <Table.HeaderCell collapsing content={`Guardian's Full Name`} />
      <Table.Cell
        content={get(user, 'Person.Guardian.fullName') || 'N/A'}
      />
    </Table.Row>
    <Table.Row>
      <Table.HeaderCell collapsing content={`Guardian's Short Name`} />
      <Table.Cell
        content={get(user, 'Person.Guardian.fullName') || 'N/A'}
      />
    </Table.Row>
    <Table.Row>
      <Table.HeaderCell collapsing content={`Guardian's Mobile Number`} />
      <Table.Cell content={get(user, 'Person.Guardian.phone') || 'N/A'} />
    </Table.Row> */}
          </Table.Body>
        </Table>
      )}
    </Segment>
  )
}

export default memo(BatchStudent)

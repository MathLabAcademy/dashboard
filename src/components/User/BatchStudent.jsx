import { Link } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import { Info } from 'luxon'
import React, { memo, useState } from 'react'
import { Button, Header, Icon, Segment, Table } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults'
import BatchStudentEditor from './BatchStudentEditor'

const months = Info.months('short')

function BatchStudent({ batchType, batchEnrollment, user }) {
  const [editing, setEditing] = useState(false)

  return (
    <Segment>
      <HeaderGrid
        Left={<Header>Enrollment ID: {get(batchEnrollment, 'id')}</Header>}
        Right={
          <Button onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        }
      />

      {editing ? (
        <BatchStudentEditor
          batchType={batchType}
          batchEnrollment={batchEnrollment}
          user={user}
        />
      ) : (
        <Table basic="very" compact className="horizontal-info">
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell
                collapsing
                content={`Active${batchType === 'class' ? ' Months' : ''}`}
              />
              <Table.Cell
                content={
                  batchType === 'class' ? (
                    get(batchEnrollment, 'activeMonths', emptyArray)
                      .sort((a, b) => a - b)
                      .map((month) => months[month - 1])
                      .join(', ') || 'N/A'
                  ) : get(batchEnrollment, 'active') ? (
                    <Icon name="check" color="green" />
                  ) : (
                    <Icon name="x" color="red" />
                  )
                }
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Waiver`} />
              <Table.Cell content={`${get(batchEnrollment, 'waiver', 0)}%`} />
            </Table.Row>

            <Table.Row>
              <Table.HeaderCell collapsing content={`User ID`} />
              <Table.Cell>
                <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
              </Table.Cell>
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
          </Table.Body>
        </Table>
      )}
    </Segment>
  )
}

export default memo(BatchStudent)

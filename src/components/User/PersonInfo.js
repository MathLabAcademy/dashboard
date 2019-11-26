import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { memo, useState } from 'react'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import Editor from './PersonInfoEditor'

function PersonInfo({ userId, person, title, isGuardian }) {
  const [editing, setEditing] = useState(false)

  return editing ? (
    <Permit teacher userId={userId}>
      <Editor
        userId={userId}
        person={person}
        title={title}
        isGuardian={isGuardian}
        setOpen={setEditing}
      />
    </Permit>
  ) : (
    <Segment>
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <Permit teacher userId={userId}>
            <Button onClick={() => setEditing(true)}>Edit</Button>
          </Permit>
        }
      />

      <Table basic="very" compact className="horizontal-info">
        <Table.Body>
          {!isGuardian && (
            <Table.Row>
              <Table.HeaderCell collapsing content={`User ID`} />
              <Table.Cell content={userId} />
            </Table.Row>
          )}

          <Table.Row>
            <Table.HeaderCell collapsing content={`Full Name`} />
            <Table.Cell content={get(person, 'fullName')} />
          </Table.Row>

          <Table.Row>
            <Table.HeaderCell collapsing content={`Short Name`} />
            <Table.Cell content={get(person, 'shortName')} />
          </Table.Row>

          {!isGuardian && (
            <Table.Row>
              <Table.HeaderCell collapsing content={`Date of Birth`} />
              <Table.Cell
                content={
                  get(person, 'dob')
                    ? DateTime.fromISO(get(person, 'dob')).toLocaleString(
                        DateTime.DATE_FULL
                      )
                    : ''
                }
              />
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Segment>
  )
}

export default memo(PersonInfo)

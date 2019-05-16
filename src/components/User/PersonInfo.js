import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { memo, useState } from 'react'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name.js'
import './PersonInfo.css'
import Editor from './PersonInfoEditor.js'

function PersonInfo({ userId, person, title, isGuardian }) {
  const [editing, setEditing] = useState(false)

  return editing ? (
    <Permit admin userId={userId}>
      <Editor
        userId={userId}
        person={person}
        title={title}
        isGuardian={isGuardian}
        setOpen={setEditing}
      />
    </Permit>
  ) : (
    <Segment className="mathlab person-info">
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <Permit admin userId={userId}>
            <Button onClick={() => setEditing(true)}>Edit</Button>
          </Permit>
        }
      />
      <Table basic="very" compact>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell collapsing content={`Name`} />
            <Table.Cell content={getPersonName(person)} />
          </Table.Row>
          {get(person, 'dob') && (
            <Table.Row>
              <Table.HeaderCell collapsing content={`Date of Birth`} />
              <Table.Cell
                content={DateTime.fromISO(get(person, 'dob')).toLocaleString(
                  DateTime.DATE_FULL
                )}
              />
            </Table.Row>
          )}
          <Table.Row>
            <Table.HeaderCell collapsing content={`Email`} />
            <Table.Cell content={get(person, 'email')} />
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell collapsing content={`Mobile Phone`} />
            <Table.Cell content={get(person, 'phone')} />
          </Table.Row>
        </Table.Body>
      </Table>
    </Segment>
  )
}

export default memo(PersonInfo)

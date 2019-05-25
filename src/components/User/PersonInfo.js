import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { memo, useCallback, useState } from 'react'
import {
  Button,
  Header,
  Icon,
  Label,
  Popup,
  Segment,
  Table
} from 'semantic-ui-react'
import api from 'utils/api.js'
import getPersonName from 'utils/get-person-name.js'
import Editor from './PersonInfoEditor.js'

function ResendEmailVerificationButton({ personId, ...props }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const requestResend = useCallback(async () => {
    setLoading(true)

    const { error } = await api(
      `/users/action/resend-email-verification-token`,
      {
        method: 'POST',
        body: {
          personId
        }
      }
    )

    setLoading(false)

    if (error) {
      console.error(error)
    } else {
      setSent(true)
    }
  }, [personId])

  return (
    <Button
      {...props}
      type="button"
      disabled={sent}
      loading={loading}
      onClick={requestResend}
    >
      Resend Verification Email
    </Button>
  )
}

function Email({ person }) {
  const email = get(person, 'email')
  const xEmail = get(person, 'xEmail')

  if (email && !xEmail) {
    return (
      <Table.Row>
        <Table.HeaderCell collapsing content={`Email`} />
        <Table.Cell content={email} />
      </Table.Row>
    )
  }

  if (email && xEmail) {
    return (
      <>
        <Table.Row>
          <Table.HeaderCell collapsing content={`Email (old)`} />
          <Table.Cell content={email} />
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell collapsing content={`Email (new)`} />
          <Table.Cell>
            <Button as="div" labelPosition="left" size="tiny">
              <Label basic pointing="right">
                <Popup
                  trigger={<Icon name="warning sign" color="yellow" />}
                  content={`needs verification`}
                  position="top center"
                />{' '}
                {xEmail}
              </Label>
              <ResendEmailVerificationButton
                personId={get(person, 'id')}
                size="tiny"
              />
            </Button>
          </Table.Cell>
        </Table.Row>
      </>
    )
  }

  if (!email && xEmail) {
    return (
      <Table.Row>
        <Table.HeaderCell collapsing content={`Email`} />
        <Table.Cell>
          <Button as="p" labelPosition="left" size="tiny">
            <Label basic pointing="right">
              <Popup
                trigger={<Icon name="warning sign" color="yellow" />}
                content={`needs verification`}
                position="top center"
              />{' '}
              {xEmail}
            </Label>
            <ResendEmailVerificationButton
              personId={get(person, 'id')}
              size="tiny"
            />
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  }

  return null
}

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
    <Segment>
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <Permit admin userId={userId}>
            <Button onClick={() => setEditing(true)}>Edit</Button>
          </Permit>
        }
      />
      <Table basic="very" compact className="horizontal-info">
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

          <Email person={person} />

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

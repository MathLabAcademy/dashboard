import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
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
import api from 'utils/api'
import Editor from './ContactInfoEditor'

function ResendEmailVerificationButton({ userId, personId, ...props }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const requestResend = useCallback(async () => {
    setLoading(true)

    const { error } = await api(
      `/users/action/resend-email-verification-token`,
      {
        method: 'POST',
        body: {
          userId,
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
  }, [userId, personId])

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

const fieldTitle = {
  email: 'Email',
  phone: 'Mobile Phone'
}

const verifiedFieldTitle = {
  email: 'Email (verified)',
  phone: 'Mobile Phone (verified)'
}

const pendingVerificationFieldTitle = {
  email: 'Email (pending verification)',
  phone: 'Mobile Phone (pending verification)'
}

function ContactInfoView({ person, userId, field, fieldTrx }) {
  const value = get(person, field) // verified
  const valueTrx = get(person, fieldTrx) // pending verification

  if (value && !valueTrx) {
    return (
      <>
        <Table.Row>
          <Table.HeaderCell collapsing content={fieldTitle[field]} />
          <Table.Cell content={value} />
        </Table.Row>
      </>
    )
  }

  if (value && valueTrx) {
    return (
      <>
        <Table.Row>
          <Table.HeaderCell collapsing content={verifiedFieldTitle[field]} />
          <Table.Cell content={value} />
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell
            collapsing
            content={pendingVerificationFieldTitle[field]}
          />
          <Table.Cell>
            {field === 'email' ? (
              <Button as="div" labelPosition="left" size="tiny">
                <Label basic pointing="right">
                  <Popup
                    trigger={<Icon name="warning sign" color="yellow" />}
                    content={`needs verification`}
                    position="top center"
                  />
                  {valueTrx}
                </Label>
                <ResendEmailVerificationButton
                  userId={userId}
                  personId={get(person, 'id')}
                  size="tiny"
                />
              </Button>
            ) : (
              valueTrx
            )}
          </Table.Cell>
        </Table.Row>
      </>
    )
  }

  if (!value && valueTrx) {
    return (
      <>
        <Table.Row>
          <Table.HeaderCell
            collapsing
            content={pendingVerificationFieldTitle[field]}
          />
          <Table.Cell>
            {field === 'email' ? (
              <Button as="p" labelPosition="left" size="tiny">
                <Label basic pointing="right">
                  <Popup
                    trigger={<Icon name="warning sign" color="yellow" />}
                    content={`needs verification`}
                    position="top center"
                  />
                  {valueTrx}
                </Label>
                <ResendEmailVerificationButton
                  userId={userId}
                  personId={get(person, 'id')}
                  size="tiny"
                />
              </Button>
            ) : (
              valueTrx
            )}
          </Table.Cell>
        </Table.Row>
      </>
    )
  }

  return null
}

function PersonInfo({ userId, person, title, isGuardian, isStudent }) {
  const [editing, setEditing] = useState(null)

  return editing ? (
    <Permit teacher userId={userId}>
      <Editor
        userId={userId}
        person={person}
        isGuardian={isGuardian}
        field={editing}
        fieldTrx={`${editing}Trx`}
        onClose={() => setEditing(null)}
      />
    </Permit>
  ) : (
    <Segment>
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <>
            <Permit teacher userId={userId}>
              <Button
                basic
                icon="edit outline"
                content={fieldTitle['email']}
                size="tiny"
                onClick={() => setEditing('email')}
              />
              <Button
                basic
                icon="edit outline"
                content={fieldTitle['phone']}
                size="tiny"
                onClick={() => setEditing('phone')}
              />
            </Permit>
          </>
        }
      />

      <Table basic="very" compact className="horizontal-info">
        <Table.Body>
          <ContactInfoView
            person={person}
            userId={userId}
            field="email"
            fieldTrx="emailTrx"
          />

          <ContactInfoView
            person={person}
            userId={userId}
            field="phone"
            fieldTrx="phoneTrx"
          />
        </Table.Body>
      </Table>
    </Segment>
  )
}

export default memo(PersonInfo)

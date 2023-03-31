import { Box } from '@chakra-ui/core'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import React, { memo, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Flex } from 'reflexbox'
import {
  Button,
  FormField,
  FormGroup,
  Header,
  Icon,
  Label,
  List,
  Message,
  Modal,
  Popup,
  Table,
} from 'semantic-ui-react'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'
import * as Yup from 'yup'
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
          personId,
        },
      }
    )

    setLoading(false)

    if (error) {
      console.error(error)
    } else {
      trackEventAnalytics({
        category: 'User',
        action: `Requested Email Verification`,
      })

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

function VerifyPhoneModal({ hide, personId, phoneTrx, refreshUser }) {
  const [open, handler] = useToggle(false)

  const [state, setState] = useState({
    loading: false,
    phone: phoneTrx,
    token: null,
  })

  const onSubmit = useCallback(
    async ({ code }, actions) => {
      actions.setStatus(null)

      try {
        const { error } = await api('/user/person/phone/verify', {
          method: 'POST',
          body: {
            personId,
            code,
            token: state.token,
          },
        })

        if (error) {
          throw error
        }

        trackEventAnalytics({
          category: 'User',
          action: `Changed Phone`,
        })

        refreshUser()
        handler.close()
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        }

        if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [personId, state.token, handler, refreshUser]
  )

  if (hide) {
    return null
  }

  return (
    <Modal
      open={open}
      closeOnDimmerClick={false}
      onClose={handler.close}
      trigger={
        <Button onClick={handler.open} color="yellow" compact>
          Verify
        </Button>
      }
    >
      <Modal.Header>Verify Phone: {phoneTrx}</Modal.Header>
      <Modal.Content>
        <Formik
          initialValues={{ code: '' }}
          validationSchema={Yup.object().shape({
            code: Yup.string()
              .matches(/^\d{4}$/, 'must be 4 digit code')
              .required(`required`),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, isValid, status, setStatus }) => (
            <Form size="large">
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput
                name="code"
                label={`Verification Code`}
                icon="lock"
                disabled={!state.token || !state.phone}
              />

              <FormGroup widths="equal">
                <FormField>
                  <Button
                    fluid
                    type="button"
                    loading={state.loading}
                    disabled={Boolean(state.token && state.phone)}
                    onClick={async () => {
                      setStatus(null)

                      setState((state) => ({
                        ...state,
                        loading: true,
                      }))

                      try {
                        const { data, error } = await api(
                          '/user/person/phone/verify/init',
                          {
                            method: 'POST',
                            body: { personId },
                          }
                        )

                        if (error) {
                          setState((state) => ({
                            ...state,
                            loading: false,
                          }))

                          throw error
                        }

                        trackEventAnalytics({
                          category: 'User',
                          action: `Requested Verification OTP`,
                        })

                        setState((state) => ({
                          ...state,
                          loading: false,
                          phone: data.phone,
                          token: data.token,
                        }))
                      } catch (err) {
                        if (err.message) {
                          setStatus(err.message)
                        }
                      }
                    }}
                    positive
                    icon="envelope outline"
                    content="Request Verification Code SMS"
                  />
                </FormField>

                <FormField>
                  <Button
                    fluid
                    positive
                    type="submit"
                    loading={isSubmitting}
                    disabled={
                      !state.phone || !state.token || !isValid || isSubmitting
                    }
                  >
                    Verify Phone
                  </Button>
                </FormField>
              </FormGroup>
            </Form>
          )}
        </Formik>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handler.close} negative>
          Later
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

function AcceptPhoneModal({ personId, phone, phoneTrx, refreshUser }) {
  const [open, handler] = useToggle(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await api(
        `/persons/${personId}/actions/accept-new-phone`,
        {
          method: 'POST',
        }
      )

      if (error) {
        throw error
      }

      refreshUser()
      handler.close()
    } catch (err) {
      if (err.message) {
        setError(err.message)
      } else {
        console.error(err)
      }
    }

    setLoading(true)
  }, [personId, handler, refreshUser])

  return (
    <Permit roles="teacher">
      <Modal
        open={open}
        closeOnDimmerClick={false}
        onClose={handler.close}
        trigger={
          <Button onClick={handler.open} negative size="tiny" compact>
            Mark as Verified
          </Button>
        }
      >
        <Modal.Header>
          Mark Unverified Phone as Verified: {phoneTrx}
        </Modal.Header>
        <Modal.Content>
          <Message color="yellow" hidden={!error}>
            {error}
          </Message>

          <Message color="red">
            <List bulleted>
              <List.Item>
                The old phone number will be removed: {phone}
              </List.Item>
              <List.Item>
                The new phone number will be accepted: {phoneTrx}
              </List.Item>
              <List.Item>
                This is generally not recommended. User should go verify their
                own phone number.
              </List.Item>
              <List.Item>
                If you send SMS to someone without their consent, they can mark
                you as SPAM.
              </List.Item>
            </List>
          </Message>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={onSubmit}
            negative
            disabled={loading}
            loading={loading}
          >
            Accept
          </Button>
          <Button onClick={handler.close} positive>
            Later
          </Button>
        </Modal.Actions>
      </Modal>
    </Permit>
  )
}

const fieldTitle = {
  email: 'Email',
  phone: 'Mobile Phone',
}

const verifiedFieldTitle = {
  email: 'Email (verified)',
  phone: 'Mobile Phone (verified)',
}

const pendingVerificationFieldTitle = {
  email: 'Email (pending verification)',
  phone: 'Mobile Phone (pending verification)',
}

function _ContactInfoView({
  person,
  userId,
  field,
  fieldTrx,
  currentUserId,
  refreshUser,
}) {
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
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                {valueTrx}
                <VerifyPhoneModal
                  hide={currentUserId !== userId}
                  personId={get(person, 'id')}
                  phoneTrx={valueTrx}
                  refreshUser={refreshUser}
                />
                <AcceptPhoneModal
                  personId={get(person, 'id')}
                  phone={value}
                  phoneTrx={valueTrx}
                  refreshUser={refreshUser}
                />
              </Flex>
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
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                {valueTrx}
                <VerifyPhoneModal
                  hide={currentUserId !== userId}
                  personId={get(person, 'id')}
                  phoneTrx={valueTrx}
                  refreshUser={refreshUser}
                />
                <AcceptPhoneModal
                  personId={get(person, 'id')}
                  phone={value}
                  phoneTrx={valueTrx}
                  refreshUser={refreshUser}
                />
              </Flex>
            )}
          </Table.Cell>
        </Table.Row>
      </>
    )
  }

  return null
}

const ContactInfoView = connect(({ user }) => ({
  currentUserId: get(user.data, 'id'),
}))(_ContactInfoView)

function ContactInfo({ userId, person, title, isGuardian, refreshUser }) {
  const [editing, setEditing] = useState(null)

  return editing ? (
    <Permit roles="teacher" userId={userId}>
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
    <Box borderWidth={1} shadow="md" p={4} h="100%">
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <>
            <Permit roles="teacher" userId={userId}>
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
            refreshUser={refreshUser}
          />

          <ContactInfoView
            person={person}
            userId={userId}
            field="phone"
            fieldTrx="phoneTrx"
            refreshUser={refreshUser}
          />
        </Table.Body>
      </Table>
    </Box>
  )
}

export default memo(ContactInfo)

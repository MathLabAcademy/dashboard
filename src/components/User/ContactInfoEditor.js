import { Box } from '@chakra-ui/core'
import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'
import Form from 'components/Form/Form'
import Input from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Table } from 'semantic-ui-react'
import { updateEmail, updatePhone } from 'store/actions/users'
import * as Yup from 'yup'

const fieldSchema = {
  email: Yup.string().email(),
  phone: Yup.string().test(
    'is-mobile-phone',
    'invalid mobile phone number',
    (phone) => (phone ? isMobilePhone(phone) : true)
  ),
}

const getValidationSchema = (field) => {
  return Yup.object({
    [field]: fieldSchema[field],
  })
}

const getInitialValues = (person, field, fieldTrx) => ({
  [field]: get(person, fieldTrx) || get(person, field) || '',
})

const inputType = {
  email: 'email',
  phone: 'text',
}

const verifiedFieldTitle = {
  email: 'Verified Email',
  phone: 'Verified Mobile Phone',
}

const newFieldTitle = {
  email: 'New Email',
  phone: 'New Mobile Phone',
}

const editorTitle = {
  email: 'Edit Email',
  phone: 'Edit Mobile Phone',
}

function ContactInfoEditor({
  userId,
  person,
  field,
  fieldTrx,
  updateEmail,
  updatePhone,
  isCurrent,
  isGuardian,
  onClose,
}) {
  const updateContactInfo = useMemo(() => {
    const updater = {
      email: updateEmail,
      phone: updatePhone,
    }
    return updater[field]
  }, [field, updateEmail, updatePhone])

  const validationSchema = useMemo(() => getValidationSchema(field, fieldTrx), [
    field,
    fieldTrx,
  ])

  const initialValues = useMemo(
    () => getInitialValues(person, field, fieldTrx),
    [person, field, fieldTrx]
  )

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateContactInfo(userId, values, { isCurrent, isGuardian })
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [userId, isCurrent, isGuardian, updateContactInfo]
  )

  return (
    <Permit roles="teacher" userId={userId}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Box borderWidth={1} shadow="md" p={4} h="100%">
              <HeaderGrid
                Left={<Header content={editorTitle[field]} />}
                Right={
                  <>
                    <Button type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      type="submit"
                      positive
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </>
                }
              />

              <Table basic="very" compact className="horizontal-info">
                <Table.Body>
                  {status && (
                    <Table.Row>
                      <Table.HeaderCell collapsing />
                      <Table.Cell>
                        <Message color="yellow" hidden={!status}>
                          {status}
                        </Message>
                      </Table.Cell>
                    </Table.Row>
                  )}

                  <Table.Row>
                    <Table.HeaderCell
                      collapsing
                      content={verifiedFieldTitle[field]}
                    />
                    <Table.Cell>
                      <Input
                        type={inputType[field]}
                        name={field}
                        label={verifiedFieldTitle[field]}
                        hideLabel
                        disabled
                        static
                        value={get(person, field)}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.HeaderCell
                      collapsing
                      content={newFieldTitle[field]}
                    />
                    <Table.Cell>
                      <Input
                        type={inputType[field]}
                        name={field}
                        label={newFieldTitle[field]}
                        hideLabel
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Box>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ user }, { userId }) => ({
  isCurrent: get(user, 'id') === userId,
})

const mapDispatchToProps = {
  updateEmail,
  updatePhone,
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfoEditor)

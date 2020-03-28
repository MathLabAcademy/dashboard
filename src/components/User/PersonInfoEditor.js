import Form from 'components/Form/Form'
import Input from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment, Table } from 'semantic-ui-react'
import { updatePerson } from 'store/actions/users'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    fullName: Yup.string().required(`required`),
    shortName: Yup.string().required(`required`),
    dob: Yup.date().notRequired(),
  })
}

const getInitialValues = (person) => ({
  fullName: get(person, 'fullName') || '',
  shortName: get(person, 'shortName') || '',
  dob: get(person, 'dob')
    ? DateTime.fromISO(get(person, 'dob')).toISODate()
    : '',
})

function PersonInfoEditor({
  userId,
  person,
  title,
  isCurrent,
  isGuardian,
  setOpen,
  updatePerson,
}) {
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(person), [person])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updatePerson(userId, values, { isCurrent, isGuardian })
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
    [userId, isCurrent, isGuardian, updatePerson]
  )

  return (
    <Permit teacher userId={userId}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header content={title} />}
                Right={
                  <>
                    <Button type="button" onClick={() => setOpen(false)}>
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
                    <Table.HeaderCell collapsing content={`Full Name`} />
                    <Table.Cell>
                      <Input name="fullName" label={`Full Name`} hideLabel />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.HeaderCell collapsing content={`Short Name`} />
                    <Table.Cell>
                      <Input name="shortName" label={`Short Name`} hideLabel />
                    </Table.Cell>
                  </Table.Row>

                  {!isGuardian && (
                    <Table.Row>
                      <Table.HeaderCell collapsing content={`Date of Birth`} />
                      <Table.Cell>
                        <Input
                          type="date"
                          name="dob"
                          label={`Date of Birth`}
                          hideLabel
                          min="1900-01-01"
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Segment>
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
  updatePerson,
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonInfoEditor)

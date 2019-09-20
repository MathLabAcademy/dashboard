import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment, Table } from 'semantic-ui-react'
import { updatePerson } from 'store/actions/users'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    fullName: Yup.string().required(`required`),
    shortName: Yup.string().required(`required`)
    // email: Yup.string().email(),
    // phone: Yup.string().test(
    //   'is-mobile-phone',
    //   'invalid mobile phone number',
    //   phone => (phone ? isMobilePhone(phone) : true)
    // )
  })
}

const getInitialValues = () => {
  const values = {
    fullName: '',
    shortName: ''
    // email: get(person, 'xEmail') || get(person, 'email') || '',
    // phone: get(person, 'phone') || ''
  }

  return values
}

function AddGuardian({ userId, person, title, updatePerson }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updatePerson(get(person, 'id'), values)
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
    [person, updatePerson]
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
                    <Button type="button" onClick={null}>
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

                  <Table.Row>
                    <Table.HeaderCell collapsing content={`Verified Email`} />
                    <Table.Cell>
                      <Input
                        type="email"
                        name="email"
                        label={`Verified Email`}
                        hideLabel
                        disabled
                        static
                        value={get(person, 'email')}
                      />
                    </Table.Cell>
                  </Table.Row>

                  {/* <Table.Row>
                    <Table.HeaderCell collapsing content={`New Email`} />
                    <Table.Cell>
                      <Input
                        type="email"
                        name="email"
                        label={`New Email`}
                        hideLabel
                      />
                    </Table.Cell>
                  </Table.Row> */}

                  <Table.Row>
                    <Table.HeaderCell collapsing content={`Mobile Phone`} />
                    <Table.Cell>
                      <Input name="phone" label={`Mobile Phone`} hideLabel />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updatePerson
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGuardian)

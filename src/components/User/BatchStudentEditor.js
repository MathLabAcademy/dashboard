import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'
import FormCheckbox from 'components/Form/Checkbox'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Table } from 'semantic-ui-react'
import { updateBatchClassEnrollment } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    active: Yup.boolean().required(`required`),
    waiver: Yup.number()
      .integer()
      .min(0)
      .max(100)
      .required(`required`),
    Person: Yup.object({
      fullName: Yup.string().required(`required`),
      shortName: Yup.string().required(`required`),
      dob: Yup.date()
        .notRequired()
        .nullable(),
      phone: Yup.string().test(
        'is-mobile-phone',
        'invalid mobile phone number',
        phone => (phone ? isMobilePhone(phone) : true)
      )
    }).required(`required`)
  })
}

const getInitialValues = (batchClassEnrollment, user) => ({
  active: get(batchClassEnrollment, 'active') || false,
  waiver: get(batchClassEnrollment, 'waiver') || 0,
  Person: {
    fullName: get(user, 'Person.fullName') || '',
    shortName: get(user, 'Person.shortName') || '',
    dob: get(user, 'Person.dob')
      ? DateTime.fromISO(get(user, 'Person.dob')).toISODate()
      : null,
    phone: get(user, 'Person.phone') || ''
  }
})

function BatchStudentEditor({
  batchClassEnrollment,
  user,
  updateBatchClassEnrollment
}) {
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(
    () => getInitialValues(batchClassEnrollment, user),
    [batchClassEnrollment, user]
  )

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateBatchClassEnrollment(
          get(batchClassEnrollment, 'id'),
          values
        )
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
    [batchClassEnrollment, updateBatchClassEnrollment]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
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
                  <Table.HeaderCell collapsing content={`Active`} />
                  <Table.Cell>
                    <FormCheckbox name="active" label={`Active`} hideLabel />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell collapsing content={`% Waiver`} />
                  <Table.Cell>
                    <FormInput name="waiver" label={`% Waiver`} hideLabel />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell collapsing content={`Full Name`} />
                  <Table.Cell>
                    <FormInput
                      name="Person.fullName"
                      label={`Full Name`}
                      hideLabel
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell collapsing content={`Short Name`} />
                  <Table.Cell>
                    <FormInput
                      name="Person.shortName"
                      label={`Short Name`}
                      hideLabel
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell collapsing content={`Date of Birth`} />
                  <Table.Cell>
                    <FormInput
                      type="date"
                      name="Person.dob"
                      label={`Date of Birth`}
                      hideLabel
                      min="1900-01-01"
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell collapsing content={`Mobile Phone`} />
                  <Table.Cell>
                    <FormInput
                      name="Person.phone"
                      label={`Mobile Phone`}
                      hideLabel
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <HeaderGrid
              Right={
                <>
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
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updateBatchClassEnrollment
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchStudentEditor)

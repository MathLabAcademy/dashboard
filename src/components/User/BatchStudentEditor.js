import FormCheckbox from 'components/Form/Checkbox'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Table } from 'semantic-ui-react'
import {
  updateBatchClassEnrollment,
  updateBatchCourseEnrollment
} from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    active: Yup.boolean().required(`required`),
    waiver: Yup.number()
      .integer()
      .min(0)
      .max(100)
      .required(`required`)
  })
}

const getInitialValues = batchEnrollment => ({
  active: get(batchEnrollment, 'active') || false,
  waiver: get(batchEnrollment, 'waiver') || 0
})

function BatchStudentEditor({
  batchType,
  batchEnrollment,
  updateBatchClassEnrollment,
  updateBatchCourseEnrollment
}) {
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(batchEnrollment), [
    batchEnrollment
  ])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        if (batchType === 'class') {
          await updateBatchClassEnrollment(get(batchEnrollment, 'id'), values)
        } else if (batchType === 'course') {
          await updateBatchCourseEnrollment(get(batchEnrollment, 'id'), values)
        } else {
          throw new Error('unknown batchType')
        }
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
    [
      batchType,
      batchEnrollment,
      updateBatchClassEnrollment,
      updateBatchCourseEnrollment
    ]
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
  updateBatchClassEnrollment,
  updateBatchCourseEnrollment
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchStudentEditor)

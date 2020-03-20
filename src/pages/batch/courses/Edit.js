import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getBatchCourse, updateBatchCourse } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(`required`),
    feeAmount: Yup.number()
      .integer()
      .min(0)
      .required(`required`)
  })
}

const getInitialValues = batchClass => ({
  name: get(batchClass, 'name', ''),
  feeAmount: get(batchClass, 'feeAmount', 0) / 100
})

function BatchCourseEdit({
  batchCourseId,
  batchCourse,
  getBatchCourse,
  updateBatchCourse,
  navigate
}) {
  useEffect(() => {
    if (!batchCourse) getBatchCourse(batchCourseId)
  }, [batchCourse, batchCourseId, getBatchCourse])

  const initialValues = useMemo(() => getInitialValues(batchCourse), [
    batchCourse
  ])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ feeAmount, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await updateBatchCourse(batchCourseId, {
          ...values,
          feeAmount: feeAmount * 100
        })
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
    [updateBatchCourse, batchCourseId]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Edit Batch Course: {batchCourseId}</Header>}
                Right={
                  <>
                    <Button as={Link} to={`..`}>
                      Go Back
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput name="name" label={`Name`} />

              <FormInput
                type="number"
                name="feeAmount"
                label={`Fee Amount (BDT)`}
                min="0"
                step="100"
              />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ batches }, { batchCourseId }) => ({
  batchCourse: get(batches.courses.byId, batchCourseId)
})

const mapDispatchToProps = {
  getBatchCourse,
  updateBatchCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchCourseEdit)

import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createBatchCourse } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    id: Yup.string()
      .min(2, 'minimum 2 characters')
      .max(4, 'maximum 4 characters')
      .required(`required`),
    name: Yup.string().required(`required`),
    feeAmount: Yup.number()
      .integer()
      .min(0)
      .required(`required`)
  })
}

const getInitialValues = () => ({
  id: '',
  name: '',
  feeAmount: 0
})

function BatchCourseCreate({ createBatchCourse, navigate }) {
  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ feeAmount, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await createBatchCourse({
          ...values,
          feeAmount: feeAmount * 100
        })
        actions.resetForm()
        navigate('..')
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
    [createBatchCourse, navigate]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Create Batch Course</Header>}
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

              <FormInput name="id" label={`ID`} />

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

const mapStateToProps = null

const mapDispatchToProps = {
  createBatchCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseCreate)

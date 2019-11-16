import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { createCoursePaymentForYear } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    batchCourseEnrollmentId: Yup.string().required(`required`),
    amount: Yup.number()
      .integer()
      .min(0)
      .required(`required`)
  })
}

const getInitialValues = () => ({
  batchCourseEnrollmentId: '',
  amount: ''
})

function BatchClassPaymentAddModal({
  batchCourseId,
  year,
  createCoursePaymentForYear
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ amount, batchCourseEnrollmentId }, actions) => {
      actions.setStatus(null)

      try {
        await createCoursePaymentForYear(batchCourseId, year, {
          amount: amount * 100,
          batchCourseEnrollmentId
        })
        actions.resetForm()
        window.location.reload()
        // handle.close()
      } catch (err) {
        if (err.errors) {
          const errors = []
          err.errors.forEach(({ param, message }) =>
            param !== 'amount'
              ? errors.push(`${param}: ${message}`)
              : actions.setFieldError(param, message)
          )
          if (errors.length) actions.setStatus(errors.join(', '))
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [batchCourseId, year, createCoursePaymentForYear]
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
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Add Payment
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>Add Payment for {year}</Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput
                name="batchCourseEnrollmentId"
                label={`Student Enrollment ID`}
              />

              <FormInput
                type="number"
                name="amount"
                label={`Amount (BDT)`}
                min="0"
                step="100"
              />
            </Modal.Content>

            <Modal.Actions>
              <Button type="reset">Reset</Button>
              <Button
                positive
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  createCoursePaymentForYear
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassPaymentAddModal)

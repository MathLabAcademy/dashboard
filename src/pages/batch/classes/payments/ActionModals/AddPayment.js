import Form from 'components/Form/Form.js'
import FormInput from 'components/Form/Input.js'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { createClassPaymentForMonth } from 'store/actions/batches.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    batchClassEnrollmentId: Yup.number()
      .integer()
      .required(`required`),
    amount: Yup.number()
      .integer()
      .min(0)
      .required(`required`)
  })
}

const getInitialValues = () => ({
  batchClassEnrollmentId: '',
  amount: ''
})

function BatchClassPaymentAddModal({
  batchClassId,
  year,
  month,
  monthName,
  createClassPaymentForMonth
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ amount, batchClassEnrollmentId }, actions) => {
      actions.setStatus(null)

      try {
        await createClassPaymentForMonth(batchClassId, year, month, {
          amount: amount * 100,
          batchClassEnrollmentId
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
    [batchClassId, year, month, createClassPaymentForMonth]
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
            <Modal.Header>
              Add Payment for {monthName} {year}
            </Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput
                name="batchClassEnrollmentId"
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
  createClassPaymentForMonth
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassPaymentAddModal)

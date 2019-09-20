import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { setBatchStudentPaymentMonthPaid } from 'store/actions/batches.js'
import * as Yup from 'yup'

const getValidationSchema = amountBoundary => {
  return Yup.object({
    amount: Yup.number()
      .integer()
      .min(amountBoundary.min)
      .max(amountBoundary.max)
      .required(`required`)
  })
}

const getInitialValues = amountBoundary => ({
  amount: amountBoundary.min
})

function CourseStudentPaymentRecordMonthModal({
  batchClassId,
  batchStudentId,
  year,
  month,
  monthName,
  setBatchStudentPaymentMonthPaid,
  batchFee,
  batchStudent
}) {
  const [open, handle] = useToggle(false)

  const amountBoundary = useMemo(() => {
    const waiver = get(batchStudent, 'waiver')
    const fee = get(batchFee, 'amount', 0) / 100

    return {
      min: fee * (1 - waiver / 100),
      max: fee
    }
  }, [batchFee, batchStudent])

  const initialValues = useMemo(() => getInitialValues(amountBoundary), [
    amountBoundary
  ])

  const validationSchema = useMemo(() => getValidationSchema(amountBoundary), [
    amountBoundary
  ])

  const onSubmit = useCallback(
    async ({ amount }, actions) => {
      actions.setStatus(null)

      try {
        await setBatchStudentPaymentMonthPaid(batchStudentId, {
          year,
          month,
          amount: amount * 100
        })
        actions.resetForm()
        handle.close()
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
    [batchStudentId, handle, month, setBatchStudentPaymentMonthPaid, year]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        isInitialValid
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Record
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>
              Record Payment from {batchStudentId} for {monthName} {year}
            </Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

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
                Record Payment
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = (
  { batches },
  { batchClassId, batchStudentId, year, month }
) => ({
  batchFee: get(batches.classes.feesById, [batchClassId, year, month]),
  batchStudent: get(batches.students.byId, batchStudentId)
})

const mapDispatchToProps = {
  setBatchStudentPaymentMonthPaid
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseStudentPaymentRecordMonthModal)

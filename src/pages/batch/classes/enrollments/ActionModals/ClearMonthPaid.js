import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { removePayment } from 'store/actions/batches.js'
import { get } from 'lodash-es'
import { Button, Confirm, ModalContent, Message } from 'semantic-ui-react'
import useToggle from 'hooks/useToggle.js'
import Permit from 'components/Permit.js'

function CourseStudentPaymentClearPaidModal({
  batchPaymentId,
  batchPayment,
  removePayment,
  batchClassId,
  batchStudentId,
  year,
  month,
  monthName
}) {
  const [open, handler] = useToggle(false)
  const [status, setStatus] = useState(null)

  const handleConfirm = useCallback(async () => {
    setStatus(null)

    try {
      await removePayment(batchPaymentId)
      handler.close()
    } catch (err) {
      const errorMessages = []

      if (err.errors) {
        err.errors.forEach(({ param, message }) =>
          message.push(`${param}: ${message}`)
        )
      } else if (err.message) {
        errorMessages.push(`${err.message}`)
      } else {
        console.error(err)
      }

      setStatus(errorMessages.join(', ') || null)
    }
  }, [batchPaymentId, handler, removePayment])

  if (!batchPayment) return null

  return (
    <Permit teacher>
      <Button onClick={handler.open}>Clear</Button>
      <Confirm
        open={open}
        onCancel={handler.close}
        onConfirm={handleConfirm}
        header={`Clear ${batchStudentId}'s payment for ${monthName} ${year}?`}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>
          </ModalContent>
        }
        confirmButton="Clear Payment"
      />
    </Permit>
  )
}

const mapStateToProps = (
  { batches },
  { batchClassId, year, month, batchPaymentId }
) => ({
  batchFee: get(batches.classes.feesById, [batchClassId, year, month]),
  batchPayment: get(batches.payments.byId, batchPaymentId)
})

const mapDispatchToProps = {
  removePayment
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseStudentPaymentClearPaidModal)

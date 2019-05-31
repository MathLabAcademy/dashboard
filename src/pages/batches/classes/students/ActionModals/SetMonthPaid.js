import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { setBatchStudentPaymentMonthPaid } from 'store/actions/batches.js'
import { get } from 'lodash-es'
import { Button, Confirm, ModalContent, Message } from 'semantic-ui-react'
import useToggle from 'hooks/useToggle.js'
import Permit from 'components/Permit.js'

function CourseStudentPaymentSetPaidModal({
  batchClassId,
  batchStudentId,
  year,
  month,
  monthName,
  setBatchStudentPaymentMonthPaid
}) {
  const [open, handler] = useToggle(false)
  const [status, setStatus] = useState(null)

  const handleConfirm = useCallback(async () => {
    setStatus(null)

    try {
      await setBatchStudentPaymentMonthPaid(batchStudentId, { year, month })
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
  }, [batchStudentId, handler, month, setBatchStudentPaymentMonthPaid, year])

  return (
    <Permit teacher>
      <Button onClick={handler.open}>Set Paid</Button>
      <Confirm
        open={open}
        onCancel={handler.close}
        onConfirm={handleConfirm}
        header={`Student ${batchStudentId} paid for ${monthName} ${year}?`}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>
          </ModalContent>
        }
        confirmButton="Set Paid"
      />
    </Permit>
  )
}

const mapStateToProps = ({ batches }, { batchClassId, year, month }) => ({
  batchFee: get(batches.classes.feesById, [batchClassId, year, month])
})

const mapDispatchToProps = {
  setBatchStudentPaymentMonthPaid
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseStudentPaymentSetPaidModal)

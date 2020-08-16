import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Text } from 'rebass'
import { Button, Message, Modal } from 'semantic-ui-react'
import { chargeClassPaymentForMonth } from 'store/actions/batches'

function BatchClassPaymentChargeModal({
  batchClassId,
  year,
  month,
  monthName,
  onDone,
  chargeClassPaymentForMonth,
}) {
  const [open, handle] = useToggle(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onClick = useCallback(async () => {
    setLoading(true)

    try {
      await chargeClassPaymentForMonth(batchClassId, year, month)

      setError(null)
      setLoading(false)
      onDone()
      handle.close()
    } catch (err) {
      const errors = []

      if (err.errors) {
        err.errors.forEach(({ param, message }) =>
          errors.push(`${param}: ${message}`)
        )
      }

      if (err.message) {
        errors.push(err.message)
      } else {
        console.error(err)
      }

      setError(errors.length ? errors.join(', ') : null)
      setLoading(false)
    }
  }, [batchClassId, year, month, onDone, chargeClassPaymentForMonth, handle])

  return (
    <Permit roles="teacher,analyst">
      <Modal
        trigger={
          <Button type="button" color="blue" onClick={handle.open}>
            Charge Payment
          </Button>
        }
        closeIcon
        open={loading || open}
        onClose={handle.close}
      >
        <Modal.Header>
          Charge Payment for {monthName} {year}
        </Modal.Header>

        <Modal.Content>
          <Message color="yellow" hidden={!error}>
            {error}
          </Message>

          <Text>
            This will deduct amount from the students' available account balance
            (if sufficient amount is available)
          </Text>
        </Modal.Content>

        <Modal.Actions>
          <Button type="button" onClick={handle.close} disabled={loading}>
            Close
          </Button>
          <Button
            positive
            type="button"
            onClick={onClick}
            loading={loading}
            disabled={loading}
          >
            Start Charging Process
          </Button>
        </Modal.Actions>
      </Modal>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  chargeClassPaymentForMonth,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassPaymentChargeModal)

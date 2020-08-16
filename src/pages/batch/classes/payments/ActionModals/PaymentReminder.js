import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Text } from 'rebass'
import { Button, Message, Modal, Tab } from 'semantic-ui-react'
import {
  getAllClassPaymentReminderForMonth,
  sendClassPaymentReminderForMonth,
} from 'store/actions/batches'
import { emptyArray } from 'utils/defaults'

function BatchClassPaymentReminderModal({
  batchClassId,
  year,
  month,
  monthName,
  paymentReminders,
  getAllClassPaymentReminderForMonth,
  sendClassPaymentReminderForMonth,
}) {
  const [open, handle] = useToggle(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onClick = useCallback(async () => {
    setLoading(true)

    try {
      await sendClassPaymentReminderForMonth(batchClassId, year, month)

      setError(null)
      setLoading(false)
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
  }, [batchClassId, month, sendClassPaymentReminderForMonth, year])

  useEffect(() => {
    getAllClassPaymentReminderForMonth(batchClassId, year, month)
  }, [batchClassId, getAllClassPaymentReminderForMonth, month, year])

  const reminders = useMemo(() => {
    const key = `${batchClassId}:${year}:${month}`
    return get(paymentReminders.idsByKey, key, emptyArray).map((id) =>
      get(paymentReminders.byId, id)
    )
  }, [
    batchClassId,
    year,
    month,
    paymentReminders.idsByKey,
    paymentReminders.byId,
  ])

  return (
    <Permit roles="teacher,analyst">
      <Modal
        trigger={
          <Button type="button" color="blue" onClick={handle.open}>
            Payment Reminders
          </Button>
        }
        closeIcon
        open={loading || open}
        onClose={handle.close}
      >
        <Modal.Header>
          Send Payment Reminder for {year} {monthName}
        </Modal.Header>

        <Modal.Content>
          <Message color="yellow" hidden={!error}>
            {error}
          </Message>

          <Text fontWeight="bold" fontSize={2}>
            Students who have payments due will be sent SMS reminders.
          </Text>

          {reminders.length > 0 && (
            <Tab
              panes={reminders.map(({ data, created }) => ({
                menuItem: DateTime.fromISO(created).toLocaleString(
                  DateTime.DATE_MED
                ),
                render: () => (
                  <Tab.Pane>
                    {get(data, 'enrollmentIds', emptyArray).map((id) => (
                      <>
                        <span>{id}</span>,{' '}
                      </>
                    ))}
                  </Tab.Pane>
                ),
              }))}
            />
          )}
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
            Send Payment Reminder
          </Button>
        </Modal.Actions>
      </Modal>
    </Permit>
  )
}

const mapStateToProps = ({ batches }) => ({
  paymentReminders: batches.classPaymentReminders,
})

const mapDispatchToProps = {
  getAllClassPaymentReminderForMonth,
  sendClassPaymentReminderForMonth,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassPaymentReminderModal)

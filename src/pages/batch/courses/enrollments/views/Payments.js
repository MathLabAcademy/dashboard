import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import { DateTime, Info } from 'luxon'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Input, Segment, Table } from 'semantic-ui-react'
import {
  getAllBatchClassFeesForYear,
  getAllBatchStudentPayments
} from 'store/actions/batches.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import ClearMonthPaid from '../ActionModals/ClearMonthPaid.js'
import RecordMonthPayment from '../ActionModals/RecordMonthPayment.js'

const months = Info.months()

function BatchCourseStudentPayments({
  batchClassId,
  batchStudentId,
  batchClassFees,
  getAllBatchClassFeesForYear,
  batchPaymentIds,
  batchPayments,
  getAllBatchStudentPayments
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  useEffect(() => {
    getAllBatchStudentPayments(batchStudentId)
  }, [batchStudentId, getAllBatchStudentPayments])

  useEffect(() => {
    getAllBatchClassFeesForYear(batchClassId, year)
  }, [batchClassId, getAllBatchClassFeesForYear, year])

  const data = useMemo(() => {
    const fees = get(batchClassFees, year, emptyObject)
    const payments = batchPaymentIds
      .filter(id => get(batchPayments.byId, [id, 'year']) === year)
      .map(id => get(batchPayments.byId, id, emptyObject))

    return months.reduce((byMonth, monthName, index) => {
      const month = index + 1
      const fee = get(fees, month)
      const payment = payments.find(item => item.month === month)
      byMonth[month] = { fee, payment, monthName }
      return byMonth
    }, {})
  }, [batchClassFees, batchPaymentIds, batchPayments.byId, year])

  return (
    <Segment>
      <HeaderGrid Left={<Header>Payments</Header>} />

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing colSpan="3">
              Year: {year}
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="4" textAlign="right">
              <Input
                ref={yearRef}
                defaultValue={year}
                disabled
                type="number"
                min="2000"
                max="2099"
                step="1"
                icon="calendar alternate"
                iconPosition="left"
                action={
                  <Button
                    type="button"
                    icon="filter"
                    disabled
                    onClick={handleYearChange}
                  />
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Month</Table.HeaderCell>
            <Table.HeaderCell collapsing>ID</Table.HeaderCell>
            <Table.HeaderCell collapsing>Type</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="right">
              Amount (BDT)
            </Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Object.entries(data).map(([month, { fee, payment, monthName }]) => (
            <Table.Row key={monthName}>
              <Table.Cell>{monthName}</Table.Cell>
              <Table.Cell collapsing>
                {payment ? get(payment, 'id') : '———'}
              </Table.Cell>
              <Table.Cell collapsing>
                {payment ? get(payment, 'transactionTypeId') : '—————'}
              </Table.Cell>
              <Table.Cell>
                {payment
                  ? DateTime.fromISO(get(payment, 'created')).toLocaleString(
                      DateTime.DATETIME_MED_WITH_SECONDS
                    )
                  : fee
                  ? 'Due'
                  : '———'}
              </Table.Cell>
              <Table.Cell collapsing textAlign="right">
                {payment
                  ? get(payment, 'amount') / 100
                  : fee
                  ? `[${get(fee, 'amount') / 100}]`
                  : '———'}
              </Table.Cell>
              <Table.Cell>{get(payment, 'note')}</Table.Cell>
              <Table.Cell collapsing>
                {!payment && fee && (
                  <RecordMonthPayment
                    batchClassId={batchClassId}
                    batchStudentId={batchStudentId}
                    year={year}
                    month={month}
                    monthName={monthName}
                  />
                )}
                {payment && get(payment, 'transactionTypeId') === 'CASH' && (
                  <ClearMonthPaid
                    batchPaymentId={get(payment, 'id')}
                    batchClassId={batchClassId}
                    batchStudentId={batchStudentId}
                    year={year}
                    month={month}
                    monthName={monthName}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  )
}

const mapStateToProps = ({ batches }, { batchClassId, batchStudentId }) => ({
  batchClassFees: get(batches.classes.feesById, batchClassId),
  batchPaymentIds: get(
    batches.students.paymentIdsById,
    batchStudentId,
    emptyArray
  ),
  batchPayments: batches.payments
})

const mapDispatchToProps = {
  getAllBatchClassFeesForYear,
  getAllBatchStudentPayments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseStudentPayments)

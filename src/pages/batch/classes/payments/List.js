import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import { Info } from 'luxon'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Input, Segment, Table } from 'semantic-ui-react'
import { getAllBatchClassEnrollmentForYear } from 'store/actions/batches'
import { emptyArray } from 'utils/defaults'
import ChargePayment from './ActionModals/ChargePayment'
import PaymentReminder from './ActionModals/PaymentReminder'

const months = Info.months()

function _ListItemRow({ enrollmentId, enrollment, user, month }) {
  const data = useMemo(() => {
    const credit = get(user, 'credit', 0) / 100
    const payment = get(enrollment, 'Payments', emptyArray).find(
      payment => payment.month === month
    )
    const transactionId = get(payment, 'id', '---')
    const amount = get(payment, 'Transaction.amount') / 100 || '---'
    return {
      credit,
      transactionId,
      amount
    }
  }, [enrollment, user, month])

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Link to={`../enrollments/${enrollmentId}`}>{enrollmentId}</Link>
      </Table.Cell>
      <Table.Cell collapsing>{data.credit}</Table.Cell>
      <Table.Cell collapsing>{data.transactionId}</Table.Cell>
      <Table.Cell collapsing>{data.amount}</Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(({ batches, users }, { enrollmentId }) => {
  const enrollment = get(batches.classEnrollments.byId, enrollmentId)
  return {
    enrollment,
    user: get(users.byId, get(enrollment, 'userId'))
  }
})(_ListItemRow)

function BatchClassPaymentList({
  batchClassId,
  getAllBatchClassEnrollmentForYear,
  classEnrollments,
  linkToBase
}) {
  const yearRef = useRef()
  const monthRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  const handleMonthChange = useCallback(() => {
    if (!monthRef.current) return
    const month = monthRef.current.inputRef.current.value
    setMonth(Number(month))
  }, [])

  const refreshPaymentData = useCallback(() => {
    getAllBatchClassEnrollmentForYear(batchClassId, year, {
      query: `include=Payments&month=${month}`
    })
  }, [batchClassId, year, month, getAllBatchClassEnrollmentForYear])

  useEffect(() => {
    refreshPaymentData()
  }, [refreshPaymentData])

  const enrollmentIds = useMemo(() => {
    const regex = new RegExp(
      `^${String(year).slice(-2)}${String(batchClassId).padStart(2, '0')}`
    )
    return classEnrollments.allIds
      .filter(id => regex.test(id))
      .sort()
      .filter(id =>
        get(classEnrollments.byId, [id, 'activeMonths'], emptyArray).includes(
          month
        )
      )
  }, [
    batchClassId,
    year,
    month,
    classEnrollments.allIds,
    classEnrollments.byId
  ])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Class Payments</Header>}
          Right={
            <>
              <Button as={Link} to={`..`}>
                Go Back
              </Button>
              <ChargePayment
                batchClassId={batchClassId}
                year={year}
                month={month}
                monthName={months[month - 1]}
                onDone={refreshPaymentData}
              />
              <PaymentReminder
                batchClassId={batchClassId}
                year={year}
                month={month}
                monthName={months[month - 1]}
              />
            </>
          }
        />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              {months[month - 1]} {year}
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="right" colSpan="2">
              <Input
                ref={yearRef}
                defaultValue={year}
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
                    onClick={handleYearChange}
                  />
                }
              />
              <Input
                ref={monthRef}
                defaultValue={month}
                type="number"
                min="1"
                max="12"
                step="1"
                icon="calendar alternate"
                iconPosition="left"
                action={
                  <Button
                    type="button"
                    icon="filter"
                    onClick={handleMonthChange}
                  />
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>
              Student Enrollment ID
            </Table.HeaderCell>
            <Table.HeaderCell collapsing>Credit Balance</Table.HeaderCell>
            <Table.HeaderCell collapsing>Transaction ID</Table.HeaderCell>
            <Table.HeaderCell collapsing>Amount (BDT)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {enrollmentIds.map(enrollmentId => (
            <ListItemRow
              key={enrollmentId}
              linkToBase={linkToBase}
              enrollmentId={enrollmentId}
              month={month}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ batches }) => ({
  classPayments: batches.classPayments,
  classEnrollments: batches.classEnrollments
})

const mapDispatchToProps = {
  getAllBatchClassEnrollmentForYear
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassPaymentList)

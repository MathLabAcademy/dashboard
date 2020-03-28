import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Input, Segment, Table } from 'semantic-ui-react'
import { getAllBatchCourseEnrollmentForYear } from 'store/actions/batches'
import ChargePayment from './ActionModals/ChargePayment'
import PaymentReminder from './ActionModals/PaymentReminder'

function _ListItemRow({ enrollmentId, enrollment, user }) {
  const data = useMemo(() => {
    const credit = get(user, 'credit', 0) / 100
    const transactionId = get(enrollment, 'Payments[0].id', '---')
    const amount =
      get(enrollment, 'Payments[0].Transaction.amount') / 100 || '---'
    return {
      credit,
      transactionId,
      amount,
    }
  }, [enrollment, user])

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
  const enrollment = get(batches.courseEnrollments.byId, enrollmentId)
  return {
    enrollment,
    user: get(users.byId, get(enrollment, 'userId')),
  }
})(_ListItemRow)

function BatchCoursePaymentList({
  batchCourseId,
  courseEnrollments,
  getAllBatchCourseEnrollmentForYear,
  linkToBase,
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  const refreshPaymentData = useCallback(() => {
    getAllBatchCourseEnrollmentForYear(batchCourseId, year, {
      query: 'include=Payments',
    })
  }, [getAllBatchCourseEnrollmentForYear, batchCourseId, year])

  useEffect(() => {
    refreshPaymentData()
  }, [refreshPaymentData])

  const enrollmentIds = useMemo(() => {
    const regex = new RegExp(`^${batchCourseId}${String(year).slice(-2)}`)
    return courseEnrollments.allIds.filter((id) => regex.test(id)).sort()
  }, [batchCourseId, year, courseEnrollments.allIds])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Course Payments</Header>}
          Right={
            <>
              <Button as={Link} to={`..`}>
                Go Back
              </Button>
              <ChargePayment
                batchCourseId={batchCourseId}
                year={year}
                onDone={refreshPaymentData}
              />
              <PaymentReminder batchCourseId={batchCourseId} year={year} />
            </>
          }
        />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
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
            <Table.HeaderCell collapsing textAlign="right" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {enrollmentIds.map((enrollmentId) => (
            <ListItemRow
              key={enrollmentId}
              linkToBase={linkToBase}
              enrollmentId={enrollmentId}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ batches }) => ({
  courseEnrollments: batches.courseEnrollments,
  coursePayments: batches.coursePayments,
})

const mapDispatchToProps = {
  getAllBatchCourseEnrollmentForYear,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCoursePaymentList)

import BatchStudent from 'components/User/BatchStudent'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import {
  getAllBatchCoursePaymentsForEnrollment,
  getBatchCourseEnrollment
} from 'store/actions/batches'
import { getUser } from 'store/actions/users'

function _PaymentItemRow({ payment }) {
  return (
    <Table.Row>
      <Table.Cell collapsing>{get(payment, 'id')}</Table.Cell>
      <Table.Cell collapsing>
        {get(payment, 'Transaction.amount') / 100}
      </Table.Cell>
      <Table.Cell collapsing textAlign="right">
        {DateTime.fromISO(get(payment, 'created'))
          .toLocal()
          .toLocaleString()}
      </Table.Cell>
    </Table.Row>
  )
}

const PaymentItemRow = connect(({ batches }, { id }) => ({
  payment: get(batches.coursePayments.byId, id)
}))(_PaymentItemRow)

function BatchCourseStudent({
  batchCourseId,
  batchCourseEnrollmentId,
  batchCourseEnrollment,
  userId,
  user,
  getUser,
  getBatchCourseEnrollment,
  getAllBatchCoursePaymentsForEnrollment
}) {
  useEffect(() => {
    if (!batchCourseEnrollment)
      getBatchCourseEnrollment(batchCourseEnrollmentId)
  }, [batchCourseEnrollment, batchCourseEnrollmentId, getBatchCourseEnrollment])

  const [paymentIds, setPaymentIds] = useState([])

  useEffect(() => {
    getAllBatchCoursePaymentsForEnrollment(batchCourseEnrollmentId).then(
      data => {
        setPaymentIds(data.items.map(({ id }) => id))
      }
    )
  }, [batchCourseEnrollmentId, getAllBatchCoursePaymentsForEnrollment])

  return (
    <>
      <BatchStudent
        batchType="course"
        batchEnrollment={batchCourseEnrollment}
        user={user}
      />

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>Transaction ID</Table.HeaderCell>
            <Table.HeaderCell collapsing>Amount (BDT)</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="right">
              Date
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {paymentIds.map(id => (
            <PaymentItemRow key={id} id={id} />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ batches, users }, { batchCourseEnrollmentId }) => {
  const batchCourseEnrollment = get(
    batches.courseEnrollments.byId,
    batchCourseEnrollmentId
  )
  const userId = get(batchCourseEnrollment, 'userId')
  const user = get(users.byId, userId)

  return {
    batchCourseEnrollment,
    userId,
    user
  }
}

const mapDispatchToProps = {
  getBatchCourseEnrollment,
  getAllBatchCoursePaymentsForEnrollment,
  getUser
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchCourseStudent)

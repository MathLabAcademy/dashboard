import BatchStudent from 'components/User/BatchStudent'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import {
  getAllBatchClassPaymentsForEnrollment,
  getBatchClassEnrollment
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
  payment: get(batches.classPayments.byId, id)
}))(_PaymentItemRow)

function BatchClassStudent({
  batchClassId,
  batchClassEnrollmentId,
  batchClassEnrollment,
  userId,
  user,
  getUser,
  getBatchClassEnrollment,
  getAllBatchClassPaymentsForEnrollment
}) {
  useEffect(() => {
    if (!batchClassEnrollment) getBatchClassEnrollment(batchClassEnrollmentId)
  }, [batchClassEnrollment, batchClassEnrollmentId, getBatchClassEnrollment])

  const [paymentIds, setPaymentIds] = useState([])

  useEffect(() => {
    getAllBatchClassPaymentsForEnrollment(batchClassEnrollmentId).then(data => {
      setPaymentIds(data.items.map(({ id }) => id))
    })
  }, [batchClassEnrollmentId, getAllBatchClassPaymentsForEnrollment])

  return (
    <>
      <BatchStudent
        batchType="class"
        batchEnrollment={batchClassEnrollment}
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

const mapStateToProps = ({ batches, users }, { batchClassEnrollmentId }) => {
  const batchClassEnrollment = get(
    batches.classEnrollments.byId,
    batchClassEnrollmentId
  )
  const userId = get(batchClassEnrollment, 'userId')
  const user = get(users.byId, userId)

  return {
    batchClassEnrollment,
    userId,
    user
  }
}

const mapDispatchToProps = {
  getBatchClassEnrollment,
  getAllBatchClassPaymentsForEnrollment,
  getUser
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassStudent)

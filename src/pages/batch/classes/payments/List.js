import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import { Info } from 'luxon'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Input, Segment, Table } from 'semantic-ui-react'
import { getAllClassPaymentForMonth } from 'store/actions/batches'
import api from 'utils/api'
import ChargePayment from './ActionModals/ChargePayment'

const months = Info.months()

function _ListItemRow({ payment }) {
  const [enrollmentId, setEnrollmentId] = useState('')

  useEffect(() => {
    api(
      `/batch/classpayments/${get(payment, 'id')}/enrollment-id`
    ).then(({ data }) => setEnrollmentId(data))
  }, [payment])

  return (
    <Table.Row>
      <Table.Cell collapsing>{get(payment, 'id')}</Table.Cell>
      <Table.Cell collapsing>
        <Link to={`../enrollments/${enrollmentId}`}>{enrollmentId}</Link>
      </Table.Cell>
      <Table.Cell collapsing>
        {get(payment, 'Transaction.amount') / 100}
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(({ batches }, { id }) => ({
  payment: get(batches.classPayments.byId, id)
}))(_ListItemRow)

function BatchClassPaymentList({
  batchClassId,
  getAllClassPaymentForMonth,
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

  const [ids, setIds] = useState([])

  const refreshPaymentIds = useCallback(() => {
    getAllClassPaymentForMonth(batchClassId, year, month).then(data => {
      setIds(data.items.map(({ id }) => id))
    })
  }, [batchClassId, year, month, getAllClassPaymentForMonth])

  useEffect(() => {
    refreshPaymentIds()
  }, [refreshPaymentIds])

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
                onDone={refreshPaymentIds}
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
            <Table.HeaderCell textAlign="right">
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
            <Table.HeaderCell collapsing>Transaction ID</Table.HeaderCell>
            <Table.HeaderCell collapsing>
              Student Enrollment ID
            </Table.HeaderCell>
            <Table.HeaderCell collapsing>Amount (BDT)</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="right" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {ids.map(id => (
            <ListItemRow key={id} id={id} linkToBase={linkToBase} />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ batches }) => ({
  classPayments: batches.classPayments
})

const mapDispatchToProps = {
  getAllClassPaymentForMonth
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassPaymentList)

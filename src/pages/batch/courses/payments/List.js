import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Input, Segment, Table } from 'semantic-ui-react'
import { getAllCoursePaymentForYear } from 'store/actions/batches'
import api from 'utils/api'
import AddPayment from './ActionModals/AddPayment'

function _ListItemRow({ payment }) {
  const [enrollmentId, setEnrollmentId] = useState('')

  useEffect(() => {
    api(
      `/batch/coursepayments/${get(payment, 'id')}/enrollment-id`
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
  payment: get(batches.coursePayments.byId, id)
}))(_ListItemRow)

function BatchCoursePaymentList({
  batchCourseId,
  getAllCoursePaymentForYear,
  linkToBase
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  const [ids, setIds] = useState([])

  useEffect(() => {
    getAllCoursePaymentForYear(batchCourseId, year).then(data => {
      setIds(data.items.map(({ id }) => id))
    })
  }, [batchCourseId, year, getAllCoursePaymentForYear])

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
              <AddPayment batchCourseId={batchCourseId} year={year} />
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
  coursePayments: batches.coursePayments
})

const mapDispatchToProps = {
  getAllCoursePaymentForYear
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCoursePaymentList)

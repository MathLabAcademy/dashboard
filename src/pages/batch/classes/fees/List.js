import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { Info } from 'luxon'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Input, Segment, Table } from 'semantic-ui-react'
import { getAllBatchClassFeesForYear } from 'store/actions/batches'
import SetFee from './ActionModals/SetFee'
import UnsetFee from './ActionModals/UnsetFee'

const months = Info.months()

function _ListItemRow({ batchClassId, year, month, monthName, batchFee }) {
  const amount = useMemo(() => {
    const value = get(batchFee, 'amount')
    return Number.isFinite(value) ? value / 100 : 'N/A'
  }, [batchFee])

  return (
    <Table.Row>
      <Table.Cell collapsing>{monthName}</Table.Cell>
      <Table.Cell collapsing>{amount}</Table.Cell>
      <Table.Cell textAlign="right">
        <Permit roles="teacher">
          <UnsetFee
            batchClassId={batchClassId}
            year={year}
            month={month}
            monthName={monthName}
          />
          <SetFee
            batchClassId={batchClassId}
            year={year}
            month={month}
            monthName={monthName}
          />
        </Permit>
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(
  ({ batches }, { batchClassId, year, month }) => ({
    batchFee: get(batches.classes.feesById, [batchClassId, year, month]),
  }),
  {}
)(_ListItemRow)

function BatchClassFeeList({
  batchClassId,
  getAllBatchClassFeesForYear,
  linkToBase,
}) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  useEffect(() => {
    getAllBatchClassFeesForYear(batchClassId, year)
  }, [batchClassId, getAllBatchClassFeesForYear, year])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Fees</Header>}
          Right={
            <Button as={Link} to={`..`}>
              Go Back
            </Button>
          }
        />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>Year: {year}</Table.HeaderCell>
            <Table.HeaderCell collapsing />
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
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>Month</Table.HeaderCell>
            <Table.HeaderCell collapsing>Amount (BDT)</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="right" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {months.map((month, index) => (
            <ListItemRow
              key={`${year}-${index + 1}`}
              batchClassId={batchClassId}
              year={year}
              month={index + 1}
              monthName={month}
              linkToBase={linkToBase}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = () => null

const mapDispatchToProps = {
  getAllBatchClassFeesForYear,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassFeeList)

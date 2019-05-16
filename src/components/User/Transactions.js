import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Table } from 'semantic-ui-react'
import { getAllTransactionsForUser } from 'store/actions/transactions.js'

function UserTransactions({ userId, transactions, getAllTransactionsForUser }) {
  useEffect(() => {
    getAllTransactionsForUser(userId)
  }, [getAllTransactionsForUser, userId])

  const transactionIds = useMemo(() => {
    const UserId = Number(userId)
    return transactions.allIds.filter(
      id => get(transactions.byId, [id, 'userId']) === UserId
    )
  }, [transactions.allIds, transactions.byId, userId])

  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Transaction History</Header>} />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="right">
              Amount (BDT)
            </Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactionIds
            .map(id => get(transactions.byId, id))
            .map(({ id, transactionTypeId, amount, note, created }) => (
              <Table.Row key={id}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{transactionTypeId}</Table.Cell>
                <Table.Cell>
                  {DateTime.fromISO(created).toLocaleString(
                    DateTime.DATETIME_MED_WITH_SECONDS
                  )}
                </Table.Cell>
                <Table.Cell collapsing textAlign="right">
                  {amount / 100}
                </Table.Cell>
                <Table.Cell>{note}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ transactions }) => ({
  transactions
})

const mapDispatchToProps = {
  getAllTransactionsForUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTransactions)

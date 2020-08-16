import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Text } from 'rebass'
import { Header, Segment, Table } from 'semantic-ui-react'
import { getAllTransactionsForUser } from 'store/actions/transactions'

function UserTransactions({
  userId,
  transactions,
  getAllTransactionsForUser,
  basic,
}) {
  useEffect(() => {
    if (userId) getAllTransactionsForUser(userId)
  }, [getAllTransactionsForUser, userId])

  const transactionIds = useMemo(() => {
    return transactions.allIds.filter(
      (id) => get(transactions.byId, [id, 'userId']) === userId
    )
  }, [transactions.allIds, transactions.byId, userId])

  return (
    <Permit roles="teacher,analyst" userId={userId}>
      {!basic && (
        <Segment>
          <HeaderGrid Left={<Header>Transaction History</Header>} />
        </Segment>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell collapsing textAlign="right">
              Amount (BDT)
            </Table.HeaderCell>
            <Permit roles="teacher,analyst">
              <Table.HeaderCell>Meta</Table.HeaderCell>
            </Permit>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactionIds
            .map((id) => get(transactions.byId, id))
            .map(({ id, transactionTypeId, amount, data, created }) => (
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
                <Permit roles="teacher,analyst">
                  <Table.Cell>
                    <Text sx={{ wordBreak: 'break-all' }}>
                      {JSON.stringify(data)}
                    </Text>
                  </Table.Cell>
                </Permit>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Permit>
  )
}

const mapStateToProps = ({ transactions }) => ({
  transactions,
})

const mapDispatchToProps = {
  getAllTransactionsForUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTransactions)

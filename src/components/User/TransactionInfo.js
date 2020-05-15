import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import { readBalance } from 'store/actions/users'
import Transactions from './Transactions'

function TransactionInfo({ userId, user, title, readBalance }) {
  const balanceTaka = useMemo(() => {
    const balance = get(user, 'balance') || 0
    const inTaka = Number(balance / 100).toFixed(2)
    return `BDT ${inTaka}`
  }, [user])

  const isStudent = useMemo(() => get(user, 'roleId') === 'student', [user])

  const refreshBalance = useCallback(() => {
    if (userId) readBalance(userId)
  }, [readBalance, userId])

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  return (
    <Segment>
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <>
            <Button type="button" icon="refresh" onClick={refreshBalance} />
            {isStudent && (
              <Permit roles="teacher">
                <Button as={Link} to={'add-balance'}>
                  Add Balance
                </Button>
              </Permit>
            )}
            {/* <Permit roles="teacher" userId={userId}>
              <Button as={Link} to={'transactions'}>
                Transactions
              </Button>
            </Permit> */}
          </>
        }
      />

      <Table basic="very" compact className="horizontal-info">
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell collapsing content={`Account Balance`} />
            <Table.Cell content={`${balanceTaka}`} />
          </Table.Row>
        </Table.Body>
      </Table>

      <Transactions userId={userId} basic />
    </Segment>
  )
}
const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId),
})

const mapDispatchToProps = {
  readBalance,
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionInfo)

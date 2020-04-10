import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import { readCredit } from 'store/actions/users'
import Transactions from './Transactions'

function TransactionInfo({ userId, user, title, readCredit }) {
  const creditTaka = useMemo(() => {
    const credit = get(user, 'credit') || 0
    const inTaka = Number(credit / 100).toFixed(2)
    return `${inTaka} BDT`
  }, [user])

  const isStudent = useMemo(() => get(user, 'roleId') === 'student', [user])

  const refreshCredit = useCallback(() => {
    if (userId) readCredit(userId)
  }, [readCredit, userId])

  useEffect(() => {
    refreshCredit()
  }, [refreshCredit])

  return (
    <Segment>
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <>
            <Button type="button" icon="refresh" onClick={refreshCredit} />
            {isStudent && (
              <Permit roles="teacher">
                <Button as={Link} to={'add-credit'}>
                  Add Credit
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
            <Table.HeaderCell collapsing content={`Credit`} />
            <Table.Cell content={creditTaka} />
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
  readCredit,
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionInfo)

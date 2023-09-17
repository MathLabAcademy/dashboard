import { Link } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Header, Segment, Table } from 'semantic-ui-react'
import { readBalance, recalculateBalance } from 'store/actions/users'
import { useCurrentUserData } from 'store/currentUser/hooks'
import SetCreditLimit from './modals/SetCreditLimit'
import Transactions from './Transactions'
import { Button, Tooltip, IconButton, Stack, Box } from '@chakra-ui/core'

function TransactionInfo({ userId, user, title }) {
  const currentUser = useCurrentUserData()

  const dispatch = useDispatch()
  const refreshBalance = useCallback(async () => {
    if (!userId) {
      return
    }

    if (['teacher', 'assistant'].includes(get(currentUser, 'roleId'))) {
      await dispatch(recalculateBalance(userId))
    } else {
      await dispatch(readBalance(userId))
    }
  }, [currentUser, dispatch, userId])

  return (
    <Segment>
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <Stack isInline spacing={2}>
            <Box>
              <Tooltip hasArrow label="Refresh Balance" placement="top">
                <IconButton
                  type="button"
                  icon="repeat"
                  onClick={refreshBalance}
                />
              </Tooltip>
            </Box>
            <Permit roles="teacher">
              <Stack isInline spacing={2}>
                <Box>
                  <Tooltip
                    hasArrow
                    label="Manually Add Balance"
                    placement="top"
                  >
                    <Button as={Link} to={'add-balance'}>
                      Deposit
                    </Button>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip
                    hasArrow
                    label="Adjust Previous Transactions"
                    placement="top"
                  >
                    <Button as={Link} to={'adjust-balance'}>
                      Adjust
                    </Button>
                  </Tooltip>
                </Box>
                <SetCreditLimit userId={userId} />
              </Stack>
            </Permit>
            {/* <Permit roles="teacher,analyst" userId={userId}>
              <Button as={Link} to={'transactions'}>
                Transactions
              </Button>
            </Permit> */}
          </Stack>
        }
      />

      <Table basic="very" compact className="horizontal-info">
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell collapsing content={`Account Balance`} />
            <Table.Cell
              content={`BDT ${Number(get(user, 'balance', 0) / 100).toFixed(
                2
              )}`}
            />
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell collapsing content={`Credit Limit`} />
            <Table.Cell
              content={`BDT ${Number(get(user, 'creditLimit', 0) / 100).toFixed(
                2
              )}`}
            />
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

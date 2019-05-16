import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { Button, Header, Segment, Table } from 'semantic-ui-react'

function TransactionInfo({ user, title }) {
  const creditTaka = useMemo(() => {
    const credit = get(user, 'credit') || 0
    const inTaka = Number(credit / 100).toFixed(2)
    return `${inTaka} BDT`
  }, [user])

  const isStudent = useMemo(() => get(user, 'roleId') === 'student', [user])

  return (
    <Segment className="mathlab user-info">
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          <>
            {isStudent && (
              <Permit teacher>
                <Button as={Link} to={'add-credit'}>
                  Add Credit
                </Button>
              </Permit>
            )}
            <Permit teacher userId={get(user, 'id')}>
              <Button as={Link} to={'transactions'}>
                Transactions
              </Button>
            </Permit>
          </>
        }
      />

      <Table basic="very" compact>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell collapsing content={`Credit`} />
            <Table.Cell content={creditTaka} />
          </Table.Row>
        </Table.Body>
      </Table>
    </Segment>
  )
}

export default memo(TransactionInfo)

import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { Button, Header, Segment, Table } from 'semantic-ui-react'

function TransactionInfo({ userData, title }) {
  const creditTaka = useMemo(() => {
    const credit = get(userData, 'credit') || 0
    const inTaka = Number(credit / 100).toFixed(2)
    return `${inTaka} ৳`
  }, [userData])

  const isStudent = useMemo(() => get(userData, 'roleId') === 'student', [
    userData
  ])

  return (
    <Segment className="mathlab user-info">
      <HeaderGrid
        Left={<Header content={title} />}
        Right={
          isStudent && (
            <Permit teacher>
              <Button as={Link} to={'add-credit'}>
                Add Credit
              </Button>
            </Permit>
          )
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

export default TransactionInfo

import { Link, Router } from '@reach/router'
import Gravatar from 'components/Gravatar.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { capitalize, get } from 'lodash-es'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import { getUser } from 'store/actions/users.js'
import getPersonName from 'utils/get-person-name.js'
import AddCredit from './AddCredit.js'
import ChangePassword from './ChangePassword.js'
import Info from './Info.js'
import Transactions from './Transactions.js'

const labeledRoles = ['admin', 'teacher']

function User({ userId, user, getUser }) {
  const refreshUser = useCallback(() => {
    getUser(userId)
  }, [getUser, userId])

  return (
    <Permit admin teacher userId={userId}>
      <Segment loading={!user}>
        <HeaderGrid
          leftClassName="auto wide"
          Left={
            <Gravatar
              email={get(user, 'Person.email') || get(user, 'Person.xEmail')}
              params={{ d: 'robohash' }}
            />
          }
          rightClassName="grow wide"
          Right={
            <HeaderGrid
              Left={
                <>
                  <Header>
                    {getPersonName(get(user, 'Person'))}
                    <Header.Subheader>{get(user, 'email')}</Header.Subheader>
                  </Header>
                  <Permit userId={userId}>
                    <Button as={Link} to={`change-password`}>
                      Change Password
                    </Button>
                  </Permit>
                </>
              }
              Right={
                <Button type="button" icon="refresh" onClick={refreshUser} />
              }
            />
          }
        />

        {labeledRoles.includes(get(user, 'roleId')) && (
          <Label color="black" size="tiny" attached="bottom right">
            {capitalize(get(user, 'roleId'))}
          </Label>
        )}
      </Segment>

      <Router>
        <Info path="/" userId={userId} />
        <AddCredit path="add-credit" userId={userId} />
        <Transactions path="transactions" userId={userId} />
        <ChangePassword path="change-password" userId={userId} />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId)
})

const mapDispatchToProps = {
  getUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)

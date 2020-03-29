import { Link, Router } from '@reach/router'
import Gravatar from 'components/Gravatar'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { capitalize, get } from 'lodash-es'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import { getUser } from 'store/actions/users'
import AddCredit from './AddCredit'
import ChangePassword from './ChangePassword'
import Info from './Info'

const labeledRoles = ['teacher', 'assistant']

function User({ userId, user, getUser }) {
  const refreshUser = useCallback(() => {
    getUser(userId)
  }, [getUser, userId])

  const email = get(user, 'Person.email') || get(user, 'Person.emailTrx')

  return (
    <Permit teacher userId={userId}>
      <Segment loading={!user}>
        <HeaderGrid
          leftClassName="auto wide"
          Left={
            email ? <Gravatar email={email} params={{ d: 'robohash' }} /> : null
          }
          rightClassName="grow wide"
          Right={
            <HeaderGrid
              Left={
                <>
                  <Header>
                    {get(user, 'Person.fullName')}
                    <Header.Subheader>
                      {get(user, 'Person.email')}
                    </Header.Subheader>
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
        <Info path="/" userId={userId} refreshUser={refreshUser} />
        <AddCredit path="add-credit" userId={userId} />
        <ChangePassword path="change-password" userId={userId} />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId),
})

const mapDispatchToProps = {
  getUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(User)

import Gravatar from 'components/Gravatar.js'
import HeaderGrid from 'components/HeaderGrid.js'
import PersonInfo from 'components/User/PersonInfo.js'
import { capitalize, get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Header, Label, Segment } from 'semantic-ui-react'
import { getUser } from 'store/actions/users.js'
import getPersonName from 'utils/get-person-name.js'

const labeledRoles = ['admin', 'teacher']

function UserView({ id, data, getData }) {
  useEffect(() => {
    if (!data) getData(id)
  }, [data, getData, id])

  return (
    <>
      <Segment loading={!data}>
        <HeaderGrid
          leftClassName="auto wide"
          Left={
            <Gravatar
              email={get(data, 'Person.email')}
              params={{ d: 'robohash' }}
            />
          }
          rightClassName="grow wide"
          Right={
            <>
              <Header>
                {getPersonName(get(data, 'Person'))}
                <Header.Subheader>{get(data, 'email')}</Header.Subheader>
              </Header>
            </>
          }
        />

        {labeledRoles.includes(get(data, 'roleId')) && (
          <Label color="black" size="tiny" attached="bottom right">
            {capitalize(get(data, 'roleId'))}
          </Label>
        )}
      </Segment>

      <PersonInfo
        userId={get(data, 'id')}
        data={get(data, 'Person')}
        title={`Personal Information`}
      />

      {get(data, 'roleId' === 'student') && (
        <PersonInfo
          userId={get(data, 'id')}
          data={get(data, 'Person.Guardian')}
          title={`Guardian Information`}
          isGuardian
        />
      )}
    </>
  )
}

const mapStateToProps = ({ users }, { UserId }) => ({
  data: get(users.byId, UserId)
})

const mapDispatchToProps = {
  getData: getUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserView)

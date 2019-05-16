import Gravatar from 'components/Gravatar.js'
import HeaderGrid from 'components/HeaderGrid.js'
import PersonInfo from 'components/User/PersonInfo.js'
import TransactionInfo from 'components/User/TransactionInfo.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name.js'
import ProfilePasswordEditor from './Editors/PasswordModal.js'
import './Main.css'

function View({ data }) {
  return (
    <>
      <Segment>
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
              <ProfilePasswordEditor />
            </>
          }
        />
      </Segment>

      <PersonInfo
        userId={get(data, 'id')}
        data={get(data, 'Person')}
        title={`Personal Information`}
      />

      {/^student/.test(get(data, 'roleId')) && (
        <PersonInfo
          userId={get(data, 'id')}
          data={get(data, 'Person.Guardian')}
          title={`Guardian Information`}
          isGuardian
        />
      )}

      <TransactionInfo userData={data} title={`Transaction Information`} />
    </>
  )
}

const mapStateToProps = ({ user }) => ({
  data: get(user, 'data')
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)

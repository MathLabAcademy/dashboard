import './Main.css'

import React from 'react'

import { connect } from 'react-redux'

import get from 'lodash/get'

import getPersonName from 'utils/get-person-name.js'

import { Header, Segment } from 'semantic-ui-react'

import Gravatar from 'components/Gravatar.js'
import HeaderGrid from 'components/HeaderGrid.js'

import PersonInfo from './PersonInfo.js'

import ProfilePasswordEditor from './Editors/PasswordModal.js'

function View({ data }) {
  return data ? (
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

      {get(data, 'Person.Guardian') && (
        <PersonInfo
          userId={get(data, 'id')}
          data={get(data, 'Person.Guardian')}
          title={`Guardian Information`}
          isGuardian
        />
      )}
    </>
  ) : null
}

const mapStateToProps = ({ user }) => ({
  data: get(user, 'data')
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)

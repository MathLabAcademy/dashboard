import PersonInfo from 'components/User/PersonInfo.js'
import TransactionInfo from 'components/User/TransactionInfo'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import AddGuardian from './AddGuardian'
import ContactInfo from 'components/User/ContactInfo'

function UserInfo({ userId, user }) {
  const isStudent = useMemo(() => /^student/.test(get(user, 'roleId')), [user])
  const hasGuardian = useMemo(() => get(user, 'Person.Guardian'), [user])

  return (
    <>
      <PersonInfo
        userId={userId}
        person={get(user, 'Person')}
        title={`Personal Information`}
        isStudent={isStudent}
      />

      <ContactInfo
        userId={userId}
        person={get(user, 'Person')}
        title={`Personal Contact Information`}
        isStudent={isStudent}
      />

      {isStudent ? (
        hasGuardian ? (
          <>
            <PersonInfo
              userId={userId}
              person={get(user, 'Person.Guardian')}
              title={`Guardian Information`}
              isGuardian
              isStudent={isStudent}
            />

            <ContactInfo
              userId={userId}
              person={get(user, 'Person.Guardian')}
              title={`Guardian Contact Information`}
              isGuardian
              isStudent={isStudent}
            />
          </>
        ) : (
          <AddGuardian
            userId={userId}
            person={get(user, 'Person')}
            title={`Add Guardian Information`}
          />
        )
      ) : null}

      <TransactionInfo userId={get(user, 'id')} title={`Transaction Info`} />
    </>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)

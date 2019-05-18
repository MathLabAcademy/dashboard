import PersonInfo from 'components/User/PersonInfo.js'
import TransactionInfo from 'components/User/TransactionInfo'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'

function UserInfo({ user }) {
  const showGuardian = useMemo(() => /^student/.test(get(user, 'roleId')), [
    user
  ])

  return (
    <>
      <PersonInfo
        userId={get(user, 'id')}
        person={get(user, 'Person')}
        title={`Personal Information`}
      />

      {showGuardian && (
        <PersonInfo
          userId={get(user, 'id')}
          person={get(user, 'Person.Guardian')}
          title={`Guardian Information`}
          isGuardian
        />
      )}

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

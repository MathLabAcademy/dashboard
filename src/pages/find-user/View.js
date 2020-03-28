import User from 'components/User/Main'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUser } from 'store/actions/users'

function UserView({ userId, user, getUser }) {
  useEffect(() => {
    if (!user && userId) {
      getUser(userId)
    }
  }, [user, getUser, userId])

  return userId ? <User userId={userId} /> : null
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId),
})

const mapDispatchToProps = {
  getUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView)

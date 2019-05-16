import User from 'components/User/Main.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUser } from 'store/actions/users.js'

function UserView({ userId, user, getUser }) {
  useEffect(() => {
    if (!user) getUser(userId)
  }, [user, getUser, userId])

  return <User userId={userId} />
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
)(UserView)

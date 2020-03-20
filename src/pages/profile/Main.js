import User from 'components/User/Main'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUser } from 'store/actions/users'

function Profile({ currentUserId, user, getUser }) {
  useEffect(() => {
    if (!user) getUser(currentUserId)
  }, [currentUserId, getUser, user])

  return <User userId={currentUserId} />
}

const mapStateToProps = ({ user, users }) => ({
  currentUserId: get(user.data, 'id'),
  user: get(users.byId, get(user.data, 'id'))
})

const mapDispatchToProps = {
  getUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

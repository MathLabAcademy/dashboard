import User from 'components/User/Main'
import React from 'react'
import { useParams } from 'react-router-dom'

function UserView({ onsite }) {
  const { userId } = useParams()

  return <User userId={userId} onsite={onsite} />
}

export default UserView

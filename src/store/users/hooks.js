import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from 'store/actions/users'

export function useUser(userId) {
  const user = useSelector((state) => state.users.byId[userId])

  const dispatch = useDispatch()
  useEffect(() => {
    if (!user) {
      dispatch(getUser(userId))
    }
  }, [dispatch, user, userId])

  return user
}

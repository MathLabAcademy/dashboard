import { useSelector } from 'react-redux'

export function useCurrentUser() {
  const user = useSelector((state) => state.user)
  return user
}

export function useCurrentUserData() {
  const userData = useSelector((state) => state.user.data)
  return userData
}

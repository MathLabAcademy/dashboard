import { useSelector } from 'react-redux'

export function useCurrentUser() {
  const user = useSelector((state) => state.user.data)

  return user
}

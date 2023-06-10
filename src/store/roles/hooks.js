import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { readAllRole } from '.'

export function useRoles() {
  const roles = useSelector((state) => state.roles)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(readAllRole())
  }, [dispatch])

  return roles
}

import { get } from 'lodash-es'
import { Children, cloneElement, useMemo } from 'react'
import { useCurrentUser } from 'store/currentUser/hooks'

function Permit({ userId, roles = '', children, ...props }) {
  const allowedRoles = useMemo(() => roles.split(',').filter(Boolean), [roles])

  const currentUser = useCurrentUser()

  let permitted = false

  if (!allowedRoles.length && !userId) permitted = true

  if (userId === get(currentUser, 'id')) permitted = true

  if (allowedRoles.includes(get(currentUser, 'roleId'))) permitted = true

  return permitted
    ? Children.toArray(children).map((child) => cloneElement(child, props))
    : null
}

export default Permit

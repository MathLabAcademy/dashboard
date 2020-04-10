import { get } from 'lodash-es'
import { Children, cloneElement } from 'react'
import { useCurrentUser } from 'store/currentUser/hooks'
import { emptyArray } from 'utils/defaults'

function Permit({ userId, roles = emptyArray, children, ...props }) {
  const currentUser = useCurrentUser()

  let permitted = false

  if (!roles.length && !userId) permitted = true

  if (userId === get(currentUser, 'id')) permitted = true

  if (roles.includes(get(currentUser, 'roleId'))) permitted = true

  return permitted
    ? Children.toArray(children).map((child) => cloneElement(child, props))
    : null
}

export default Permit

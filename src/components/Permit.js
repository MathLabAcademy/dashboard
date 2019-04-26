import { connect } from 'react-redux'

import get from 'lodash/get'

function Permit({ children, UserId, userId, userRoleId, ...roleIds }) {
  if (userId === String(UserId)) return children

  const allowedRoleIds = Object.keys(roleIds)

  if (!allowedRoleIds.length) return children

  const hasPermit = allowedRoleIds.includes(userRoleId)

  return hasPermit ? children : null
}

const mapStateToProps = ({ user }) => ({
  userId: get(user.data, 'User.id'),
  userRoleId: get(user.data, 'User.roleId')
})

export default connect(
  mapStateToProps,
  {} // without the empty {}, `dispatch` will be injected to props
)(Permit)

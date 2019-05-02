import { get } from 'lodash-es'
import { connect } from 'react-redux'

function Permit({ children, UserId, userId, userRoleId, ...roleIds }) {
  if (userId === UserId) return children

  const allowedRoleIds = Object.keys(roleIds)

  if (!allowedRoleIds.length) return children

  const hasPermit = allowedRoleIds.includes(userRoleId)

  return hasPermit ? children : null
}

const mapStateToProps = ({ user }) => ({
  userId: get(user.data, 'id'),
  userRoleId: get(user.data, 'roleId')
})

export default connect(
  mapStateToProps,
  {} // without the empty {}, `dispatch` will be injected to props
)(Permit)

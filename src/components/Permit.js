import { get } from 'lodash-es'
import { connect } from 'react-redux'

function Permit({ children, userId, user, ...roleIds }) {
  if (userId === get(user, 'id')) return children

  const allowedRoleIds = Object.keys(roleIds)

  if (!allowedRoleIds.length) return children

  const hasPermit = allowedRoleIds.includes(get(user, 'roleId'))

  return hasPermit ? children : null
}

const mapStateToProps = ({ user }) => ({
  user: user.data
})

export default connect(
  mapStateToProps,
  {} // without the empty {}, `dispatch` will be injected to props
)(Permit)

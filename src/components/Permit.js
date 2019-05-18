import { get } from 'lodash-es'
import { connect } from 'react-redux'

function Permit({ children, currentUser, userId, ...roleIds }) {
  const allowedRoleIds = Object.keys(roleIds)

  if (!allowedRoleIds.length && !userId) return children

  if (+userId === get(currentUser, 'id')) return children

  if (allowedRoleIds.includes(get(currentUser, 'roleId'))) return children

  return null
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.data
})

export default connect(
  mapStateToProps,
  {} // without the empty {}, `dispatch` will be injected to props
)(Permit)

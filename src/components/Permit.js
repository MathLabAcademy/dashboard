import { get } from 'lodash-es'
import { connect } from 'react-redux'

function Permit({ children, currentUser, userId, ...roleIds }) {
  const allowedRoleIds = Object.keys(roleIds)

  if (allowedRoleIds.includes(get(currentUser, 'roleId'))) return children

  if (!userId || +userId === get(currentUser, 'id')) return children

  return null
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.data
})

export default connect(
  mapStateToProps,
  {} // without the empty {}, `dispatch` will be injected to props
)(Permit)

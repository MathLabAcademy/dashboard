import { get } from 'lodash-es'
import { connect } from 'react-redux'

function DashIndex() {
  return null
}

const mapStateToProps = ({ user }) => ({
  userData: get(user, 'data')
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashIndex)

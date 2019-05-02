import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Message, Segment } from 'semantic-ui-react'

function DashIndex({ userData }) {
  return (
    !userData.verified && (
      <Segment>
        <Message warning>Account is not verified yet!</Message>
      </Segment>
    )
  )
}

const mapStateToProps = ({ user }) => ({
  userData: get(user, 'data')
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashIndex)

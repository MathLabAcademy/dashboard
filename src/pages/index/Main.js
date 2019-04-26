import React from 'react'

import { connect } from 'react-redux'

import get from 'lodash/get'

import { Segment, Message } from 'semantic-ui-react'

function DashIndex({ userData }) {
  return (
    <Segment>
      {!userData.verified && (
        <Message warning>Account is not verified yet!</Message>
      )}
    </Segment>
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

import { Redirect } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Grid, Header } from 'semantic-ui-react'
import Form from './Form.js'

function LogIn({ userStatus }) {
  return userStatus.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Grid columns={1} centered padded>
      <Grid.Column
        mobile={16}
        tablet={12}
        computer={8}
        style={{ maxWidth: '512px' }}
      >
        <Header as="h2" textAlign="center">
          Log In
        </Header>

        <Form />
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(LogIn)

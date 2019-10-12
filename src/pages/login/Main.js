import { Redirect } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Grid, Header } from 'semantic-ui-react'
import EmailLoginForm from './EmailLoginForm'
import PhoneLoginForm from './PhoneLoginForm'

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
          Login with Email
        </Header>

        <EmailLoginForm />

        <Header as="h2" textAlign="center">
          Login with Phone
        </Header>

        <PhoneLoginForm />
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(LogIn)

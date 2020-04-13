import { Stack } from '@chakra-ui/core'
import { Redirect } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import { usePageviewAnalytics } from 'utils/analytics'
import EmailLoginForm from './EmailLoginForm'
import PhoneLoginForm from './PhoneLoginForm'

function LogIn({ userStatus }) {
  usePageviewAnalytics()

  return userStatus.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Stack maxWidth="512px" mx="auto" px={2} py={8}>
      <Header as="h2" textAlign="center">
        Login with Phone
      </Header>

      <PhoneLoginForm />

      <Header as="h2" textAlign="center">
        Login with Email
      </Header>

      <EmailLoginForm />
    </Stack>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status'),
})

export default connect(mapStateToProps)(LogIn)

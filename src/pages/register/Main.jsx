import { Box, Button, Heading, Stack, Text } from '@chakra-ui/core'
import { Redirect } from 'components/Redirect'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { usePageviewAnalytics } from 'utils/analytics'
import Form from './Form'

function SuccessMessage({ data }) {
  if (!data) return null

  return (
    <Box borderWidth={1} shadow="md" p={6}>
      <Stack spacing={2} textAlign="center">
        <Heading as="h2">Hello {get(data, 'Person.fullName')}!</Heading>
        <Text fontSize={4}>You are successfully registered!</Text>
        {/* <p>
        We've sent a verification email to <strong>{get(data, 'email')}</strong>
        <br />
        Check your mailbox and verify your email address to get started!
        </p>
        <p>
        <em>Didn't receive the email?</em>
        <br />
        <em>
        Wait a few minutes and make sure you've checked your spam folder!
        </em>
      </p> */}
        <Text fontSize={4}>You can login to your account now!</Text>

        <Box mt={4}>
          <Button
            variantColor="blue"
            _hover={{ color: 'white' }}
            size="lg"
            as={Link}
            to={`/login`}
          >
            Log In
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

function Register({ userStatus }) {
  usePageviewAnalytics()

  const [data, setData] = useState(null)

  const onSuccess = useCallback((data) => {
    setData(data)
  }, [])

  return userStatus.authed ? (
    <Redirect to="/" />
  ) : (
    <Grid columns={1} centered padded>
      <Grid.Column mobile={16} tablet={12} style={{ maxWidth: '720px' }}>
        <Heading as="h2" textAlign="center" my={6}>
          {data ? '🎉 Register 🎉' : 'Register'}
        </Heading>

        <SuccessMessage data={data} />

        {!data && <Form onSuccess={onSuccess} />}
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status'),
})

export default connect(mapStateToProps)(Register)

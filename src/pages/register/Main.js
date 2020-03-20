import { Link, Redirect } from '@reach/router'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Grid, Header, Segment } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name'
import Form from './Form'

function SuccessMessage({ data }) {
  if (!data) return null

  return (
    <Container text as={Segment} textAlign="center">
      <h2>Hello {getPersonName(get(data, 'Person'))}!</h2>
      <p>You are successfully registered!</p>
      <p>
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
      </p>
      <p>You can login to your account now!</p>
      <p>
        <Button color="blue" as={Link} to={`/login`}>
          Log In
        </Button>
      </p>
    </Container>
  )
}

function Register({ userStatus }) {
  const [data, setData] = useState(null)

  const onSuccess = useCallback(data => {
    setData(data)
  }, [])

  return userStatus.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Grid columns={1} centered padded>
      <Grid.Column mobile={16} tablet={12} style={{ maxWidth: '840px' }}>
        <Header as="h2" textAlign="center">
          Register
        </Header>

        <SuccessMessage data={data} />

        {!data && <Form onSuccess={onSuccess} />}
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(Register)

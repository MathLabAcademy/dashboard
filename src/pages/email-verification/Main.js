import { Link, Redirect } from '@reach/router'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Segment } from 'semantic-ui-react'
import api from 'utils/api.js'

function EmailVerification({ personId, token, userStatus }) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  const tryToVerify = useCallback(async () => {
    const { error } = await api('/users/action/verify-email', {
      method: 'POST',
      body: {
        personId,
        token
      }
    })

    setLoading(false)

    if (error) {
      if (error.errors) {
        setError(
          error.errors
            .map(({ param, message }) => `${param}: ${message}`)
            .join(', ')
        )
      } else if (error.message) {
        setError(error.message)
      } else {
        console.error(error)
        setError('Verification Error!')
      }
    } else {
      setVerified(true)
    }
  }, [personId, token])

  useEffect(() => {
    if (!userStatus.authed) {
      setTimeout(() => tryToVerify(), 750)
    }
  }, [tryToVerify, userStatus.authed])

  return userStatus.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Container text textAlign="center" as={Segment}>
      {loading && <p>Trying to verify your email address...</p>}
      {verified && (
        <>
          <p>Your email is verified! You can Log In now...</p>
          <p>
            <Button color="blue" as={Link} to="/login">
              Log In
            </Button>
          </p>
        </>
      )}
      {error && (
        <>
          <p>Failed to verify your email address!</p>
          <p>
            Error: <em className="red text">{error}</em>
          </p>
          <p>
            <Button as={Link} to="/">
              Go Back
            </Button>
          </p>
        </>
      )}
    </Container>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(EmailVerification)

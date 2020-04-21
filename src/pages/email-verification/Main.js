import { Link } from '@reach/router'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Segment } from 'semantic-ui-react'
import { trackEventAnalytics, usePageviewAnalytics } from 'utils/analytics'
import api from 'utils/api'

function EmailVerification({ token, userStatus, forGuardian }) {
  usePageviewAnalytics()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  const tryToVerify = useCallback(async () => {
    const url = forGuardian
      ? '/users/action/verify-guardian-email'
      : '/users/action/verify-email'

    const { error } = await api(url, {
      method: 'POST',
      body: {
        encodedToken: token,
      },
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
      trackEventAnalytics({
        category: 'User',
        action: `Verified Email${forGuardian ? ' (Guardian)' : ''}`,
      })

      setVerified(true)
    }
  }, [token, forGuardian])

  useEffect(() => {
    setTimeout(() => tryToVerify(), 750)
  }, [tryToVerify])

  console.log(userStatus)

  return (
    <Container text textAlign="center" as={Segment}>
      {loading && <p>Trying to verify your email address...</p>}
      {verified && (
        <>
          <p>Your email is verified!</p>
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
  userStatus: get(user, 'status'),
})

export default connect(mapStateToProps)(EmailVerification)

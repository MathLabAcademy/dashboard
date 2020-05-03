import React, { useCallback } from 'react'
import { Button } from 'rebass'
import { useCurrentUserData } from 'store/currentUser/hooks'

function LoginButton() {
  const [{ authStatus }] = useCurrentUserData()

  const login = useCallback(() => {
    window.FB.login(() => {}, {
      scope: `email`,
    })
  }, [])

  return (
    <>
      {authStatus.status === 'unknown' && (
        <Button backgroundColor="#365899" fontWeight="normal" onClick={login}>
          Login with Facebook
        </Button>
      )}
    </>
  )
}

export default LoginButton

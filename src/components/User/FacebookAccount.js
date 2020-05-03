import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/core'
import { handleAPIError } from 'components/HookForm/helpers'
import Permit from 'components/Permit'
import loadjs from 'loadjs'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { connectFacebookAccount } from 'store/currentUser'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'

function loadFacebookJavaScriptSDK() {
  if (!loadjs.isDefined('facebook-jssdk')) {
    loadjs(['https://connect.facebook.net/en_US/sdk.js'], 'facebook-jssdk', {
      before: (_path, scriptEl) => {
        scriptEl.defer = true
      },
      success: () => {
        console.log('Facebook JavaScript SDK successfully loaded!')
      },
      error: (depsNotFound) => {
        console.error('Facebook JavaScript SDK failed to load!', depsNotFound)
      },
    })
  }
}

const requiredScopes = ['public_profile', 'email']

function ConnectFacebookAccount() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authResponse, setAuthResponse] = useState(null)
  const [insufficientPermission, setInsufficientPermission] = useState(false)

  const handleFacebookLoginStatus = useCallback(({ status, authResponse }) => {
    if (status !== 'connected') {
      console.warn(`Facebook login status: ${status}`)
      return
    }

    setLoading(true)

    window.FB.api('/me/permissions', {}, (response) => {
      const grantedScopes = response.data.reduce(
        (scopes, { permission, status }) => {
          if (status === 'granted') {
            scopes.push(permission)
          }
          return scopes
        },
        []
      )

      setAuthResponse(authResponse)
      setInsufficientPermission(
        !requiredScopes.every((scope) => grantedScopes.includes(scope))
      )

      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (typeof window.fbAsyncInit === 'undefined') {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          version: 'v6.0',
          xfbml: false,
        })

        window.FB.getLoginStatus(handleFacebookLoginStatus)
        setInitialized(true)
      }
    }

    loadFacebookJavaScriptSDK()
  }, [handleFacebookLoginStatus])

  const initiateFacebookLogin = useCallback(() => {
    setLoading(true)
    window.FB.login(handleFacebookLoginStatus, {
      scope: requiredScopes.join(','),
      auth_type: insufficientPermission ? 'rerequest' : null,
    })
  }, [handleFacebookLoginStatus, insufficientPermission])

  const toast = useToast()
  const dispatch = useDispatch()
  useEffect(() => {
    if (authResponse && !insufficientPermission) {
      dispatch(
        connectFacebookAccount({
          facebookUserId: authResponse.userID,
          facebookAccessToken: authResponse.accessToken,
        })
      )
        .then(() => {
          trackEventAnalytics({
            category: 'User',
            action: 'Connected Facebook Account',
          })
        })
        .catch((error) => {
          handleAPIError(error, { toast })
        })
    }
  }, [authResponse, dispatch, insufficientPermission, toast])

  return (
    <>
      <Stack spacing={4} textAlign="center" p={4}>
        <Button
          size="lg"
          borderRadius="0.5rem"
          variantColor="facebook"
          isLoading={loading || !initialized}
          isDisabled={loading || !initialized}
          onClick={initiateFacebookLogin}
        >
          Connect Facebook Account
        </Button>

        {authResponse && insufficientPermission && (
          <Box>
            <Alert status="warning" variant="top-accent">
              <AlertIcon />
              <Text>
                Looks like you didn't give us permission to read your{' '}
                <strong>Public Profile</strong> and <strong>Email</strong> on
                Facebook. Please, try again!
              </Text>
            </Alert>
          </Box>
        )}
      </Stack>
    </>
  )
}

function FacebookAccount({ userId }) {
  const currentUser = useCurrentUserData()

  if (currentUser.id !== userId) {
    return null
  }

  const facebookAccount = get(currentUser, 'facebookAccount')
  const facebookName = get(facebookAccount, 'data.name')
  const facebookEmail = get(facebookAccount, 'email')

  return (
    <Permit userId={userId}>
      <Stack borderWidth={1} shadow="md" p={4} spacing={2} height="100%">
        <Box>
          <Heading fontSize={4}>Facebook Account</Heading>
        </Box>
        <Box>
          {facebookAccount ? (
            <Stack spacing={2} fontSize={2}>
              <br />
              <Text>
                <strong>Name:</strong> {facebookName}
              </Text>
              {facebookEmail && (
                <Text>
                  <strong>Email:</strong> {facebookEmail}
                </Text>
              )}
            </Stack>
          ) : (
            <ConnectFacebookAccount />
          )}
        </Box>
      </Stack>
    </Permit>
  )
}

export default FacebookAccount

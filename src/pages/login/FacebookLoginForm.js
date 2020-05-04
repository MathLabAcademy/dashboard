import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/core'
import { handleAPIError } from 'components/HookForm/helpers'
import { useFacebookSdk } from 'hooks/facebookSdk'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginWithFacebook } from 'store/currentUser'
import { useCurrentUser } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import { getFacebookPermissions, initiateFacebookLogin } from 'utils/facebook'

const requiredScopes = ['public_profile', 'email']

function FacebookLoginForm({ isOpen }) {
  const { initialized } = useFacebookSdk({ paused: !isOpen })

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const toast = useToast()
  const dispatch = useDispatch()

  const handleLoginWithFacebook = useCallback(async () => {
    setLoading(true)
    try {
      const { authResponse } = await initiateFacebookLogin({
        scope: requiredScopes.join(','),
        authType: status === 'need_more_permission' ? 'rerequest' : null,
      })
      const permissions = await getFacebookPermissions()
      const hasSufficientPermission = requiredScopes.every(
        (scope) => permissions[scope] === 'granted'
      )
      if (!hasSufficientPermission) {
        return setStatus('need_more_permission')
      }
      await dispatch(
        loginWithFacebook({
          facebookUserId: authResponse.userID,
          facebookAccessToken: authResponse.accessToken,
        })
      )

      trackEventAnalytics({
        category: 'User',
        action: 'Logged In with Facebook',
      })
    } catch (err) {
      handleAPIError(err, { toast })
      setLoading(false)
    }
  }, [dispatch, status, toast])

  const { status: userStatus } = useCurrentUser()

  return (
    <>
      {!userStatus.authed && (
        <Stack spacing={4} textAlign="center" p={4}>
          <Button
            size="lg"
            borderRadius="0.5rem"
            variantColor="facebook"
            isLoading={loading || !initialized}
            isDisabled={loading || !initialized}
            onClick={handleLoginWithFacebook}
          >
            Login with Facebook
          </Button>

          {status === 'need_more_permission' && (
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
      )}
    </>
  )
}

export default FacebookLoginForm

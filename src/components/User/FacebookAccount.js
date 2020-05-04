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
import { useFacebookSdk } from 'hooks/facebookSdk'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { connectFacebookAccount } from 'store/currentUser'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import { getFacebookPermissions, initiateFacebookLogin } from 'utils/facebook'

const requiredScopes = ['public_profile', 'email']

function ConnectFacebookAccount() {
  const { initialized } = useFacebookSdk()

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const toast = useToast()
  const dispatch = useDispatch()

  const handleConnectFacebookAccount = useCallback(async () => {
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
        connectFacebookAccount({
          facebookUserId: authResponse.userID,
          facebookAccessToken: authResponse.accessToken,
        })
      )
      trackEventAnalytics({
        category: 'User',
        action: 'Connected Facebook Account',
      })
    } catch (err) {
      handleAPIError(err, { toast })
      setLoading(false)
    }
  }, [dispatch, status, toast])

  return (
    <>
      <Stack spacing={4} textAlign="center" p={4}>
        <Button
          size="lg"
          borderRadius="0.5rem"
          variantColor="facebook"
          isLoading={loading || !initialized}
          isDisabled={loading || !initialized}
          onClick={handleConnectFacebookAccount}
        >
          Connect Facebook Account
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

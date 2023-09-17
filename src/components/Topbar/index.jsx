import { Button, Stack, Text } from '@chakra-ui/core'
import { useMatch } from 'react-router-dom'
import NavLink from 'components/Link/NavLink'
import { get } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { Box, Flex } from 'reflexbox'
import { useCurrentUser } from 'store/currentUser/hooks'
import CurrentUserPopover from './CurrentUserPopover'
import WebNotificationButton from './WebNotificationButton'

function Topbar() {
  const { data: userData, status: userStatus } = useCurrentUser()

  const isDobToday = useMemo(() => {
    const dob = get(userData, 'Person.dob', null)

    if (!dob) return false

    const date = new Date(dob)
    const today = new Date()

    return (
      date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
    )
  }, [userData])

  const isLoginPage = useMatch('/login')

  return (
    <Flex
      as="header"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        position: 'fixed',
        top: 0,
        zIndex: 500 || 'sticky',
        bg: 'white',
        left: 0,
        right: 0,
        borderBottomWidth: '1px',
        width: '100%',
        height: 'navbar',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.135571)',
      }}
      px={8}
    >
      <Box>
        <NavLink to="/" display="block">
          <Text fontSize={2} fontWeight="bold" color="gray.600">
            MathLab
          </Text>
        </NavLink>
      </Box>

      {isDobToday && (
        <Box>
          <span role="img" aria-label="Confetti Ball">
            🎊
          </span>
          <Text display={['none', 'none', 'inline-block']}>
            {' '}
            Happy Birthday {get(userData, 'Person.shortName')}!{' '}
          </Text>
          <span role="img" aria-label="Birthday Cake">
            🎂
          </span>
          <Text display={['none', 'none', 'inline-block']}>
            {' '}
            Have a blast!{' '}
          </Text>
          <span role="img" aria-label="Party Popper">
            🎉
          </span>
        </Box>
      )}

      <Stack isInline spacing={2} alignItems="center">
        {userStatus.authed && <WebNotificationButton />}

        {!userStatus.loading && !userStatus.authed ? (
          <Box>
            {isLoginPage ? (
              <Button as={NavLink} to="/register">
                Register
              </Button>
            ) : (
              <Button as={NavLink} to="/login">
                Log In
              </Button>
            )}
          </Box>
        ) : userStatus.authed ? (
          <CurrentUserPopover />
        ) : null}
      </Stack>
    </Flex>
  )
}

export default memo(Topbar)

import { Button, Text } from '@chakra-ui/core'
import { Match } from '@reach/router'
import NavLink from 'components/Link/NavLink'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { Box, Flex } from 'reflexbox'
import CurrentUserPopover from './CurrentUserPopover'

function Topbar() {
  const userStatus = useSelector((state) => state.user.status)

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
      <Box>
        {!userStatus.loading && !userStatus.authed ? (
          <Box>
            <Match path="/login">
              {({ match }) =>
                match ? (
                  <Button as={NavLink} to="/register">
                    Register
                  </Button>
                ) : (
                  <Button as={NavLink} to="/login">
                    Log In
                  </Button>
                )
              }
            </Match>
          </Box>
        ) : userStatus.authed ? (
          <CurrentUserPopover />
        ) : null}
      </Box>
    </Flex>
  )
}

export default memo(Topbar)

import { Box, Button, Heading, IconButton, Stack, Text } from '@chakra-ui/core'
import Gravatar from 'components/Gravatar'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { connect } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import { getUser } from 'store/actions/users'
import AddBalance from './AddBalance'
import AdjustBalance from './AdjustBalance'
import ChangePassword from './ChangePassword'
import Info from './Info'
import { UserRole } from './Role'
import { useUser } from 'store/users/hooks'

function User({ userId, getUser }) {
  const user = useUser(userId)

  const refreshUser = useCallback(() => {
    getUser(userId)
  }, [getUser, userId])

  const email = get(user, 'Person.email') || get(user, 'Person.emailTrx')

  return (
    <Permit roles="teacher,analyst" userId={userId}>
      <Stack
        alignItems="center"
        borderWidth={1}
        boxShadow="md"
        flexWrap="wrap"
        isInline
        justifyContent="space-between"
        mb={4}
        p={3}
        spacing={6}
      >
        <Box>
          {email && <Gravatar email={email} params={{ d: 'robohash' }} />}
        </Box>
        <Box flexGrow={1}>
          <Stack
            flexWrap="wrap"
            isInline
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flexGrow={1}>
              <Box mb={3}>
                <Heading as="h3" fontSize={3}>
                  {get(user, 'Person.fullName')}
                </Heading>
                <Text color="gray.500">{get(user, 'Person.email')}</Text>

                <UserRole user={user} />
              </Box>
              <Permit userId={userId}>
                <Button as={Link} to={`change-password`}>
                  Change Password
                </Button>
              </Permit>
            </Box>
            <Box>
              <IconButton icon={FaSyncAlt} onClick={refreshUser} />
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Routes>
        <Route
          element={<Info userId={userId} refreshUser={refreshUser} />}
          path="/"
        />
        <Route element={<AddBalance userId={userId} />} path="add-balance" />
        <Route
          element={<AdjustBalance userId={userId} />}
          path="adjust-balance"
        />
        <Route
          element={<ChangePassword userId={userId} />}
          path="change-password"
        />
      </Routes>
    </Permit>
  )
}

const mapDispatchToProps = {
  getUser,
}

export default connect(null, mapDispatchToProps)(User)

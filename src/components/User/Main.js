import {
  Box,
  Button,
  Heading,
  IconButton,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/core'
import { FaSyncAlt } from 'react-icons/fa'
import { Link, Router } from '@reach/router'
import Gravatar from 'components/Gravatar'
import Permit from 'components/Permit'
import { capitalize, get } from 'lodash-es'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { getUser } from 'store/actions/users'
import AddBalance from './AddBalance'
import AdjustBalance from './AdjustBalance'
import ChangePassword from './ChangePassword'
import Info from './Info'

const labeledRoles = ['teacher', 'assistant']

function User({ userId, user, getUser }) {
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

                {labeledRoles.includes(get(user, 'roleId')) && (
                  <Tag variant="solid" size="md">
                    {capitalize(get(user, 'roleId'))}
                  </Tag>
                )}
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

      <Router>
        <Info path="/" userId={userId} refreshUser={refreshUser} />
        <AddBalance path="add-balance" userId={userId} />
        <AdjustBalance path="adjust-balance" userId={userId} />
        <ChangePassword path="change-password" userId={userId} />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId),
})

const mapDispatchToProps = {
  getUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(User)

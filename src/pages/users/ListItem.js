import { Link } from '@reach/router'
import { Box, Button, Heading, Stack, Tag, Text } from '@chakra-ui/core'
import { capitalize, get } from 'lodash-es'
import React from 'react'
import { useUser } from 'store/users/hooks'

const labeledRoles = ['teacher']

function UserListItem({ id, ...props }) {
  const data = useUser(id)

  return (
    <Stack
      {...props}
      isInline
      borderRadius="0.25em"
      borderWidth={1}
      boxShadow="sm"
      justifyContent="space-between"
      alignItems="center"
      p={4}
    >
      <Box>
        <Heading as="h4" fontSize={2}>
          {get(data, 'Person.fullName')}
          {labeledRoles.includes(get(data, 'roleId')) && (
            <Tag variant="solid" size="sm" ml={2}>
              {capitalize(get(data, 'roleId'))}
            </Tag>
          )}
        </Heading>
        <Text color="gray.500">{get(data, 'Person.email')}</Text>
      </Box>
      <Box>
        <Button as={Link} to={`${id}`}>
          Open
        </Button>
      </Box>
    </Stack>
  )
}

export default UserListItem

import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Box } from 'reflexbox'
import { logOut } from 'store/currentUser'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'

function CurrentUserPopover() {
  const currentUser = useCurrentUserData()

  const dispatch = useDispatch()
  const logoutUser = useCallback(async () => {
    await dispatch(logOut())

    trackEventAnalytics({
      category: 'User',
      action: 'Logged Out',
    })
  }, [dispatch])

  return currentUser ? (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">{get(currentUser, 'Person.fullName')}</Button>
      </PopoverTrigger>
      <PopoverContent zIndex={4}>
        <PopoverArrow />
        <PopoverBody>
          {get(currentUser, 'Person.email') && (
            <Box>
              <Text as="strong">Email: </Text>
              {get(currentUser, 'Person.email')}
            </Box>
          )}
          {get(currentUser, 'facebookAccount') && (
            <Box>
              <Text as="strong">Facebook: </Text>
              Connected
            </Box>
          )}
          {get(currentUser, 'Person.phone') && (
            <Box>
              <Text as="strong">Phone: </Text>
              {get(currentUser, 'Person.phone', '').slice(-11)}
            </Box>
          )}
        </PopoverBody>
        <PopoverFooter>
          <Button width="full" variantColor="red" onClick={logoutUser}>
            Logout!
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ) : null
}

export default CurrentUserPopover

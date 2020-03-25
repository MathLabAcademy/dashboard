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
import { useCurrentUser } from 'store/currentUser/hooks'

function CurrentUserPopover() {
  const user = useCurrentUser()

  const dispatch = useDispatch()
  const logoutUser = useCallback(() => {
    dispatch(logOut())
  }, [dispatch])

  return user ? (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">{get(user, 'Person.fullName')}</Button>
      </PopoverTrigger>
      <PopoverContent zIndex={4}>
        <PopoverArrow />
        <PopoverBody>
          <Box>
            <Text as="strong">Phone: </Text>
            {get(user, 'Person.phone')}
          </Box>
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

import { Box, Button, Text } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import React, { useMemo } from 'react'
import { MdNotificationsActive } from 'react-icons/md'
import { useWebNotifications } from 'store/notifications/hooks'

function WebNotificationButton() {
  const webNotifications = useWebNotifications()

  const unreadCount = useMemo(() => {
    return webNotifications.allIds.filter(
      (id) => !webNotifications.byId[id].read
    ).length
  }, [webNotifications.allIds, webNotifications.byId])

  return unreadCount ? (
    <Button
      variant="ghost"
      as={Link}
      to="/notifications/web"
      position="relative"
    >
      <Text
        as="span"
        display="block"
        position="absolute"
        right="0"
        bottom="0"
        bg="primary"
        color="white"
        borderRadius="full"
        p="2px"
        textAlign="center"
        fontSize="12px"
      >
        {unreadCount}
      </Text>
      <Box as={MdNotificationsActive} size="1.5rem" />
    </Button>
  ) : null
}

export default WebNotificationButton

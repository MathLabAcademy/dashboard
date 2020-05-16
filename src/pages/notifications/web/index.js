import { Box, Button, Stack, Text } from '@chakra-ui/core'
import { Link } from '@reach/router'
import React, { useCallback } from 'react'
import { MdCheck } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { markWebNotificationAsRead } from 'store/notifications'
import { useWebNotifications } from 'store/notifications/hooks'

function WebNotificationItem({ data: { id, topic, data, read }, ...props }) {
  const dispatch = useDispatch()
  const onMarkRead = useCallback(async () => {
    await dispatch(markWebNotificationAsRead(id))
  }, [dispatch, id])

  return (
    <Stack
      isInline
      justifyContent="space-between"
      alignItems="center"
      shadow="md"
      borderWidth={1}
      p={4}
      fontSize={2}
      opacity={read ? 0.6 : 1}
      {...props}
    >
      {topic === 'course-video-comment' ? (
        <Link
          to={`/courses/${data.courseId}/videos/${data.videoId}#comment-${data.commentId}`}
        >
          <Text>
            {data.userName}{' '}
            {data.event === 'new'
              ? `commented on the ${data.videoName} video on ${data.courseName} Course!`
              : data.event === 'reply'
              ? `replied on a comment you are subscribed to on the ${data.videoName} video on ${data.courseName} Course!`
              : ''}
          </Text>
        </Link>
      ) : null}
      <Button isDisabled={read} onClick={onMarkRead}>
        <Box as={MdCheck} size={6} />
      </Button>
    </Stack>
  )
}

function WebNotificationsPage() {
  const webNotifications = useWebNotifications()

  return (
    <Box p={4}>
      <Stack spacing={4}>
        {webNotifications.allIds.map((id) => (
          <WebNotificationItem key={id} data={webNotifications.byId[id]} />
        ))}
      </Stack>
    </Box>
  )
}

export default WebNotificationsPage

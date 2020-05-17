import { Box, Button, Stack, Text } from '@chakra-ui/core'
import { Link } from '@reach/router'
import React, { useCallback } from 'react'
import { MdCheck, MdComment } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { markWebNotificationAsRead } from 'store/notifications'
import { useWebNotifications } from 'store/notifications/hooks'
import { trackEventAnalytics } from 'utils/analytics'

function WebNotificationItem({ data: { id, topic, data, read }, ...props }) {
  const dispatch = useDispatch()
  const onMarkRead = useCallback(async () => {
    await dispatch(markWebNotificationAsRead(id))

    trackEventAnalytics({
      category: 'User',
      action: 'Marked Web Notification as Read',
    })
  }, [dispatch, id])

  return (
    <Stack
      isInline
      justifyContent="space-between"
      alignItems="center"
      shadow="md"
      borderWidth={1}
      p={4}
      fontSize={3}
      opacity={read ? 0.6 : 1}
      {...props}
    >
      {topic === 'course-video-comment' ? (
        <Link
          to={`/courses/${data.courseId}/videos/${data.videoId}#comment-${data.commentId}`}
        >
          <Stack isInline spacing={4} alignItems="center">
            <Box as={MdComment} />
            <Text>
              {data.userName}{' '}
              {data.event === 'new'
                ? `commented on the ${data.videoName} video on ${data.courseName} Course!`
                : data.event === 'reply'
                ? `replied on a comment you are subscribed to on the ${data.videoName} video on ${data.courseName} Course!`
                : ''}
            </Text>
          </Stack>
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
      {webNotifications.allIds.length === 0 && (
        <Box p={4}>
          <Text fontSize={4}>No new notifications!</Text>
        </Box>
      )}

      <Stack spacing={4}>
        {webNotifications.allIds.map((id) => (
          <WebNotificationItem key={id} data={webNotifications.byId[id]} />
        ))}
      </Stack>
    </Box>
  )
}

export default WebNotificationsPage

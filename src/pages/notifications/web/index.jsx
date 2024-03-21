import { Box, Button, Stack, Text } from '@chakra-ui/core'
import { DateTime } from 'luxon'
import React, { useCallback } from 'react'
import { MdCheck, MdComment } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
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
      ) : topic === 'course-new-cqexam' ? (
        <Link to={`/courses/${data.courseId}/cqexams`}>
          <Stack isInline spacing={4} alignItems="center">
            <Box as={MdComment} />
            <Text>
              New CQ Exam (<em>{data.cqExamName}</em>) is added on your{' '}
              <em>{data.courseName}</em> course for{' '}
              {DateTime.fromISO(data.cqExamDate).toLocaleString(
                DateTime.DATETIME_MED
              )}
              !
            </Text>
          </Stack>
        </Link>
      ) : topic === 'course-new-mcqexam' ? (
        <Link to={`/courses/${data.courseId}/mcqexams`}>
          <Stack isInline spacing={4} alignItems="center">
            <Box as={MdComment} />
            <Text>
              New MCQ Exam (<em>{data.mcqExamName}</em>) is added on your{' '}
              <em>{data.courseName}</em> course for{' '}
              {DateTime.fromISO(data.mcqExamDate).toLocaleString(
                DateTime.DATETIME_MED
              )}
              !
            </Text>
          </Stack>
        </Link>
      ) : topic === 'course-new-video' ? (
        <Link to={`/courses/${data.courseId}/videos`}>
          <Stack isInline spacing={4} alignItems="center">
            <Box as={MdComment} />
            <Text>
              New video{' '}
              {data.videoName && (
                <>
                  (<em>{data.videoName}</em>)
                </>
              )}{' '}
              uploaded on your <em>{data.courseName}</em> course!
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

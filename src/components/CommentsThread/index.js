import {
  Avatar,
  Box,
  Button,
  Flex,
  PseudoBox,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from '@chakra-ui/core'
import { handleAPIError } from 'components/HookForm/helpers'
import NavLink from 'components/Link/NavLink'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MdNotifications, MdNotificationsOff } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { subscribeToComment, unsubscribeFromComment } from 'store/comments'
import { useComment } from 'store/comments/hooks'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import gravatarUrl from 'utils/gravatar-url'

function removeLocationHash() {
  // https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r/5298684#5298684

  let scrollV
  let scrollH
  let loc = window.location
  if ('pushState' in window.history)
    window.history.pushState('', document.title, loc.pathname + loc.search)
  else {
    // Prevent scrolling by storing the page's current scroll offset
    scrollV = document.body.scrollTop
    scrollH = document.body.scrollLeft

    loc.hash = ''

    // Restore the scroll offset, should be flicker free
    document.body.scrollTop = scrollV
    document.body.scrollLeft = scrollH
  }
}

function CommentSubscriptionButton({ comment, toast }) {
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const onClick = useCallback(async () => {
    try {
      setLoading(true)
      await dispatch(
        comment.isSubscribed
          ? unsubscribeFromComment(comment.id)
          : subscribeToComment(comment.id)
      )
    } catch (err) {
      handleAPIError(err, { toast })
    }
    setLoading(false)
  }, [comment.id, comment.isSubscribed, dispatch, toast])

  if (comment.depth !== 0) {
    return null
  }

  return (
    <Tooltip label={comment.isSubscribed ? 'Unsubscribe!' : 'Subscribe!'}>
      <Button
        variant="ghost"
        isLoading={loading}
        isDisabled={loading}
        onClick={onClick}
      >
        <PseudoBox
          size="2rem"
          color={comment.isSubscribed ? 'blue.500' : 'gray.500'}
          as={comment.isSubscribed ? MdNotifications : MdNotificationsOff}
          _hover={{
            color: comment.isSubscribed ? 'red.500' : 'green.500',
          }}
          _focus={{
            color: comment.isSubscribed ? 'red.500' : 'green.500',
          }}
        />
      </Button>
    </Tooltip>
  )
}

function CommentBox({
  textRef,
  replyToCommentId,
  setReplyToCommentId,
  addComment,
  ...props
}) {
  const toast = useToast()

  const currentUser = useCurrentUserData()
  const parentComment = useComment(replyToCommentId)

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    setLoading(true)
    try {
      if (!textRef.current.value.trim()) {
        throw new Error("Don't you wanna write something? ¯\\_(ツ)_/¯")
      }

      const parentId = get(parentComment, 'id', null)

      await addComment({
        type: 'plain',
        text: textRef.current.value,
        parentId,
      })

      trackEventAnalytics({
        category: 'User',
        action: parentId ? `Commented on Video` : `Replied to Comment on Video`,
      })

      textRef.current.value = ''
      setLoading(false)
      toast({
        title: parentId
          ? `Replied to ${get(parentComment, 'user.person.shortName')}`
          : 'Comment added!',
        duration: 2000,
        isClosable: true,
        status: 'success',
      })
      setReplyToCommentId()
    } catch (err) {
      setLoading(false)
      let title = 'Comment Error!'
      let description = ''
      if (err.errors) {
        description = err.errors
          .map((error) => `${error.param}: ${error.message}`)
          .join(', ')
      } else if (err.message) {
        title = err.message
      } else {
        console.error(err)
      }
      toast({
        title,
        description,
        duration: 5000,
        isClosable: true,
        status: 'error',
      })
    }
  }, [addComment, parentComment, setReplyToCommentId, textRef, toast])

  return (
    <Stack {...props}>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex flexDirection="row" px={2}>
          <Box mr={3} opacity="0.6">
            <Avatar
              name={get(currentUser, 'Person.shortName')}
              src={gravatarUrl(get(currentUser, 'Person.email'))}
              size="lg"
            />
          </Box>
          <Stack justifyContent="center" spacing={1}>
            <Text fontSize={3} fontWeight="bold" opacity="0.6">
              {get(currentUser, 'Person.shortName')}{' '}
              <Permit roles="teacher">
                <Text as="span" fontSize="0.8em">
                  (ID:{' '}
                  <NavLink to={`/users/${get(currentUser, 'id')}`}>
                    {get(currentUser, 'id')}
                  </NavLink>
                  )
                </Text>
              </Permit>
            </Text>
            <Text fontSize={2} fontWeight="bold">
              {replyToCommentId ? 'Reply to comment' : 'Write a comment'}
            </Text>
          </Stack>
        </Flex>
        {replyToCommentId && (
          <Box>
            <Button
              size="md"
              shadow="sm"
              variantColor="yellow"
              onClick={() => setReplyToCommentId(null)}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Flex>
      <Box position="relative">
        <Textarea
          ref={textRef}
          size="sm"
          resize="vertical"
          p={4}
          fontSize={2}
          borderWidth={2}
          borderRadius="0.25rem"
        />
        <Button
          zIndex="99999"
          position="absolute"
          bottom="-6px"
          right="-6px"
          size="md"
          shadow="sm"
          variant="solid"
          variantColor="green"
          onClick={onSubmit}
          isDisabled={loading}
          isLoading={loading}
          _disabled={{ opacity: 1 }}
        >
          {replyToCommentId
            ? `Reply to ${get(parentComment, 'user.person.shortName')}`
            : 'Comment on Video'}
        </Button>
      </Box>
    </Stack>
  )
}

function CommentItem({
  id,
  replyToCommentId,
  setReplyToCommentId,
  commentBoxTextRef,
  addComment,
  locationHash,
  ...props
}) {
  const comment = useComment(id)

  const depth = get(comment, 'depth')
  const childIds = get(comment, 'childIds')

  return (
    <Stack id={`comment-${id}`} spacing={0} {...props}>
      <Stack
        p={4}
        mb={0}
        borderColor="primary"
        borderStyle="dashed"
        borderWidth={locationHash === `comment-${id}` ? 1 : 0}
      >
        <Stack
          isInline
          justifyContent="space-between"
          alignItems="center"
          px={2}
        >
          <Stack isInline>
            <Box mr={3}>
              <Avatar
                name={get(comment, 'user.person.shortName')}
                src={gravatarUrl(get(comment, 'user.person.email'))}
                size="lg"
              />
            </Box>
            <Stack justifyContent="center" spacing={1}>
              <Text fontSize={3} fontWeight="bold">
                {get(comment, 'user.person.shortName')}{' '}
                <Permit roles="teacher">
                  <Text as="span" fontSize="0.8em">
                    (ID:{' '}
                    <NavLink to={`/users/${get(comment, 'user.id')}`}>
                      {get(comment, 'user.id')}
                    </NavLink>
                    )
                  </Text>
                </Permit>
              </Text>
              <Text>
                {DateTime.fromISO(get(comment, 'created')).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </Text>
            </Stack>
          </Stack>
          <Box>
            <CommentSubscriptionButton comment={comment} />
          </Box>
        </Stack>

        <Box
          borderWidth={1}
          shadow="sm"
          borderRadius="0.25rem"
          p={4}
          position="relative"
        >
          <Text fontSize={2}>{get(comment, 'text')}</Text>
          {depth < 1 && replyToCommentId !== id && (
            <Button
              position="absolute"
              bottom="-1rem"
              right="-0.25rem"
              size="md"
              shadow="sm"
              variant="solid"
              variantColor="blue"
              onClick={() => setReplyToCommentId(id)}
            >
              Reply
            </Button>
          )}
        </Box>
      </Stack>

      <Stack ml={`${3 * (depth + 1)}rem`} spacing={2} position="relative">
        {childIds &&
          childIds.map((id) => (
            <CommentItem key={id} id={id} locationHash={locationHash} />
          ))}

        {replyToCommentId === id ? (
          <CommentBox
            textRef={commentBoxTextRef}
            replyToCommentId={replyToCommentId}
            setReplyToCommentId={setReplyToCommentId}
            addComment={addComment}
          />
        ) : depth === 0 && childIds && childIds.length > 0 ? (
          <Button
            position="absolute"
            bottom="-1rem"
            right="-0.25rem"
            size="sm"
            shadow="sm"
            variant="solid"
            variantColor="blue"
            onClick={() => setReplyToCommentId(id)}
          >
            Reply to {get(comment, 'user.person.shortName')}'s Comment
          </Button>
        ) : null}
      </Stack>
    </Stack>
  )
}

function CommentsThread({ comments, addComment }) {
  const locationHash = useMemo(() => window.location.hash.slice(1), [])

  const commentBoxTextRef = useRef()
  const [replyToCommentId, setReplyToCommentId] = useState()

  useEffect(() => {
    if (typeof replyToCommentId !== 'undefined') {
      commentBoxTextRef.current.focus()
    }
  }, [replyToCommentId])

  useLayoutEffect(() => {
    if (comments.allIds.length) {
      const elem = window.document.getElementById(locationHash)
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          removeLocationHash()
        })
      }, 50)
    }
  }, [comments.allIds.length, locationHash])

  return (
    <Stack mb={4} spacing={8} id="comments">
      {comments.allIds.map((id) => (
        <CommentItem
          key={id}
          id={id}
          replyToCommentId={replyToCommentId}
          setReplyToCommentId={setReplyToCommentId}
          commentBoxTextRef={commentBoxTextRef}
          addComment={addComment}
          locationHash={locationHash}
        />
      ))}

      {!replyToCommentId && (
        <CommentBox
          textRef={commentBoxTextRef}
          replyToCommentId={replyToCommentId}
          setReplyToCommentId={setReplyToCommentId}
          addComment={addComment}
        />
      )}
    </Stack>
  )
}

export default CommentsThread

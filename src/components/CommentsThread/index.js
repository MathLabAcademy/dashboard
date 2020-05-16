import {
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/core'
import NavLink from 'components/Link/NavLink'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useComment } from 'store/comments/hooks'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import gravatarUrl from 'utils/gravatar-url'

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
  ...props
}) {
  const comment = useComment(id)

  const depth = get(comment, 'depth')
  const childIds = get(comment, 'childIds')

  return (
    <Stack {...props}>
      <Flex flexDirection="row" px={2}>
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
      </Flex>
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

      <Stack
        ml={`${3 * (depth + 1)}rem`}
        mt={2}
        spacing={2}
        position="relative"
      >
        {childIds && childIds.map((id) => <CommentItem key={id} id={id} />)}

        {replyToCommentId === id ? (
          <CommentBox
            textRef={commentBoxTextRef}
            replyToCommentId={replyToCommentId}
            setReplyToCommentId={setReplyToCommentId}
            addComment={addComment}
          />
        ) : depth === 0 && childIds.length > 0 ? (
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
  const commentBoxTextRef = useRef()
  const [replyToCommentId, setReplyToCommentId] = useState()

  useEffect(() => {
    if (typeof replyToCommentId !== 'undefined') {
      commentBoxTextRef.current.focus()
    }
  }, [replyToCommentId])

  return (
    <Stack mb={4} spacing={8}>
      {comments.allIds.map((id) => (
        <CommentItem
          key={id}
          id={id}
          replyToCommentId={replyToCommentId}
          setReplyToCommentId={setReplyToCommentId}
          commentBoxTextRef={commentBoxTextRef}
          addComment={addComment}
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

import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/core'
import { useParams } from '@reach/router'
import Permit from 'components/Permit'
import VimeoEmbed from 'components/VimeoEmbed'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { createCommentForCourseVideo } from 'store/comments'
import { removeCourseVideo } from 'store/courses'
import { useCourseVideo } from 'store/courses/hooks'
import { useCourseVideoComments } from 'store/comments/hooks'
import CommentsThread from 'components/CommentsThread'

function CourseVideoView({ courseId, navigate }) {
  const { videoId } = useParams()

  const video = useCourseVideo(courseId, videoId)

  const dispatch = useDispatch()

  const onRemove = useCallback(async () => {
    await dispatch(removeCourseVideo(courseId, videoId))
    navigate(`..`)
  }, [courseId, dispatch, navigate, videoId])

  const addComment = useCallback(
    ({ type, text, parentId }) => {
      return dispatch(
        createCommentForCourseVideo(courseId, videoId, {
          type,
          text,
          parentId,
        })
      )
    },
    [courseId, dispatch, videoId]
  )

  const comments = useCourseVideoComments(courseId, videoId, 0)

  return (
    <Stack spacing={4}>
      <Box borderWidth={1} shadow="md" p={3}>
        {video && video.provider === 'vimeo' ? (
          <>
            <Flex justifyContent="space-between">
              <Box>
                <Heading>{get(video.data, 'name')}</Heading>
              </Box>
              <Permit roles="teacher,analyst">
                <Box>
                  <Button size="sm" variantColor="red" onClick={onRemove}>
                    Remove
                  </Button>
                </Box>
              </Permit>
            </Flex>
            <Box my={1}>
              <Text>{get(video.data, 'description')}</Text>
            </Box>
            <VimeoEmbed video={video} maxWidth={960} mx="auto" />
          </>
        ) : null}
      </Box>

      <Box borderWidth={1} shadow="md" p={6}>
        <Box mb={6}>
          <Heading>Comments</Heading>
        </Box>

        <CommentsThread comments={comments} addComment={addComment} />
      </Box>
    </Stack>
  )
}

export default CourseVideoView

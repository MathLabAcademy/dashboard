import { Box, Button, Flex, Heading, Text } from '@chakra-ui/core'
import { useParams } from '@reach/router'
import Permit from 'components/Permit'
import VimeoEmbed from 'components/VimeoEmbed'
import { useVideo } from 'hooks/useVideo'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { removeCourseVideo } from 'store/courses'
import { useCourseVideo } from 'store/courses/hooks'

function CourseVideoView({ courseId }) {
  const { courseVideoId } = useParams()

  const { videoProvider, videoId } = useCourseVideo(courseId, courseVideoId)

  const video = useVideo(videoProvider, videoId)

  const dispatch = useDispatch()
  const onRemove = useCallback(async () => {
    await dispatch(removeCourseVideo(courseId, courseVideoId))
  }, [courseId, courseVideoId, dispatch])

  return (
    <Box borderWidth={1} shadow="md" p={3}>
      {videoProvider === 'vimeo' ? (
        <>
          <Flex justifyContent="space-between">
            <Box>
              <Heading>{get(video, 'data.name')}</Heading>
            </Box>
            <Permit roles="teacher">
              <Box>
                <Button size="sm" variantColor="red" onClick={onRemove}>
                  Remove
                </Button>
              </Box>
            </Permit>
          </Flex>
          <Box my={1}>
            <Text>{get(video, 'data.description')}</Text>
          </Box>
          <VimeoEmbed video={video} maxWidth={960} mx="auto" />
        </>
      ) : null}
    </Box>
  )
}

export default CourseVideoView
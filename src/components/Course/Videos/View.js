import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/core'
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
    <Stack spacing={4}>
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

      <Box borderWidth={1} shadow="md" p={3}>
        <Alert
          status="info"
          variant="solid"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon size="20px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize={6}>
            Comments are coming soon!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Need a little help understanding something? Soon you'll be able to
            ask questions to your teacher through comments!
          </AlertDescription>
        </Alert>
      </Box>
    </Stack>
  )
}

export default CourseVideoView

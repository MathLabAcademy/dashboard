import { Box, Button, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/core'
import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import VimeoEmbed from 'components/VimeoEmbed'
import { useCourseAccess } from 'hooks/useCourseAccess'
import { useVideo } from 'hooks/useVideo'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { removeCourseVideo } from 'store/courses'
import { useCourseVideos } from 'store/courses/hooks'
import { emptyArray, emptyObject } from 'utils/defaults'

function ListItem({ id, courseId, data = emptyObject }) {
  const { videoProvider, videoId } = data

  const video = useVideo(videoProvider, videoId)

  const dispatch = useDispatch()
  const onRemove = useCallback(async () => {
    await dispatch(removeCourseVideo(courseId, id))
  }, [courseId, dispatch, id])

  return (
    <Box borderWidth={1} shadow="md" p={3}>
      {videoProvider === 'vimeo' ? (
        <>
          <Flex justifyContent="space-between">
            <Box>
              <Heading>{get(video, 'data.name')}</Heading>
            </Box>
            <Permit teacher>
              <Box>
                <Button size="sm" variantColor="red" onClick={onRemove}>
                  Remove
                </Button>
              </Box>
            </Permit>
          </Flex>
          <VimeoEmbed video={video} maxWidth={400} mx="auto" />
          <Box my={1}>
            <Text>{get(video, 'data.description')}</Text>
          </Box>
        </>
      ) : null}
    </Box>
  )
}

function CourseVideoList({ courseId, cqExamIds, linkToBase }) {
  const videos = useCourseVideos(courseId)

  const canAccess = useCourseAccess(courseId)

  return (
    <Permit teacher student>
      {canAccess ? (
        <Segment>
          <HeaderGrid
            Left={<Header>Videos</Header>}
            Right={
              <Permit teacher>
                <Button as={Link} to={`${linkToBase}create`} color="blue">
                  Add New
                </Button>
              </Permit>
            }
          />

          <SimpleGrid columns={3}>
            {videos.allIds.map((id) => (
              <ListItem
                key={id}
                id={id}
                courseId={courseId}
                data={videos.byId[id]}
              />
            ))}
          </SimpleGrid>
        </Segment>
      ) : null}
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { courseId }) => ({
  cqExamIds: get(courses.cqExamsById, courseId, emptyArray),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CourseVideoList)

import {
  AspectRatioBox,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/core'
import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import { useVideo } from 'hooks/useVideo'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { useCourseVideos } from 'store/courses/hooks'
import { emptyArray, emptyObject } from 'utils/defaults'

function ListItem({ id, data = emptyObject }) {
  const { videoProvider, videoId } = data

  const video = useVideo(videoProvider, videoId)

  return (
    <Box borderWidth={1} shadow="md" p={3}>
      {video.loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Flex>
      ) : videoProvider === 'vimeo' ? (
        <>
          <Box>
            <Heading>{get(video, 'data.name')}</Heading>
          </Box>
          <Box my={1}>
            <Text>{get(video, 'data.description')}</Text>
          </Box>
          <Link to={`${id}`}>
            <AspectRatioBox ratio={16 / 9}>
              <Flex justifyContent="center" alignItems="center">
                <Image
                  src={`http://f.vimeocdn.com/p/images/crawler_play.png`}
                />
              </Flex>
            </AspectRatioBox>
          </Link>
        </>
      ) : null}
    </Box>
  )
}

function CourseVideoList({ courseId }) {
  const videos = useCourseVideos(courseId)

  const canAccess = useCourseAccess(courseId)

  return (
    <Permit roles="teacher,student">
      {canAccess ? (
        <Segment>
          <HeaderGrid
            Left={<Header>Videos</Header>}
            Right={
              <Permit roles="teacher">
                <Button as={Link} to={`create`} color="blue">
                  Add New
                </Button>
              </Permit>
            }
          />

          <SimpleGrid mt={4} columns={4} spacing={6}>
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

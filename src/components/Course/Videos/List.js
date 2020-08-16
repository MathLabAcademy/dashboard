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
import { get } from 'lodash-es'
import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { useCourseVideos } from 'store/courses/hooks'
import { useVideo } from 'store/videos/hooks'

function ListItem({ id }) {
  const video = useVideo(id)

  return (
    <Box borderWidth={1} shadow="md" p={3}>
      {!video ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Flex>
      ) : video.provider === 'vimeo' ? (
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
                  src={`https://f.vimeocdn.com/p/images/crawler_play.png`}
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
  const canAccess = useCourseAccess(courseId)

  const videos = useCourseVideos(courseId)

  return (
    <Permit roles="teacher,analyst,student">
      {canAccess ? (
        <Segment>
          <HeaderGrid
            Left={<Header>Videos</Header>}
            Right={
              <Permit roles="teacher,analyst">
                <Button as={Link} to={`create`} color="blue">
                  Add New
                </Button>
              </Permit>
            }
          />

          <SimpleGrid mt={4} columns={4} spacing={6} minChildWidth={320}>
            {videos.allIds.map((id) => (
              <ListItem key={id} id={id} />
            ))}
          </SimpleGrid>
        </Segment>
      ) : null}
    </Permit>
  )
}

export default CourseVideoList

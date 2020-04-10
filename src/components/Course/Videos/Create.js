import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
} from '@chakra-ui/core'
import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import VimeoEmbed from 'components/VimeoEmbed'
import { useVideo } from 'hooks/useVideo'
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Header, Message, Segment } from 'semantic-ui-react'
import { createCourseVideo } from 'store/courses'

const videoProvider = 'vimeo'

function CourseVideoCreate({ courseId, navigate }) {
  const vimeoVideoIdRef = useRef()

  const [vimeoVideoId, setVimeoVideoId] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const vimeoVideo = useVideo(videoProvider, vimeoVideoId)

  const onPreview = useCallback(() => {
    setVimeoVideoId(vimeoVideoIdRef.current.value)
  }, [])

  const dispatch = useDispatch()
  const onSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await dispatch(
        createCourseVideo(courseId, {
          videoId: vimeoVideoId,
          videoProvider,
        })
      )
      navigate(`/courses/${courseId}/videos`)
    } catch (err) {
      if (err.errors) {
        setError(
          err.errors
            .map((error) => `${error.param}: ${error.message}`)
            .join(', ')
        )
      } else if (err.message) {
        setError(err.message)
      } else {
        console.error(err)
        setError(null)
      }
    }
    setLoading(false)
  }, [courseId, dispatch, navigate, vimeoVideoId])

  return (
    <Permit roles="teacher">
      <Segment>
        <HeaderGrid
          Left={<Header>Add Video:</Header>}
          Right={
            <>
              <Button as={Link} to="..">
                Cancel
              </Button>
            </>
          }
        />
      </Segment>

      <Segment>
        <Message color="yellow" hidden={!error}>
          {JSON.stringify(error)}
        </Message>

        <Stack isInline spacing={2} alignItems="center">
          <InputGroup size="lg" flexGrow={1}>
            <InputLeftAddon children="Vimeo Video ID" />
            <Input
              pr="6rem"
              placeholder="Enter Vimeo Video ID"
              ref={vimeoVideoIdRef}
            />
            <InputRightElement width="5rem" pr="0.5rem">
              <Button
                h="2rem"
                isLoading={vimeoVideo.loading}
                isDisabled={vimeoVideo.loading}
                onClick={onPreview}
                variantColor="blue"
                px="0.5rem"
              >
                Preview
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            isLoading={loading}
            isDisabled={loading || !vimeoVideo.data}
            variantColor="green"
            onClick={onSubmit}
          >
            Add Video
          </Button>
        </Stack>

        {vimeoVideoId && (
          <Box p={4}>
            <VimeoEmbed video={vimeoVideo} maxWidth={600} mx="auto" />
          </Box>
        )}
      </Segment>
    </Permit>
  )
}

export default CourseVideoCreate
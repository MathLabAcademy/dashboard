import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/core'
import { get } from 'lodash-es'
import React from 'react'
import { FaImages } from 'react-icons/fa'
import useSWR from 'swr'
import api from 'utils/api'

function ImageCard({ image, ...props }) {
  // const id = useMemo(() => `s3-${get(image, 's3ObjectId')}`, [image])
  // const copySrc = useCallback(() => {
  //   document.querySelector(`#${id}`).select()
  //   document.execCommand('copy')
  // }, [id])

  return (
    <Box width="20rem" mx="auto" {...props}>
      <Image
        size="100%"
        src={`/api/user/utils/s3/sign?key=${get(image, 's3Object.key')}`}
      />
      {/* <InputGroup> */}
      {/*   <InputLeftElement */}
      {/*     children={<Icon name="attachment" color="gray.500" />} */}
      {/*   /> */}
      {/*   <Input */}
      {/*     pr="3rem" */}
      {/*     id={id} */}
      {/*     defaultValue={`s3:${get(image, 's3Object.key')}`} */}
      {/*   /> */}
      {/*   <InputRightElement width="3rem"> */}
      {/*     <IconButton icon="copy" h="1.75rem" size="sm" onClick={copySrc} /> */}
      {/*   </InputRightElement> */}
      {/* </InputGroup> */}
    </Box>
  )
}

const fetcher = async (url) => {
  const { data, error } = await api(url)

  if (error) {
    throw error
  }

  return data
}

function MCQImageGallery({ mcqId }) {
  const swr = useSWR(`/mcqs/${mcqId}/images`, fetcher)

  // const onNewImage = useCallback(
  //   (image) => {
  //     swr.mutate(
  //       (data) => ({
  //         items: [image, ...data.items],
  //         totalItems: data.totalItems + 1,
  //       }),
  //       false
  //     )
  //   },
  //   [swr]
  // )

  const { isOpen, onOpen, onClose } = useDisclosure(false)

  return (
    <>
      <Button mx={1} onClick={onOpen}>
        <Box as={FaImages} />
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>MCQ Image Gallery</DrawerHeader>

          <DrawerBody overflowY="auto">
            <Stack spacing={4}>
              {swr.data ? (
                swr.data.items.map((image) => (
                  <ImageCard key={get(image, 's3ObjectId')} image={image} />
                ))
              ) : (
                <Box mx="auto" p={8}>
                  <Spinner
                    mx="auto"
                    thickness="0.5rem"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="10rem"
                  />
                </Box>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MCQImageGallery

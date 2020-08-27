import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormButton } from 'components/HookForm/Button'
import { FormInput } from 'components/HookForm/Input'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { uploadMCQImage } from 'store/actions/mcqs'

function MCQImageUploader({ mcqId, onSuccess }) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure(false)

  const form = useForm()

  const dispatch = useDispatch()
  const onSubmit = useCallback(
    async ({ image }) => {
      try {
        const data = await dispatch(uploadMCQImage({ mcqId, image: image[0] }))

        onSuccess(data)
        onClose()
      } catch (err) {
        handleAPIError(err, { toast })
      }
    },
    [dispatch, mcqId, onClose, onSuccess, toast]
  )

  const image = form.watch('image')

  const [localUri, setLocalUri] = useState(null)

  useEffect(() => {
    if (image && image[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLocalUri(e.target.result)
      }
      reader.readAsDataURL(image[0])
    } else {
      setLocalUri(null)
    }
  }, [image])

  return (
    <>
      <Button variantColor="blue" onClick={onOpen}>
        Upload Image
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />

        <ModalContent>
          <Form form={form} onSubmit={onSubmit}>
            <ModalHeader>Upload Image</ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <Stack spacing={4}>
                <FormInput
                  name="image"
                  type="file"
                  label="Select Image File"
                  accept="image/png, image/jpeg"
                />

                <Box h="20rem">
                  {localUri ? (
                    <Image src={localUri} maxH="100%" maxW="100%" mx="auto" />
                  ) : (
                    <Skeleton height="100%" />
                  )}
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button variantColor="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <FormButton type="submit">Upload</FormButton>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MCQImageUploader

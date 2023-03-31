import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  FormControl,
  FormLabel,
} from '@chakra-ui/core'
import insertAtomicBlock from 'components/Draft/modifiers/insertAtomicBlock'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaImage } from 'react-icons/fa'
import { __MATHLAB_DRAFT_JS_IMAGE_BLOCK_TYPE__ } from './constants'

function ImageAdder({ store, onClose }) {
  useEffect(() => {
    store.setReadOnly(true)
    return () => store.setReadOnly(false)
  }, [store])

  const [loading, setLoading] = useState(false)

  const srcRef = useRef(null)
  const captionRef = useRef('')
  const widthRef = useRef(null)

  const onSubmit = useCallback(() => {
    const files = srcRef.current.files

    if (files && files[0]) {
      setLoading(true)

      const reader = new FileReader()

      reader.onload = (e) => {
        const data = {
          src: e.target.result,
          caption: captionRef.current.value,
          w: widthRef.current.value || 'auto',
          type: __MATHLAB_DRAFT_JS_IMAGE_BLOCK_TYPE__,
        }

        const newEditorState = insertAtomicBlock(store.getEditorState(), data)

        store.setEditorState(newEditorState)

        setLoading(false)
        onClose()
      }

      reader.onerror = (e) => {
        console.error(e.target.error)
        setLoading(false)
      }

      reader.readAsDataURL(files[0])
    }
  }, [onClose, store])

  return (
    <>
      <ModalHeader>Add Image</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          <FormControl>
            <FormLabel htmlFor="image">Image File</FormLabel>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg"
              ref={srcRef}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="caption">Image Caption</FormLabel>
            <Input id="caption" name="caption" ref={captionRef} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="width">Image Width</FormLabel>
            <Input
              type="number"
              id="width"
              name="width"
              step="10"
              ref={widthRef}
            />
          </FormControl>
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button
          type="button"
          isLoading={loading}
          isDisabled={loading}
          onClick={onSubmit}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  )
}
function ImageButton({ store }) {
  const { isOpen, onOpen, onClose } = useDisclosure(false)

  return (
    <>
      <Button onClick={onOpen}>
        <Box as={FaImage} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ImageAdder store={store} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageButton

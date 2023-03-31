import removeBlock from 'components/Draft/modifiers/removeBlock'
import {
  FormControl,
  FormLabel,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useDisclosure,
  ModalContent,
} from '@chakra-ui/core'
import { EditorState, Modifier, SelectionState } from 'draft-js'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function ImageMetaEditor({ store, block, contentState, onClose }) {
  useEffect(() => {
    store.setReadOnly(true)
    return () => store.setReadOnly(false)
  }, [store])

  const [loading, setLoading] = useState(false)

  const captionRef = useRef('')
  const widthRef = useRef(null)

  useEffect(() => {
    const blockData = block.getData()
    captionRef.current.value = blockData.get('caption')
    widthRef.current.value = blockData.get('w')
  }, [block])

  const onRemove = useCallback(() => {
    setLoading(true)

    const blockKey = block.getKey()

    const newEditorState = removeBlock(store.getEditorState(), blockKey)

    store.setEditorState(newEditorState)

    setLoading(false)
    onClose()
  }, [block, store, onClose])

  const onUpdate = useCallback(() => {
    setLoading(true)

    const blockKey = block.getKey()

    const contentBlock = contentState.getBlockForKey(blockKey)

    const selectionState = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: 0,
      focusOffset: contentBlock.getLength(),
    })

    const newContentState = Modifier.mergeBlockData(
      contentState,
      selectionState,
      {
        caption: captionRef.current.value,
        w: widthRef.current.value || 'auto',
      }
    )

    const newEditorState = EditorState.push(
      store.getEditorState(),
      newContentState,
      'change-block-data'
    )

    store.setEditorState(newEditorState)

    setLoading(false)

    onClose()
  }, [block, contentState, onClose, store])

  return (
    <>
      <ModalHeader>Edit Image</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
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
        <Stack isInline justifyContent="space-between">
          <Button
            type="button"
            isLoading={loading}
            isDisabled={loading}
            onClick={onRemove}
          >
            Remove
          </Button>

          <Button
            type="button"
            isLoading={loading}
            isDisabled={loading}
            onClick={onUpdate}
          >
            Update
          </Button>
        </Stack>
      </ModalFooter>
    </>
  )
}

function ImageBlock({ block, blockProps: { store }, contentState }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const readOnly = store.getReadOnly()

  const data = useMemo(() => {
    const blockData = block.getData()

    let src = blockData.get('src')

    if (/^s3:/.test(src)) {
      src = `/api/user/utils/s3/sign?key=${src.replace(/^s3:/, '')}`
    } else if (/^\/download/.test(src)) {
      src = `/api${src}`
    }

    return {
      src,
      caption: blockData.get('caption'),
      width: blockData.get('w') || 'auto',
    }
  }, [block])

  useEffect(() => {
    console.log(store.getReadOnly())
  }, [store])

  return (
    <>
      {readOnly ? (
        <img src={data.src} alt={data.caption} width={data.width} />
      ) : (
        <Button
          variant="ghost"
          height="auto"
          p="0"
          type="button"
          onClick={onOpen}
          cursor="pointer"
        >
          <img src={data.src} alt={data.caption} width={data.width} />
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ImageMetaEditor
            store={store}
            block={block}
            contentState={contentState}
            onClose={onClose}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageBlock

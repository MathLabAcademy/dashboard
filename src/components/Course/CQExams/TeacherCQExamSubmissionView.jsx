import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Image,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import imageCompression from 'browser-image-compression'
import { CanvasImageOverlay } from 'components/Canvas/CanvasImageOverlay'
import { FormButton } from 'components/HookForm/Button'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormRichText } from 'components/HookForm/RichText'
import Permit from 'components/Permit'
import { get, sum } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { MdBrush, MdClear, MdEdit, MdSave, MdUndo } from 'react-icons/md'
import ResizeObserver from 'resize-observer-polyfill'
import { useCQExam, useCQExamSubmissionsForUser } from 'store/cqExams/hooks'
import { useUser } from 'store/users/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'

const brushColors = { '#e53e34': 'red', '#38a169': 'green', '#3182ce': 'blue' }

function ImageOverlay({ name, imageKey, overlayImageKey, isDisabled }) {
  const { register, unregister, setValue } = useFormContext()

  useEffect(() => {
    register({ name })
    return () => unregister(name)
  }, [name, register, unregister])

  const container = useRef(null)
  const [image, setImage] = useState(null)
  const [overlayImage, setOverlayImage] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const src = `/api/user/utils/s3/sign?key=${imageKey}`

    const image = new window.Image()
    image.onload = () => {
      setImage(image)
    }
    image.src = src
  }, [imageKey])

  useEffect(() => {
    if (overlayImageKey) {
      const overlaySrc = `/api/user/utils/s3/sign?key=${overlayImageKey}`

      const image = new window.Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        setOverlayImage(image)
      }
      image.src = overlaySrc
    }
  }, [overlayImageKey])

  const { isLoading, ratio } = useMemo(() => {
    let ratio = 3 / 4

    if (image) {
      ratio = image.width / image.height
    }

    return { isLoading: !image, ratio }
  }, [image])

  const canvas = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const box = container.current
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      const height = width / ratio
      setCanvasSize({ width, height })
    })
    observer.observe(box)
    return () => {
      observer.unobserve(box)
    }
  }, [ratio])

  const onClear = useCallback(async () => {
    canvas.current.clearCanvas()
    const blob = await canvas.current.getBlob('image/png')
    setValue(name, blob ?? null)
  }, [name, setValue])

  const onSave = useCallback(async () => {
    const blob = await canvas.current.getBlob('image/png')
    setValue(name, blob ?? null)
    setIsEditing(false)
  }, [name, setValue])

  const brushConfig = useDisclosure()
  const [brushRadius, setBrushRadius] = useState(5)
  const [brushColor, setBrushColor] = useState('#e53e34')

  return (
    <Box
      width="100%"
      maxWidth="1600px"
      mx="auto"
      ref={container}
      pr="60px"
      position="relative"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <CanvasImageOverlay
            ref={canvas}
            image={image}
            overlayImage={overlayImage}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            isDisabled={!isEditing}
            brushColor={brushColor}
            brushRadius={brushRadius}
          />

          <Stack
            position="absolute"
            right="0"
            width="60px"
            top="0"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              type="button"
              size="md"
              variantColor="blue"
              onClick={() => setIsEditing(true)}
              isDisabled={isEditing || isDisabled}
            >
              <Box as={MdEdit} />
            </Button>

            <Box>
              <Popover
                usePortal
                isOpen={brushConfig.isOpen}
                onClose={brushConfig.onClose}
                closeOnBlur
              >
                <PopoverTrigger>
                  <Button
                    type="button"
                    size="md"
                    variantColor="blue"
                    isDisabled={!isEditing}
                    onClick={brushConfig.onOpen}
                  >
                    <Box as={MdBrush} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent zIndex={99999}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Brush</PopoverHeader>
                  <PopoverBody>
                    <Slider
                      min={2}
                      max={20}
                      color={brushColors[brushColor]}
                      value={brushRadius}
                      onChange={setBrushRadius}
                    >
                      <SliderTrack />
                      <SliderFilledTrack />
                      <SliderThumb />
                    </Slider>

                    <Stack isInline spacing={2}>
                      {Object.keys(brushColors).map((color) => (
                        <Button
                          key={color}
                          type="button"
                          variant="solid"
                          size="sm"
                          bg={color}
                          borderRadius="50%"
                          _hover={{ bg: color, transform: 'scale(1.2)' }}
                          onClick={() => {
                            if (brushColor !== color) {
                              setBrushColor(color)
                            }
                            brushConfig.onClose()
                          }}
                        />
                      ))}
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>

            <Button
              type="button"
              size="md"
              variantColor="blue"
              onClick={() => canvas.current.undo()}
              isDisabled={!isEditing}
            >
              <Box as={MdUndo} />
            </Button>
            <Button
              type="button"
              size="md"
              variantColor="blue"
              onClick={onClear}
              isDisabled={!isEditing}
            >
              <Box as={MdClear} />
            </Button>
            <Button
              type="button"
              size="md"
              variantColor="blue"
              onClick={() => onSave()}
              isDisabled={!isEditing}
            >
              <Box as={MdSave} />
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}

const getDefaultValues = (submission) => ({
  remark: get(submission, 'remark') || '',
  marks: get(submission, 'marks') || [],
  overlayImage: null,
})

function SubmissionItem({
  data,
  cqExamId,
  isSubmissionOpen,
  onRemarkUpdate,
  ...props
}) {
  const defaultValues = useMemo(() => getDefaultValues(data), [data])

  const toast = useToast()

  const form = useForm({
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'marks',
  })

  const formReset = form.reset
  useEffect(() => {
    formReset(defaultValues)
  }, [defaultValues, formReset])

  const onSubmit = useCallback(
    async ({ remark, marks = [], overlayImage }) => {
      try {
        const body = new FormData()
        body.set('userId', data.userId)
        body.set('s3ObjectId', data.s3ObjectId)
        if (remark) {
          body.set('remark', remark)
        }
        marks.forEach((mark) => {
          body.append('marks[]', mark)
        })

        if (overlayImage) {
          const image = await imageCompression(overlayImage, {
            maxSizeMB: 1,
          })
          body.set('overlayImage', image)
        }

        const { data: responseData, error } = await api(
          `/cqexams/${cqExamId}/submissions/action/update-evaluation`,
          {
            method: 'POST',
            body,
          }
        )

        if (error) {
          throw error
        }

        trackEventAnalytics({
          category: 'Teacher',
          action: 'Updated CQExamSubmission Evaluation',
        })

        onRemarkUpdate(responseData)
      } catch (err) {
        handleAPIError(err, { form, toast })
      }
    },
    [cqExamId, data.s3ObjectId, data.userId, form, onRemarkUpdate, toast]
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box borderWidth="1px" boxShadow="sm" p={2} {...props}>
      <Button
        onClick={onOpen}
        variant="ghost"
        height="320px"
        width="320px"
        p="0"
      >
        <Image
          size="100%"
          objectFit="cover"
          src={`/api/user/utils/s3/sign?key=${get(data, 's3Object.key')}`}
          fallbackSrc="https://via.placeholder.com/320?text=..."
        />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <Form form={form} onSubmit={onSubmit}>
            <ModalHeader>Answer Sheet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing="4">
                <Box>
                  <ImageOverlay
                    name="overlayImage"
                    isDisabled={isSubmissionOpen}
                    imageKey={get(data, 's3Object.key')}
                    overlayImageKey={get(data, 'overlayS3Object.key')}
                  />
                </Box>

                <Box fontSize={2}>
                  <FormRichText
                    name="remark"
                    label={`Remark`}
                    labelProps={{ fontSize: 2, fontWeight: 'bold' }}
                    disableImage
                    disabled={isSubmissionOpen}
                  />
                </Box>

                <Box>
                  <FormLabel fontSize={2} fontWeight="bold">
                    Marks
                  </FormLabel>
                  <Stack isInline spacing={2}>
                    {fields.map((field, index) => (
                      <Flex key={index} alignItems="center">
                        <NumberInput
                          step={1}
                          precision={2}
                          w="100px"
                          defaultValue={field.value}
                          isDisabled={isSubmissionOpen}
                        >
                          <InputGroup size="lg">
                            <InputLeftElement width="2rem">
                              <IconButton
                                icon="close"
                                size="xs"
                                onClick={() => remove(index)}
                                variant="outline"
                                variantColor="red"
                                isDisabled={isSubmissionOpen}
                              />
                            </InputLeftElement>
                            <NumberInputField
                              pl="2rem"
                              textAlign="right"
                              ref={form.register()}
                              name={`marks[${index}]`}
                            />
                          </InputGroup>
                        </NumberInput>
                        {index < fields.length - 1 && (
                          <Icon name="add" ml={2} />
                        )}
                      </Flex>
                    ))}
                    <IconButton
                      icon="add"
                      type="button"
                      onClick={() => append(0)}
                      isDisabled={isSubmissionOpen}
                    />
                  </Stack>
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button variantColor="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <FormButton type="submit" variantColor="blue">
                Save
              </FormButton>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

function TeacherCQExamSubmissionView({ courseId, cqExamId, userId }) {
  const cqExam = useCQExam(cqExamId)
  const submissions = useCQExamSubmissionsForUser(cqExamId, userId)
  const student = useUser(userId)

  const isSubmissionOpen = useMemo(() => {
    const submissionDeadline = get(cqExam, 'submissionDeadline')
    if (!submissionDeadline) {
      return null
    }

    const diff = DateTime.fromISO(submissionDeadline).diffNow('minutes').minutes

    return diff >= 0
  }, [cqExam])

  const marks = useMemo(() => {
    const marks = get(submissions.data, 'items', []).reduce((marks, item) => {
      marks.push(...get(item, 'marks', []))
      return marks
    }, [])

    const isEvaluated = marks.length > 0
    const total = Number(sum(marks)).toFixed(2)

    return {
      isEvaluated,
      total,
    }
  }, [submissions.data])

  const onRemarkUpdate = useCallback(
    (updatedItem) => {
      submissions.mutate((data) => {
        const items = data.items.map((item) => {
          if (item.s3ObjectId === updatedItem.s3ObjectId) {
            return updatedItem
          }
          return item
        })
        return {
          items,
          totalItems: data.totalItems,
        }
      }, false)
    },
    [submissions]
  )

  return (
    <Permit roles="teacher,analyst,assistant">
      <Box borderWidth="1px" boxShadow="sm" p={4}>
        <Stack
          isInline
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Stack spacing={2}>
            <Heading fontSize={2}>
              <Text as={Link} to={`/courses/${courseId}/cqexams/${cqExamId}`}>
                {get(cqExam, 'name')}
              </Text>{' '}
              Answer Paper Submissions of{' '}
              <Text as={Link} to={`/users/${get(student, 'id')}`}>
                {get(student, 'Person.fullName')}
              </Text>{' '}
            </Heading>

            <Box>
              <Text fontStyle="italic">Total Obtained Marks: </Text>
              <Text>
                {marks.isEvaluated ? marks.total : '---'} /{' '}
                {get(cqExam, 'totalMark')}
              </Text>
            </Box>
          </Stack>
          <Box>
            <Button as={Link} to={'../..'}>
              Go Back
            </Button>
          </Box>
        </Stack>

        {submissions.data && (
          <Stack spacing={4} isInline flexWrap="wrap">
            {submissions.data.items.map((item) => (
              <SubmissionItem
                key={item.s3ObjectId}
                cqExamId={cqExamId}
                data={item}
                isSubmissionOpen={isSubmissionOpen}
                onRemarkUpdate={onRemarkUpdate}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Permit>
  )
}

export default TeacherCQExamSubmissionView

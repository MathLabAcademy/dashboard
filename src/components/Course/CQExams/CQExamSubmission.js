import {
  Box,
  Button,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import imageCompression from 'browser-image-compression'
import { DraftViewer } from 'components/Draft'
import { FormButton } from 'components/HookForm/Button'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormInput } from 'components/HookForm/Input'
import Permit from 'components/Permit'
import { useCourseEnrollment } from 'hooks/useCourseEnrollment'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCQExam, useCQExamSubmissionsForUser } from 'store/cqExams/hooks'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'

function AddCQExamSubmission({ cqExamId, onSuccess }) {
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const form = useForm()

  const onSubmit = useCallback(
    async ({ file }) => {
      try {
        if (file && file[0]) {
          const image = await imageCompression(file[0], {
            maxSizeMB: 2,
            maxWidthOrHeight: 2048,
          })

          const body = new FormData()
          body.set('image', image, image.name)

          const { data, error } = await api(
            `/cqexams/${cqExamId}/submissions`,
            {
              method: 'POST',
              body,
            }
          )

          if (error) {
            throw error
          }

          onSuccess(data)

          trackEventAnalytics({
            category: 'Student',
            action: 'Uploaded CQExam Submission',
          })

          onClose()
        }
      } catch (err) {
        handleAPIError(err, { toast, form })
      }
    },
    [cqExamId, form, onClose, onSuccess, toast]
  )

  return (
    <>
      <Button onClick={onOpen} variantColor="blue">
        Upload
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Form form={form} onSubmit={onSubmit}>
            <ModalHeader>Upload Answer Paper Image</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormInput
                type="file"
                name="file"
                label={`Select Answer Paper Image`}
                accept="image/jpeg, image/png"
              />
            </ModalBody>

            <ModalFooter>
              <Button variantColor="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <FormButton type="submit" variantColor="green">
                Upload Image
              </FormButton>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  )
}

function RemoveCQExamSubmission({ cqExamId, s3ObjectId, onSuccess }) {
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)
      await api(`/cqexams/${cqExamId}/submissions`, {
        method: 'DELETE',
        body: {
          s3ObjectId,
        },
      })

      setIsLoading(false)

      onSuccess({ s3ObjectId })

      trackEventAnalytics({
        category: 'Student',
        action: 'Deleted CQExam Submission',
      })

      onClose()
    } catch (err) {
      handleAPIError(err, { toast })
      setIsLoading(false)
    }
  }, [cqExamId, onClose, onSuccess, s3ObjectId, toast])

  return (
    <>
      <Button onClick={onOpen} variantColor="red">
        Remove
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Answer Paper Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure?</ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              variantColor="green"
              onClick={onSubmit}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Remove Image
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function SubmissionItem({
  data,
  cqExamId,
  isSubmissionOpen,
  onSubmissionRemove,
  ...props
}) {
  return (
    <Stack
      isInline
      flexWrap="wrap"
      borderWidth="1px"
      boxShadow="sm"
      p={2}
      {...props}
    >
      <Box
        maxW="480px"
        as="a"
        href={get(data, 's3Object.url')}
        target="_blank"
        display="block"
        position="relative"
      >
        <Image
          size="100%"
          objectFit="cover"
          src={get(data, 's3Object.url')}
          fallbackSrc="https://via.placeholder.com/250?text=..."
        />

        {isSubmissionOpen && (
          <Box mt={2} position="absolute" bottom="0" right="0">
            <RemoveCQExamSubmission
              cqExamId={cqExamId}
              s3ObjectId={get(data, 's3ObjectId')}
              onSuccess={onSubmissionRemove}
            />
          </Box>
        )}
      </Box>

      {!isSubmissionOpen && (
        <Box flexGrow="1" fontSize={2} ml={2} p={2}>
          <Text fontWeight="bold">Remark:</Text>
          <DraftViewer rawValue={get(data, 'remark')} />
        </Box>
      )}
    </Stack>
  )
}

function CQExamSubmission({ courseId, cqExamId }) {
  const user = useCurrentUserData()
  const isEnrolled = useCourseEnrollment(courseId)
  const cqExam = useCQExam(cqExamId)
  const submissions = useCQExamSubmissionsForUser(cqExamId, user.id)

  const isSubmissionOpen = useMemo(() => {
    const submissionDeadline = get(cqExam, 'submissionDeadline')
    if (!submissionDeadline) {
      return null
    }

    const diff = DateTime.fromISO(submissionDeadline).diffNow('minutes').minutes

    return diff >= 0
  }, [cqExam])

  const onSubmissionAdd = useCallback(
    (item) => {
      submissions.mutate(
        (data) => ({
          items: data.items.concat(item),
          totalItems: data.totalItems + 1,
        }),
        false
      )
    },
    [submissions]
  )

  const onSubmissionRemove = useCallback(
    ({ s3ObjectId }) => {
      submissions.mutate(
        (data) => ({
          items: data.items.filter((item) => item.s3ObjectId !== s3ObjectId),
          totalItems: data.totalItems - 1,
        }),
        false
      )
    },
    [submissions]
  )

  if (!isEnrolled || !cqExam) {
    return null
  }

  return (
    <Permit roles="student">
      <Box borderWidth="1px" boxShadow="sm" p={4}>
        <Stack
          isInline
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Heading fontSize={2}>
              {isSubmissionOpen
                ? `Submit Your Answer Papers before ${DateTime.fromISO(
                    cqExam.submissionDeadline
                  ).toLocaleString(DateTime.DATETIME_MED)}`
                : isSubmissionOpen === null
                ? `Answer Paper Submission is Closed!`
                : `Answer Paper Submission Deadline Over!`}
            </Heading>
          </Box>
          {isSubmissionOpen && (
            <Box>
              <AddCQExamSubmission
                cqExamId={cqExamId}
                onSuccess={onSubmissionAdd}
              />
            </Box>
          )}
        </Stack>

        {submissions.data && (
          <Stack spacing={4} isInline={isSubmissionOpen} flexWrap="wrap">
            {submissions.data.items.map((item) => (
              <SubmissionItem
                key={item.s3ObjectId}
                cqExamId={cqExamId}
                data={item}
                isSubmissionOpen={isSubmissionOpen}
                onSubmissionRemove={onSubmissionRemove}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Permit>
  )
}

export default CQExamSubmission

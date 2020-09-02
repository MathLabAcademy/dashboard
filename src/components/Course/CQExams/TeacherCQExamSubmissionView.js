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
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { Link } from '@reach/router'
import { FormButton } from 'components/HookForm/Button'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormRichText } from 'components/HookForm/RichText'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useCQExam, useCQExamSubmissionsForUser } from 'store/cqExams/hooks'
import { useUser } from 'store/users/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'

const getDefaultValues = (submission) => ({
  remark: get(submission, 'remark') || '',
  marks: get(submission, 'marks') || [],
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
    async ({ remark, marks }) => {
      try {
        const { data: responseData, error } = await api(
          `/cqexams/${cqExamId}/submissions/action/update-evaluation`,
          {
            method: 'POST',
            body: {
              userId: data.userId,
              s3ObjectId: data.s3ObjectId,
              remark,
              marks,
            },
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
          src={get(data, 's3Object.url')}
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
                  <Image
                    size="100%"
                    objectFit="cover"
                    src={get(data, 's3Object.url')}
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
    <Permit roles="teacher,analyst">
      <Box borderWidth="1px" boxShadow="sm" p={4}>
        <Stack
          isInline
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Heading fontSize={2}>
              <Text as={Link} to={`/courses/${courseId}/cqexams/${cqExamId}`}>
                {get(cqExam, 'name')}
              </Text>{' '}
              Answer Paper Submissions of{' '}
              <Text as={Link} to={`/users/${get(student, 'id')}`}>
                {get(student, 'Person.fullName')}
              </Text>{' '}
            </Heading>
          </Box>
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

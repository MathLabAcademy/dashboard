import {
  Box,
  Heading,
  Image,
  Stack,
  Text,
  Button,
  useToast,
} from '@chakra-ui/core'
import { Link } from '@reach/router'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useCallback } from 'react'
import { useCQExam, useCQExamSubmissionsForUser } from 'store/cqExams/hooks'
import { useUser } from 'store/users/hooks'
import { useForm } from 'react-hook-form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormRichText } from 'components/HookForm/RichText'
import { Form } from 'components/HookForm/Form'
import api from 'utils/api'
import { FormButton } from 'components/HookForm/Button'

const getDefaultValues = (submission) => ({
  remark: get(submission, 'remark') || '',
})

function SubmissionItem({
  data,
  cqExamId,
  isSubmissionOpen,
  onRemarkUpdate,
  ...props
}) {
  const defaultValues = useMemo(() => getDefaultValues(data), [data])

  const toast = useToast({
    defaultValues,
  })

  const form = useForm()

  const formReset = form.reset
  useEffect(() => {
    formReset(defaultValues)
  }, [defaultValues, formReset])

  const onSubmit = useCallback(
    async ({ remark }) => {
      try {
        const { data: responseData, error } = await api(
          `/cqexams/${cqExamId}/submissions/action/add-remark`,
          {
            method: 'POST',
            body: {
              userId: data.userId,
              s3ObjectId: data.s3ObjectId,
              remark,
            },
          }
        )
        if (error) {
          throw error
        }

        onRemarkUpdate(responseData)
      } catch (err) {
        handleAPIError(err, { form, toast })
      }
    },
    [cqExamId, data.s3ObjectId, data.userId, form, onRemarkUpdate, toast]
  )

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
        width="480px"
        as="a"
        href={get(data, 's3Object.url')}
        target="_blank"
        display="block"
      >
        <Image
          size="100%"
          objectFit="cover"
          src={get(data, 's3Object.url')}
          fallbackSrc="https://via.placeholder.com/250?text=..."
        />
      </Box>

      <Box flexGrow="1" fontSize={2} ml={2} p={2}>
        <Form form={form} onSubmit={onSubmit}>
          <FormRichText
            name="remark"
            label={`Remark`}
            disableImage
            disabled={isSubmissionOpen}
          />
          <Box textAlign="right" mt={2}>
            <FormButton type="submit" variantColor="blue">
              Save
            </FormButton>
          </Box>
        </Form>
      </Box>
    </Stack>
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
          mb={6}
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
          <Stack spacing={4}>
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

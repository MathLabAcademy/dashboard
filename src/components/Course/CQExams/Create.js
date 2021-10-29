import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/core'
import { Link } from '@reach/router'
import { FormButton } from 'components/HookForm/Button'
import { FormDatePicker } from 'components/HookForm/DatePicker'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormInput } from 'components/HookForm/Input'
import Permit from 'components/Permit'
import React, { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createCQExam } from 'store/cqExams'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getDefaultValues = () => ({
  date: new Date(),
  name: '',
  description: '',
  questionPaperPdf: '',
  submissionDeadline: new Date(),
  totalMark: 0,
})

const getValidationSchema = () => {
  return Yup.object({
    date: Yup.date()
      .min(new Date(), `date already passed`)
      .required(`required`),
    name: Yup.string().notRequired(),
    description: Yup.string().notRequired(),
    questionPaperPdf: Yup.mixed().required(`required`),
    submissionDeadline: Yup.date().min(Yup.ref('date')).notRequired(),
    totalMark: Yup.number().required(`required`),
  })
}

function CourseCQExamCreate({ courseId, navigate }) {
  const toast = useToast()

  const defaultValues = useMemo(() => getDefaultValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const form = useForm({
    defaultValues,
    validationSchema,
  })

  const dispatch = useDispatch()

  const onSubmit = useCallback(
    async ({
      date,
      name,
      description,
      questionPaperPdf,
      submissionDeadline,
      totalMark,
    }) => {
      try {
        await dispatch(
          createCQExam({
            courseId,
            date,
            name,
            description,
            questionPaperPdf: questionPaperPdf[0],
            submissionDeadline,
            totalMark,
          })
        )

        trackEventAnalytics({
          category: 'Teacher',
          action: 'Created CQExam',
        })

        navigate(`/courses/${courseId}/cqexams`)
      } catch (err) {
        handleAPIError(err, { form, toast })
      }
    },
    [courseId, dispatch, form, navigate, toast]
  )

  const date = form.watch('date')

  return (
    <Permit roles="teacher">
      <Form form={form} onSubmit={onSubmit}>
        <Stack spacing={4}>
          <Box borderWidth="1px" boxShadow="sm" p={4}>
            <Stack isInline justifyContent="space-between" alignItems="center">
              <Box>
                <Heading fontSize={4}>New CQ Exam:</Heading>
              </Box>
              <Stack isInline spacing={2}>
                <Button as={Link} to="..">
                  Cancel
                </Button>
                <Button type="reset">Reset</Button>
                <FormButton type="submit" variantColor="green">
                  Create
                </FormButton>
              </Stack>
            </Stack>
          </Box>

          <Stack borderWidth="1px" boxShadow="sm" p={4} spacing={4}>
            <FormInput name="name" label={`Name`} />

            <FormInput
              id="description"
              name="description"
              label={`Description`}
            />

            <FormInput
              type="number"
              step={5}
              name="totalMark"
              label={`Total Mark`}
            />

            <Box>
              <FormDatePicker
                name="date"
                label={`Date`}
                dateFormat="yyyy-dd-MM hh:mm aa"
                minDate={new Date()}
                showTimeSelect
              />
            </Box>

            <Box>
              <FormDatePicker
                name="submissionDeadline"
                label={`Submission Deadline`}
                dateFormat="yyyy-dd-MM hh:mm aa"
                minDate={date}
                showTimeSelect
              />
            </Box>

            <FormInput
              type="file"
              name="questionPaperPdf"
              label={`Question Paper (PDF)`}
              accept="application/pdf"
            />
          </Stack>
        </Stack>
      </Form>
    </Permit>
  )
}

export default CourseCQExamCreate

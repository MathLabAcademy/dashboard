import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/core'
import { Link } from '@reach/router'
import { FormButton } from 'components/HookForm/Button'
import { FormDatePicker } from 'components/HookForm/DatePicker'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormInput } from 'components/HookForm/Input'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getCQExam, updateCQExam } from 'store/cqExams'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getDefaultValues = (data) => ({
  date: get(data, 'date') ? DateTime.fromISO(get(data, 'date')).toJSDate() : '',
  name: get(data, 'name') || '',
  description: get(data, 'description') || '',
  questionPaperPdf: '',
  submissionDeadline: get(data, 'submissionDeadline')
    ? DateTime.fromISO(get(data, 'submissionDeadline')).toJSDate()
    : '',
  totalMark: get(data, 'totalMark') || 0,
})

const getValidationSchema = () => {
  return Yup.object({
    date: Yup.date().required(`required`),
    name: Yup.string().notRequired(),
    description: Yup.string().notRequired(),
    questionPaperPdf: Yup.mixed().notRequired(),
    submissionDeadline: Yup.date().min(Yup.ref('date')).notRequired(),
    totalMark: Yup.number().required(`required`),
  })
}

function CourseCQExamEdit({ cqExamId, navigate }) {
  const data = useSelector((state) => state.cqExams.byId[cqExamId])

  const dispatch = useDispatch()

  useEffect(() => {
    if (!data) dispatch(getCQExam(cqExamId))
  }, [data, cqExamId, dispatch])

  const toast = useToast()

  const defaultValues = useMemo(() => getDefaultValues(data), [data])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const form = useForm({
    defaultValues,
    validationSchema,
  })

  const formReset = form.reset
  useEffect(() => {
    formReset(defaultValues)
  }, [defaultValues, formReset])

  const onSubmit = useCallback(
    async ({ questionPaperPdf, ...values }) => {
      try {
        await dispatch(
          updateCQExam(cqExamId, {
            ...values,
            questionPaperPdf: questionPaperPdf[0],
          })
        )

        trackEventAnalytics({
          category: 'Teacher',
          action: 'Edited CQExam',
        })

        navigate('..')
      } catch (err) {
        handleAPIError(err, { form, toast })
      }
    },
    [cqExamId, dispatch, form, navigate, toast]
  )

  const date = form.watch('date')

  return (
    <Permit roles="teacher,assistant">
      <Form form={form} onSubmit={onSubmit}>
        <Stack spacing={4}>
          <Box borderWidth="1px" boxShadow="sm" p={4}>
            <Stack isInline justifyContent="space-between" alignItems="center">
              <Box>
                <Heading fontSize={4}>Edit CQ Exam #{get(data, 'id')}:</Heading>
              </Box>
              <Stack isInline spacing={2}>
                <Button as={Link} to="..">
                  Go Back
                </Button>
                <FormButton type="submit" variantColor="green">
                  Save
                </FormButton>
              </Stack>
            </Stack>
          </Box>

          <Stack borderWidth="1px" boxShadow="sm" p={4} spacing={4}>
            <FormInput id="name" name="name" label={`Name`} />

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
              label={`Question Paper (PDF) (ignore if you don't want to change)`}
              accept="application/pdf"
            />
          </Stack>
        </Stack>
      </Form>
    </Permit>
  )
}

export default CourseCQExamEdit

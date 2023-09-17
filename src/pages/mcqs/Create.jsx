import { Box, Stack } from '@chakra-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import Form from 'components/Form/Form'
import FormRichText from 'components/Form/RichText'
import FormSelect from 'components/Form/Select'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createMCQ } from 'store/actions/mcqs'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    text: Yup.string().required(`required`),
    guide: Yup.string().required(`required`),
    answerIndex: Yup.number().integer().min(0).max(3).required(`required`),
    options: Yup.array()
      .of(Yup.string().required(`required`))
      .min(4)
      .max(4)
      .required(`required`),
    tagIds: Yup.array().of(Yup.number().integer()),
  })
}

const getInitialValues = () => ({
  text: '',
  guide: '',
  answerIndex: '0',
  options: ['', '', '', ''],
  tagIds: [],
})

const answerIndexOptions = [0, 1, 2, 3].reduce((opts, index) => {
  opts[index] = `Option ${index + 1}`
  return opts
}, {})

function MCQCreate() {
  const navigate = useNavigate()

  const mcqTags = useSelector((state) => state.mcqTags)
  const tagOptions = useMemo(() => {
    return zipObject(
      mcqTags.allIds,
      mcqTags.allIds.map((id) => get(mcqTags.byId, [id, 'name']))
    )
  }, [mcqTags.allIds, mcqTags.byId])

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const dispatch = useDispatch()
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        const mcq = await dispatch(createMCQ(values))
        actions.resetForm()
        trackEventAnalytics({
          category: 'Teacher',
          action: 'Created MCQ',
        })
        navigate(`/mcqs/${mcq.id}`)
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [dispatch, navigate]
  )

  return (
    <Permit roles="teacher,assistant">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Create MCQ</Header>}
                Right={
                  <>
                    <Button as={Link} to="./..">
                      Go Back
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      isDisabled={!isValid || isSubmitting}
                      variantColor="green"
                    >
                      Save
                    </Button>
                  </>
                }
              />
            </Segment>

            <Stack borderWidth="1px" boxShadow="md" p={4} spacing={4}>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <Box>
                <FormRichText name="text" label={`Question`} />
              </Box>

              <Box>
                <FormSelect
                  name="answerIndex"
                  label={'Answer'}
                  options={answerIndexOptions}
                />
              </Box>

              <Box>
                <FormRichText name="guide" label={`Guide`} />
              </Box>

              <Stack borderWidth="1px" boxShadow="sm" p={4} spacing={4}>
                {values.options.map((_, index) => (
                  <Box key={`options.${index}`}>
                    <FormRichText
                      name={`options.${index}`}
                      label={`Option ${index + 1}`}
                    />
                  </Box>
                ))}
              </Stack>

              <FormSelect
                name="tagIds"
                label={`Tags`}
                options={tagOptions}
                fluid
                multiple
                search
                selection
              />
            </Stack>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

export default MCQCreate

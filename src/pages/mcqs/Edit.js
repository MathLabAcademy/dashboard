import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import FormRichText from 'components/Form/RichText.js'
import FormSelect from 'components/Form/Select.js'
import HeaderGrid from 'components/HeaderGrid'
import { Formik } from 'formik'
import {
  get,
  isUndefined,
  keyBy,
  map,
  mapValues,
  sortBy,
  zipObject
} from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getMCQ, readMCQAnswer, updateMCQ } from 'store/actions/mcqs.js'
import * as Yup from 'yup'

const getValidationSchema = options => {
  const textSchema = Yup.string().required(`required`)
  return Yup.object({
    id: Yup.number().required(`required`),
    text: textSchema,
    answerId: Yup.number()
      .integer()
      .oneOf(map(options, 'id'))
      .required(`required`),
    options: Yup.object(
      mapValues(keyBy(options, 'id'), () => textSchema)
    ).required(`required`),
    tagIds: Yup.array().of(Yup.number().integer())
  })
}

const getInitialValues = (mcq, options, answerId) => ({
  id: get(mcq, 'id'),
  text: get(mcq, 'text'),
  answerId: String(answerId || ''),
  options: mapValues(keyBy(options, 'id'), 'text'),
  tagIds: get(mcq, 'tagIds').map(String)
})

function MCQEdit({
  mcqId,
  mcq,
  getMCQ,
  answerId,
  readMCQAnswer,
  mcqTags,
  updateMCQ
}) {
  useEffect(() => {
    if (!mcq) getMCQ(mcqId)
  }, [getMCQ, mcq, mcqId])

  useEffect(() => {
    if (isUndefined(answerId)) readMCQAnswer(mcqId)
  }, [answerId, mcqId, readMCQAnswer])

  const options = useMemo(() => {
    return sortBy(get(mcq, 'Options'), 'id')
  }, [mcq])

  const initialValues = useMemo(
    () => getInitialValues(mcq, options, answerId),
    [answerId, mcq, options]
  )
  const validationSchema = useMemo(() => getValidationSchema(options), [
    options
  ])

  const onSubmit = useCallback(
    async ({ id, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await updateMCQ(id, values)
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
    [updateMCQ]
  )

  const answerIndexOptions = useMemo(() => {
    return options.reduce((opts, { id }, index) => {
      opts[id] = `Option ${index + 1}`
      return opts
    }, {})
  }, [options])

  const tagOptions = useMemo(() => {
    return zipObject(
      mcqTags.allIds,
      mcqTags.allIds.map(id => get(mcqTags.byId, [id, 'name']))
    )
  }, [mcqTags.allIds, mcqTags.byId])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form>
          <Segment>
            <HeaderGrid
              Left={<Header>Edit MCQ #{mcqId}</Header>}
              Right={
                <>
                  <Button as={Link} to={`..`}>
                    Go Back
                  </Button>
                  <Button type="reset">Reset</Button>
                  <Button
                    positive
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                  >
                    Save
                  </Button>
                </>
              }
            />
          </Segment>
          <Segment>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>

            <FormRichText name="text" label={`Question`} />

            <FormSelect
              name="answerId"
              label={`Answer`}
              options={answerIndexOptions}
            />

            <Segment secondary>
              {Object.keys(values.options).map((mcqOptionId, index) => (
                <FormRichText
                  key={`options.${mcqOptionId}`}
                  name={`options.${mcqOptionId}`}
                  label={`Option ${index + 1}`}
                />
              ))}
            </Segment>

            <FormSelect
              name="tagIds"
              label={`Tags`}
              options={tagOptions}
              fluid
              multiple
              search
              selection
            />
          </Segment>
        </Form>
      )}
    </Formik>
  )
}

const mapStateToProps = ({ mcqs, mcqTags }, { mcqId }) => ({
  mcq: get(mcqs.byId, mcqId),
  answerId: get(mcqs.answerById, mcqId),
  mcqTags
})

const mapDispatchToProps = {
  getMCQ,
  readMCQAnswer,
  updateMCQ
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQEdit)

import Form from 'components/Form/Form'
import FormRichText from 'components/Form/RichText'
import FormSelect from 'components/Form/Select'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get, keyBy, map, mapValues } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal, Segment } from 'semantic-ui-react'
import { updateMCQ } from 'store/actions/mcqs'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getValidationSchema = (options) => {
  const textSchema = Yup.string().required(`required`)
  return Yup.object({
    id: Yup.number().required(`required`),
    text: textSchema,
    guide: textSchema,
    answerId: Yup.number()
      .integer()
      .oneOf(map(options, 'id'))
      .required(`required`),
    options: Yup.object(
      mapValues(keyBy(options, 'id'), () => textSchema)
    ).required(`required`),
  })
}

const getInitialValues = (mcq, options, answerId) => ({
  id: get(mcq, 'id'),
  text: get(mcq, 'text'),
  guide: get(mcq, 'guide') || '',
  answerId: String(answerId || ''),
  options: mapValues(keyBy(options, 'id'), 'text'),
})

function EditMCQ({ index, mcq, options, answerId, updateMCQ }) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(
    () => getInitialValues(mcq, options, answerId),
    [answerId, mcq, options]
  )
  const validationSchema = useMemo(() => getValidationSchema(options), [
    options,
  ])

  const onSubmit = useCallback(
    async ({ id, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await updateMCQ(id, values)
        trackEventAnalytics({
          category: 'Teacher',
          action: 'Edited MCQ from MCQExam screen',
        })
        handle.close()
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
    [handle, updateMCQ]
  )

  const answerIndexOptions = useMemo(() => {
    return options.reduce((opts, { id }, index) => {
      opts[id] = `Option ${index + 1}`
      return opts
    }, {})
  }, [options])

  return (
    <Permit roles="teacher,assistant">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Modal
            trigger={
              <Button
                type="button"
                color="blue"
                onClick={handle.open}
                label={answerId ? null : '?'}
                content={'Edit'}
              />
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>Edit MCQ #{index + 1}</Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormRichText name="text" label={`Question`} />

              <FormSelect
                name="answerId"
                label={`Answer`}
                options={answerIndexOptions}
              />

              <FormRichText name="guide" label={`Guide`} />

              <Segment secondary>
                {Object.keys(values.options).map((mcqOptionId, index) => (
                  <FormRichText
                    key={`options.${mcqOptionId}`}
                    name={`options.${mcqOptionId}`}
                    label={`Option ${index + 1}`}
                  />
                ))}
              </Segment>
            </Modal.Content>

            <Modal.Actions>
              <Button type="reset">Reset</Button>
              <Button
                positive
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updateMCQ,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMCQ)

import Form from 'components/Form/Form.js'
import FormRichText from 'components/Form/RichText.js'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import { get, keyBy, mapValues } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal, Segment } from 'semantic-ui-react'
import { updateMCQ } from 'store/actions/mcqs.js'
import * as Yup from 'yup'

const getValidationSchema = options => {
  const textSchema = Yup.string().required(`required`)
  return Yup.object({
    id: Yup.number().required(`required`),
    mcqExamId: Yup.number().required(`required`),
    text: textSchema,
    options: Yup.object(
      mapValues(keyBy(options, 'id'), () => textSchema)
    ).required(`required`)
  })
}

const getInitialValues = (mcq, options) => ({
  id: get(mcq, 'id'),
  mcqExamId: get(mcq, 'mcqExamId'),
  text: get(mcq, 'text'),
  options: mapValues(keyBy(options, 'id'), 'text')
})

function EditMCQ({ index, mcq, options, updateMCQ }) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(mcq, options), [
    mcq,
    options
  ])
  const validationSchema = useMemo(() => getValidationSchema(options), [
    options
  ])

  const onSubmit = useCallback(
    async ({ id, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await updateMCQ(id, values)
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Modal
          trigger={
            <Button type="button" color="blue" onClick={handle.open}>
              Edit
            </Button>
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
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updateMCQ
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMCQ)

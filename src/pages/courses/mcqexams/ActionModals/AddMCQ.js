import Form from 'components/Form/Form.js'
import FormRichText from 'components/Form/RichText.js'
import { ErrorMessage, Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal, Segment } from 'semantic-ui-react'
import { createMCQ } from 'store/actions/mcqs.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    text: Yup.string().required(`required`),
    options: Yup.array()
      .of(Yup.string().required(`required`))
      .min(4)
      .max(4)
      .required(`required`)
  })
}

const getInitialValues = mcqExamId => ({
  mcqExamId,
  text: '',
  options: ['', '', '', '']
})

function AddMCQ({ mcqExamId, createMCQ }) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(mcqExamId), [mcqExamId])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createMCQ(values)
        actions.resetForm()
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
    [createMCQ, handle]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Modal
          trigger={
            <Button type="button" color="blue" onClick={handle.open}>
              Add MCQ
            </Button>
          }
          as={Form}
          closeIcon
          open={open}
          onClose={handle.close}
        >
          <Modal.Header>Add MCQ</Modal.Header>

          <Modal.Content>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>

            <FormRichText name="text" label={`Question`} />

            <Segment secondary>
              <ErrorMessage
                name={`options`}
                component="p"
                className="red text"
              />

              {values.options.map((_, index) => (
                <FormRichText
                  key={`options.${index}`}
                  name={`options.${index}`}
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
  createMCQ
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMCQ)

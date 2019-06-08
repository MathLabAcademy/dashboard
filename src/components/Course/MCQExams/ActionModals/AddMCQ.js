import Form from 'components/Form/Form.js'
import FormRichText from 'components/Form/RichText.js'
import FormSelect from 'components/Form/Select.js'
import HeaderGrid from 'components/HeaderGrid'
import TmpImageGalleryModal from 'components/MCQs/TmpImageGalleryModal'
import Permit from 'components/Permit'
import { ErrorMessage, Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal, Segment } from 'semantic-ui-react'
import { createMCQ } from 'store/actions/mcqs.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    text: Yup.string().required(`required`),
    answerIndex: Yup.number()
      .integer()
      .min(0)
      .max(3)
      .required(`required`),
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
  answerIndex: '0',
  options: ['', '', '', '']
})

const answerIndexOptions = [0, 1, 2, 3].reduce((opts, index) => {
  opts[index] = `Option ${index + 1}`
  return opts
}, {})

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

  const [galleryOpen, galleryHandler] = useToggle(false)

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Add New MCQ
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>
              <HeaderGrid
                Left={<Header>Add New MCQ</Header>}
                Right={
                  <Modal
                    closeIcon
                    open={galleryOpen}
                    onClose={galleryHandler.close}
                    trigger={
                      <Button
                        type="button"
                        icon="images"
                        onClick={galleryHandler.open}
                      />
                    }
                  >
                    <Modal.Header>Temporary Images</Modal.Header>
                    <Modal.Content>
                      <TmpImageGalleryModal />
                    </Modal.Content>
                  </Modal>
                }
              />
            </Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormRichText name="text" label={`Question`} />

              <FormSelect
                name="answerIndex"
                label={'Answer'}
                options={answerIndexOptions}
              />

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
    </Permit>
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

import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormRichText from 'components/Form/RichText'
import FormSelect from 'components/Form/Select'
import HeaderGrid from 'components/HeaderGrid'
import TmpImageGalleryModal from 'components/MCQs/TmpImageGalleryModal'
import Permit from 'components/Permit'
import { ErrorMessage, Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal, Segment } from 'semantic-ui-react'
import { createMCQ } from 'store/actions/mcqs'
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

function MCQCreate({ createMCQ, mcqTags, navigate }) {
  const tagOptions = useMemo(() => {
    return zipObject(
      mcqTags.allIds,
      mcqTags.allIds.map((id) => get(mcqTags.byId, [id, 'name']))
    )
  }, [mcqTags.allIds, mcqTags.byId])

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createMCQ(values)
        actions.resetForm()
        navigate('..')
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
    [createMCQ, navigate]
  )

  const [galleryOpen, galleryHandler] = useToggle(false)

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
                name="answerIndex"
                label={'Answer'}
                options={answerIndexOptions}
              />

              <FormRichText name="guide" label={`Guide`} />

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
    </Permit>
  )
}

const mapStateToProps = ({ mcqTags }) => ({
  mcqTags,
})

const mapDispatchToProps = {
  createMCQ,
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQCreate)

import Form from 'components/Form/Form.js'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { DraftViewer } from 'components/Draft/index.js'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import { get } from 'lodash-es'
import React, { useCallback, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  FormField,
  Header,
  Input,
  Message,
  Modal,
  Segment
} from 'semantic-ui-react'
import { addQuestionToMCQExam } from 'store/actions/mcqExams.js'
import { getMCQ } from 'store/actions/mcqs.js'
import * as Yup from 'yup'

function _Picker({ mcqId, mcqs, getMCQ, name, setFieldValue, setFieldError }) {
  const ref = useRef(null)

  const mcq = useMemo(() => {
    return get(mcqs.byId, mcqId)
  }, [mcqId, mcqs.byId])

  const showMCQ = useCallback(async () => {
    if (!ref.current) return

    const id = ref.current.inputRef.current.value

    const mcq = get(mcqs.byId, id)

    try {
      if (id && !mcq) await getMCQ(id)

      setFieldValue(name, id)
      setFieldError(name)
    } catch (err) {
      if (err.status === 404) {
        setFieldError(name, 'Not Found!')
      } else throw err
    }
  }, [getMCQ, mcqs.byId, name, setFieldError, setFieldValue])

  return (
    <>
      <FormField>
        <label htmlFor="pickedMcqId">Enter MCQ ID:</label>
        <Input
          id="pickedMcqId"
          ref={ref}
          action={
            <Button type="button" onClick={showMCQ}>
              Show
            </Button>
          }
        />
      </FormField>

      {mcq && (
        <Segment basic>
          <Header>
            <Header.Subheader>ID: #{mcqId}</Header.Subheader>
            <DraftViewer rawValue={mcq.text} />
          </Header>
        </Segment>
      )}
    </>
  )
}

const Picker = connect(
  ({ mcqs }) => ({ mcqs }),
  { getMCQ }
)(_Picker)

const getValidationSchema = mcqIds => {
  return Yup.object({
    mcqId: Yup.number()
      .integer()
      .notOneOf(mcqIds, `already picked`)
      .required(`required`)
  })
}

const getInitialValues = () => ({
  mcqId: ''
})

function PickMCQ({ mcqExamId, mcqIds, addQuestionToMCQExam }) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(mcqExamId), [mcqExamId])
  const validationSchema = useMemo(() => getValidationSchema(mcqIds), [mcqIds])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await addQuestionToMCQExam(mcqExamId, values)
        actions.resetForm()
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
    [addQuestionToMCQExam, mcqExamId]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          isSubmitting,
          isValid,
          values,
          errors,
          status,
          setFieldValue,
          setFieldError
        }) => (
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Pick MCQ
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>Pick MCQ</Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <Picker
                name="mcqId"
                mcqId={values.mcqId}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
              />
            </Modal.Content>

            <Modal.Actions>
              <HeaderGrid
                Left={
                  <Message
                    color="yellow"
                    hidden={!errors.mcqId}
                    content={errors.mcqId}
                  />
                }
                Right={
                  <>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Pick
                    </Button>
                  </>
                }
              />
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  addQuestionToMCQExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PickMCQ)

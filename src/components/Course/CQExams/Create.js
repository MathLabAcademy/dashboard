import { Link } from '@reach/router'
import FormFile from 'components/Form/File'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createCQExam } from 'store/actions/cqExams'
import * as Yup from 'yup'

const getInitialValues = (courseId) => ({
  courseId: Number(courseId),
  date: '',
  name: '',
  description: '',
  questionPaperPdf: '',
})

const getValidationSchema = () => {
  return Yup.object({
    date: Yup.date()
      .min(DateTime.local().toISODate(), `date already passed`)
      .required(`required`),
    name: Yup.string().notRequired(),
    description: Yup.string().notRequired(),
    questionPaperPdf: Yup.mixed().required(`required`),
  })
}

function CourseMCQExamCreate({ courseId, createCQExam, navigate }) {
  const initialValues = useMemo(() => getInitialValues(courseId), [courseId])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createCQExam(values)
        navigate(`/courses/${courseId}/cqexams`)
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          console.error(err)
          actions.setStatus(null)
        }
      }

      actions.setSubmitting(false)
    },
    [courseId, createCQExam, navigate]
  )

  return (
    <Permit roles="teacher">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>New CQ Exam:</Header>}
                Right={
                  <>
                    <Button as={Link} to="..">
                      Cancel
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Create
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput type="date" name="date" label={`Date`} />

              <FormInput name="name" label={`Name`} />

              <FormInput
                id="description"
                name="description"
                label={`Description`}
              />

              <FormFile
                name="questionPaperPdf"
                label={`Question Paper (PDF)`}
                accept="application/pdf"
              />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  createCQExam,
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseMCQExamCreate)

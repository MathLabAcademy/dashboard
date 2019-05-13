import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import FormField from 'components/Form/Input.js'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createMCQExam } from 'store/actions/mcqExams.js'
import * as Yup from 'yup'

const getInitialValues = courseId => ({
  courseId: Number(courseId),
  date: '',
  name: '',
  description: ''
})

const getValidationSchema = () => {
  return Yup.object({
    date: Yup.date()
      .min(DateTime.local().toISODate(), `date already passed`)
      .required(`required`),
    name: Yup.string().notRequired(),
    description: Yup.string().notRequired()
  })
}

function CourseMCQExamCreate({ courseId, createMCQExam, navigate }) {
  const initialValues = useMemo(() => getInitialValues(courseId), [courseId])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      try {
        await createMCQExam(values)
        actions.setStatus(null)
        navigate(`/courses/${courseId}/mcqexams`)
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
    [courseId, createMCQExam, navigate]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>New MCQ Exam:</Header>}
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

              <FormField type="date" id="date" name="date" label={`Date`} />

              <FormField id="name" name="name" label={`Name`} />

              <FormField
                id="description"
                name="description"
                label={`Description`}
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
  createMCQExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamCreate)

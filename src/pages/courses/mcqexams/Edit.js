import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import FormField from 'components/Form/Input.js'
import HeaderGrid from 'components/HeaderGrid'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getMCQExam, updateMCQExam } from 'store/actions/mcqExams.js'
import * as Yup from 'yup'

const getInitialValues = data => ({
  date: DateTime.fromISO(get(data, 'date')).toISODate() || '',
  name: get(data, 'name') || '',
  description: get(data, 'description') || ''
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

function CourseMCQExamEdit({
  courseId,
  mcqExamId,
  data,
  getData,
  updateMCQExam
}) {
  useEffect(() => {
    if (!data) getData(mcqExamId)
  }, [data, getData, mcqExamId])

  const initialValues = useMemo(() => getInitialValues(data), [data])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      try {
        await updateMCQExam(mcqExamId, values)
        actions.setStatus(null)
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
    [mcqExamId, updateMCQExam]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, status }) => (
        <Form>
          <Segment>
            <HeaderGrid
              Left={<Header as="h2">Edit MCQ Exam #{get(data, 'id')}:</Header>}
              Right={
                <>
                  <Button as={Link} to="..">
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
  )
}

const mapStateToProps = ({ mcqExams }, { mcqExamId }) => ({
  data: get(mcqExams.byId, mcqExamId)
})

const mapDispatchToProps = {
  getData: getMCQExam,
  updateMCQExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamEdit)
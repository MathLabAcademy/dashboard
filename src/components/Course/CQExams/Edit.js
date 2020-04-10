import { Link } from '@reach/router'
import FormFile from 'components/Form/File'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getCQExam, updateCQExam } from 'store/actions/cqExams'
import * as Yup from 'yup'

const getInitialValues = (data) => ({
  date: DateTime.fromISO(get(data, 'date')).toISODate() || '',
  name: get(data, 'name') || '',
  description: get(data, 'description') || '',
  questionPaperPdf: '',
})

const getValidationSchema = () => {
  return Yup.object({
    date: Yup.date()
      .min(DateTime.local().toISODate(), `date already passed`)
      .required(`required`),
    name: Yup.string().notRequired(),
    description: Yup.string().notRequired(),
    questionPaperPdf: Yup.mixed().notRequired(),
  })
}

function CourseCQExamEdit({ cqExamId, data, getData, updateCQExam }) {
  useEffect(() => {
    if (!data) getData(cqExamId)
  }, [data, getData, cqExamId])

  const initialValues = useMemo(() => getInitialValues(data), [data])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateCQExam(cqExamId, values)
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
    [cqExamId, updateCQExam]
  )

  return (
    <Permit roles="teacher">
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
                Left={<Header as="h2">Edit CQ Exam #{get(data, 'id')}:</Header>}
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

              <FormInput type="date" id="date" name="date" label={`Date`} />

              <FormInput id="name" name="name" label={`Name`} />

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

const mapStateToProps = ({ cqExams }, { cqExamId }) => ({
  data: get(cqExams.byId, cqExamId),
})

const mapDispatchToProps = {
  getData: getCQExam,
  updateCQExam,
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseCQExamEdit)

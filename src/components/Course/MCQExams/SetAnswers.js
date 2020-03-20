import { Link } from '@reach/router'
import FormExclusiveCheckboxField from 'components/Form/ExclusiveCheckboxField'
import Form from 'components/Form/Form'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { DraftViewer } from 'components/Draft/index'
import { Formik } from 'formik'
import { get, map, sortBy } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Divider,
  Grid,
  Header,
  Message,
  Segment
} from 'semantic-ui-react'
import {
  getAllMCQAnswersForExam,
  getAllMCQsForExam,
  setMCQAnswers
} from 'store/actions/mcqs'
import * as Yup from 'yup'

const optionLetters = ['a', 'b', 'c', 'd']

function MCQ({ mcq, index }) {
  const options = useMemo(() => {
    return sortBy(mcq.Options, 'id')
  }, [mcq.Options])

  return (
    <Permit teacher>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>#{index + 1}</Header.Subheader>
            <DraftViewer rawValue={mcq.text} />
          </Header>
        }
      />

      <Segment basic>
        <Grid columns={2} stackable>
          {options.map((option, index) => (
            <Grid.Column key={option.id}>
              <FormExclusiveCheckboxField
                name={String(mcq.id)}
                value={String(option.id)}
                label={
                  <>
                    {optionLetters[index]}.{' '}
                    <DraftViewer rawValue={option.text} inline />
                  </>
                }
              />
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    </Permit>
  )
}

const getValidationSchema = (mcqIds, mcqs) => {
  return Yup.object({
    ...mcqIds.reduce((schema, id) => {
      schema[id] = Yup.number()
        .integer()
        .oneOf(map(get(mcqs.byId, [id, 'Options']), 'id'))
        .required(`required`)
      return schema
    }, {})
  })
}

const getInitialValues = (mcqIds, mcqs) => {
  return mcqIds.reduce((values, id) => {
    values[id] = String(get(mcqs.answerById, id) || '')
    return values
  }, {})
}

function CourseMCQExamSetAnswers({
  courseId,
  mcqExamId,
  mcqs,
  getAllMCQsForExam,
  getAllMCQAnswersForExam,
  setMCQAnswers
}) {
  useEffect(() => {
    getAllMCQsForExam(mcqExamId)
    getAllMCQAnswersForExam(mcqExamId)
  }, [getAllMCQAnswersForExam, getAllMCQsForExam, mcqExamId])

  const mcqIds = useMemo(() => {
    const McqExamId = Number(mcqExamId)
    return mcqs.allIds
      .filter(id => get(mcqs.byId, [id, 'mcqExamId']) === McqExamId)
      .sort()
  }, [mcqExamId, mcqs.allIds, mcqs.byId])

  const initialValues = useMemo(() => getInitialValues(mcqIds, mcqs), [
    mcqIds,
    mcqs
  ])
  const validationSchema = useMemo(() => getValidationSchema(mcqIds, mcqs), [
    mcqIds,
    mcqs
  ])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await setMCQAnswers({
          byId: values
        })
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
    [setMCQAnswers]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, status }) => (
        <Segment as={Form}>
          <HeaderGrid
            Left={<Header>Set MCQ Answers</Header>}
            Right={
              <>
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

          <Message color="yellow" hidden={!status}>
            {status}
          </Message>

          {mcqIds
            .map(id => get(mcqs.byId, id))
            .map((mcq, index) => (
              <React.Fragment key={index}>
                <MCQ index={index} mcq={mcq} />
                {index + 1 < mcqIds.length && <Divider section />}
              </React.Fragment>
            ))}
        </Segment>
      )}
    </Formik>
  )
}

const mapStateToProps = ({ mcqs }) => ({
  mcqs
})

const mapDispatchToProps = {
  getAllMCQsForExam,
  getAllMCQAnswersForExam,
  setMCQAnswers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamSetAnswers)

import { Link, Router } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getMCQExam } from 'store/actions/mcqExams.js'
import Questions from './Questions.js'
import SetAnswers from './SetAnswers.js'
import TakeExam from './Take.js'

function View({ courseId, mcqExamId }) {
  return (
    <>
      <Permit student>
        <TakeExam courseId={courseId} mcqExamId={mcqExamId} />
      </Permit>
      <Permit teacher>
        <Questions courseId={courseId} mcqExamId={mcqExamId} />
      </Permit>
    </>
  )
}

function CourseMCQExamView({ courseId, mcqExamId, mcqExam, getMCQExam }) {
  useEffect(() => {
    if (!mcqExam) getMCQExam(mcqExamId)
  }, [mcqExam, getMCQExam, mcqExamId])

  return (
    <>
      <Segment loading={!mcqExam}>
        <HeaderGrid
          Left={
            <Header>
              MCQ Exam: {get(mcqExam, 'name')}
              <Header.Subheader>{get(mcqExam, 'description')}</Header.Subheader>
            </Header>
          }
          Right={
            <>
              <Permit teacher>
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>
            </>
          }
        />
      </Segment>

      <Router>
        <View path="/" courseId={courseId} />
        <SetAnswers path="set-answers" courseId={courseId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ mcqExams }, { mcqExamId }) => ({
  mcqExam: get(mcqExams.byId, mcqExamId)
})

const mapDispatchToProps = {
  getMCQExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamView)

import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getMCQExam } from 'store/actions/mcqExams.js'

import Questions from './Questions.js'
import SetAnswers from './SetAnswers.js'
import { Router } from '@reach/router'

function CourseMCQExamView({ courseId, mcqExamId, data, getData }) {
  useEffect(() => {
    if (!data) getData(mcqExamId)
  }, [data, getData, mcqExamId])

  return (
    <>
      <Segment loading={!data}>
        <HeaderGrid
          Left={
            <Header>
              MCQ Exam: {get(data, 'name')}
              <Header.Subheader>{get(data, 'description')}</Header.Subheader>
            </Header>
          }
          Right={
            <Permit teacher>
              <Button as={Link} to={`edit`}>
                Edit
              </Button>
            </Permit>
          }
        />
      </Segment>

      <Router>
        <Questions path="/" courseId={courseId} />
        <SetAnswers path="set-answers" courseId={courseId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ mcqExams }, { mcqExamId }) => ({
  data: get(mcqExams.byId, mcqExamId)
})

const mapDispatchToProps = {
  getData: getMCQExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamView)

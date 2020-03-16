import { Link, Router } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Box, Text } from 'rebass'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getMCQExam } from 'store/actions/mcqExams'
import TakeExam from './Take.js'
import TeacherResults from './TeacherResults'
import TeacherView from './TeacherView'

function View({ courseId, mcqExamId }) {
  return (
    <>
      <Permit student>
        <TakeExam courseId={courseId} mcqExamId={mcqExamId} />
      </Permit>
      <Permit teacher>
        <TeacherView courseId={courseId} mcqExamId={mcqExamId} />
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
            <>
              <Header>
                MCQ Exam: {get(mcqExam, 'name')}
                <Header.Subheader>
                  {get(mcqExam, 'description')}
                </Header.Subheader>
              </Header>

              <Box>
                <Text>
                  <strong>Date: </strong>
                  {DateTime.fromISO(get(mcqExam, 'date')).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </Text>
                <Text>
                  <strong>Exam Duration: </strong>
                  {get(mcqExam, 'duration') / 60} minutes
                </Text>
              </Box>
            </>
          }
          Right={
            <>
              <Permit teacher>
                <Button as={Link} to={`results`} color="blue">
                  Results
                </Button>
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
        <TeacherResults path="/results" courseId={courseId} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CourseMCQExamView)

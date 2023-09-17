import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { Text } from 'rebass'
import { Box } from 'reflexbox'
import { Button, Header, Segment } from 'semantic-ui-react'
import { useMCQExam } from 'store/mcqExams/hooks'
import TakeExam from './Take'
import TeacherResults from './TeacherResults'
import TeacherView from './TeacherView'

function View({ courseId, mcqExamId }) {
  return (
    <>
      <Permit roles="student">
        <TakeExam courseId={courseId} mcqExamId={mcqExamId} />
      </Permit>
      <Permit roles="teacher,analyst,assistant">
        <TeacherView courseId={courseId} mcqExamId={mcqExamId} />
      </Permit>
    </>
  )
}

function CourseMCQExamView({ courseId }) {
  const { mcqExamId } = useParams()
  const mcqExam = useMCQExam(mcqExamId)

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
              <Permit roles="teacher,analyst,assistant">
                <Button as={Link} to={`results`} color="blue">
                  Results
                </Button>
              </Permit>
              <Permit roles="teacher,assistant">
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>
            </>
          }
        />
      </Segment>

      <Routes>
        <Route
          element={<View courseId={courseId} mcqExamId={mcqExamId} />}
          path="/"
        />
        <Route
          element={<TeacherResults courseId={courseId} mcqExamId={mcqExamId} />}
          path="/results"
        />
      </Routes>
    </>
  )
}

export default CourseMCQExamView

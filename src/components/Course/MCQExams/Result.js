import { Stack, Text } from '@chakra-ui/core'
import { DraftViewer } from 'components/Draft'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get, keyBy, mapValues } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Icon, Segment } from 'semantic-ui-react'
import {
  getAllQuestionsForExam,
  getAllSubmissions,
  pingTracker,
  readTracker,
  startTracker,
} from 'store/actions/mcqExams'
import { getAllMCQsForExam } from 'store/actions/mcqs'
import api from 'utils/api'
import { emptyArray } from 'utils/defaults'

const optionLetters = ['a', 'b', 'c', 'd']

function MCQExamResult({
  userId,
  mcqExam,
  mcqExamId,
  mcqIds,
  getAllQuestionsForExam,
  tracker,
  readTracker,
  startTracker,
  pingTracker,
  getAllMCQsForExam,
  getAllSubmissions,
}) {
  const [data, setData] = useState(null)

  useEffect(() => {
    readTracker(mcqExamId)
  }, [mcqExamId, readTracker])

  useEffect(() => {
    if (tracker && tracker.end) {
      api(`/users/${userId}/mcqexams/${mcqExamId}/result`).then(({ data }) => {
        setData(data)
      })
    }
  }, [mcqExamId, tracker, userId])

  const submittedOptionIdByQuestionId = useMemo(() => {
    return mapValues(
      keyBy(get(data, 'Submissions', emptyArray), 'mcqId'),
      'mcqOptionId'
    )
  }, [data])

  const summary = useMemo(() => {
    const correctOptionIdByQuestionId = mapValues(
      keyBy(get(data, 'Questions', emptyArray), 'id'),
      'Answer.id'
    )

    return {
      answersSubmitted: get(data, 'Submissions', emptyArray).length,
      correctlyAnswered: get(data, 'Submissions', emptyArray).filter(
        ({ mcqId, mcqOptionId }) => {
          return mcqOptionId === correctOptionIdByQuestionId[mcqId]
        }
      ).length,
      totalQuestions: get(data, 'Questions', emptyArray).length,
      startTime: DateTime.fromISO(
        get(data, 'Trackers[0].start')
      ).toLocaleString(DateTime.DATETIME_MED),
      endTime: DateTime.fromISO(get(data, 'Trackers[0].end')).toLocaleString(
        DateTime.DATETIME_MED
      ),
      lastPingTime: DateTime.fromISO(
        get(data, 'Trackers[0].ping')
      ).toLocaleString(DateTime.DATETIME_MED),
    }
  }, [data])

  return (
    <Permit roles="student">
      <Segment>
        <Stack>
          <Text>
            <strong>Exam Start Time: </strong>
            {summary.startTime}
          </Text>
          <Text>
            <strong>Last Ping Time: </strong>
            {summary.lastPingTime}
          </Text>
          <Text>
            <strong>Exam End Time: </strong>
            {summary.endTime}
          </Text>
          <br />
          <Text>
            <strong>Answers Submitted: </strong>
            {summary.answersSubmitted} / {summary.totalQuestions}
          </Text>
          <Text>
            <strong>Correctly Answered: </strong>
            {summary.correctlyAnswered} / {summary.totalQuestions}
          </Text>
        </Stack>
      </Segment>

      {get(data, 'Questions', emptyArray).map((question, index) => (
        <Segment key={get(question, 'id')}>
          <HeaderGrid
            Left={
              <Header>
                <Header.Subheader>{index + 1}.</Header.Subheader>
                <DraftViewer rawValue={get(question, 'text')} />
              </Header>
            }
          />

          <Segment basic>
            <Grid columns={1}>
              {get(question, 'Options', emptyArray).map((option, index) => (
                <Grid.Column key={option.id}>
                  {optionLetters[index]}.{' '}
                  <DraftViewer rawValue={option.text} inline />{' '}
                  {submittedOptionIdByQuestionId[question.id] === option.id &&
                    (option.id === get(question, 'Answer.id') ? (
                      <Icon name="check" color="blue" />
                    ) : (
                      <Icon name="x" color="red" />
                    ))}
                  {option.id === get(question, 'Answer.id') && (
                    <Icon name="check" color="green" />
                  )}
                </Grid.Column>
              ))}
            </Grid>
          </Segment>

          <Segment basic>
            <Header size="small">Guide</Header>
            <DraftViewer rawValue={get(question, 'guide')} />
          </Segment>
        </Segment>
      ))}
    </Permit>
  )
}

const mapStateToProps = ({ mcqExams, user }, { mcqExamId }) => ({
  userId: user.data.id,
  mcqExam: get(mcqExams.byId, mcqExamId),
  mcqIds: get(mcqExams.questionsById, mcqExamId, emptyArray),
  tracker: get(mcqExams.trackersById, [mcqExamId, user.data.id]),
})

const mapDispatchToProps = {
  getAllQuestionsForExam,
  readTracker,
  startTracker,
  pingTracker,
  getAllMCQsForExam,
  getAllSubmissions,
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQExamResult)

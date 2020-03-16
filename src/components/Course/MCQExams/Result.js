import { DraftViewer } from 'components/Draft'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get, keyBy, mapValues } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Icon } from 'semantic-ui-react'
import {
  getAllQuestionsForExam,
  getAllSubmissions,
  pingTracker,
  readTracker,
  startTracker
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
  getAllSubmissions
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

  return (
    <Permit student>
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
                    option.id !== get(question, 'Answer.id') && (
                      <Icon name="x" color="red" />
                    )}
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
  tracker: get(mcqExams.trackersById, [mcqExamId, user.data.id])
})

const mapDispatchToProps = {
  getAllQuestionsForExam,
  readTracker,
  startTracker,
  pingTracker,
  getAllMCQsForExam,
  getAllSubmissions
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQExamResult)

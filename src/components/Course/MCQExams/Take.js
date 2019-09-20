import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { DraftViewer } from 'components/Draft/index.js'
import useCountdown from 'hooks/useCountdown.js'
import useInterval from 'hooks/useInterval.js'
import { get, sortBy } from 'lodash-es'
import { DateTime, Duration } from 'luxon'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Label,
  Message,
  Segment
} from 'semantic-ui-react'
import {
  getAllQuestionsForExam,
  getAllSubmissions,
  pingTracker,
  readTracker,
  startTracker
} from 'store/actions/mcqExams.js'
import { getAllMCQsForExam, submit as submitMCQ } from 'store/actions/mcqs.js'
import { emptyArray } from 'utils/defaults'

const optionLetters = ['a', 'b', 'c', 'd']

function _MCQ({
  index,
  mcqExamId,
  mcqId,
  mcq,
  submitMCQ,
  submission,
  readOnly
}) {
  const [error, setError] = useState(null)
  const timer = useRef(null)

  const options = useMemo(() => {
    return sortBy(get(mcq, 'Options', emptyArray), 'id')
  }, [mcq])

  const handleOptionSelect = useCallback(
    async (_, { value }) => {
      try {
        if (value !== get(submission, 'mcqOptionId')) {
          await submitMCQ(mcqExamId, mcqId, { mcqOptionId: value })
        }
      } catch (err) {
        if (err.message) {
          if (timer.current) clearTimeout(timer.current)
          setError(err.message)
          timer.current = setTimeout(() => setError(null), 1500)
        } else throw err
      }
    },
    [mcqExamId, mcqId, submission, submitMCQ]
  )

  return (
    <>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>#{index + 1}</Header.Subheader>
            <DraftViewer rawValue={get(mcq, 'text')} />
          </Header>
        }
      />

      <Segment basic>
        <Grid columns={2} stackable>
          {options.map((option, index) => (
            <Grid.Column key={option.id}>
              <Checkbox
                id={option.id}
                value={option.id}
                checked={get(submission, 'mcqOptionId') === option.id}
                label={
                  <label htmlFor={option.id}>
                    {optionLetters[index]}.{' '}
                    <DraftViewer rawValue={option.text} inline />
                  </label>
                }
                disabled={readOnly}
                onChange={handleOptionSelect}
              />
            </Grid.Column>
          ))}
        </Grid>
      </Segment>

      <Message color="yellow" hidden={!error}>
        {error}
      </Message>
    </>
  )
}

const MCQ = connect(
  ({ mcqExams, mcqs, user }, { mcqExamId, mcqId }) => ({
    mcq: get(mcqs.byId, mcqId),
    submission: get(mcqExams.submissionsById, [mcqExamId, user.data.id, mcqId])
  }),
  { submitMCQ }
)(_MCQ)

function MCQExamTake({
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
  useEffect(() => {
    readTracker(mcqExamId)
  }, [mcqExamId, readTracker])

  console.log(tracker)
  const data = useMemo(() => {
    const data = { started: false, ended: false }

    if (!get(tracker, 'start') || !get(tracker, 'end')) {
      return data
    }

    const now = DateTime.local()
    const start = DateTime.fromISO(tracker.start)
    const end = DateTime.fromISO(tracker.end)

    console.log(now, start, end)

    data.started = now >= start
    data.ended = now > end

    return data
  }, [tracker])

  useEffect(() => {
    if (data.started) getAllMCQsForExam(mcqExamId)
  }, [data.started, getAllMCQsForExam, mcqExamId])

  const [countdown] = useCountdown({
    endTime: get(tracker, 'end')
  })

  useInterval(
    () => {
      pingTracker(mcqExamId)
    },
    countdown ? 15000 : null
  )

  useEffect(() => {
    getAllQuestionsForExam(mcqExamId)
    getAllSubmissions(mcqExamId)
  }, [getAllQuestionsForExam, getAllSubmissions, mcqExamId])

  const sortedMcqIds = useMemo(() => mcqIds.sort(), [mcqIds])

  const startExam = useCallback(() => {
    startTracker(mcqExamId)
  }, [mcqExamId, startTracker])

  console.log(data)
  return (
    <Permit student>
      <Segment>
        <HeaderGrid
          Left={
            <Header as="span" size="small">
              {data.ended && 'MCQ Exam Finished!'}
            </Header>
          }
          Right={
            <>
              {data.started ? (
                <Label color={countdown ? 'blue' : 'red'}>
                  Remaining Time
                  <Label.Detail
                    content={Duration.fromMillis(countdown).toFormat('mm:ss')}
                  />
                </Label>
              ) : (
                <Button type="button" onClick={startExam} color="blue">
                  Start Taking Exam
                </Button>
              )}
            </>
          }
        />

        {data.started &&
          sortedMcqIds.map((mcqId, index) => (
            <React.Fragment key={index}>
              <Divider section />
              <MCQ
                index={index}
                mcqExamId={mcqExamId}
                mcqId={mcqId}
                readOnly={!countdown}
              />
            </React.Fragment>
          ))}
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ mcqExams, user }, { mcqExamId }) => ({
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQExamTake)

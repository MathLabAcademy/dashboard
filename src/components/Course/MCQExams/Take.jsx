import { DraftViewer } from 'components/Draft/index'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import useCountdown from 'hooks/useCountdown'
import useInterval from 'hooks/useInterval'
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
  Segment,
} from 'semantic-ui-react'
import {
  getAllQuestionsForExam,
  getAllSubmissions,
  pingTracker,
  readTracker,
  startTracker,
} from 'store/actions/mcqExams'
import { getAllMCQsForExam, submit as submitMCQ } from 'store/actions/mcqs'
import { trackEventAnalytics } from 'utils/analytics'
import { emptyArray } from 'utils/defaults'
import MCQExamResult from './Result'

const optionLetters = ['a', 'b', 'c', 'd']

function _MCQ({
  index,
  mcqExamId,
  mcqId,
  mcq,
  submitMCQ,
  submission,
  readOnly,
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
    submission: get(mcqExams.submissionsById, [mcqExamId, user.data.id, mcqId]),
  }),
  { submitMCQ }
)(_MCQ)

function MCQExamTake({
  courseId,
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
  const [error, setError] = useState(null)

  useEffect(() => {
    readTracker(mcqExamId)
  }, [mcqExamId, readTracker])

  const canStart = useMemo(() => {
    const startTime = get(mcqExam, 'date')
    return startTime && DateTime.fromISO(startTime) <= DateTime.local()
  }, [mcqExam])

  const data = useMemo(() => {
    const data = { started: false, ended: false }

    if (!get(tracker, 'start') || !get(tracker, 'end')) {
      return data
    }

    const now = DateTime.local()
    const start = DateTime.fromISO(tracker.start)
    const end = DateTime.fromISO(tracker.end)

    data.started = now >= start
    data.ended = now > end

    return data
  }, [tracker])

  useEffect(() => {
    if (data.started) {
      getAllMCQsForExam(mcqExamId)
      getAllQuestionsForExam(mcqExamId)
      getAllSubmissions(mcqExamId)
    }
  }, [
    data.started,
    getAllMCQsForExam,
    getAllQuestionsForExam,
    getAllSubmissions,
    mcqExamId,
  ])

  const [countdown] = useCountdown({
    endTime: get(tracker, 'end'),
  })

  useInterval(
    () => {
      pingTracker(mcqExamId)
    },
    countdown ? 15000 : null
  )

  const sortedMcqIds = useMemo(() => mcqIds.sort(), [mcqIds])

  const startExam = useCallback(async () => {
    try {
      await startTracker(mcqExamId)

      trackEventAnalytics({
        category: 'Student',
        action: 'Started MCQ Exam',
      })
    } catch (err) {
      if (err.message) {
        setError(err.message)
      } else {
        console.error(err)
      }
    }
  }, [mcqExamId, startTracker])

  if (!canStart) {
    return null
  }

  if (data.ended) {
    return <MCQExamResult courseId={courseId} mcqExamId={mcqExamId} />
  }

  return (
    <Permit roles="student">
      <Segment>
        <HeaderGrid
          Left={
            <>
              <Header as="span" size="small">
                {data.ended && 'MCQ Exam Finished!'}
              </Header>

              <Message color="red" hidden={!error}>
                {error}
              </Message>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(MCQExamTake)

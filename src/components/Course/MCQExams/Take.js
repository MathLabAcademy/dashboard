import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { SlateViewer } from 'components/Slate/index.js'
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
import { submit as submitMCQ } from 'store/actions/mcqs.js'
import { emptyArray } from 'utils/defaults'

const optionLetters = ['a', 'b', 'c', 'd']

function MCQ({ mcq, index, submitMCQ, submission, readOnly }) {
  const [error, setError] = useState(null)
  const timer = useRef(null)

  const options = useMemo(() => {
    return sortBy(mcq.Options, 'id')
  }, [mcq.Options])

  const handleOptionSelect = useCallback(
    async (_, { value }) => {
      try {
        if (value !== get(submission, 'mcqOptionId')) {
          await submitMCQ(mcq.id, { mcqOptionId: value })
        }
      } catch (err) {
        if (err.message) {
          if (timer.current) clearTimeout(timer.current)
          setError(err.message)
          timer.current = setTimeout(() => setError(null), 1500)
        } else throw err
      }
    },
    [mcq.id, submission, submitMCQ]
  )

  return (
    <>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>#{index + 1}</Header.Subheader>
            <SlateViewer initialValue={mcq.text} />
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
                    <SlateViewer initialValue={option.text} inline />
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

function MCQExamTake({
  mcqExamId,
  mcqIds,
  mcqs,
  getAllQuestionsForExam,
  tracker,
  readTracker,
  startTracker,
  pingTracker,
  submitMCQ,
  currentUserId,
  getAllSubmissions
}) {
  useEffect(() => {
    readTracker(mcqExamId).catch(() => {})
  }, [mcqExamId, readTracker])

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
          sortedMcqIds
            .map(id => get(mcqs.byId, id))
            .map((mcq, index) => (
              <React.Fragment key={index}>
                <Divider section />
                <MCQ
                  index={index}
                  mcq={mcq}
                  submitMCQ={submitMCQ}
                  submission={get(mcqs.submissionsById, [
                    mcq.id,
                    currentUserId
                  ])}
                  readOnly={!countdown}
                />
              </React.Fragment>
            ))}
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ mcqExams, mcqs, user }, { mcqExamId }) => ({
  currentUserId: user.data.id,
  mcqs,
  mcqIds: get(mcqExams.questionsById, mcqExamId, emptyArray),
  tracker: get(mcqExams.trackersById, [mcqExamId, user.data.id])
})

const mapDispatchToProps = {
  getAllQuestionsForExam,
  readTracker,
  startTracker,
  pingTracker,
  submitMCQ,
  getAllSubmissions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQExamTake)

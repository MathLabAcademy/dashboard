import { DraftViewer } from 'components/Draft/index'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import { get, isUndefined, sortBy } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { getAllQuestionsForExam } from 'store/actions/mcqExams'
import {
  getAllMCQAnswersForExam,
  getMCQ,
  readMCQAnswer,
} from 'store/actions/mcqs'
import { emptyArray } from 'utils/defaults'
import AddMCQ from './ActionModals/AddMCQ'
import EditMCQ from './ActionModals/EditMCQ'
import PickMCQ from './ActionModals/PickMCQ'
import RemoveMCQ from './ActionModals/RemoveMCQ'

const optionLetters = ['a', 'b', 'c', 'd']

function _MCQ({
  mcqExamId,
  mcqId,
  mcq,
  getMCQ,
  answerId,
  readMCQAnswer,
  index,
}) {
  useEffect(() => {
    if (isUndefined(answerId)) readMCQAnswer(mcqId)
  }, [answerId, mcqId, readMCQAnswer])

  const [open, handler] = useToggle(false)

  useEffect(() => {
    if (!mcq) getMCQ(mcqId)
  }, [getMCQ, mcq, mcqId])

  const options = useMemo(() => {
    return sortBy(get(mcq, 'Options'), 'id')
  }, [mcq])

  if (!mcq) return null

  return (
    <>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>
              #{index + 1} [ID:{mcqId}]
            </Header.Subheader>
            <DraftViewer rawValue={mcq.text} />
          </Header>
        }
        Right={
          <>
            <Button
              type="button"
              onClick={handler.toggle}
              icon={`chevron ${open ? 'up' : 'down'}`}
            />
            <EditMCQ
              index={index}
              mcq={mcq}
              options={options}
              answerId={answerId}
            />
            <RemoveMCQ mcqId={mcqId} mcq={mcq} mcqExamId={mcqExamId} />
          </>
        }
      />

      {open && (
        <Segment basic>
          <Grid columns={2} stackable>
            {options.map((option, index) => (
              <Grid.Column key={option.id}>
                {optionLetters[index]}.{' '}
                <DraftViewer rawValue={option.text} inline />{' '}
                {option.id === answerId && <Icon name="check" color="green" />}
              </Grid.Column>
            ))}
          </Grid>
        </Segment>
      )}
    </>
  )
}

const MCQ = connect(
  ({ mcqs }, { mcqId }) => ({
    mcq: get(mcqs.byId, mcqId),
    answerId: get(mcqs.answerById, mcqId),
  }),
  {
    getMCQ,
    readMCQAnswer,
  }
)(_MCQ)

function CourseMCQExamTeacherView({
  mcqExamId,
  mcqIds,
  getAllQuestionsForExam,
  getAllMCQAnswersForExam,
}) {
  useEffect(() => {
    getAllQuestionsForExam(mcqExamId)
    getAllMCQAnswersForExam(mcqExamId)
  }, [getAllMCQAnswersForExam, getAllQuestionsForExam, mcqExamId])

  const sortedMcqIds = useMemo(() => mcqIds, [mcqIds])

  return (
    <Permit admin teacher>
      <Segment>
        <HeaderGrid Left={<Header>Multiple Choice Questions</Header>} />

        {sortedMcqIds.map((id, index) => (
          <React.Fragment key={index}>
            <MCQ index={index} mcqId={id} mcqExamId={mcqExamId} />
            {index + 1 < mcqIds.length && <Divider section />}
          </React.Fragment>
        ))}

        <HeaderGrid
          Right={
            <>
              <PickMCQ mcqExamId={mcqExamId} mcqIds={sortedMcqIds} />
              <AddMCQ mcqExamId={mcqExamId} />
            </>
          }
        />
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ mcqExams }, { mcqExamId }) => ({
  mcqIds: get(mcqExams.questionsById, mcqExamId, emptyArray),
})

const mapDispatchToProps = {
  getAllQuestionsForExam,
  getAllMCQAnswersForExam,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamTeacherView)

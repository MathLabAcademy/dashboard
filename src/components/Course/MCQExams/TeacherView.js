import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { SlateViewer } from 'components/Slate/index.js'
import useToggle from 'hooks/useToggle.js'
import { get, sortBy } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { getAllQuestionsForExam } from 'store/actions/mcqExams.js'
import { getAllMCQAnswersForExam, getMCQ } from 'store/actions/mcqs.js'
import { emptyArray } from 'utils/defaults.js'
import AddMCQ from './ActionModals/AddMCQ.js'
import EditMCQ from './ActionModals/EditMCQ.js'
import PickMCQ from './ActionModals/PickMCQ.js'

const optionLetters = ['a', 'b', 'c', 'd']

function _MCQ({ mcqId, mcq, index, answerId, getMCQ }) {
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
            <Header.Subheader>#{index + 1}</Header.Subheader>
            <SlateViewer initialValue={mcq.text} />
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
          </>
        }
      />

      {open && (
        <Segment basic>
          <Grid columns={2} stackable>
            {options.map((option, index) => (
              <Grid.Column key={option.id}>
                {optionLetters[index]}.{' '}
                <SlateViewer initialValue={option.text} inline />{' '}
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
    answerId: get(mcqs.answerById, mcqId)
  }),
  {
    getMCQ
  }
)(_MCQ)

function CourseMCQExamTeacherView({
  mcqExamId,
  mcqIds,
  getAllQuestionsForExam,
  getAllMCQAnswersForExam
}) {
  useEffect(() => {
    getAllQuestionsForExam(mcqExamId)
    getAllMCQAnswersForExam(mcqExamId)
  }, [getAllMCQAnswersForExam, getAllQuestionsForExam, mcqExamId])

  const sortedMcqIds = useMemo(() => mcqIds.sort(), [mcqIds])

  return (
    <Permit teacher>
      <Segment>
        <HeaderGrid Left={<Header>Multiple Choice Questions</Header>} />

        {sortedMcqIds.map((id, index) => (
          <React.Fragment key={index}>
            <MCQ index={index} mcqId={id} />
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
  mcqIds: get(mcqExams.questionsById, mcqExamId, emptyArray)
})

const mapDispatchToProps = {
  getAllQuestionsForExam,
  getAllMCQAnswersForExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamTeacherView)

import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Divider, Header, Segment } from 'semantic-ui-react'
import { getAllMCQsForExam } from 'store/actions/mcqs.js'
import AddMCQ from './ActionModals/AddMCQ.js'
import MCQ from './MCQ.js'

function CourseMCQExamQuestions({
  courseId,
  mcqExamId,
  mcqs,
  getAllMCQsForExam
}) {
  useEffect(() => {
    getAllMCQsForExam(mcqExamId)
  }, [getAllMCQsForExam, mcqExamId])

  const mcqIds = useMemo(() => {
    const McqExamId = Number(mcqExamId)
    return mcqs.allIds
      .filter(id => get(mcqs.byId, [id, 'mcqExamId']) === McqExamId)
      .sort()
  }, [mcqExamId, mcqs.allIds, mcqs.byId])

  return (
    <Permit teacher>
      <Segment>
        <HeaderGrid
          Left={<Header>Multiple Choice Questions</Header>}
          Right={
            <Permit teacher>
              <Button as={Link} to={`set-answers`}>
                Set Answers
              </Button>
            </Permit>
          }
        />

        {mcqIds
          .map(id => get(mcqs.byId, id))
          .map((mcq, index) => (
            <React.Fragment key={index}>
              <MCQ index={index} mcq={mcq} />
              {index + 1 < mcqIds.length && <Divider section />}
            </React.Fragment>
          ))}

        <HeaderGrid
          Right={
            <Permit teacher>
              <AddMCQ mcqExamId={mcqExamId} />
            </Permit>
          }
        />
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ mcqs }) => ({
  mcqs
})

const mapDispatchToProps = {
  getAllMCQsForExam
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamQuestions)

import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getAllMCQExamsForCourse } from 'store/actions/mcqExams.js'
import ListItem from './ListItem.js'

function CourseMCQExamList({
  courseId,
  mcqExams,
  getAllMCQExamsForCourse,
  linkToBase
}) {
  useEffect(() => {
    getAllMCQExamsForCourse(courseId)
  }, [courseId, getAllMCQExamsForCourse])

  const mcqExamIds = useMemo(() => {
    const CourseId = Number(courseId)
    return mcqExams.allIds.filter(
      id => get(mcqExams.byId, [id, 'courseId']) === CourseId
    )
  }, [courseId, mcqExams.allIds, mcqExams.byId])

  return (
    <Permit admin teacher>
      <Segment>
        <HeaderGrid
          Left={<Header>MCQ Exams</Header>}
          Right={
            <Button as={Link} to={`${linkToBase}create`} color="blue">
              Create
            </Button>
          }
        />

        {mcqExamIds.map(id => (
          <ListItem key={id} id={id} linkToBase={linkToBase} />
        ))}
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ mcqExams }) => ({
  mcqExams
})

const mapDispatchToProps = {
  getAllMCQExamsForCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamList)

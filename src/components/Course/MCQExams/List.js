import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getAllMCQExamsForCourse } from 'store/actions/mcqExams'
import { emptyArray } from 'utils/defaults'
import ListItem from './ListItem'

function CourseMCQExamList({
  courseId,
  mcqExamIds,
  getAllMCQExamsForCourse,
  currentUser,
  enrollments,
  linkToBase
}) {
  useEffect(() => {
    getAllMCQExamsForCourse(courseId)
  }, [courseId, getAllMCQExamsForCourse])

  const isEnrolled = useMemo(() => {
    return (
      currentUser.roleId !== 'student' || enrollments.includes(currentUser.id)
    )
  }, [currentUser.id, currentUser.roleId, enrollments])

  return (
    <Permit admin teacher student>
      {isEnrolled && (
        <Segment>
          <HeaderGrid
            Left={<Header>MCQ Exams</Header>}
            Right={
              <Permit teacher>
                <Button as={Link} to={`${linkToBase}create`} color="blue">
                  Create
                </Button>
              </Permit>
            }
          />

          {mcqExamIds.map(id => (
            <ListItem key={id} id={id} linkToBase={linkToBase} />
          ))}
        </Segment>
      )}
    </Permit>
  )
}

const mapStateToProps = ({ courses, user }, { courseId }) => ({
  currentUser: user.data,
  mcqExamIds: get(courses.mcqExamsById, courseId, emptyArray),
  enrollments: get(courses.enrollmentsById, courseId, emptyArray)
})

const mapDispatchToProps = {
  getAllMCQExamsForCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseMCQExamList)

import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getAllCQExamsForCourse } from 'store/actions/cqExams'
import { emptyArray } from 'utils/defaults'
import ListItem from './ListItem'

function CourseCQExamList({
  courseId,
  cqExamIds,
  getAllCQExamsForCourse,
  currentUser,
  enrollments,
  linkToBase
}) {
  useEffect(() => {
    getAllCQExamsForCourse(courseId)
  }, [courseId, getAllCQExamsForCourse])

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
            Left={<Header>CQ Exams</Header>}
            Right={
              <Permit teacher>
                <Button as={Link} to={`${linkToBase}create`} color="blue">
                  Create
                </Button>
              </Permit>
            }
          />

          {cqExamIds.map(id => (
            <ListItem key={id} id={id} linkToBase={linkToBase} />
          ))}
        </Segment>
      )}
    </Permit>
  )
}

const mapStateToProps = ({ courses, user }, { courseId }) => ({
  currentUser: user.data,
  cqExamIds: get(courses.cqExamsById, courseId, emptyArray),
  enrollments: get(courses.enrollmentsById, courseId, emptyArray)
})

const mapDispatchToProps = {
  getAllCQExamsForCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseCQExamList)

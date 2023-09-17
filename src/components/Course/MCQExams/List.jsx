import { Link } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getAllMCQExamsForCourse } from 'store/actions/mcqExams'
import { emptyArray } from 'utils/defaults'
import ListItem from './ListItem'

function CourseMCQExamList({ courseId }) {
  const mcqExamIds = useSelector((state) =>
    get(state.courses.mcqExamsById, courseId, emptyArray)
  )

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllMCQExamsForCourse(courseId))
  }, [courseId, dispatch])

  return (
    <Permit roles="teacher,analyst,assistant,student">
      <Segment>
        <HeaderGrid
          Left={<Header>MCQ Exams</Header>}
          Right={
            <Permit roles="teacher,assistant">
              <Button as={Link} to={`create`} color="blue">
                Create
              </Button>
            </Permit>
          }
        />
      </Segment>

      <Segment>
        {mcqExamIds.map((id) => (
          <ListItem key={id} id={id} />
        ))}
      </Segment>
    </Permit>
  )
}

export default CourseMCQExamList

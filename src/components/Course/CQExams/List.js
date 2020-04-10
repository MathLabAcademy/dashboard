import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getAllCQExamsForCourse } from 'store/actions/cqExams'
import { emptyArray } from 'utils/defaults'
import ListItem from './ListItem'

function CourseCQExamList({ courseId }) {
  const cqExamIds = useSelector((state) =>
    get(state.courses.cqExamsById, courseId, emptyArray)
  )

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllCQExamsForCourse(courseId))
  }, [courseId, dispatch])

  return (
    <Permit roles="teacher,student">
      <Segment>
        <HeaderGrid
          Left={<Header>CQ Exams</Header>}
          Right={
            <Permit roles="teacher">
              <Button as={Link} to={`create`} color="blue">
                Create
              </Button>
            </Permit>
          }
        />
      </Segment>

      <Segment>
        {cqExamIds.map((id) => (
          <ListItem key={id} id={id} />
        ))}
      </Segment>
    </Permit>
  )
}

export default CourseCQExamList

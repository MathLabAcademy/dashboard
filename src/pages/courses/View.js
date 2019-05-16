import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'
import CourseMCQExams from './mcqexams/Main.js'

function CourseView({ courseId, data, getData }) {
  useEffect(() => {
    if (!data) getData(courseId)
  }, [courseId, data, getData])

  return (
    <>
      <Segment loading={!data}>
        <HeaderGrid
          Left={
            <Header>
              {get(data, 'name')}
              <Header.Subheader>
                {get(data, 'description')}
                <br />
                Price: {get(data, 'price') / 100} BDT
              </Header.Subheader>
            </Header>
          }
          Right={
            <Permit teacher>
              <Button as={Link} to={`edit`}>
                Edit
              </Button>
            </Permit>
          }
        />
      </Segment>

      <CourseMCQExams courseId={courseId} />
    </>
  )
}

const mapStateToProps = ({ courses }, { courseId }) => ({
  data: get(courses.byId, courseId)
})

const mapDispatchToProps = {
  getData: getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseView)

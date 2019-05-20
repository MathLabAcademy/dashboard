import { Link, Router } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults.js'
import CourseMCQExams from './MCQExams/Main.js'

import Enroll from './Enroll.js'

function Course({ courseId, course, enrollments, currentUser }) {
  const isEnrolled = useMemo(() => {
    return enrollments.includes(currentUser.id)
  }, [currentUser.id, enrollments])

  return (
    <>
      <Segment loading={!course}>
        <HeaderGrid
          Left={
            <Header>
              {get(course, 'name')}
              <Header.Subheader>
                {get(course, 'description')}
                <br />
                Price: {get(course, 'price') / 100} BDT
              </Header.Subheader>
            </Header>
          }
          Right={
            <>
              <Permit teacher>
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>

              <Permit student>
                {!isEnrolled && (
                  <Button as={Link} to={`enroll`}>
                    Enroll
                  </Button>
                )}
              </Permit>
            </>
          }
        />
      </Segment>

      <CourseMCQExams courseId={courseId} />

      <Router>
        <Enroll path="enroll" courseId={courseId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ courses, user }, { courseId }) => ({
  course: get(courses.byId, courseId),
  enrollments: get(courses, ['enrollmentsById', courseId], emptyArray),
  currentUser: user.data
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Course)
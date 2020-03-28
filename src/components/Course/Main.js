import { Box, Stack } from '@chakra-ui/core'
import { Link, Router } from '@reach/router'
import { DraftViewer } from 'components/Draft'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Label, Segment, Table } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults'
import CourseCQExams from './CQExams/Main'
import Enroll from './Enroll'
import CourseEnrollments from './Enrollments'
import CourseMCQExams from './MCQExams/Main'
import CourseVideos from './Videos/Main'

function CourseInfo({ courseId, course, courseTags }) {
  return (
    <>
      <Segment>
        <Table basic="very" compact className="horizontal-info">
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Description`} />
              <Table.Cell
                content={<DraftViewer rawValue={get(course, 'description')} />}
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Price`} />
              <Table.Cell content={`${get(course, 'price') / 100} BDT`} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Tags`} />
              <Table.Cell>
                {get(course, 'tagIds', emptyArray).map((id) => (
                  <Label
                    key={id}
                    color="black"
                    size="tiny"
                    content={get(courseTags.byId, [id, 'name'])}
                  />
                ))}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>

      <Stack spacing={4}>
        <Box>
          <CourseCQExams courseId={courseId} />
        </Box>
        <Box>
          <CourseMCQExams courseId={courseId} />
        </Box>
        <Box>
          <CourseVideos courseId={courseId} />
        </Box>
      </Stack>
    </>
  )
}

function Course({ courseId, course, courseTags, enrollments, currentUser }) {
  const isEnrolled = useMemo(() => {
    return enrollments.includes(currentUser.id)
  }, [currentUser.id, enrollments])

  return (
    <>
      <Segment loading={!course}>
        <HeaderGrid
          Left={<Header>{get(course, 'name')}</Header>}
          Right={
            <>
              <Permit teacher>
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
                <Button as={Link} to={`enrollments`} color="blue">
                  Enrollments
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

      <Router>
        <CourseInfo
          path="/*"
          course={course}
          courseId={courseId}
          courseTags={courseTags}
        />
        <CourseEnrollments path="enrollments" courseId={courseId} />
        <Enroll path="enroll" courseId={courseId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ courses, courseTags, user }, { courseId }) => ({
  course: get(courses.byId, courseId),
  courseTags,
  enrollments: get(courses, ['enrollmentsById', courseId], emptyArray),
  currentUser: user.data,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Course)

import { Badge, Box, Button, Flex, Heading, Stack } from '@chakra-ui/core'
import { DraftViewer } from 'components/Draft'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { useCourseAccess } from 'hooks/useCourseAccess'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import { Header, Label, Segment, Table } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults'
import CourseAttendance from './Attendance'
import CourseCQExams from './CQExams/Main'
import Enroll from './Enroll'
import CourseEnrollments from './Enrollments'
import CourseMCQExams from './MCQExams/Main'
import CourseVideos from './Videos/Main'
import { useCourse } from 'store/courses/hooks'

function CourseInfo({ course, courseId, courseTags }) {
  const hasAccess = useCourseAccess(courseId)

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

      {hasAccess && (
        <Stack spacing={4}>
          <Flex
            borderWidth={1}
            shadow="md"
            p={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Heading fontSize={4}>CQ Exams</Heading>
            </Box>
            <Box>
              <Button
                size="lg"
                variantColor="blue"
                as={Link}
                to={`cqexams`}
                _hover={{ color: 'white' }}
              >
                Open
              </Button>
            </Box>
          </Flex>
          <Flex
            borderWidth={1}
            shadow="md"
            p={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Heading fontSize={4}>MCQ Exams</Heading>
            </Box>
            <Box>
              <Button
                size="lg"
                variantColor="blue"
                as={Link}
                to={`mcqexams`}
                _hover={{ color: 'white' }}
              >
                Open
              </Button>
            </Box>
          </Flex>
          <Flex
            borderWidth={1}
            shadow="md"
            p={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Heading fontSize={4}>Videos</Heading>
            </Box>
            <Box>
              <Button
                size="lg"
                variantColor="blue"
                as={Link}
                to={`videos`}
                _hover={{ color: 'white' }}
              >
                Open
              </Button>
            </Box>
          </Flex>
        </Stack>
      )}
    </>
  )
}

function Course({ courseId, courseTags, enrollments, currentUser }) {
  const course = useCourse(courseId)
  const isEnrolled = useMemo(() => {
    return enrollments.includes(currentUser.id)
  }, [currentUser.id, enrollments])

  return (
    <>
      <Segment loading={!course}>
        <HeaderGrid
          Left={
            <Header>
              <Link to={`/courses/${courseId}`}>{get(course, 'name')}</Link>

              {isEnrolled && (
                <Badge
                  variant="solid"
                  variantColor="green"
                  ml={4}
                  fontSize="0.8em"
                >
                  ENROLLED
                </Badge>
              )}

              {!get(course, 'active', true) && (
                <Badge
                  variant="solid"
                  variantColor="gray"
                  ml={4}
                  fontSize="0.8em"
                >
                  INACTIVE
                </Badge>
              )}
            </Header>
          }
          Right={
            <Stack isInline spacing={2}>
              <Permit roles="teacher,assistant">
                <Button as={Link} to={`edit`} variantColor="gray">
                  Edit
                </Button>
              </Permit>
              <Permit roles="teacher,assistant">
                <Button
                  as={Link}
                  to={`attendances`}
                  variantColor="blue"
                  _hover={{ color: 'white' }}
                >
                  Attendance
                </Button>
              </Permit>
              <Permit roles="teacher,assistant">
                <Button
                  as={Link}
                  to={`enrollments`}
                  variantColor="blue"
                  _hover={{ color: 'white' }}
                >
                  Enrollments
                </Button>
              </Permit>

              <Permit roles="student">
                {!isEnrolled && (
                  <Button
                    as={Link}
                    to={`enroll`}
                    variantColor="green"
                    _hover={{ color: 'white' }}
                  >
                    Enroll
                  </Button>
                )}
              </Permit>
            </Stack>
          }
        />
      </Segment>

      <Routes>
        <Route
          element={
            <CourseInfo
              course={course}
              courseId={courseId}
              courseTags={courseTags}
            />
          }
          path="/"
        />
        <Route
          element={<CourseCQExams courseId={courseId} />}
          path="cqexams/*"
        />
        <Route
          element={<CourseMCQExams courseId={courseId} />}
          path="mcqexams/*"
        />
        <Route element={<CourseVideos courseId={courseId} />} path="videos/*" />

        <Route
          element={<CourseEnrollments courseId={courseId} />}
          path="enrollments"
        />
        <Route
          element={<CourseAttendance courseId={courseId} />}
          path="attendances"
        />
        <Route element={<Enroll courseId={courseId} />} path="enroll" />
      </Routes>
    </>
  )
}

const mapStateToProps = ({ courses, courseTags, user }, { courseId }) => ({
  courseTags,
  enrollments: get(courses, ['enrollmentsById', courseId], emptyArray),
  currentUser: user.data,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Course)

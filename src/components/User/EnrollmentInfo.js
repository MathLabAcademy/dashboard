import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Table, Label } from 'semantic-ui-react'
import { getAllEnrollmentsForUser } from 'store/actions/users'
import { Link } from '@reach/router'
import { emptyObject } from 'utils/defaults'

function EnrollmentInfo({
  userId,
  title,
  courses,
  courseEnrollments,
  batchClassEnrollments,
  batchCourseEnrollments,
  getAllEnrollmentsForUser,
}) {
  useEffect(() => {
    getAllEnrollmentsForUser(userId, 'batch_class')
    getAllEnrollmentsForUser(userId, 'batch_course')
    getAllEnrollmentsForUser(userId, 'course')
  }, [getAllEnrollmentsForUser, userId])

  const {
    courseIds,
    batchClassEnrollmentIds,
    batchCourseEnrollmentIds,
  } = useMemo(
    () => ({
      courseIds: Object.keys(courseEnrollments),
      batchClassEnrollmentIds: Object.keys(batchClassEnrollments),
      batchCourseEnrollmentIds: Object.keys(batchCourseEnrollments),
    }),
    [batchClassEnrollments, batchCourseEnrollments, courseEnrollments]
  )

  return (
    <Segment>
      <HeaderGrid Left={<Header content={title} />} />

      <Table basic="very" compact className="horizontal-info">
        <Table.Body>
          {courseIds.length ? (
            <Table.Row>
              <Table.HeaderCell collapsing content={`Enrolled Courses`} />
              <Table.Cell>
                {courseIds.map((courseId) => (
                  <Label key={courseId} to={`/courses/${courseId}`} as={Link}>
                    {get(courses.byId[courseId], 'name', `#${courseId}`)}
                  </Label>
                ))}
              </Table.Cell>
            </Table.Row>
          ) : null}

          {batchClassEnrollmentIds.length ? (
            <Table.Row>
              <Table.HeaderCell
                collapsing
                content={`Batch Class Enrollments`}
              />
              <Table.Cell>
                {batchClassEnrollmentIds.map((enrollmentId) => (
                  <Label
                    key={enrollmentId}
                    to={`/batchclasses/${get(
                      batchClassEnrollments[enrollmentId],
                      'batchClassId'
                    )}/enrollments/${enrollmentId}`}
                    as={Link}
                  >
                    {enrollmentId}
                  </Label>
                ))}
              </Table.Cell>
            </Table.Row>
          ) : null}

          {batchCourseEnrollmentIds.length ? (
            <Table.Row>
              <Table.HeaderCell
                collapsing
                content={`Batch Course Enrollments`}
              />
              <Table.Cell>
                {batchCourseEnrollmentIds.map((enrollmentId) => (
                  <Label
                    key={enrollmentId}
                    to={`/batchcourses/${get(
                      batchCourseEnrollments[enrollmentId],
                      'batchCourseId'
                    )}/enrollments/${enrollmentId}`}
                    as={Link}
                  >
                    {enrollmentId}
                  </Label>
                ))}
              </Table.Cell>
            </Table.Row>
          ) : null}
        </Table.Body>
      </Table>
    </Segment>
  )
}

const mapStateToProps = ({ courses, users }, { userId }) => ({
  courses,
  courseEnrollments: get(users.courseEnrollmentsById, userId, emptyObject),
  batchClassEnrollments: get(
    users.batchClassEnrollmentsById,
    userId,
    emptyObject
  ),
  batchCourseEnrollments: get(
    users.batchCourseEnrollmentsById,
    userId,
    emptyObject
  ),
  user: get(users.byId, userId),
})

const mapDispatchToProps = { getAllEnrollmentsForUser }

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentInfo)

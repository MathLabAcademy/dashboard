import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Table, Label } from 'semantic-ui-react'
import { getAllEnrollmentsForUser } from 'store/actions/users'
import { Link } from 'react-router-dom'
import { emptyObject } from 'utils/defaults'

function EnrollmentInfo({
  userId,
  title,
  courses,
  courseEnrollments,
  getAllEnrollmentsForUser,
}) {
  useEffect(() => {
    getAllEnrollmentsForUser(userId, 'course')
  }, [getAllEnrollmentsForUser, userId])

  const { courseIds } = useMemo(
    () => ({
      courseIds: Object.keys(courseEnrollments),
    }),
    [courseEnrollments]
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
        </Table.Body>
      </Table>
    </Segment>
  )
}

const mapStateToProps = ({ courses, users }, { userId }) => ({
  courses,
  courseEnrollments: get(users.courseEnrollmentsById, userId, emptyObject),
  user: get(users.byId, userId),
})

const mapDispatchToProps = { getAllEnrollmentsForUser }

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentInfo)

import { Checkbox, Input } from '@chakra-ui/core'
import { Link } from '@reach/router'
import { useCourseAttendances } from 'api/course'
import Permit from 'components/Permit'
import { get, keyBy } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { useCourse, useCourseEnrolledUserIds } from 'store/courses/hooks'
import { useUser } from 'store/users/hooks'

const today = DateTime.local().toFormat('yyyy-MM-dd')

function ListItemRow({ enrollmentId, attendanceByUserId }) {
  const enrollments = useSelector(({ enrollments }) => enrollments)
  const userId = get(enrollments.byId, [enrollmentId, 'userId'])
  const user = useUser(userId)
  const attendance = attendanceByUserId[userId]

  return (
    <Table.Row>
      <Table.Cell>
        <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
      </Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
      <Table.Cell>
        <Checkbox
          defaultIsChecked={get(attendance, 'present')}
          onClick={() => {}}
        />
      </Table.Cell>
      <Table.Cell>
        <Input defaultValue={get(attendance, 'note', '')} />
      </Table.Cell>
    </Table.Row>
  )
}

function CourseAttendance({ courseId }) {
  const [date, setDate] = useState(today)

  const course = useCourse(courseId)

  const attendance = useCourseAttendances(courseId, date)

  const { data: enrolledUserIds } = useCourseEnrolledUserIds(courseId)

  const attendanceByUserId = useMemo(() => {
    const byUserId = keyBy(attendance.data?.items, 'userId')
    return byUserId
  }, [attendance.data])

  const enrollments = useSelector(({ enrollments }) => enrollments)

  const enrollmentIds = useMemo(() => {
    const enrollmentIdPattern = new RegExp(`^${courseId}:.+`)
    return enrollments.allIds.filter((id) => enrollmentIdPattern.test(id))
  }, [courseId, enrollments.allIds])

  return (
    <Permit roles="teacher,assistant">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Present</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {enrollmentIds.map((id) => (
            <ListItemRow
              key={id}
              enrollmentId={id}
              attendanceByUserId={attendanceByUserId}
            />
          ))}
        </Table.Body>
      </Table>
    </Permit>
  )
}

export default CourseAttendance

import { Box, useToast } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import { useCourseAttendances, useCourseAttendancesMutation } from 'api/course'
import HeaderGrid from 'components/HeaderGrid'
import { FormButton } from 'components/HookForm/Button'
import { FormCheckbox } from 'components/HookForm/Checkbox'
import { FormDatePicker } from 'components/HookForm/DatePicker'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormInput } from 'components/HookForm/Input'
import Permit from 'components/Permit'
import { Table } from 'components/Table'
import useInterval from 'hooks/useInterval'
import { get, keyBy } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCourseEnrollments } from 'store/courses/hooks'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { useUser } from 'store/users/hooks'
import { trackEventAnalytics } from 'utils/analytics'

function ListItemRow({ enrollment, isReadOnly }) {
  const userId = get(enrollment, 'userId')
  const user = useUser(userId)

  return (
    <Table.Row>
      <Table.Cell>
        <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
      </Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
      <Table.Cell>
        <FormCheckbox
          disabled={isReadOnly}
          name={`items.${userId}.present`}
          size="lg"
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          disabled={isReadOnly}
          name={`items.${userId}.note`}
          maxWith={50}
        />
      </Table.Cell>
    </Table.Row>
  )
}

function getDefaultValues(date, attendanceByUserId) {
  return {
    date: new Date(date),
    items: Object.entries(attendanceByUserId).reduce((byId, [userId, item]) => {
      byId[userId] = {
        present: item.present,
        note: item.note,
      }
      return byId
    }, {}),
  }
}

const today = new Date()

function CourseAttendanceForm({
  courseId,
  enrollments,
  date,
  setDate,
  attendanceByUserId,
}) {
  const toast = useToast()

  const isReadOnly = useCurrentUserData().roleId !== 'teacher'

  const defaultValues = useMemo(
    () => getDefaultValues(date, attendanceByUserId),
    [attendanceByUserId, date]
  )
  const form = useForm({
    defaultValues,
  })

  const formReset = form.reset
  useEffect(() => {
    formReset(defaultValues)
  }, [defaultValues, formReset])

  const formDate = form.watch('date')
  useEffect(() => {
    setDate(DateTime.fromJSDate(formDate).toFormat('yyyy-MM-dd'))
  }, [formDate, setDate])

  const { updateAttendances } = useCourseAttendancesMutation(courseId, date)

  const onSubmit = useCallback(
    async (values) => {
      try {
        const items = Object.entries(values.items).map(([userId, item]) => ({
          userId,
          ...item,
        }))
        await updateAttendances.mutateAsync(items)
        trackEventAnalytics({
          category: 'Teacher',
          action: 'Updated Attendance',
        })
        form.reset(form.getValues())
      } catch (err) {
        handleAPIError(err, { form, toast })
      }
    },
    [form, toast, updateAttendances]
  )

  useInterval(async () => {
    if (form.formState.dirty) {
      await form.handleSubmit(onSubmit)()
    }
  }, 5000)

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Box borderWidth={1} shadow="md" p={4} mb={4}>
        <HeaderGrid
          Left={
            <FormDatePicker
              name="date"
              dateFormat="MMM dd, yyyy"
              maxDate={today}
            />
          }
          Right={
            !isReadOnly && (
              <FormButton type="submit" variant="solid" variantColor="blue">
                Save
              </FormButton>
            )
          }
        />
      </Box>
      <Box borderWidth={1} shadow="md">
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
            {enrollments.map((enrollment) => (
              <ListItemRow
                key={enrollment.id}
                enrollment={enrollment}
                isReadOnly={isReadOnly}
              />
            ))}
          </Table.Body>
        </Table>
      </Box>
    </Form>
  )
}

function CourseAttendance({ courseId }) {
  const [date, setDate] = useState(
    DateTime.fromJSDate(today).toFormat('yyyy-MM-dd')
  )

  const enrollments = useCourseEnrollments(courseId)
  const attendance = useCourseAttendances(courseId, date)
  const attendanceByUserId = useMemo(() => {
    const byUserId = keyBy(attendance.data?.items, 'userId')
    for (const enrollment of enrollments.data) {
      if (!byUserId[enrollment.userId]) {
        byUserId[enrollment.userId] = {
          userId: enrollment.userId,
          present: false,
          note: '',
        }
      }
    }
    return byUserId
  }, [attendance.data, enrollments])

  if (enrollments.loading || attendance.isLoading) {
    return null
  }

  return (
    <Permit roles="teacher,analyst,assistant">
      <CourseAttendanceForm
        courseId={courseId}
        enrollments={enrollments.data}
        attendanceByUserId={attendanceByUserId}
        date={date}
        setDate={setDate}
      />
    </Permit>
  )
}

export default CourseAttendance

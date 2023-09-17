import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import { handleAPIError } from 'components/HookForm/helpers'
import { get, sum } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Checkbox, Header, Segment, Table } from 'semantic-ui-react'
import { useCourse, useCourseEnrolledUserIds } from 'store/courses/hooks'
import { toggleEnrollmentStatus } from 'store/enrollments'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'
import Permit from 'components/Permit'
import { useCurrentUserData } from 'store/currentUser/hooks'

function RevertEnrollment({ user, enrollment }) {
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true)

      const { error } = await api(
        `/courses/${get(enrollment, 'courseId')}/action/revert-enrollment`,
        {
          method: 'POST',
          body: {
            userId: get(enrollment, 'userId'),
          },
        }
      )

      if (error) {
        throw error
      }

      trackEventAnalytics({
        category: 'Teacher',
        action: 'Reverted Course Enrollment',
      })

      setLoading(false)

      window.location.reload()
    } catch (err) {
      setLoading(false)
      handleAPIError(err, { toast })
    }
  }, [enrollment, toast])

  return (
    <Permit roles="teacher">
      <Button onClick={onOpen} size="sm" variantColor="red">
        Revert
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Revert Enrollment for {get(user, 'Person.fullName')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={2}>
            <Text fontWeight="bold">Are you sure?</Text>
            <Text>
              This will try to remove the enrollment and adjust the account
              balance
            </Text>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button
                variantColor="red"
                isDisabled={loading}
                onClick={onSubmit}
              >
                Revert Enrollment
              </Button>
              <Button variantColor="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Permit>
  )
}

function _ListItemRow({
  user,
  enrollment,
  enrollmentId,
  toggleEnrollmentStatus,
}) {
  const currentUser = useCurrentUserData()

  return (
    <Table.Row>
      <Table.Cell>
        <Link to={`/users/${get(user, 'id')}`}>{get(user, 'id')}</Link>
      </Table.Cell>
      <Table.Cell>{get(user, 'Person.fullName')}</Table.Cell>
      <Table.Cell>BDT {get(user, 'balance', 0) / 100}</Table.Cell>
      <Table.Cell>BDT {get(user, 'creditLimit', 0) / 100}</Table.Cell>
      <Table.Cell>
        <Checkbox
          disabled={get(currentUser,'roleId')!=='teacher'}
          checked={get(enrollment, 'active')}
          toggle
          onClick={async () => {
            await toggleEnrollmentStatus(enrollmentId)
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <RevertEnrollment user={user} enrollment={enrollment} />
      </Table.Cell>
    </Table.Row>
  )
}

const ListItemRow = connect(
  ({ users, enrollments }, { enrollmentId }) => {
    const enrollment = get(enrollments.byId, enrollmentId)
    const user = get(users.byId, get(enrollment, 'userId'), null)

    return {
      enrollment,
      user,
    }
  },
  { toggleEnrollmentStatus }
)(_ListItemRow)

function CourseEnrollmentList({ courseId }) {
  const course = useCourse(courseId)

  const { data: enrolledUserIds } = useCourseEnrolledUserIds(courseId)

  const enrollments = useSelector(({ enrollments }) => enrollments)

  const users = useSelector(({ users }) => users)

  const enrollmentIdPattern = useMemo(() => new RegExp(`^${courseId}:.+`), [
    courseId,
  ])

  const enrollmentIds = useMemo(() => {
    return enrollments.allIds.filter((id) => enrollmentIdPattern.test(id))
  }, [enrollmentIdPattern, enrollments.allIds])

  const summary = useMemo(() => {
    const price = get(course, 'price')
    const dueItems = enrolledUserIds.reduce((totalDue, userId) => {
      const balance = get(users.byId[userId], 'balance')

      if (balance >= 0) {
        return totalDue
      }

      if (price < Math.abs(balance)) {
        totalDue.push(price)
      } else {
        totalDue.push(Math.abs(balance))
      }

      return totalDue
    }, [])

    const totalDue = sum(dueItems) / 100

    const totalPaid = ((enrolledUserIds.length - dueItems.length) * price) / 100

    return {
      totalStudents: enrolledUserIds.length,
      totalDue,
      totalStudentsInDue: dueItems.length,
      totalPaid,
    }
  }, [course, enrolledUserIds, users.byId])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Stack>
              <Box>
                <Header>Course Enrollments</Header>
              </Box>
              <Box>
                <Stack isInline>
                  <Stat>
                    <StatLabel>Total Enrolled</StatLabel>
                    <StatNumber>{summary.totalStudents}</StatNumber>
                    <StatHelpText>Students</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Total Paid</StatLabel>
                    <StatNumber>{summary.totalPaid}</StatNumber>
                    <StatHelpText>BDT approx.</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Total Due</StatLabel>
                    <StatNumber>{summary.totalDue}</StatNumber>
                    <StatHelpText>BDT approx.</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Total in Due</StatLabel>
                    <StatNumber>{summary.totalStudentsInDue}</StatNumber>
                    <StatHelpText>Students</StatHelpText>
                  </Stat>
                </Stack>
              </Box>
            </Stack>
          }
          Right={
            <Button as={Link} to={`..`}>
              Go Back
            </Button>
          }
        />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Account Balance</Table.HeaderCell>
            <Table.HeaderCell>Credit Limit</Table.HeaderCell>
            <Table.HeaderCell>Active</Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {enrollmentIds.map((id) => (
            <ListItemRow key={id} enrollmentId={id} />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default CourseEnrollmentList

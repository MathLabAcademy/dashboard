import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { handleAPIError } from 'components/HookForm/helpers'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Header, Segment, Table } from 'semantic-ui-react'
import { toggleEnrollmentStatus } from 'store/enrollments'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'
import { emptyArray } from 'utils/defaults'

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
    <>
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
    </>
  )
}

function _ListItemRow({
  user,
  enrollment,
  enrollmentId,
  toggleEnrollmentStatus,
}) {
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

function CourseEnrollmentList({ enrollmentIds }) {
  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Online Course Enrollments</Header>}
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

const mapStateToProps = ({ courses, enrollments }, { courseId }) => {
  const enrollmentIdPattern = new RegExp(`^${courseId}:.+`)
  const enrollmentIds = enrollments.allIds.filter((id) =>
    enrollmentIdPattern.test(id)
  )
  return {
    course: get(courses.byId, courseId),
    userIds: get(courses, ['enrollmentsById', courseId], emptyArray),
    enrollments,
    enrollmentIds,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseEnrollmentList)

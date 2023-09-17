import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get, groupBy, keyBy, mapValues } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Text } from 'rebass'
import { Header, Segment } from 'semantic-ui-react'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'
import { emptyArray, emptyObject } from 'utils/defaults'

function RemoveSubmissionsButton({ mcqExamId, userId, fullName }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = useCallback(async () => {
    await api(`/mcqexams/${mcqExamId}/action/remove-submissions-for-student`, {
      method: 'POST',
      body: { userId },
    })

    trackEventAnalytics({
      category: 'Teacher',
      action: 'Removed MCQExam Result of Student',
    })

    window.location.reload()
  }, [mcqExamId, userId])

  return (
    <Permit roles="teacher">
      <Button onClick={onOpen} variantColor="red">
        Remove
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent p={2}>
          <ModalHeader fontSize={4}>
            Allow {fullName} to retake this exam?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={2}>
            Are you sure? All the current submissions (if there are any) for{' '}
            {fullName} will be deleted!
          </ModalBody>

          <ModalFooter>
            <Button variantColor="red" mr={3} onClick={onSubmit}>
              Remove Submissions
            </Button>
            <Button variantColor="blue" onClick={onClose}>
              No... Take me back!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Permit>
  )
}

function MCQExamResult({ mcqExamId }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    api(`/mcqexams/${mcqExamId}/results`).then(({ data }) => {
      setData(data)
    })
  }, [mcqExamId])

  const dataByUserId = useMemo(() => {
    const trackerByUserId = keyBy(get(data, 'Trackers', emptyArray), 'userId')

    const userIds = Object.keys(trackerByUserId)

    const totalQuestions = get(data, 'Questions', emptyArray).length

    const correctOptionIdByQuestionId = mapValues(
      keyBy(get(data, 'Questions', emptyArray), 'id'),
      'Answer.id'
    )

    const submissionsByUserId = mapValues(
      groupBy(get(data, 'Submissions', emptyArray), 'userId'),
      (submissions) => mapValues(keyBy(submissions, 'mcqId'), 'mcqOptionId')
    )

    const dataByUserId = {}

    for (const userId of userIds) {
      const tracker = get(trackerByUserId, userId)

      if (!tracker.end) {
        continue
      }

      const user = get(tracker, 'User')

      const submissions = get(submissionsByUserId, userId, emptyObject)

      dataByUserId[userId] = {
        id: userId,
        fullName: get(user, 'Person.fullName'),
        phone: get(user, 'Person.phone'),
        answersSubmitted: Object.values(submissions).length,
        correctlyAnswered: Object.keys(submissions).filter((questionId) => {
          return (
            submissions[questionId] === correctOptionIdByQuestionId[questionId]
          )
        }).length,
        totalQuestions,
        startTime: DateTime.fromISO(tracker.start).toLocaleString(
          DateTime.DATETIME_MED
        ),
        endTime: DateTime.fromISO(tracker.end).toLocaleString(
          DateTime.DATETIME_MED
        ),
        lastPingtime: DateTime.fromISO(tracker.ping).toLocaleString(
          DateTime.DATETIME_MED
        ),
      }
    }

    return dataByUserId
  }, [data])

  return (
    <Permit roles="teacher,analyst,assistant">
      <Segment>
        <HeaderGrid
          Left={<Header>Result Summary </Header>}
          Right={
            <Button as={Link} to={`..`}>
              Back
            </Button>
          }
        />
      </Segment>
      {Object.entries(dataByUserId).map(([userId, data]) => (
        <Flex
          key={userId}
          p={4}
          borderWidth={1}
          shadow="md"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Stack>
            <Text>
              <strong>User ID: </strong>
              <Link to={`/users/${userId}`}>{userId}</Link>
            </Text>
            <Text>
              <strong>Full name: </strong>
              {data.fullName}
            </Text>
            <Text>
              <strong>Phone: </strong>
              {data.phone.slice(-11)}
            </Text>
            <br />
            <Text>
              <strong>Exam Start Time: </strong>
              {data.startTime}
            </Text>
            <Text>
              <strong>Last Ping Time: </strong>
              {data.lastPingtime}
            </Text>
            <Text>
              <strong>Exam End Time: </strong>
              {data.endTime}
            </Text>
            <br />
            <Text>
              <strong>Answers Submitted: </strong>
              {data.answersSubmitted} / {data.totalQuestions}
            </Text>
            <Text>
              <strong>Correctly Answered: </strong>
              {data.correctlyAnswered} / {data.totalQuestions}
            </Text>
          </Stack>
          <Box>
            {data.totalQuestions / data.answersSubmitted >= 3 && (
              <RemoveSubmissionsButton
                mcqExamId={mcqExamId}
                userId={userId}
                fullName={data.fullName}
              />
            )}
          </Box>
        </Flex>
      ))}
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MCQExamResult)

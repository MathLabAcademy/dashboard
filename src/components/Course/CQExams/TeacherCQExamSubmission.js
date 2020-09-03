import { Box, Button, Heading, Stack, Text } from '@chakra-ui/core'
import { Link } from '@reach/router'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React from 'react'
import { useCQExam, useCQExamStudents } from 'store/cqExams/hooks'

function TeacherCQExamSubmission({ cqExamId }) {
  const cqExam = useCQExam(cqExamId)
  const students = useCQExamStudents(cqExamId)

  if (!cqExam) {
    return null
  }

  return (
    <Permit roles="teacher,analyst">
      <Box borderWidth="1px" boxShadow="sm" p={4}>
        <Stack
          isInline
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Heading fontSize={2}>Answer Paper Submissions</Heading>
          </Box>
        </Stack>

        <Stack>
          {students.data &&
            students.data.items.map((item) => (
              <Box key={item.userId} borderWidth="1px" boxShadow="sm" p={4}>
                <Stack
                  isInline
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack spacing={2}>
                    <Text fontSize={3} fontWeight="bold">
                      {get(item, 'user.person.fullName')} (
                      <Text
                        fontSize={1}
                        as={Link}
                        to={`/users/${get(item, 'userId')}`}
                      >
                        {get(item, 'userId')}
                      </Text>
                      )
                    </Text>
                    <Text fontSize={2}>
                      <Text as="span" fontWeight="bold" fontStyle="italic">
                        Obtained Marks:{' '}
                      </Text>
                      {get(item, 'totalMark')} / {get(cqExam, 'totalMark')}
                    </Text>
                  </Stack>
                  <Box>
                    <Button
                      as={Link}
                      to={`./submissions/${item.userId}`}
                      variantColor="blue"
                      _hover={{ color: 'white' }}
                    >
                      Open
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
    </Permit>
  )
}

export default TeacherCQExamSubmission

import { Box, Button, Heading, Stack } from '@chakra-ui/core'
import { Link } from '@reach/router'
import Permit from 'components/Permit'
import Table from 'components/Table'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCQExam } from 'store/actions/cqExams'

const tableStyle = {
  th: { borderWidth: 0, whiteSpace: 'nowrap' },
  td: { borderWidth: 0, width: '100%' },
}

function CourseCQExamView({ courseId, cqExamId }) {
  const cqExam = useSelector((state) => state.cqExams.byId[cqExamId])

  const dispatch = useDispatch()
  useEffect(() => {
    if (!cqExam) dispatch(getCQExam(cqExamId))
  }, [cqExam, cqExamId, dispatch])

  if (!cqExam) {
    return null
  }

  return (
    <Box borderWidth="1px" boxShadow="sm" p={4}>
      <Stack isInline justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Heading fontSize={3}>CQ Exam: {get(cqExam, 'name')}</Heading>
        </Box>
        <Box>
          <Permit roles="teacher,analyst">
            <Button as={Link} to={`edit`}>
              Edit
            </Button>
          </Permit>
        </Box>
      </Stack>

      <Table sx={tableStyle}>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.Cell>{get(cqExam, 'description')}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.Cell>
              {DateTime.fromISO(get(cqExam, 'date')).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Submission Deadline</Table.HeaderCell>
            <Table.Cell>
              {DateTime.fromISO(
                get(cqExam, 'submissionDeadline')
              ).toLocaleString(DateTime.DATETIME_MED)}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Question Paper</Table.HeaderCell>
            <Table.Cell>
              <Button
                as="a"
                _hover={{ color: 'white' }}
                href={get(cqExam, 'filePath')}
                target="_blank"
                variantColor="blue"
                size="sm"
              >
                Download
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Box>
  )
}

export default CourseCQExamView

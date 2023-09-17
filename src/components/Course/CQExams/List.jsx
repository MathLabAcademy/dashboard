import { Box, Button, Heading, Stack } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCQExamsForCourse } from 'store/cqExams'
import { emptyArray } from 'utils/defaults'
import ListItem from './ListItem'

function CourseCQExamList({ courseId }) {
  const cqExamIds = useSelector((state) =>
    get(state.courses.cqExamsById, courseId, emptyArray)
  )

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllCQExamsForCourse(courseId))
  }, [courseId, dispatch])

  return (
    <Permit roles="teacher,analyst,assistant,student">
      <Box borderWidth="1px" boxShadow="sm" p={4} mb={4}>
        <Stack isInline justifyContent="space-between" alignItems="center">
          <Box>
            <Heading fontSize={4}>CQ Exams</Heading>
          </Box>

          <Permit roles="teacher,assistant">
            <Box>
              <Button
                as={Link}
                to={`create`}
                variantColor="blue"
                _hover={{ color: 'white' }}
              >
                Create
              </Button>
            </Box>
          </Permit>
        </Stack>
      </Box>

      {cqExamIds.length > 0 && (
        <Stack spacing={4} borderWidth="1px" boxShadow="sm" p={2}>
          {cqExamIds.map((id) => (
            <Box key={id}>
              <ListItem id={id} />
            </Box>
          ))}
        </Stack>
      )}
    </Permit>
  )
}

export default CourseCQExamList

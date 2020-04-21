import { Badge, Box, Button, Heading } from '@chakra-ui/core'
import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { useCourseEnrollment } from 'hooks/useCourseEnrollment'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCourse } from 'store/courses'

function CourseListItem({ id, ...props }) {
  const isEnrolled = useCourseEnrollment(id)

  const data = useSelector((state) => get(state.courses.byId, id))
  const dispatch = useDispatch()
  useEffect(() => {
    if (!data) {
      dispatch(getCourse(id))
    }
  }, [data, dispatch, id])

  return (
    <Box borderWidth={1} shadow="md" p={4} {...props}>
      <HeaderGrid
        Left={
          <Box>
            <Heading fontSize={4}>
              {get(data, 'name')}{' '}
              {isEnrolled && (
                <Badge
                  variant="solid"
                  variantColor="green"
                  ml={4}
                  fontSize="0.8em"
                >
                  ENROLLED
                </Badge>
              )}
              {!get(data, 'active', true) && (
                <Badge
                  variant="solid"
                  variantColor="gray"
                  ml={4}
                  fontSize="0.8em"
                >
                  INACTIVE
                </Badge>
              )}
            </Heading>
          </Box>
        }
        Right={
          <Button
            as={Link}
            to={`${id}`}
            size="lg"
            variantColor="blue"
            _hover={{ color: 'white' }}
          >
            Open
          </Button>
        }
      />
    </Box>
  )
}

export default CourseListItem

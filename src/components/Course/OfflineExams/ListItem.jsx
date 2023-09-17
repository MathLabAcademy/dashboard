import { Box, Button, Heading, Stack } from '@chakra-ui/core'
import { Link } from '@reach/router'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCQExam } from 'store/cqExams'

function CourseCQExamListItem({ id, data, getData }) {
  useEffect(() => {
    if (!data) getData(id)
  }, [data, getData, id])

  if (!data) {
    return null
  }

  return (
    <Box borderWidth="1px" boxShadow="sm" p={4}>
      <Stack isInline justifyContent="space-between" alignItems="center">
        <Box>
          <Heading fontSize={3}>
            [
            {DateTime.fromISO(get(data, 'date')).toLocaleString(
              DateTime.DATE_MED
            )}
            ] {get(data, 'name')}
          </Heading>
        </Box>
        <Box>
          <Button
            as={Link}
            to={`${id}`}
            _hover={{ color: 'white' }}
            variantColor="blue"
          >
            Open
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

const mapStateToProps = ({ cqExams }, { id }) => ({
  data: get(cqExams.byId, id),
})

const mapDispatchToProps = {
  getData: getCQExam,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseCQExamListItem)

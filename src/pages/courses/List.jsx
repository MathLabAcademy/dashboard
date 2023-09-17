import { Box, Checkbox, Stack } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import Permit from 'components/Permit'
import usePagination from 'hooks/usePagination'
import useToggle from 'hooks/useToggle'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Button, Dropdown, Header, Segment } from 'semantic-ui-react'
import { fetchCoursePage } from 'store/courses'
import { getOwnEnrollments } from 'store/enrollments'
import { emptyArray, emptyObject } from 'utils/defaults'
import formatDropdownOptions from 'utils/format-dropdown-options'
import ListItem from './ListItem'

function CourseList({ pagination, fetchPage, courseTags }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getOwnEnrollments())
  }, [dispatch])

  const tagsRef = useRef()
  const [includeInactive, setIncludeInactive] = useState(false)
  const [open, handler] = useToggle(false)

  const [queryObject, setQueryObject] = useState({ length: 20 })

  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject,
  })

  const filterByTags = useCallback(() => {
    if (!tagsRef.current) return

    const value = tagsRef.current.state.value

    setQueryObject((obj) => ({
      ...obj,
      filter: {
        ...get(obj, 'filter', emptyObject),
        tagIds: value.length ? { '@>': value.map(Number) } : undefined,
      },
    }))
  }, [])

  useEffect(() => {
    setQueryObject((obj) => ({
      ...obj,
      filter: {
        ...get(obj, 'filter', emptyObject),
        active: includeInactive ? undefined : { '=': true },
      },
    }))
  }, [includeInactive])

  const tagOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        courseTags.allIds,
        courseTags.allIds.map((id) => get(courseTags.byId, [id, 'name']))
      )
    )
  }, [courseTags.allIds, courseTags.byId])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Courses</Header>}
          Right={
            <>
              <Permit roles="teacher,assistant">
                <Button as={Link} to={`create`} color="blue">
                  Create
                </Button>
              </Permit>
              <Button
                type="button"
                icon="filter"
                active={open}
                onClick={handler.toggle}
              />
            </>
          }
        />
      </Segment>

      {open && (
        <Stack borderWidth={1} shadow="md" p={4} my={4} spacing={5}>
          <Checkbox
            size="lg"
            isChecked={includeInactive}
            onChange={() => setIncludeInactive((state) => !state)}
          >
            Show Inactive Courses
          </Checkbox>
          <Box>
            <Button fluid labelPosition="left" as="div">
              <Dropdown
                ref={tagsRef}
                fluid
                multiple
                search
                selection
                options={tagOptions}
                className="label"
              />
              <Button type="button" icon="filter" onClick={filterByTags} />
            </Button>
          </Box>
        </Stack>
      )}

      <Stack spacing={4} mb={6}>
        {get(pagination.pages[page], `itemIds`, emptyArray).map((id) => (
          <ListItem key={id} id={id} />
        ))}
      </Stack>

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const mapStateToProps = ({ pagination, courseTags }) => ({
  pagination: pagination.courses,
  courseTags,
})

const mapDispatchToProps = {
  fetchPage: fetchCoursePage,
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)

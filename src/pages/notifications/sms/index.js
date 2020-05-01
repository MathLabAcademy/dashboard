import { Box, Checkbox, FormLabel, Stack, Text } from '@chakra-ui/core'
import { DataTable } from 'components/Table/DataTable'
import { stringify } from 'query-string'
import React, { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactSelectAsync from 'react-select/async'
import { useRowSelect } from 'react-table'
import { useCourseEnrolledUserIds } from 'store/courses/hooks'
import api from 'utils/api'
import { emptyArray } from 'utils/defaults'

function CourseSearch({ onChange: _onChange, ...props }) {
  const loadOptions = useCallback((name) => {
    if (name.length < 3) {
      return Promise.resolve([])
    }

    const query = stringify({
      fields: 'id,name',
      filter: JSON.stringify({ name: { '~*': name } }),
    })

    return api(`/search/courses?${query}`).then(({ data }) => {
      if (data) {
        return data.items.map(({ id: value, name: label }) => ({
          value,
          label,
        }))
      }
    })
  }, [])

  const onChange = useCallback((item) => _onChange(item?.value), [_onChange])

  return (
    <Box minWidth="250px" {...props}>
      <FormLabel htmlFor="course">
        <Text fontSize={2} as="strong">
          Online Course
        </Text>
      </FormLabel>
      <ReactSelectAsync
        inputId="course"
        placeholder="Search Course"
        cacheOptions
        loadOptions={loadOptions}
        onChange={onChange}
        isClearable
      />
    </Box>
  )
}

const userColumns = [
  {
    Header: ({ getToggleAllRowsSelectedProps }) => {
      const { checked, ...props } = getToggleAllRowsSelectedProps()
      return <Checkbox isChecked={checked} {...props} />
    },
    accessor: 'checkbox',
    Cell: ({ row }) => {
      const { checked, ...props } = row.getToggleRowSelectedProps()
      return <Checkbox isChecked={checked} {...props} />
    },
  },
  {
    Header: 'UserID',
    accessor: 'id',
  },
  {
    Header: 'Name',
    accessor: 'Person.shortName',
  },
  {
    Header: 'Phone',
    accessor: 'Person.phone',
    Cell: ({ cell: { value } }) => value.slice(-11),
  },
]

const getRowId = (row) => row.id
const tablePluginHooks = [useRowSelect]

function NotificationsSMSPage() {
  const [courseId, setCourseId] = useState()

  const users = useSelector((state) => state.users)
  const userIds = useCourseEnrolledUserIds(courseId)
  const userData = useMemo(() => {
    return userIds.map((id) => users.byId[id])
  }, [userIds, users.byId])

  const [selectedUserIds, setSelectedUserIds] = useState(emptyArray)

  const onTableStateChange = useCallback(({ selectedRowIds }) => {
    setSelectedUserIds(
      Object.keys(selectedRowIds).filter((id) => selectedRowIds[id])
    )
  }, [])

  return (
    <Box>
      <Stack isInline spacing={2} mb={6}>
        <CourseSearch onChange={setCourseId} p={3} />
      </Stack>

      <Stack isInline>
        <Box>
          <DataTable
            data={userData}
            columns={userColumns}
            getRowId={getRowId}
            pluginHooks={tablePluginHooks}
            onStateChange={onTableStateChange}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default NotificationsSMSPage

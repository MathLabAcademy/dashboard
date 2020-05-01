import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Stack,
  Tag,
  Text,
  Textarea,
} from '@chakra-ui/core'
import { DataTable } from 'components/Table/DataTable'
import useInterval from 'hooks/useInterval'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import { stringify } from 'query-string'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactSelectAsync from 'react-select/async'
import { useRowSelect } from 'react-table'
import { useCourse, useCourseEnrolledUserIds } from 'store/courses/hooks'
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

const placeholderMap = {
  replacer: {
    '#{courseName}': ({ course }) => get(course, 'name'),
    '#{coursePrice}': ({ course }) => get(course, 'price') / 100,
    '#{userId}': ({ users }) => users.allIds[0],
    '#{userName}': ({ users }) =>
      get(users.byId[users.allIds[0]], 'Person.shortName'),
    '#{today}': () => DateTime.local().toFormat('yyyy-MM-dd'),
    '#{signature}': () => '— MathLab',
  },
  remote: ['#{userId}', '#{userName}'],
}

const placeholderPattern = /#\{\w+\}/g

const hydrateTemplate = (template, data, preview = false) => {
  let hydratedTemplate = template

  let placeholders = template.match(placeholderPattern)

  if (!preview) {
    placeholders = placeholders?.filter(
      (placeholder) => !placeholderMap.remote.includes(placeholder)
    )
  }

  if (placeholders) {
    for (const placeholder of placeholders) {
      if (placeholderMap.replacer[placeholder]) {
        hydratedTemplate = hydratedTemplate.replace(
          placeholder,
          placeholderMap.replacer[placeholder](data)
        )
      }
    }
  }

  return hydratedTemplate
}

function NotificationsSMSPage() {
  const [courseId, setCourseId] = useState()
  const course = useCourse(courseId)

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

  const templateRef = useRef()

  const [preview, setPreview] = useState('')
  const refreshPreview = useCallback(() => {
    const template = templateRef.current.value
    setPreview(hydrateTemplate(template, { course, users }, true))
  }, [course, users])
  useInterval(refreshPreview, 1500)

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(() => {
    setLoading(true)

    const _template = templateRef.current.value
    const template = hydrateTemplate(_template, { course, users })

    setTimeout(() => {
      window.alert(`Not Yet Implemented!`)
      console.log({ userIds, template })

      setLoading(false)
    }, 2000)
  }, [course, userIds, users])

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

        <Box flexGrow={1} maxWidth="600px" mx="auto">
          <Stack spacing={8}>
            <Box>
              <Text fontSize={2} as="strong" mb={2} display="block">
                SMS Placeholders
              </Text>
              <Stack isInline spacing={2}>
                {Object.keys(placeholderMap.replacer).map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </Stack>
            </Box>

            <Box>
              <FormLabel htmlFor="template">
                <Text fontSize={2} as="strong">
                  SMS Template
                </Text>
              </FormLabel>
              <Textarea
                id="template"
                ref={templateRef}
                fontSize={2}
                resize="vertical"
                height="auto"
                rows="5"
              />
            </Box>

            <Box>
              <Text fontSize={2} as="strong">
                SMS Preview
              </Text>
              <Textarea
                value={preview}
                fontSize={2}
                isDisabled={true}
                height="auto"
                rows="5"
              />
            </Box>

            <Stack isInline justifyContent="flex-end">
              <Button
                type="button"
                variantColor="blue"
                size="lg"
                isLoading={loading}
                isDisabled={loading || !selectedUserIds.length}
                onClick={onSubmit}
              >
                Send SMS
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default NotificationsSMSPage

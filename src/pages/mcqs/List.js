import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import Permit from 'components/Permit'
import usePagination from 'hooks/usePagination'
import useToggle from 'hooks/useToggle'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Box, Flex } from 'reflexbox'
import { Button, Dropdown, Header, Segment } from 'semantic-ui-react'
import { fetchMCQPage } from 'store/actions/mcqs'
import { emptyArray, emptyObject } from 'utils/defaults'
import formatDropdownOptions from 'utils/format-dropdown-options'
import * as localStorage from 'utils/localStorage'
import ListItem from './ListItem'

function MCQTagGroups({ setTags }) {
  const groups = useMemo(
    () => localStorage.loadState('mathlab:mcqTagGroups') || emptyObject,
    []
  )

  return (
    <Flex>
      {Object.keys(groups).map((name, index) => (
        <Box key={index} p={2}>
          <Button onClick={() => setTags(groups[name], true)}>{name}</Button>
        </Box>
      ))}
    </Flex>
  )
}

function MCQList({ pagination, fetchPage, mcqTags }) {
  const tagsRef = useRef()
  const [open, handler] = useToggle(false)

  const [queryObject, setQueryObject] = useState({ length: 20 })

  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject,
  })

  const setTags = useCallback((tags = emptyArray, forceSet = false) => {
    if (forceSet) {
      tagsRef.current.setValue(tags)
    }

    setQueryObject((obj) => ({
      ...obj,
      filter: {
        ...get(obj, 'filter', emptyObject),
        tagIds: tags.length ? { '&&': tags.map(Number) } : undefined,
      },
    }))
  }, [])

  const filterByTags = useCallback(() => {
    if (!tagsRef.current) return

    const value = tagsRef.current.state.value

    setTags(value)
  }, [setTags])

  const tagOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        mcqTags.allIds,
        mcqTags.allIds.map((id) => get(mcqTags.byId, [id, 'name']))
      )
    )
  }, [mcqTags.allIds, mcqTags.byId])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Multiple Choice Questions</Header>}
          Right={
            <>
              <Permit roles="teacher,assistant">
                <Button as={Link} to={`create`} color="blue">
                  Create
                </Button>
              </Permit>
              <Button
                type="button"
                icon="tags"
                active={open}
                onClick={handler.toggle}
              />
            </>
          }
        />
      </Segment>

      {open && (
        <Segment>
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

          <MCQTagGroups tagOptions={tagOptions} setTags={setTags} />
        </Segment>
      )}

      {get(pagination.pages[page], `itemIds`, emptyArray).map((id) => (
        <ListItem key={id} id={id} mcqId={id} />
      ))}

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const mapStateToProps = ({ pagination, mcqTags }) => ({
  pagination: pagination.mcqs,
  mcqTags,
})

const mapDispatchToProps = {
  fetchPage: fetchMCQPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQList)

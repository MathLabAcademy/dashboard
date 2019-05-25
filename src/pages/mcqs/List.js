import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Switcher from 'components/Pagination/Switcher.js'
import usePagination from 'hooks/usePagination.js'
import useToggle from 'hooks/useToggle.js'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Header, Segment } from 'semantic-ui-react'
import { fetchMCQPage } from 'store/actions/mcqs.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import ListItem from './ListItem.js'
import Permit from 'components/Permit.js'

function MCQList({ pagination, fetchPage, mcqTags }) {
  const tagsRef = useRef()
  const [open, handler] = useToggle(false)

  const [queryObject, setQueryObject] = useState({ length: 20 })

  const [[page, handlePageChange]] = usePagination(pagination, fetchPage, {
    queryObject
  })

  const filterByTags = useCallback(() => {
    if (!tagsRef.current) return

    const value = tagsRef.current.state.value

    setQueryObject(obj => ({
      ...obj,
      filter: {
        ...get(obj, 'filter', emptyObject),
        tagIds: value.length ? { '@>': value.map(Number) } : undefined
      }
    }))
  }, [])

  const tagOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        mcqTags.allIds,
        mcqTags.allIds.map(id => get(mcqTags.byId, [id, 'name']))
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
              <Permit teacher>
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
        </Segment>
      )}

      {get(pagination.pages[page], `itemIds`, emptyArray).map(id => (
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
  mcqTags
})

const mapDispatchToProps = {
  fetchPage: fetchMCQPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQList)

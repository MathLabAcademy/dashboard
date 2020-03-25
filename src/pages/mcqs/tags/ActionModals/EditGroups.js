import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import { get, zipObject } from 'lodash-es'
import React, { useEffect, useMemo, useReducer } from 'react'
import { connect } from 'react-redux'
import { Flex } from 'reflexbox'
import { Button, Dropdown, Input, Modal } from 'semantic-ui-react'
import { updateTag } from 'store/actions/mcqTags'
import { emptyArray, emptyObject } from 'utils/defaults'
import formatDropdownOptions from 'utils/format-dropdown-options'
import * as localStorage from 'utils/localStorage'

const initialState = emptyObject

const getInitialState = () => {
  return localStorage.loadState('mathlab:mcqTagGroups') || initialState
}

function reducer(state, { type, prevName, name, tags = emptyArray }) {
  switch (type) {
    case 'RENAME_GROUP': {
      const newState = { ...state }
      newState[name] = newState[prevName]
      delete newState[prevName]
      return newState
    }
    case 'ADD_GROUP':
      return { ...state, [name]: tags }
    case 'REMOVE_GROUP': {
      const newState = { ...state }
      delete newState[name]
      return newState
    }
    case 'SET_TAGS':
      return { ...state, [name]: tags }
    case 'RESET':
      return getInitialState()
    default:
      throw new Error('Invalid action type')
  }
}

function TagGroupsEditModal({ mcqTags }) {
  const [open, handle] = useToggle(false)

  const [groups, dispatch] = useReducer(reducer, initialState, getInitialState)

  useEffect(() => {
    localStorage.saveState('mathlab:mcqTagGroups', groups)
  }, [groups])

  const tagOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        mcqTags.allIds,
        mcqTags.allIds.map((id) => get(mcqTags.byId, [id, 'name']))
      )
    )
  }, [mcqTags.allIds, mcqTags.byId])

  return (
    <Permit teacher>
      <Modal
        trigger={
          <Button
            type="button"
            basic
            color="blue"
            icon="edit outline"
            onClick={handle.open}
            content={'Edit Groups'}
          />
        }
        closeIcon
        open={open}
        onClose={handle.close}
      >
        <Modal.Header>Edit Tag Groups</Modal.Header>

        <Modal.Content>
          {Object.keys(groups).map((name, index) => (
            <Flex key={index} alignItems="center" py={2}>
              <Input
                value={name}
                onChange={(e) => {
                  dispatch({
                    type: 'RENAME_GROUP',
                    prevName: name,
                    name: e.target.value,
                  })
                }}
              />
              <Dropdown
                name={name}
                fluid
                multiple
                search
                selection
                options={tagOptions}
                defaultValue={groups[name]}
                onChange={(_, { value, name }) => {
                  dispatch({ type: 'SET_TAGS', name, tags: value })
                }}
              />
              <Button
                onClick={() => {
                  dispatch({ type: 'REMOVE_GROUP', name })
                }}
              >
                Remove
              </Button>
            </Flex>
          ))}
        </Modal.Content>

        <Modal.Actions>
          <Button
            onClick={() => {
              dispatch({
                type: 'ADD_GROUP',
                name: `GROUP:${Math.floor(Math.random() * 100)}`,
              })
            }}
          >
            Add Group
          </Button>
          <Button type="reset">Reset</Button>
        </Modal.Actions>
      </Modal>
    </Permit>
  )
}

const mapStateToProps = ({ mcqTags }) => ({ mcqTags })

const mapDispatchToProps = {
  updateTag,
}

export default connect(mapStateToProps, mapDispatchToProps)(TagGroupsEditModal)

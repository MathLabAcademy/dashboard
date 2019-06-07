import { EditorState, Modifier, SelectionState } from 'draft-js'
import insertAtomicBlock from 'draft/modifiers/insertAtomicBlock.js'
import insertEntity from 'draft/modifiers/insertEntity.js'
import removeBlock from 'draft/modifiers/removeBlock.js'
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  Button,
  Checkbox,
  Form,
  FormField,
  FormGroup,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react'
import TeX from './TeX.js'
import removeEntity from 'draft/modifiers/removeEntity.js'

const defaultState = {
  tex: '',
  type: 'block',
  error: 'empty'
}

const getIntialState = data => {
  return data
    ? { tex: data.tex, type: data.type, error: data.tex ? '' : 'empty' }
    : defaultState
}

function reducer(state, { type, data }) {
  switch (type) {
    case 'RESET':
      return data
    case 'UPDATE':
      return {
        ...state,
        ...data,
        error: ''
      }
    case 'ERROR':
      return {
        ...state,
        error: data
      }
    default:
      throw new Error(`invalid actionType: ${type}`)
  }
}

function TeXEditor({
  isInline,
  toUpdate,
  block,
  children,
  contentState,
  decoratedText,
  dir,
  entityKey,
  offsetKey,
  getStore,
  onClose
}) {
  useEffect(() => {
    const store = getStore()
    store.setReadOnly(true)
    return () => store.setReadOnly(false)
  }, [getStore])

  const initialState = useMemo(() => {
    if (!toUpdate) return getIntialState()

    if (isInline) {
      const entity = contentState.getEntity(entityKey)

      const entityData = entity.getData()

      return getIntialState({
        tex: entityData.tex,
        type: entityData.type
      })
    }

    const blockData = block.getData()

    return getIntialState({
      tex: blockData.get('tex'),
      type: blockData.get('type')
    })
  }, [block, contentState, entityKey, isInline, toUpdate])

  const [state, dispatch] = useReducer(reducer, initialState)

  const onReset = useCallback(() => {
    dispatch({ type: 'RESET', data: initialState })
  }, [initialState])

  const onChange = useCallback(
    (_, { name, value }) => {
      if (toUpdate && name === 'type') return

      dispatch({ type: 'UPDATE', data: { [name]: value } })
    },
    [toUpdate]
  )

  const onError = useCallback(err => {
    dispatch({ type: 'ERROR', data: err.toString() })
  }, [])

  const onRemove = useCallback(() => {
    if (!toUpdate) return

    const store = getStore()

    if (isInline) {
      store.setEditorState(editorState =>
        removeEntity(editorState, { contentState, entityKey })
      )
    } else {
      const blockKey = block.getKey()
      store.setEditorState(editorState => removeBlock(editorState, blockKey))
    }

    onClose()
  }, [block, contentState, entityKey, getStore, isInline, onClose, toUpdate])

  const handleUpdate = useCallback(() => {
    const store = getStore()

    if (isInline) {
      const editorState = store.getEditorState()
      const selectionState = editorState.getSelection()
      const blockKey = selectionState.getStartKey()
      const block = contentState.getBlockForKey(blockKey)

      let selectionToReplace = SelectionState.createEmpty(blockKey)

      block.findEntityRanges(
        character => {
          const characterEntityKey = character.getEntity()
          return characterEntityKey && characterEntityKey === entityKey
        },
        (start, end) => {
          selectionToReplace = selectionToReplace.merge({
            anchorOffset: start,
            focusOffset: end
          })
        }
      )

      const newContentState = Modifier.replaceText(
        contentState,
        selectionToReplace,
        ' ',
        null,
        entityKey
      ).mergeEntityData(entityKey, { tex: state.tex })

      store.setEditorState(editorState =>
        EditorState.push(editorState, newContentState, 'insert-characters')
      )
    } else {
      const blockKey = block.getKey()

      const contentBlock = contentState.getBlockForKey(blockKey)

      const targetRange = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: contentBlock.getLength()
      })

      const newContentState = Modifier.mergeBlockData(
        contentState,
        targetRange,
        { tex: state.tex }
      )

      store.setEditorState(editorState =>
        EditorState.push(editorState, newContentState, 'change-block-data')
      )
    }
  }, [block, contentState, entityKey, getStore, isInline, state.tex])

  const handleInsert = useCallback(() => {
    const store = getStore()

    const isInline = state.type === 'inline'

    const data = {
      tex: state.tex,
      type: state.type
    }

    if (!isInline) data.atomic = 'texblock'

    const editorState = store.getEditorState()
    const newEditorState = isInline
      ? insertEntity(editorState, 'inlinetex', data)
      : insertAtomicBlock(editorState, data)

    store.setEditorState(newEditorState)
  }, [getStore, state.tex, state.type])

  const onSubmit = useCallback(() => {
    if (toUpdate) handleUpdate()
    else handleInsert()

    onClose()
  }, [handleInsert, handleUpdate, onClose, toUpdate])

  return (
    <>
      <Modal.Header>{toUpdate ? `Insert` : 'Update'} TeX</Modal.Header>
      <Modal.Content>
        <Form as="div">
          <Segment>
            <TeX data={state} onParseError={onError} />
          </Segment>

          <FormField>
            <TextArea
              name="tex"
              value={state.tex}
              onChange={onChange}
              rows="5"
            />
          </FormField>

          <FormGroup>
            <FormField disabled={toUpdate}>
              <Checkbox
                name="type"
                value="block"
                onChange={onChange}
                checked={state.type === 'block'}
                label={`Block`}
              />
            </FormField>
            <FormField disabled={toUpdate}>
              <Checkbox
                name="type"
                onChange={onChange}
                value="inline"
                checked={state.type === 'inline'}
                label={`Inline`}
              />
            </FormField>
          </FormGroup>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {toUpdate && (
          <Button
            type="button"
            color="red"
            onClick={onRemove}
            content={`Remove`}
          />
        )}

        <Button type="button" onClick={onReset} content={`Reset`} />
        <Button
          type="button"
          color="blue"
          disabled={Boolean(state.error)}
          onClick={onSubmit}
          content={toUpdate ? 'Save' : 'Insert'}
        />
      </Modal.Actions>
    </>
  )
}

export default TeXEditor

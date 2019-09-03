import { EditorState, Modifier, SelectionState } from 'draft-js'
import insertAtomicBlock from 'components/Draft/modifiers/insertAtomicBlock'
import removeBlock from 'components/Draft/modifiers/removeBlock'
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  Button,
  Form,
  FormField,
  FormGroup,
  Grid,
  Image,
  Input,
  Modal,
  Placeholder,
  Segment
} from 'semantic-ui-react'
import { __MATHLAB_DRAFT_JS_IMAGE_BLOCK_TYPE__ } from './constants'

const defaultState = {
  src: '',
  caption: ''
}

const getIntialState = data => {
  return data ? { src: data.src, caption: data.caption } : defaultState
}

function reducer(state, { type, data }) {
  switch (type) {
    case 'RESET':
      return data
    case 'UPDATE':
      return {
        ...state,
        ...data
      }
    default:
      throw new Error(`invalid actionType: ${type}`)
  }
}

function ImageEditor({ toUpdate, block, contentState, store, onClose }) {
  useEffect(() => {
    store.setReadOnly(true)
    return () => store.setReadOnly(false)
  }, [store])

  const initialState = useMemo(() => {
    if (!toUpdate) return getIntialState()

    const blockData = block.getData()

    return getIntialState({
      src: blockData.get('src'),
      caption: blockData.get('caption')
    })
  }, [block, toUpdate])

  const [state, dispatch] = useReducer(reducer, initialState)

  const onReset = useCallback(() => {
    dispatch({ type: 'RESET', data: initialState })
  }, [initialState])

  const onChange = useCallback((_, { name, value }) => {
    dispatch({ type: 'UPDATE', data: { [name]: value } })
  }, [])

  const onRemove = useCallback(() => {
    if (!toUpdate) return

    const blockKey = block.getKey()

    const newEditorState = removeBlock(store.getEditorState(), blockKey)

    store.setEditorState(newEditorState)

    onClose()
  }, [block, store, onClose, toUpdate])

  const handleUpdate = useCallback(() => {
    const blockKey = block.getKey()

    const contentBlock = contentState.getBlockForKey(blockKey)

    const selectionState = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: 0,
      focusOffset: contentBlock.getLength()
    })

    const newContentState = Modifier.mergeBlockData(
      contentState,
      selectionState,
      { src: state.src, caption: state.caption }
    )

    const newEditorState = EditorState.push(
      store.getEditorState(),
      newContentState,
      'change-block-data'
    )

    store.setEditorState(newEditorState)
  }, [block, contentState, store, state.caption, state.src])

  const handleInsert = useCallback(() => {
    const data = {
      src: state.src,
      caption: state.caption,
      type: __MATHLAB_DRAFT_JS_IMAGE_BLOCK_TYPE__
    }

    const newEditorState = insertAtomicBlock(store.getEditorState(), data)

    store.setEditorState(newEditorState)
  }, [store, state.caption, state.src])

  const onSubmit = useCallback(() => {
    if (toUpdate) handleUpdate()
    else handleInsert()

    onClose()
  }, [handleInsert, handleUpdate, onClose, toUpdate])

  return (
    <>
      <Modal.Header>{toUpdate ? `Change` : `Insert`} Image</Modal.Header>
      <Modal.Content>
        <Form as="div">
          <Grid columns="equal">
            <Grid.Column>
              <FormField>
                <Input
                  label={'Source'}
                  name="src"
                  value={state.src}
                  onChange={onChange}
                />
              </FormField>
              <FormField>
                <Input
                  label={'Caption'}
                  name="caption"
                  value={state.caption}
                  onChange={onChange}
                />
              </FormField>

              <FormGroup widths="equal">
                {toUpdate && (
                  <FormField>
                    <Button
                      fluid
                      type="button"
                      color="red"
                      onClick={onRemove}
                      content={`Remove`}
                    />
                  </FormField>
                )}

                <FormField>
                  <Button
                    fluid
                    type="button"
                    onClick={onReset}
                    content={`Reset`}
                  />
                </FormField>
                <FormField>
                  <Button
                    fluid
                    type="button"
                    color="blue"
                    disabled={!state.src}
                    onClick={onSubmit}
                    content={toUpdate ? 'Save' : 'Insert'}
                  />
                </FormField>
              </FormGroup>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                {state.src ? (
                  <Image src={`/api${state.src}`} alt={state.caption} />
                ) : (
                  <Placeholder fluid>
                    <Placeholder.Image />
                  </Placeholder>
                )}
              </Segment>
            </Grid.Column>
          </Grid>
        </Form>
      </Modal.Content>
    </>
  )
}

export default ImageEditor

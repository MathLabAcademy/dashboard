import { EditorState, Modifier, SelectionState } from 'draft-js'
import insertAtomicBlock from 'draft/modifiers/insertAtomicBlock'
import removeBlock from 'draft/modifiers/removeBlock'
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  Button,
  Form,
  FormField,
  Grid,
  Image,
  Input,
  Modal,
  Placeholder,
  Segment,
  FormGroup
} from 'semantic-ui-react'

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

function ImageEditor({ toUpdate, block, contentState, getStore, onClose }) {
  useEffect(() => {
    const store = getStore()
    store.setReadOnly(true)
    return () => store.setReadOnly(false)
  }, [getStore])

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

    const store = getStore()

    const blockKey = block.getKey()
    store.setEditorState(editorState => removeBlock(editorState, blockKey))

    onClose()
  }, [block, getStore, onClose, toUpdate])

  const handleUpdate = useCallback(() => {
    const store = getStore()

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

    store.setEditorState(editorState =>
      EditorState.push(editorState, newContentState, 'change-block-data')
    )
  }, [block, contentState, getStore, state.caption, state.src])

  const handleInsert = useCallback(() => {
    const store = getStore()

    const data = {
      src: state.src,
      caption: state.caption,
      atomic: 'image'
    }

    store.setEditorState(editorState => insertAtomicBlock(editorState, data))
  }, [getStore, state.caption, state.src])

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

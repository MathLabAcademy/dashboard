import imageCompression from 'browser-image-compression'
import { get } from 'lodash-es'
import React, { useCallback, useReducer, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Form,
  FormField,
  Grid,
  Image,
  Input,
  List,
  Message,
  Placeholder,
  Segment
} from 'semantic-ui-react'
import { uploadMCQImage } from 'store/actions/mcqs.js'

const defaultState = {
  file: null,
  src: '',
  loading: false,
  error: ''
}

const getIntialState = data => {
  return data
    ? {
        file: null,
        src: `/api${get(data, 'filePath')}`,
        loading: false,
        error: '',
        serial: get(data, 'serial')
      }
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

function MCQImageUploader({ mcqId, serial, image, uploadMCQImage, onSuccess }) {
  const initialState = useMemo(() => getIntialState(image), [image])

  const [state, dispatch] = useReducer(reducer, initialState)

  const onReset = useCallback(
    () => dispatch({ type: 'RESET', data: initialState }),
    [initialState]
  )

  const onSubmit = useCallback(
    async state => {
      try {
        if (state.error) return

        dispatch({ type: 'UPDATE', data: { loading: true } })
        await uploadMCQImage(mcqId, { serial: state.serial, image: state.file })
        dispatch({ type: 'RESET', data: initialState })

        if (state.serial) return   window.location.reload(true)

        onSuccess()
      } catch (err) {
        dispatch({ type: 'ERROR', data: err.message || 'error occured' })
      }
    },
    [initialState, mcqId, onSuccess, uploadMCQImage]
  )

  return (
    <Segment basic>
      <Form as="div">
        <Message color="yellow" hidden={!state.error}>
          {state.error}
        </Message>

        <Grid columns={2}>
          <Grid.Column className="auto wide">
            <FormField>
              <Input
                type="file"
                accept="image/png, image/jpeg"
                onChange={async event => {
                  const imageFile = event.target.files[0]

                  if (!imageFile) return

                  const image = await imageCompression(imageFile, {
                    maxWidthOrHeight: 512
                  })

                  const base64EncodedImage = await imageCompression.getDataUrlFromFile(
                    image
                  )

                  dispatch({
                    type: 'UPDATE',
                    data: { file: image, src: base64EncodedImage }
                  })
                }}
                action={
                  <Button
                    type="button"
                    disabled={Boolean(!state.file || state.error)}
                    content={serial ? 'Replace' : 'Upload'}
                    onClick={() => onSubmit(state)}
                  />
                }
              />
            </FormField>

            <FormField>
              <Button type="button" onClick={onReset} content={`Reset`} />
            </FormField>

            <List>
              <List.Item>
                <strong>Size</strong>:{' '}
                {Number(get(state.file, 'size', 0) / 1024).toFixed(2)} KB
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column className="grow wide">
            {state.src ? (
              <Image src={state.src} />
            ) : (
              <Placeholder fluid>
                <Placeholder.Image />
              </Placeholder>
            )}
          </Grid.Column>
        </Grid>
      </Form>
    </Segment>
  )
}

const mapStateToProps = ({ mcqs }, { mcqId, serial }) => ({
  image: get(mcqs.imagesById, [mcqId, serial])
})

const mapDispatchToProps = {
  uploadMCQImage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQImageUploader)

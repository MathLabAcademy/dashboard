import imageCompression from 'browser-image-compression'
import { get } from 'lodash-es'
import React, { useCallback, useReducer } from 'react'
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
  Segment,
} from 'semantic-ui-react'
import { uploadMCQTmpImage } from 'store/actions/mcqs'

const initialState = {
  file: null,
  src: '',
  loading: false,
  error: '',
}

function reducer(state, { type, data }) {
  switch (type) {
    case 'RESET':
      return initialState
    case 'UPDATE':
      return {
        ...state,
        ...data,
        error: '',
      }
    case 'ERROR':
      return {
        ...state,
        error: data,
      }
    default:
      throw new Error(`invalid actionType: ${type}`)
  }
}

function MCQTmpImageUploader({ uploadMCQTmpImage, onSuccess }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onSubmit = useCallback(
    async (state) => {
      try {
        if (state.error) return

        dispatch({ type: 'UPDATE', data: { loading: true } })
        await uploadMCQTmpImage({ image: state.file })
        dispatch({ type: 'RESET' })

        onSuccess()
      } catch (err) {
        dispatch({ type: 'ERROR', data: err.message || 'error occured' })
      }
    },
    [onSuccess, uploadMCQTmpImage]
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
                onChange={async (event) => {
                  const imageFile = event.target.files[0]

                  const image = await imageCompression(imageFile, {
                    maxWidthOrHeight: 512,
                  })

                  const base64EncodedImage = await imageCompression.getDataUrlFromFile(
                    image
                  )

                  dispatch({
                    type: 'UPDATE',
                    data: { file: image, src: base64EncodedImage },
                  })
                }}
                action={
                  <Button
                    type="button"
                    disabled={Boolean(!state.file || state.error)}
                    content={'Upload'}
                    onClick={() => onSubmit(state)}
                  />
                }
              />
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

const mapStateToProps = null

const mapDispatchToProps = {
  uploadMCQTmpImage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQTmpImageUploader)

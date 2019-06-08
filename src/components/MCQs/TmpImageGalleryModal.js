import { get } from 'lodash-es'
import React, { useEffect, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { Card, Modal, Button, Image, Input } from 'semantic-ui-react'
import { getAllMCQTmpImages } from 'store/actions/mcqs.js'
import useToggle from 'hooks/useToggle'
import md5 from 'md5-o-matic'

import TmpImageUploader from './TmpImageUploader.js'

function ImageCard({ src }) {
  const id = useMemo(() => `tmp-${md5(src)}`, [src])
  const copySrc = useCallback(() => {
    document.querySelector(`#${id}`).select()
    document.execCommand('copy')
  }, [id])

  return (
    <Card>
      <Image src={`/api${src}`} />
      <Card.Content />
      <Card.Content extra>
        <Input
          disabled
          className="static"
          fluid
          id={id}
          value={src}
          action={
            <Button type="button" icon="copy outline" onClick={copySrc} />
          }
        />
      </Card.Content>
    </Card>
  )
}

function MCQTmpImageGalleryModal({ images, getAllMCQTmpImages }) {
  useEffect(() => {
    getAllMCQTmpImages()
  }, [getAllMCQTmpImages])

  const [uploaderOpen, uploaderHandle] = useToggle(false)

  return (
    <Card.Group centered itemsPerRow={4}>
      {images.map(src => (
        <ImageCard key={src} src={src} />
      ))}
      <Card>
        <Card.Content />
        <Card.Content extra>
          <Modal
            closeIcon
            open={uploaderOpen}
            onClose={uploaderHandle.close}
            trigger={
              <Button
                fluid
                type="button"
                disabled={images.length >= 5}
                onClick={uploaderHandle.open}
              >
                Add
              </Button>
            }
          >
            <Modal.Header>Add Temporary Image</Modal.Header>
            <Modal.Content>
              <TmpImageUploader onSuccess={uploaderHandle.close} />
            </Modal.Content>
          </Modal>
        </Card.Content>
      </Card>
    </Card.Group>
  )
}

const mapStateToProps = ({ mcqs }) => ({
  images: get(mcqs.imagesById, 'tmp')
})

const mapDispatchToProps = {
  getAllMCQTmpImages
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQTmpImageGalleryModal)

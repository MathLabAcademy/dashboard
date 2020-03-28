import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import md5 from 'md5-o-matic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Image, Input, Modal } from 'semantic-ui-react'
import { getAllMCQImages } from 'store/actions/mcqs'
import { emptyObject } from 'utils/defaults'
import ImageUploader from './ImageUploader'

function ImageCard({ image, openReplacer }) {
  const id = useMemo(() => `tmp-${md5(get(image, 'filePath'))}`, [image])
  const copySrc = useCallback(() => {
    document.querySelector(`#${id}`).select()
    document.execCommand('copy')
  }, [id])

  const onClick = useCallback(() => {
    openReplacer(get(image, 'serial'))
  }, [image, openReplacer])

  return (
    <Card>
      <Image src={`/api${get(image, 'filePath')}`} onClick={onClick} />
      <Card.Content />
      <Card.Content extra>
        <Input
          className="static"
          fluid
          id={id}
          value={get(image, 'filePath')}
          action={
            <Button type="button" icon="copy outline" onClick={copySrc} />
          }
        />
      </Card.Content>
    </Card>
  )
}

function MCQImageGalleryModal({ mcqId, images, getAllMCQImages }) {
  useEffect(() => {
    getAllMCQImages(mcqId)
  }, [getAllMCQImages, mcqId])

  const imagesLength = useMemo(() => {
    return Object.keys(images).length
  }, [images])

  const [uploaderOpen, uploaderHandle] = useToggle(false)

  const [replacerSerial, setReplacerSerial] = useState()

  const openAdder = useCallback(() => {
    setReplacerSerial()
    uploaderHandle.open()
  }, [uploaderHandle])

  const openReplacer = useCallback(
    (serial) => {
      setReplacerSerial(serial)
      uploaderHandle.open()
    },
    [uploaderHandle]
  )

  return (
    <Card.Group centered itemsPerRow={4}>
      {Object.values(images).map((image) => (
        <ImageCard
          key={`${mcqId}-${get(image, 'serial')}`}
          image={image}
          openReplacer={openReplacer}
        />
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
                disabled={imagesLength >= 5}
                onClick={openAdder}
              >
                Add
              </Button>
            }
          >
            <Modal.Header>
              {replacerSerial ? 'Replace' : 'Add'} Image
            </Modal.Header>
            <Modal.Content>
              <ImageUploader
                mcqId={mcqId}
                serial={replacerSerial}
                onSuccess={uploaderHandle.close}
              />
            </Modal.Content>
          </Modal>
        </Card.Content>
      </Card>
    </Card.Group>
  )
}

const mapStateToProps = ({ mcqs }, { mcqId }) => ({
  images: get(mcqs.imagesById, mcqId, emptyObject),
})

const mapDispatchToProps = {
  getAllMCQImages,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQImageGalleryModal)

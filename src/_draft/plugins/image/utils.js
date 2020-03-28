import ImageBlock from './ImageBlock'

export function blockRendererFn(block, getStore, next) {
  const isAtomic = block.getType() === 'atomic'
  const isImage = block.getData().get('atomic') === 'image'

  if (isAtomic && isImage) {
    return {
      component: ImageBlock,
      editable: false,
      props: {
        getStore,
      },
    }
  }

  return next()
}

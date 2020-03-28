import { __MATHLAB_DRAFT_JS_IMAGE_BLOCK_TYPE__ } from './constants'
import ImageBlock from './ImageBlock'

export function blockRendererFn(store, block) {
  const isAtomic = block.getType() === 'atomic'
  const isImage =
    block.getData().get('type') === __MATHLAB_DRAFT_JS_IMAGE_BLOCK_TYPE__

  if (isAtomic && isImage) {
    return {
      component: ImageBlock,
      editable: false,
      props: {
        store,
      },
    }
  }
}

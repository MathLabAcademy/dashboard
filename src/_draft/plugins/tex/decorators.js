import InlineTeX from './InlineTeX'
import { findInlineTeXEntities } from './utils'

const inlineTeXDecorator = {
  strategy: findInlineTeXEntities,
  component: InlineTeX
}

const decorators = [inlineTeXDecorator]

export default decorators

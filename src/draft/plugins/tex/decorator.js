import InlineTeX from './InlineTeX.js'
import { findInlineTeXEntities } from './utils.js'

const inlineTeXDecorator = {
  strategy: findInlineTeXEntities,
  component: InlineTeX
}

export default inlineTeXDecorator

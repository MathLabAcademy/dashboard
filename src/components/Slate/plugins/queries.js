function QueriesPlugin() {
  const queries = {
    hasMark: (editor, markType) => {
      const { value } = editor
      return value.activeMarks.some((mark) => mark.type === markType)
    },
    hasBlock: (editor, type) => {
      const { value } = editor
      return value.blocks.some((node) => node.type === type)
    },
    hasInline: (editor, type) => {
      const { value } = editor
      return value.inlines.some((node) => node.type === type)
    },
  }

  return {
    queries,
  }
}

export default QueriesPlugin

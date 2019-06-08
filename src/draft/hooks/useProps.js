import { getDefaultKeyBinding, RichUtils } from 'draft-js'
import { useMemo } from 'react'

const defaultBlockRendererFn = (block, getStore) => {
  return null
}

const getBlockRendererFn = (getStore, pluginBlockRendererFns = []) => block => {
  const blockRendererFns = [].concat(pluginBlockRendererFns)

  const next = () => blockRendererFns.shift()

  let nextBlockRendererFn = next()

  while (typeof nextBlockRendererFn === 'function') {
    nextBlockRendererFn = nextBlockRendererFn(block, getStore, next)
  }

  if (typeof nextBlockRendererFn === 'object') {
    return nextBlockRendererFn
  }

  return defaultBlockRendererFn(block, getStore)
}

const defaultKeyBindingFn = (event, getStore) => {
  switch (event.keyCode) {
    default:
      return getDefaultKeyBinding(event)
  }
}

const getKeyBindingFn = (getStore, pluginKeyBindingFns = []) => event => {
  const keyBindingFns = [].concat(pluginKeyBindingFns)

  const next = () => keyBindingFns.shift()

  let nextKeyBindingFn = next()

  while (typeof nextKeyBindingFn === 'function') {
    nextKeyBindingFn = nextKeyBindingFn(event, getStore, next)
  }

  if (typeof nextKeyBindingFn === 'string') return nextKeyBindingFn

  return defaultKeyBindingFn(event, getStore)
}

const defaultHandleKeyCommand = (command, editorState, getStore) => {
  const newEditorState = RichUtils.handleKeyCommand(editorState, command)

  if (newEditorState) {
    getStore().setEditorState(newEditorState)
    return 'handled'
  }

  return 'not-handled'
}

const getHandleKeyCommand = (getStore, pluginHandleKeyCommands = []) => (
  command,
  editorState
) => {
  const handleKeyCommands = [].concat(pluginHandleKeyCommands)

  const next = () => handleKeyCommands.shift()

  let nextHandleKeyCommand = next()

  while (typeof nextHandleKeyCommand === 'function') {
    nextHandleKeyCommand = nextHandleKeyCommand(
      command,
      editorState,
      getStore,
      next
    )
  }

  if (typeof nextHandleKeyCommand === 'string') return nextHandleKeyCommand

  return defaultHandleKeyCommand(command, editorState, getStore)
}

function useProps(getStore, plugins) {
  const { blockRendererFns, handleKeyCommands, keyBindingFns } = useMemo(() => {
    const blockRendererFns = plugins
      .map(({ blockRendererFn }) => blockRendererFn)
      .filter(Boolean)
    const handleKeyCommands = plugins
      .map(({ handleKeyCommand }) => handleKeyCommand)
      .filter(Boolean)
    const keyBindingFns = plugins
      .map(({ keyBindingFn }) => keyBindingFn)
      .filter(Boolean)

    return { blockRendererFns, handleKeyCommands, keyBindingFns }
  }, [plugins])

  const blockRendererFn = useMemo(
    () => getBlockRendererFn(getStore, blockRendererFns),
    [getStore, blockRendererFns]
  )

  const handleKeyCommand = useMemo(
    () => getHandleKeyCommand(getStore, handleKeyCommands),
    [getStore, handleKeyCommands]
  )

  const keyBindingFn = useMemo(() => getKeyBindingFn(getStore, keyBindingFns), [
    getStore,
    keyBindingFns
  ])

  return {
    blockRendererFn,
    handleKeyCommand,
    keyBindingFn
  }
}

export default useProps

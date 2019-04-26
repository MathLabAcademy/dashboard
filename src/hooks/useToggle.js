import { useCallback, useMemo, useState } from 'react'

function useToggle(initalState = false) {
  const [open, setOpen] = useState(initalState)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const handleToggle = useCallback(() => setOpen(open => !open), [])

  const handler = useMemo(
    () => ({
      open: handleOpen,
      close: handleClose,
      toggle: handleToggle
    }),
    [handleClose, handleOpen, handleToggle]
  )

  return [open, handler]
}

export default useToggle

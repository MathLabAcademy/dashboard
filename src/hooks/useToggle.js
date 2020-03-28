import { useMemo, useState } from 'react'

function useToggle(initalState = false) {
  const [open, setOpen] = useState(initalState)

  const handler = useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((open) => !open),
    }),
    []
  )

  return [open, handler]
}

export default useToggle

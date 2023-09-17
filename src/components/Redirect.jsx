import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Redirect({ to }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  })
  return null
}

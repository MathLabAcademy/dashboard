import { Link } from '@chakra-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import React from 'react'

function NavLink({ children, to, ...props }) {
  return (
    <Link
      as={RouterLink}
      to={to}
      _hover={{
        textDecoration: 'none',
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink

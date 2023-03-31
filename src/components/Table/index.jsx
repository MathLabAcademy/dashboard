import React from 'react'
import { Box } from 'reflexbox'

export function Table({ children, sx = {} }) {
  return (
    <Box
      as="table"
      sx={{
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function TableHeader({ children, sx = {} }) {
  return (
    <Box
      as="thead"
      sx={{
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function TableBody({ children, sx = {} }) {
  return (
    <Box as="tbody" sx={{ ...sx }}>
      {children}
    </Box>
  )
}

export function TableFooter({ children, sx = {} }) {
  return (
    <Box as="tfoot" sx={{ ...sx }}>
      {children}
    </Box>
  )
}

export function TableRow({ children, sx = {} }) {
  return (
    <Box as="tr" sx={{ ...sx }}>
      {children}
    </Box>
  )
}

export function TableHeaderCell({ children, sx = {} }) {
  return (
    <Box
      as="th"
      sx={{
        p: 3,
        borderBottomWidth: '1px',
        borderBottomColor: 'gray.200',
        borderBottomStyle: 'solid',
        textAlign: 'left',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function TableCell({ children, sx = {}, ...props }) {
  return (
    <Box
      as="td"
      sx={{
        p: 3,
        borderBottomWidth: '1px',
        borderBottomColor: 'gray.200',
        borderBottomStyle: 'solid',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Footer = TableFooter
Table.Row = TableRow
Table.HeaderCell = TableHeaderCell
Table.Cell = TableCell

export default Table

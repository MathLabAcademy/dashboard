import React, { useEffect } from 'react'
import { useTable } from 'react-table'
import { emptyArray } from 'utils/defaults'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '.'

const noop = () => {}

export function DataTable({
  columns,
  data,
  tableProps,
  tableBodyProps,
  headerProps,
  headerGroupProps,
  rowProps,
  cellProps,
  getRowId,
  pluginHooks = emptyArray,
  onStateChange = noop,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      getRowId,
    },
    ...pluginHooks
  )

  useEffect(() => {
    onStateChange(state)
  }, [onStateChange, state])

  return (
    <Table {...getTableProps(tableProps)}>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps(headerGroupProps)}>
            {headerGroup.headers.map((column) => (
              <TableHeaderCell {...column.getHeaderProps(headerProps)}>
                {column.render('Header')}
              </TableHeaderCell>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody {...getTableBodyProps(tableBodyProps)}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps(rowProps)}>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps(cellProps)}>
                    {cell.render('Cell')}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

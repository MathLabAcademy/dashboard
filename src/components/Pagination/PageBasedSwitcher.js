import { Button, ButtonGroup, Stack, Tag, TagLabel } from '@chakra-ui/core'
import { usePageBasedPaging } from 'hooks/usePageSwitcher'
import React from 'react'

const PageBasedPagination = ({
  pageIndex,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const pages = usePageBasedPaging({
    pageIndex,
    totalPages,
  })

  return (
    <Stack
      isInline
      spacing={4}
      mt={8}
      alignItems="center"
      justifyContent="space-between"
    >
      <ButtonGroup spacing={3}>
        {pages.map(({ content, current, disabled, page }) => (
          <Button
            isDisabled={current || disabled}
            key={`page-${page}-${content}`}
            onClick={() => onPageChange(page)}
          >
            {content}
          </Button>
        ))}
      </ButtonGroup>
      <Stack isInline spacing={2}>
        <Tag variant="outline" variantColor="blue">
          <TagLabel mr={1}>Total:</TagLabel> <span>{totalItems}</span>
        </Tag>
      </Stack>
    </Stack>
  )
}

export default PageBasedPagination

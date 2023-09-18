import { IconButton } from '@chakra-ui/core'
import React from 'react'
import { Box } from 'reflexbox'
import { sidebarItems } from './items'
import MenuItems from './MenuItems'

function Sidebar({ isOpen, onToggle }) {
  return (
    <Box
      flexGrow="0"
      width="sidebar"
      bg="gray.50"
      sx={{
        transition: '0.2s',
        borderRight: '2px solid',
        borderRightColor: 'gray.200',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: ({ sizes }) => (isOpen ? 0 : `calc(-${sizes.sidebar} + 1rem)`),
        height: ({ sizes }) => `calc(100% - ${sizes.navbar})`,
        mt: ({ sizes }) => sizes.navbar,
      }}
    >
      <IconButton
        icon="chevron-left"
        variantColor="purple"
        size="sm"
        isRound
        onClick={onToggle}
        position="absolute"
        top="3rem"
        right="-1rem"
        transition="0.2s"
        transform={`rotate(${isOpen ? '0' : '180'}deg)`}
        aria-label={`${isOpen ? 'Close' : 'Open'} Sidebar`}
      />

      <Box height="100%" py={6} overflowY="auto">
        <MenuItems items={sidebarItems} />
      </Box>
    </Box>
  )
}

export default Sidebar

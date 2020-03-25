import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/core'
import { Match } from '@reach/router'
import NavLink from 'components/Link/NavLink'
import Permit from 'components/Permit'
import { zipObject } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { emptyArray } from 'utils/defaults'

function ParentItem({ link, title, match, children }) {
  return (
    <AccordionItem borderWidth={0} _last={{ borderWidth: 0 }} isOpen={!!match}>
      <AccordionHeader
        as={link ? NavLink : undefined}
        to={link}
        py={3}
        fontWeight={match ? 'bold' : 'normal'}
        color={match ? 'white' : null}
        bg={match ? 'primary' : null}
        _hover={{ bg: 'primary', color: 'white' }}
      >
        <Box flexGrow={1}>{title}</Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel p={2}>{children}</AccordionPanel>
    </AccordionItem>
  )
}

function Item({ link, title, permits = emptyArray, children, isChild }) {
  const permitsObject = useMemo(() => {
    return zipObject(permits, permits.map(Boolean))
  }, [permits])

  const matchPath = useMemo(() => {
    return `${link}${link !== '/' ? '/*' : ''}`
  }, [link])

  return (
    <Permit {...permitsObject}>
      <Match path={matchPath}>
        {({ match }) =>
          children ? (
            <ParentItem
              link={link}
              title={title}
              children={children}
              match={match}
            />
          ) : (
            <AccordionItem
              borderWidth={0}
              _last={{ borderWidth: 0 }}
              isOpen={!!match}
            >
              <AccordionHeader
                as={NavLink}
                to={link}
                py={isChild ? 2 : 3}
                fontWeight={match ? 'bold' : 'normal'}
                color={match ? (isChild ? 'primary' : 'white') : null}
                bg={match && !isChild ? 'primary' : null}
                _hover={{
                  bg: isChild ? null : 'primary',
                  color: isChild ? 'primary' : 'white',
                }}
              >
                <Box>{title}</Box>
              </AccordionHeader>
            </AccordionItem>
          )
        }
      </Match>
    </Permit>
  )
}

const ItemsFactory = ({ items, isChild }) => {
  return items.map(({ ...props }) => (
    <ItemFactory
      key={props.link}
      isParent={!!props.items}
      isChild={isChild}
      {...props}
    />
  ))
}

const ItemFactory = ({ items, isParent: hasParent, ...props }) => (
  <Item
    key={props.link}
    children={items ? <ItemsFactory items={items} isChild={hasParent} /> : null}
    {...props}
  />
)

const Items = ({ items }) => <ItemsFactory items={items} />

function SidebarMenuItems({ items }) {
  return (
    <Accordion allowMultiple={false}>
      <Items items={items} />
    </Accordion>
  )
}

export default memo(SidebarMenuItems)

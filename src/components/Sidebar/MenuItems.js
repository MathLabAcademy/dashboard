import { Link, Match } from '@reach/router'
import Permit from 'components/Permit'
import { zipObject } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { Accordion, Header, Icon, Menu } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults'
import './MenuItems.css'

const ParentItem = ({ link, title, icon, active, children }) => (
  <Accordion className="parent-item">
    <Accordion.Title
      as={props => <Menu.Item as={Link} {...props} />}
      to={link}
      active={active}
      className="parent-item-title"
    >
      {icon ? <Icon name={icon} className="item-icon" /> : null}
      {title}
      <Icon name="dropdown" className="parent-item-dropdown-icon" />
    </Accordion.Title>
    <Accordion.Content
      as={Menu.Menu}
      active={active}
      content={children}
      className="parent-item-content"
    />
  </Accordion>
)

function Item({ link, title, icon, permits = emptyArray, children }) {
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
              icon={icon}
              active={Boolean(match)}
              children={children}
            />
          ) : (
            <Menu.Item as={Link} to={link} active={Boolean(match)}>
              {icon ? <Icon name={icon} className="item-icon" /> : null}
              {title}
            </Menu.Item>
          )
        }
      </Match>
    </Permit>
  )
}

const ItemsFactory = ({ items }) => {
  return items.map(({ ...props }) => (
    <ItemFactory key={props.link} {...props} />
  ))
}

const ItemFactory = ({ items, ...props }) => (
  <Item
    key={props.link}
    children={items ? <ItemsFactory items={items} /> : null}
    {...props}
  />
)

const Items = ({ items }) => <ItemsFactory items={items} />

function SidebarMenuItems({ items }) {
  return (
    <>
      <Menu.Item as={Link} to="/" className="logo">
        <Header as="h2" textAlign="center">
          {/* <Image size="small" src={Logo} alt="MathLab Logo" /> */}
          <Header.Subheader>MathLab</Header.Subheader>
        </Header>
      </Menu.Item>

      <Items items={items} />
    </>
  )
}

export default memo(SidebarMenuItems)

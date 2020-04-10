import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Switcher from 'components/Pagination/Switcher'
import Permit from 'components/Permit'
import usePagination from 'hooks/usePagination'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { fetchBatchClassPage, getBatchClass } from 'store/actions/batches'
import { emptyArray } from 'utils/defaults'

function _ListItem({ batchClassId, batchClass, getBatchClass }) {
  useEffect(() => {
    if (!batchClass) getBatchClass(batchClassId)
  }, [batchClass, batchClassId, getBatchClass])

  return (
    <Segment>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>
              ID: {String(batchClassId).padStart(2, '0')}
            </Header.Subheader>
            {get(batchClass, 'name')}
          </Header>
        }
        Right={
          <>
            <Permit roles="teacher">
              <Button as={Link} to={`${batchClassId}/edit`}>
                Edit
              </Button>
            </Permit>

            <Button as={Link} to={`${batchClassId}`} color="blue">
              Open
            </Button>
          </>
        }
      />
    </Segment>
  )
}

const ListItem = connect(
  ({ batches }, { batchClassId }) => ({
    batchClass: get(batches.classes.byId, batchClassId),
  }),
  { getBatchClass }
)(_ListItem)

function BatchClassList({ pagination, fetchPage }) {
  const [[page, handlePageChange]] = usePagination(pagination, fetchPage)

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch Classes</Header>}
          Right={
            <Permit roles="teacher">
              <Button as={Link} to={`create`} color="blue">
                Create
              </Button>
            </Permit>
          }
        />
      </Segment>

      {get(pagination.pages[page], `itemIds`, emptyArray).map((id) => (
        <ListItem key={id} batchClassId={id} />
      ))}

      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const mapStateToProps = ({ pagination }) => ({
  pagination: pagination.batchClasses,
})

const mapDispatchToProps = {
  fetchPage: fetchBatchClassPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassList)

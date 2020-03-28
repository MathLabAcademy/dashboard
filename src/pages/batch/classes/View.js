import { Link, Router } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getBatchClass } from 'store/actions/batches'
import Enrollments from './enrollments/Main'
import Fees from './fees/Main'
import Payments from './payments/Main'

function BatchClassView({ batchClassId, batchClass, getBatchClass }) {
  useEffect(() => {
    if (!batchClass) getBatchClass(batchClassId)
  }, [batchClassId, batchClass, getBatchClass])

  return (
    <>
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
              <Button as={Link} to={`..`}>
                Go Back
              </Button>
              <Permit teacher>
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>
              <Button color="blue" as={Link} to={`fees`}>
                Fees
              </Button>
              <Button color="orange" as={Link} to={`payments`}>
                Payments
              </Button>
            </>
          }
        />
      </Segment>

      <Router>
        <Fees path="fees/*" batchClassId={batchClassId} />
        <Payments path="payments/*" batchClassId={batchClassId} />
        <Enrollments path="/*" batchClassId={batchClassId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ batches }, { batchClassId }) => ({
  batchClass: get(batches.classes.byId, batchClassId),
})

const mapDispatchToProps = {
  getBatchClass,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassView)
